"""Tests for vrt_check.py. Run: python3 -m unittest test_vrt_check -v"""
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import vrt_check as vc  # noqa: E402


def statuses(report, clause_prefix):
    return [f["status"] for f in report["findings"] if f["clause"].startswith(clause_prefix)]


def step(v_dip, dur, p_during, p_after_fn=None, dt=0.005, T=8.0, t0=1.0, p0=100.0):
    """Build a single rectangular dip with a custom recovery profile."""
    t = [round(k * dt, 6) for k in range(int(T / dt) + 1)]
    v, p = [], []
    for tk in t:
        if t0 <= tk < t0 + dur:
            v.append(v_dip); p.append(p_during)
        else:
            v.append(1.0)
            p.append(p_after_fn(tk - (t0 + dur)) if (p_after_fn and tk >= t0 + dur) else p0)
    return vc.Series(t, v, p)


class TableA(unittest.TestCase):
    def test_bands_match_nog_2_15(self):
        self.assertEqual(vc.UV_BANDS, [(0.90, 2.0), (0.80, 0.5), (0.50, 0.25), (0.35, 0.15)])
        self.assertEqual((vc.OV_LOW, vc.OV_HIGH, vc.OV_TIME), (1.10, 1.20, 1.0))

    def test_within_envelope_is_required(self):
        r = vc.grade(step(0.6, 0.45, 100.0))
        self.assertTrue(r["events"][0]["ride_through_required"])

    def test_outside_each_band_is_not_required(self):
        for v_dip, dur in [(0.85, 2.1), (0.6, 0.55), (0.4, 0.3), (0.2, 0.2)]:
            r = vc.grade(step(v_dip, dur, 0.0, lambda x: 0.0))
            self.assertFalse(r["events"][0]["ride_through_required"], (v_dip, dur))
            self.assertEqual(r["overall"], vc.NA, (v_dip, dur))

    def test_inclusive_accumulation(self):
        # 0.3 s at 0.6 pu then 0.25 s at 0.85 pu: 0.55 s below 0.9 (ok) but only 0.3 below 0.8 (ok)
        dt, t, v, p = 0.005, [], [], []
        for k in range(1601):
            tk = round(k * dt, 6); t.append(tk)
            if 1.0 <= tk < 1.3: v.append(0.6)
            elif 1.3 <= tk < 1.55: v.append(0.85)
            else: v.append(1.0)
            p.append(100.0)
        r = vc.grade(vc.Series(t, v, p))
        ev = r["events"][0]
        self.assertTrue(ev["ride_through_required"])
        self.assertAlmostEqual(ev["time_below"]["0.9"], 0.55, places=2)
        self.assertAlmostEqual(ev["time_below"]["0.8"], 0.30, places=2)


class Recovery(unittest.TestCase):
    def test_recovers_inside_2s_passes(self):
        r = vc.grade(step(0.6, 0.3, 0.0, lambda x: min(100.0, 100.0 * x / 1.5)))
        self.assertIn(vc.PASS, statuses(r, "2.15(3)(c)"))
        self.assertEqual(r["overall"], vc.WARN)  # only the advisory mid-band proportional check

    def test_load_loss_fails_recovery(self):
        r = vc.grade(vc.synth("fail_load_loss"))
        rec = [f for f in r["findings"] if "within 2 s" in f["requirement"]][0]
        self.assertEqual(rec["status"], vc.FAIL)
        self.assertIn("4.000 s", rec["detail"])

    def test_boundary_exactly_2s(self):
        # 90 MW reached exactly 2.0 s after return -> pass; 2.05 s -> fail
        ok = vc.grade(step(0.85, 0.5, 85.0, lambda x: 100.0 if x >= 2.0 else 85.0))
        late = vc.grade(step(0.85, 0.5, 85.0, lambda x: 100.0 if x >= 2.05 else 85.0))
        self.assertEqual(statuses(ok, "2.15(3)(b)")[-1], vc.PASS)
        self.assertEqual(statuses(late, "2.15(3)(b)")[-1], vc.FAIL)

    def test_relapse_after_recovery_fails(self):
        prof = lambda x: 100.0 if x < 1.0 else 50.0
        r = vc.grade(step(0.6, 0.3, 100.0, prof))
        rec = [f for f in r["findings"] if "within 2 s" in f["requirement"]][0]
        self.assertEqual(rec["status"], vc.FAIL)
        self.assertIn("fell back", rec["detail"])


