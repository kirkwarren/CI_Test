#!/usr/bin/env python3
"""
vrt_check.py — grade a Large Computational Load (LCL) voltage/power time series
against ERCOT Nodal Operating Guide Section 2.15, "Voltage Ride-Through
Requirements for Large Computational Loads" (created by NOGRR282, effective
1 August 2026; text checked against the NOG Section 2 version dated 1 Nov 2026).

USE: a triage aid for engineers. Feed it a PSCAD / PSS/E (or field PMU) export
measured at the Service Delivery Point (or the POIB for co-located loads).
It is NOT a compliance certificate. ERCOT runs its own tests on submitted models.

INPUT CSV columns (header names are case-insensitive):
    t          time in seconds (ascending)
    v          RMS voltage, per unit of nominal
    p          active power drawn from the grid, MW
    i          OPTIONAL current, per unit of MAXIMUM NORMAL operating current
    p_cooling  OPTIONAL cooling/mechanical portion of p, MW

Pure Python 3.8+, no dependencies.

Every interpretation that is ours rather than ERCOT's verbatim text is marked
INTERPRETATION in the code and in the report. Confirm those with ERCOT before
relying on a result.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import sys
from dataclasses import dataclass, field, asdict
from typing import List, Optional

# --------------------------------------------------------------------------
# NOG 2.15 Table A — minimum ride-through time for undervoltage bands (s).
# Upper bound of each band -> minimum time. Read from NOG Section 2, 1 Nov 2026:
#   0.80 <= V < 0.90 : 2.0 s     0.50 <= V < 0.80 : 0.5 s
#   0.35 <= V < 0.50 : 0.25 s    V < 0.35         : 0.15 s
#   1.10 < V <= 1.20 : 1.0 s     V > 1.20: may ride through or trip
#   0.90 <= V <= 1.10: continuous
# INTERPRETATION: durations are applied INCLUSIVELY (time below 0.8 pu also
# counts as time below 0.9 pu), matching ERCOT's stated convention for its
# generator ride-through tables in the same Section 2. ERCOT's LCL section does
# not restate the convention.
# --------------------------------------------------------------------------
UV_BANDS = [(0.90, 2.0), (0.80, 0.5), (0.50, 0.25), (0.35, 0.15)]
OV_LOW, OV_HIGH, OV_TIME = 1.10, 1.20, 1.0
CONT_LOW, CONT_HIGH = 0.90, 1.10

RECOVERY_FRACTION = 0.90      # 2.15(3)(b),(c): return to 90% of pre-disturbance
RECOVERY_WINDOW = 2.0         # ... within 2 s of V returning above 0.9 pu
TRANSFER_START = 0.25         # 2.15(3)(e): begin returning within 0.25 s
TRANSFER_90 = 0.5             # ... and reach 90% within 0.5 s
OVERCURRENT_MAX = 1.5         # 2.15(3)(d): <= 150% of max normal current
OVERCURRENT_TIME = 0.5        # ... persisting no more than 0.5 s
SAG_COUNT, SAG_WINDOW = 6, 90.0   # 2.15(7): six sags or swells within 90 s
COOLING_V = 0.35              # cooling may trip below 0.35 pu (2.15(3), (3)(c))

PASS, FAIL, WARN, NA, INFO = "PASS", "FAIL", "WARN", "N/A", "INFO"
SETTLE_FRACTION = 0.98   # R12: settling below 98% of the pre-disturbance level suggests a permanent partial trip


@dataclass
class Series:
    t: List[float]
    v: List[float]
    p: List[float]
    i: Optional[List[float]] = None
    p_cool: Optional[List[float]] = None


@dataclass
class Finding:
    clause: str
    requirement: str
    status: str
    detail: str
    interpretation: bool = False


@dataclass
class Excursion:
    kind: str            # "UV" or "OV"
    i0: int              # first sample index inside excursion
    i1: int              # first sample index after the excursion (or len)
    t_start: float
    t_end: float         # time voltage returned to the continuous range
    v_extreme: float
    time_below: dict = field(default_factory=dict)
    required: bool = True
    why_not_required: str = ""


# ------------------------------- loading ----------------------------------
def load_csv(path: str) -> Series:
    with open(path, newline="") as fh:
        rdr = csv.DictReader(fh)
        if rdr.fieldnames is None:
            raise ValueError("CSV has no header row")
        cols = {c.strip().lower(): c for c in rdr.fieldnames}
        for need in ("t", "v", "p"):
            if need not in cols:
                raise ValueError(f"CSV is missing required column '{need}' (have {list(cols)})")
        t, v, p, i, pc = [], [], [], [], []
        has_i, has_pc = "i" in cols, "p_cooling" in cols
        for row in rdr:
            t.append(float(row[cols["t"]]))
            v.append(float(row[cols["v"]]))
            p.append(float(row[cols["p"]]))
            if has_i:
                i.append(float(row[cols["i"]]))
            if has_pc:
                pc.append(float(row[cols["p_cooling"]]))
    if len(t) < 3:
        raise ValueError("need at least 3 samples")
    if any(b <= a for a, b in zip(t, t[1:])):
        raise ValueError("time column must be strictly ascending")
    return Series(t, v, p, i if has_i else None, pc if has_pc else None)


# ------------------------------- helpers ----------------------------------
def _dt(s: Series, k: int) -> float:
    """Duration represented by sample k (left-point rule)."""
    if k + 1 < len(s.t):
        return s.t[k + 1] - s.t[k]
    return s.t[k] - s.t[k - 1]


def _mean(xs: List[float]) -> float:
    return sum(xs) / len(xs) if xs else float("nan")


def pre_disturbance(s: Series, t_start: float, window: float) -> tuple:
    idx = [k for k, tk in enumerate(s.t) if t_start - window <= tk < t_start]
    if not idx:
        idx = [k for k, tk in enumerate(s.t) if tk < t_start][-1:]
    if not idx:
        raise ValueError("no samples before the first disturbance; add a pre-disturbance window")
    p_pre = _mean([s.p[k] for k in idx])
    v_pre = _mean([s.v[k] for k in idx])
    c_pre = _mean([s.p_cool[k] for k in idx]) if s.p_cool else 0.0
    return p_pre, v_pre, c_pre


def find_excursions(s: Series) -> List[Excursion]:
    out, k, n = [], 0, len(s.t)
    while k < n:
        vk = s.v[k]
        if vk < CONT_LOW or vk > CONT_HIGH:
            kind = "UV" if vk < CONT_LOW else "OV"
            j = k
            while j < n and ((s.v[j] < CONT_LOW) if kind == "UV" else (s.v[j] > CONT_HIGH)):
                j += 1
            seg = range(k, j)
            vx = min(s.v[m] for m in seg) if kind == "UV" else max(s.v[m] for m in seg)
            t_end = s.t[j] if j < n else s.t[-1]
            e = Excursion(kind, k, j, s.t[k], t_end, vx)
            if kind == "UV":
                for thr, _ in UV_BANDS:
                    e.time_below[thr] = sum(_dt(s, m) for m in seg if s.v[m] < thr)
            else:
                e.time_below["ov_1.1"] = sum(_dt(s, m) for m in seg if s.v[m] > OV_LOW)
            out.append(e)
            k = j
        else:
            k += 1
    return out


def classify_requirement(e: Excursion) -> None:
    """Is ride-through REQUIRED for this excursion under Table A?"""
    if e.kind == "UV":
        for thr, limit in UV_BANDS:
            if e.time_below[thr] > limit + 1e-9:
                e.required = False
                e.why_not_required = (f"{e.time_below[thr]:.3f} s below {thr} pu exceeds the Table A "
                                      f"minimum of {limit} s, so ride-through is not required (2.15(4))")
                return
    else:
        if e.v_extreme > OV_HIGH:
            e.required = False
            e.why_not_required = "voltage above 1.20 pu: may ride through or trip (Table A)"
        elif e.time_below["ov_1.1"] >= OV_TIME:
            e.required = False
            e.why_not_required = (f"{e.time_below['ov_1.1']:.3f} s above 1.10 pu reaches the 1.0 s "
                                  "Table A minimum; ride-through beyond it is not required")


# ------------------------------- grading ----------------------------------
def transfer_timing(s: Series, e: Excursion, target: float, p_pre: float, start_threshold: float):
    """Seconds after V returns above 0.9 pu at which load begins returning, and reaches target."""
    seg = range(e.i0, e.i1)
    after = range(e.i1, len(s.t))
    near = [s.p[m] for m in after if s.t[m] <= e.t_end + 0.05]
    p_min = min([s.p[m] for m in seg] + near) if (list(seg) or near) else 0.0
    t_begin = next((s.t[m] for m in after if s.p[m] - p_min >= start_threshold * p_pre), None)
    t_hit = next((s.t[m] for m in after if s.p[m] >= target), None)
    return (None if t_begin is None else t_begin - e.t_end,
            None if t_hit is None else t_hit - e.t_end)


def grade(s: Series, tier: str = "pre2028", transfer_scheme: bool = False,
          pre_window: float = 0.5, tol: float = 0.02, start_threshold: float = 0.02,
          per_event_pre: bool = False, report_both: bool = False) -> dict:
    exc = find_excursions(s)
    findings: List[Finding] = []
    events = []
    if not exc:
        return {"overall": NA, "summary": "no voltage excursion outside 0.90-1.10 pu in the record",
                "events": [], "findings": []}

    base_p, base_v, base_c = pre_disturbance(s, exc[0].t_start, pre_window)
    findings.append(Finding("2.15(3)", "Pre-disturbance reference",
                            NA, f"P_pre = {base_p:.3f} MW, V_pre = {base_v:.4f} pu, taken as the mean over "
                                f"{pre_window} s before the first excursion (t = {exc[0].t_start:.3f} s)", True))
    uv_results = []

    for n_e, e in enumerate(exc, 1):
        classify_requirement(e)
        p_pre, v_pre, c_pre = (pre_disturbance(s, e.t_start, pre_window) if per_event_pre
                               else (base_p, base_v, base_c))
        ev = {"n": n_e, "kind": e.kind, "t_start": round(e.t_start, 4), "t_return": round(e.t_end, 4),
              "v_extreme": round(e.v_extreme, 4), "ride_through_required": e.required,
              "time_below": {str(k): round(v, 4) for k, v in e.time_below.items()}}
        tag = f"Event {n_e} ({e.kind}, t={e.t_start:.3f}s, V={'min' if e.kind=='UV' else 'max'} {e.v_extreme:.3f} pu)"

        if not e.required:
            findings.append(Finding("Table A / 2.15(4)", f"{tag}: is ride-through required?", NA,
                                    e.why_not_required, True))
            ev["result"] = NA
            events.append(ev)
            continue

        seg = range(e.i0, e.i1)

        # ---------------- overvoltage ----------------
        if e.kind == "OV":
            low = [s.t[m] for m in seg if s.p[m] < (1 - tol) * p_pre]
            st = FAIL if low else PASS
            findings.append(Finding("2.15(3)(a)", f"{tag}: keep consuming at pre-disturbance level "
                                    "during 1.10-1.20 pu for < 1.0 s", st,
                                    "consumption held" if not low else
                                    f"P fell below {(1-tol)*p_pre:.2f} MW at t={low[0]:.3f}s"))
            ev["result"] = st
            events.append(ev)
            continue

        # ---------------- undervoltage ----------------
        shallow = e.v_extreme >= 0.80
        ev["band"] = "0.80-0.90 (2.15(3)(b))" if shallow else "below 0.80 (2.15(3)(c))"

        # cooling adjustment — 2.15(3)(c)
        target_base, cool_note = p_pre, ""
        if s.p_cool and e.v_extreme < COOLING_V:
            post = [s.p_cool[m] for m in range(e.i1, len(s.t)) if s.t[m] <= e.t_end + RECOVERY_WINDOW]
            if post and max(post) < 0.5 * c_pre:
                target_base = p_pre - c_pre
                cool_note = (f"; cooling load ({c_pre:.2f} MW) tripped below 0.35 pu, so it is subtracted "
                             f"from the pre-disturbance level per 2.15(3)(c)")
        target = RECOVERY_FRACTION * target_base

        # during-dip consumption
        if shallow:
            bad = [m for m in seg if s.p[m] < (s.v[m] / v_pre) * p_pre * (1 - tol)]
            st = FAIL if bad else PASS
            findings.append(Finding("2.15(3)(b)", f"{tag}: continue consuming; any reduction no more than "
                                    "proportional to the voltage drop", st,
                                    "held within proportional limit" if not bad else
                                    f"P={s.p[bad[0]]:.2f} MW at t={s.t[bad[0]]:.3f}s is below the proportional "
                                    f"floor {(s.v[bad[0]]/v_pre)*p_pre*(1-tol):.2f} MW", True))
            ev.setdefault("checks", []).append(st)
        else:
            mid = [m for m in seg if 0.5 <= s.v[m] < 0.8]
            if mid and not transfer_scheme:
                bad = [m for m in mid if s.p[m] < (s.v[m] / v_pre) * p_pre * (1 - tol)]
                if tier == "post2028":
                    st = FAIL if bad else PASS
                    req = "must keep consuming between 0.8 and 0.5 pu (reduction at most proportional)"
                else:
                    st = WARN if bad else PASS
                    req = "reduction proportional to voltage drop between 0.8 and 0.5 pu 'if capable'"
                findings.append(Finding("2.15(3)(c)(i)" if tier == "pre2028" else "2.15(3)(c)(ii)",
                                        f"{tag}: {req}", st,
                                        "within proportional limit" if not bad else
                                        f"P={s.p[bad[0]]:.2f} MW at V={s.v[bad[0]]:.3f} pu, t={s.t[bad[0]]:.3f}s "
                                        "is below the proportional floor"
                                        + (" (advisory for loads completing PG 9.5 on or before 1 Jan 2028)"
                                           if tier == "pre2028" else ""), True))
                ev.setdefault("checks", []).append(st)

        # recovery
        after = [m for m in range(e.i1, len(s.t))]
        t_hit = next((s.t[m] for m in after if s.p[m] >= target), None)
        if transfer_scheme and not shallow:
            d_begin, d_90 = transfer_timing(s, e, target, p_pre, start_threshold)
            st1 = PASS if d_begin is not None and d_begin <= TRANSFER_START + 1e-9 else FAIL
            st2 = PASS if d_90 is not None and d_90 <= TRANSFER_90 + 1e-9 else FAIL
            findings.append(Finding("2.15(3)(e)", f"{tag}: load-transfer scheme begins returning within 0.25 s",
                                    st1, "never began returning" if d_begin is None else
                                    f"began returning {d_begin:.3f} s after V > 0.9 pu", True))
            findings.append(Finding("2.15(3)(e)", f"{tag}: load-transfer scheme reaches 90% within 0.5 s",
                                    st2, ("never reached " if d_90 is None else f"reached ") +
                                    f"{target:.2f} MW" + ("" if d_90 is None else f" after {d_90:.3f} s") + cool_note))
            ev.setdefault("checks", []).extend([st1, st2])
            rec_ok = st1 == PASS and st2 == PASS
        else:
            d_90 = None if t_hit is None else t_hit - e.t_end
            ok = d_90 is not None and d_90 <= RECOVERY_WINDOW + 1e-9
            # sustained: once recovered, does P stay >= target while V stays in the continuous range?
            relapse = None
            if ok:
                relapse = next((s.t[m] for m in after if s.t[m] > t_hit and s.p[m] < target
                                and CONT_LOW <= s.v[m] <= CONT_HIGH), None)
            st = PASS if ok and relapse is None else FAIL
            clause = "2.15(3)(b)" if shallow else "2.15(3)(c)"
            if d_90 is None:
                det = f"never returned to {target:.2f} MW (90% of {target_base:.2f} MW) in the record"
            elif not ok:
                det = f"reached {target:.2f} MW only {d_90:.3f} s after V > 0.9 pu (limit 2.0 s)"
            elif relapse is not None:
                det = f"reached 90% after {d_90:.3f} s but fell back below it at t={relapse:.3f}s"
            else:
                det = f"reached {target:.2f} MW {d_90:.3f} s after V > 0.9 pu"
            findings.append(Finding(clause, f"{tag}: return to 90% of pre-disturbance within 2 s", st,
                                    det + cool_note))
            ev.setdefault("checks", []).append(st)
            rec_ok = st == PASS
            ev["seconds_to_90pct"] = None if d_90 is None else round(d_90, 4)
            if report_both and not shallow:
                db, d9 = transfer_timing(s, e, target, p_pre, start_threshold)
                meets = (db is not None and db <= TRANSFER_START + 1e-9 and d9 is not None
                         and d9 <= TRANSFER_90 + 1e-9)
                findings.append(Finding("2.15(3)(e) [alt]", f"{tag}: IF the drop is a load-transfer action "
                                        "(e.g. UPS to battery), would it meet 0.25 s / 0.5 s?", INFO,
                                        ("would MEET" if meets else "would NOT meet") +
                                        f" — begins {('never' if db is None else f'{db:.3f} s')}, 90% at "
                                        f"{('never' if d9 is None else f'{d9:.3f} s')} (reading R6: not counted "
                                        "in the overall verdict)", True))
        uv_results.append((e, rec_ok))

        # R12 — permanent partial load loss hidden behind a >= 90% recovery
        if rec_ok:
            settle = [s.p[m] for m in range(e.i1, len(s.t))
                      if s.t[m] >= e.t_end + RECOVERY_WINDOW and CONT_LOW <= s.v[m] <= CONT_HIGH]
            if settle and _mean(settle) < SETTLE_FRACTION * target_base:
                findings.append(Finding("2.15(3) remain connected", f"{tag}: settles below the pre-disturbance level",
                                        WARN, f"settles at {_mean(settle):.2f} MW, "
                                        f"{100*_mean(settle)/target_base:.1f}% of {target_base:.2f} MW — possible "
                                        "permanent partial load loss, which ERCOT counts as a deficiency (reading R12)",
                                        True))
                ev.setdefault("checks", []).append(WARN)

        # overcurrent — R8: window runs from the start of the disturbance through the
        # 2 s recovery window, so re-acceleration inrush after voltage returns is counted.
        if s.i:
            win = [m for m in range(e.i0, len(s.t)) if s.t[m] <= e.t_end + RECOVERY_WINDOW]
            ipk = max(s.i[m] for m in win)
            t_over = sum(_dt(s, m) for m in win if s.i[m] > 1.0)
            st = FAIL if (ipk > OVERCURRENT_MAX + 1e-9 or t_over > OVERCURRENT_TIME + 1e-9) else PASS
            findings.append(Finding("2.15(3)(d)", f"{tag}: current <= 150% of max normal, overcurrent <= 0.5 s",
                                    st, f"peak {ipk*100:.0f}% of max normal; {t_over:.3f} s above 100% "
                                        "(window includes the 2 s after voltage recovers — reading R8)", True))
            ev.setdefault("checks", []).append(st)

        ev["result"] = FAIL if FAIL in ev.get("checks", []) else (WARN if WARN in ev.get("checks", []) else PASS)
        events.append(ev)

    # six sags or swells within 90 s — 2.15(7)
    req = [e for e in exc if e.required]
    best = 0
    for e in req:
        best = max(best, sum(1 for f in req if e.t_start <= f.t_start < e.t_start + SAG_WINDOW))
    if best >= SAG_COUNT:
        failed = [e for e, ok in uv_results if not ok]
        st = FAIL if failed else PASS
        findings.append(Finding("2.15(7)", "stay connected through at least six sags/swells within 90 s", st,
                                f"{best} required-ride-through events within 90 s; "
                                + ("all recovered" if not failed else f"{len(failed)} did not recover")))
    else:
        findings.append(Finding("2.15(7)", "stay connected through at least six sags/swells within 90 s", NA,
                                f"record has at most {best} required-ride-through event(s) in any 90 s window; "
                                "run a six-sag sequence to test this clause"))

    statuses = [f.status for f in findings if f.status != INFO]
    overall = FAIL if FAIL in statuses else (WARN if WARN in statuses else (PASS if PASS in statuses else NA))
    return {"overall": overall, "tier": tier, "transfer_scheme": transfer_scheme,
            "events": events, "findings": [asdict(f) for f in findings]}


# ------------------------------- output -----------------------------------
def render(report: dict, label: str = "") -> str:
    lines = []
    head = f"NOG 2.15 VRT CHECK{(' — ' + label) if label else ''}"
    lines += [head, "=" * len(head)]
    lines.append(f"Overall: {report['overall']}   tier: {report.get('tier','-')}   "
                 f"transfer scheme: {report.get('transfer_scheme', False)}")
    for f in report["findings"]:
        flag = " [INTERPRETATION]" if f["interpretation"] else ""
        lines.append(f"  {f['status']:<4}  {f['clause']:<16} {f['requirement']}{flag}")
        lines.append(f"        {f['detail']}")
    lines.append("Triage aid only — not a compliance determination. ERCOT tests the submitted models itself.")
    return "\n".join(lines)


# ----------------------------- synthetic demo ------------------------------
def synth(kind: str) -> Series:
    """Synthetic waveforms illustrating the failure modes ERCOT reported."""
    dt, T, P0 = 0.005, 8.0, 100.0
    t = [round(k * dt, 6) for k in range(int(T / dt) + 1)]
    v, p, cur, pc = [], [], [], []
    for tk in t:
        vv, pp, ii, cc = 1.0, P0, 1.0, 20.0
        if kind == "pass_shallow":          # 0.85 pu for 1.0 s, proportional reduction
            if 1.0 <= tk < 2.0: vv, pp = 0.85, P0 * 0.85
        elif kind == "fail_load_loss":       # 0.6 pu for 0.3 s; UPS drops to battery, back after ~4 s
            if 1.0 <= tk < 1.3: vv, pp = 0.6, 0.0
            elif 1.3 <= tk < 5.3: pp = 0.0
        elif kind == "fail_slow_recovery":   # 0.6 pu for 0.3 s; ramp back to 100% over 4 s
            if 1.0 <= tk < 1.3: vv, pp = 0.6, 30.0
            elif 1.3 <= tk < 5.3: pp = 30.0 + 70.0 * (tk - 1.3) / 4.0
        elif kind == "outside_envelope":     # 0.6 pu for 1.0 s: exceeds Table A 0.5 s -> not required
            if 1.0 <= tk < 2.0: vv, pp = 0.6, 0.0
            elif tk >= 2.0: pp = 0.0
        elif kind == "pass_transfer_scheme": # 0.3 pu for 0.1 s; transfer, back fast
            if 1.0 <= tk < 1.1: vv, pp = 0.3, 0.0
            elif 1.1 <= tk < 1.5: pp = min(P0, max(0.0, (tk - 1.15) / 0.30 * P0))
        elif kind == "fail_overcurrent":     # 0.7 pu 0.2 s; reacceleration draws 170% current
            if 1.0 <= tk < 1.2: vv, pp, ii = 0.7, 70.0, 1.7
        elif kind == "midband_steep_drop":   # 0.65 pu 0.4 s, load falls to 20% (not proportional)
            if 1.0 <= tk < 1.4: vv, pp = 0.65, 20.0
            elif 1.4 <= tk < 1.9: pp = 20.0 + 80.0 * (tk - 1.4) / 0.5
        elif kind == "pass_cooling_trip":    # 0.3 pu 0.1 s; 20 MW cooling trips & stays off, IT returns
            if 1.0 <= tk < 1.1: vv, pp, cc = 0.3, 0.0, 0.0
            elif tk >= 1.1: cc = 0.0; pp = 80.0 if tk >= 1.6 else 80.0 * (tk - 1.1) / 0.5
        elif kind == "six_sags_pass":        # six 0.85 pu sags of 0.2 s, 10 s apart
            pass
        v.append(vv); p.append(pp); cur.append(ii); pc.append(cc)
    if kind == "six_sags_pass":
        dt, T = 0.01, 70.0
        t = [round(k * dt, 6) for k in range(int(T / dt) + 1)]
        v, p = [], []
        for tk in t:
            inside = any(s0 <= tk < s0 + 0.2 for s0 in [5.0 + 10.0 * j for j in range(6)])
            v.append(0.85 if inside else 1.0); p.append(85.0 if inside else 100.0)
        return Series(t, v, p)
    return Series(t, v, p, cur if kind == "fail_overcurrent" else None,
                  pc if kind == "pass_cooling_trip" else None)


DEMO_CASES = [
    ("pass_shallow", {}, "PASS"),
    ("fail_load_loss", {}, "FAIL"),
    ("fail_slow_recovery", {}, "FAIL"),
    ("outside_envelope", {}, "N/A"),
    ("pass_transfer_scheme", {"transfer_scheme": True}, "PASS"),
    ("fail_overcurrent", {}, "FAIL"),
    ("midband_steep_drop", {"tier": "pre2028"}, "WARN"),
    ("midband_steep_drop", {"tier": "post2028"}, "FAIL"),
    ("pass_cooling_trip", {}, "PASS"),
    ("six_sags_pass", {}, "PASS"),
]


def write_csv(s: Series, path: str) -> None:
    cols = ["t", "v", "p"] + (["i"] if s.i else []) + (["p_cooling"] if s.p_cool else [])
    with open(path, "w", newline="") as fh:
        w = csv.writer(fh); w.writerow(cols)
        for k in range(len(s.t)):
            row = [s.t[k], s.v[k], s.p[k]]
            if s.i: row.append(s.i[k])
            if s.p_cool: row.append(s.p_cool[k])
            w.writerow(row)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Grade an LCL V/P time series against ERCOT NOG 2.15.")
    ap.add_argument("csv", nargs="?", help="CSV with columns t, v, p [, i, p_cooling]")
    ap.add_argument("--tier", choices=["pre2028", "post2028"], default="pre2028",
                    help="pre2028 = satisfies PG 9.5 on or before 1 Jan 2028 (default); post2028 = after")
    ap.add_argument("--transfer-scheme", action="store_true",
                    help="facility uses a load-transfer/control-stabilisation scheme below 0.8 pu (2.15(3)(e))")
    ap.add_argument("--pre-window", type=float, default=0.5, help="seconds averaged for pre-disturbance level")
    ap.add_argument("--tol", type=float, default=0.02, help="tolerance on proportional-reduction checks")
    ap.add_argument("--per-event-pre", action="store_true",
                    help="use each event's own pre-disturbance level (default: level before the first event)")
    ap.add_argument("--report-both", action="store_true",
                    help="also report whether each deep dip would meet the faster load-transfer timing "
                         "(2.15(3)(e)), for the open question of whether UPS-to-battery is a transfer (R6)")
    ap.add_argument("--json", action="store_true", help="print the report as JSON")
    ap.add_argument("--demo", action="store_true", help="grade the built-in synthetic cases")
    ap.add_argument("--write-examples", metavar="DIR", help="write the synthetic cases as CSVs into DIR")
    a = ap.parse_args(argv)

    if a.write_examples:
        import os
        os.makedirs(a.write_examples, exist_ok=True)
        for name, _, _ in DEMO_CASES:
            write_csv(synth(name), os.path.join(a.write_examples, f"{name}.csv"))
        print(f"wrote {len({n for n, _, _ in DEMO_CASES})} example CSVs to {a.write_examples}")
        return 0
    if a.demo:
        bad = 0
        for name, kw, expect in DEMO_CASES:
            r = grade(synth(name), **kw)
            mark = "ok " if r["overall"] == expect else "MISMATCH"
            bad += r["overall"] != expect
            print(f"{mark} {name:<22} {str(kw):<28} expected {expect:<4} got {r['overall']}")
        return 1 if bad else 0
    if not a.csv:
        ap.error("give a CSV path, or --demo")
    try:
        s = load_csv(a.csv)
        r = grade(s, tier=a.tier, transfer_scheme=a.transfer_scheme, pre_window=a.pre_window,
                  tol=a.tol, per_event_pre=a.per_event_pre, report_both=a.report_both)
    except (ValueError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(r, indent=2) if a.json else render(r, a.csv))
    return 0 if r["overall"] in (PASS, NA) else 1


if __name__ == "__main__":
    sys.exit(main())