class DuringDip(unittest.TestCase):
    def test_shallow_proportional_ok(self):
        self.assertEqual(vc.grade(vc.synth("pass_shallow"))["overall"], vc.PASS)

    def test_shallow_steeper_than_proportional_fails(self):
        r = vc.grade(step(0.85, 1.0, 60.0))
        self.assertIn(vc.FAIL, statuses(r, "2.15(3)(b)"))

    def test_midband_tiering(self):
        self.assertEqual(vc.grade(vc.synth("midband_steep_drop"), tier="pre2028")["overall"], vc.WARN)
        self.assertEqual(vc.grade(vc.synth("midband_steep_drop"), tier="post2028")["overall"], vc.FAIL)

    def test_below_half_pu_any_reduction_allowed(self):
        r = vc.grade(step(0.4, 0.2, 0.0, lambda x: 100.0))
        self.assertNotIn(vc.WARN, statuses(r, "2.15(3)(c)("))
        self.assertEqual(r["overall"], vc.PASS)


class TransferScheme(unittest.TestCase):
    def test_fast_transfer_passes(self):
        self.assertEqual(vc.grade(vc.synth("pass_transfer_scheme"), transfer_scheme=True)["overall"], vc.PASS)

    def test_slow_transfer_fails_even_though_2s_rule_would_pass(self):
        s = step(0.3, 0.1, 0.0, lambda x: min(100.0, 100.0 * max(0.0, x - 0.3) / 0.6))
        self.assertEqual(vc.grade(s)["overall"], vc.PASS)                       # 2.15(3)(c): within 2 s
        self.assertEqual(vc.grade(s, transfer_scheme=True)["overall"], vc.FAIL)  # 2.15(3)(e): too slow


class Overcurrent(unittest.TestCase):
    def test_peak_over_150_fails(self):
        r = vc.grade(vc.synth("fail_overcurrent"))
        self.assertEqual(statuses(r, "2.15(3)(d)"), [vc.FAIL])

    def test_overcurrent_duration_limit(self):
        s = step(0.7, 0.45, 70.0)
        s.i = [1.3 if 1.0 <= tk < 1.45 else 1.0 for tk in s.t]   # 0.45 s at 130%: ok
        self.assertEqual(statuses(vc.grade(s), "2.15(3)(d)"), [vc.PASS])
        s2 = step(0.75, 0.48, 75.0)
        s2.i = [1.3 if 0.9 <= tk < 1.48 else 1.0 for tk in s2.t]  # only in-dip samples count
        self.assertEqual(statuses(vc.grade(s2), "2.15(3)(d)"), [vc.PASS])


class Cooling(unittest.TestCase):
    def test_cooling_trip_adjusts_target(self):
        s = vc.synth("pass_cooling_trip")
        self.assertEqual(vc.grade(s)["overall"], vc.PASS)
        s.p_cool = None
        self.assertEqual(vc.grade(s)["overall"], vc.FAIL)

    def test_no_adjustment_above_0_35(self):
        s = step(0.45, 0.2, 0.0, lambda x: 80.0)
        s.p_cool = [20.0 if tk < 1.0 else 0.0 for tk in s.t]
        self.assertEqual(vc.grade(s)["overall"], vc.FAIL)  # cooling may only be excluded below 0.35 pu


class SixSags(unittest.TestCase):
    def test_six_sags_all_recovered(self):
        r = vc.grade(vc.synth("six_sags_pass"))
        self.assertEqual(statuses(r, "2.15(7)"), [vc.PASS])

    def test_fewer_than_six_is_not_tested(self):
        self.assertEqual(statuses(vc.grade(vc.synth("pass_shallow")), "2.15(7)"), [vc.NA])

    def test_trip_on_fourth_sag_fails(self):
        s = vc.synth("six_sags_pass")
        s.p = [0.0 if tk >= 35.0 else pk for tk, pk in zip(s.t, s.p)]
        r = vc.grade(s)
        self.assertEqual(statuses(r, "2.15(7)"), [vc.FAIL])


class Overvoltage(unittest.TestCase):
    def test_short_overvoltage_must_hold_load(self):
        t = [round(k * 0.005, 6) for k in range(801)]
        v = [1.15 if 1.0 <= tk < 1.5 else 1.0 for tk in t]
        self.assertEqual(vc.grade(vc.Series(t, v, [100.0] * len(t)))["overall"], vc.PASS)
        p = [50.0 if 1.0 <= tk < 1.5 else 100.0 for tk in t]
        self.assertEqual(vc.grade(vc.Series(t, v, p))["overall"], vc.FAIL)

    def test_above_1_2_not_required(self):
        t = [round(k * 0.005, 6) for k in range(801)]
        v = [1.25 if 1.0 <= tk < 1.2 else 1.0 for tk in t]
        p = [0.0 if tk >= 1.0 else 100.0 for tk in t]
        self.assertEqual(vc.grade(vc.Series(t, v, p))["overall"], vc.NA)


class IO(unittest.TestCase):
    def test_csv_roundtrip_and_cli(self):
        with tempfile.TemporaryDirectory() as d:
            for name in ("fail_load_loss", "pass_shallow"):
                vc.write_csv(vc.synth(name), os.path.join(d, name + ".csv"))
            fail = subprocess.run([sys.executable, os.path.join(HERE, "vrt_check.py"),
                                   os.path.join(d, "fail_load_loss.csv"), "--json"],
                                  capture_output=True, text=True)
            self.assertEqual(fail.returncode, 1)
            self.assertEqual(json.loads(fail.stdout)["overall"], "FAIL")
            ok = subprocess.run([sys.executable, os.path.join(HERE, "vrt_check.py"),
                                 os.path.join(d, "pass_shallow.csv")], capture_output=True, text=True)
            self.assertEqual(ok.returncode, 0)
            self.assertIn("Overall: PASS", ok.stdout)

    def test_bad_input_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "bad.csv")
            with open(path, "w") as fh:
                fh.write("t,v\n0,1\n0.1,1\n0.2,1\n")
            r = subprocess.run([sys.executable, os.path.join(HERE, "vrt_check.py"), path],
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 2)
            self.assertIn("missing required column 'p'", r.stderr)
            with open(path, "w") as fh:
                fh.write("t,v,p\n0,1,1\n0,1,1\n0.2,1,1\n")
            r = subprocess.run([sys.executable, os.path.join(HERE, "vrt_check.py"), path],
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 2)

    def test_demo_all_match(self):
        r = subprocess.run([sys.executable, os.path.join(HERE, "vrt_check.py"), "--demo"],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout)
        self.assertNotIn("MISMATCH", r.stdout)


class MethodAlignment(unittest.TestCase):
    """Readings R6, R8 and R12 from TRIAGE_OFFER_AND_METHOD.md, section 8."""

    def test_r8_post_recovery_inrush_counts(self):
        s = step(0.7, 0.2, 70.0)                       # dip 1.0-1.2 s, current normal during dip
        s.i = [1.7 if 1.2 <= tk < 1.3 else 1.0 for tk in s.t]   # re-acceleration inrush after recovery
        self.assertEqual(statuses(vc.grade(s), "2.15(3)(d)"), [vc.FAIL])

    def test_r8_inrush_well_after_window_ignored(self):
        s = step(0.7, 0.2, 70.0)
        s.i = [1.7 if 5.0 <= tk < 5.1 else 1.0 for tk in s.t]   # > 2 s after recovery: not this event
        self.assertEqual(statuses(vc.grade(s), "2.15(3)(d)"), [vc.PASS])

    def test_r12_partial_trip_warns(self):
        r = vc.grade(step(0.6, 0.3, 50.0, lambda x: 93.0))      # recovers to 93%: passes 90%, settles low
        self.assertIn(vc.PASS, [f["status"] for f in r["findings"] if "within 2 s" in f["requirement"]])
        self.assertEqual(statuses(r, "2.15(3) remain connected"), [vc.WARN])

    def test_r12_full_recovery_no_warning(self):
        r = vc.grade(step(0.6, 0.3, 50.0, lambda x: 100.0))
        self.assertEqual(statuses(r, "2.15(3) remain connected"), [])

    def test_r6_report_both_is_informational(self):
        s = step(0.6, 0.3, 0.0, lambda x: min(100.0, 100.0 * x / 1.5))   # 90% at ~1.35 s: (c) ok, (e) not
        plain = vc.grade(s)
        both = vc.grade(s, report_both=True)
        alt = [f for f in both["findings"] if f["clause"] == "2.15(3)(e) [alt]"]
        self.assertEqual(len(alt), 1)
        self.assertEqual(alt[0]["status"], vc.INFO)
        self.assertIn("would NOT meet", alt[0]["detail"])
        self.assertEqual(plain["overall"], both["overall"])     # INFO never changes the verdict

    def test_r6_fast_return_would_meet(self):
        s = step(0.3, 0.1, 0.0, lambda x: min(100.0, 100.0 * x / 0.3))
        alt = [f for f in vc.grade(s, report_both=True)["findings"] if f["clause"] == "2.15(3)(e) [alt]"]
        self.assertIn("would MEET", alt[0]["detail"])


if __name__ == "__main__":
    unittest.main()
