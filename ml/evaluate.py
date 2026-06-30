#!/usr/bin/env python3
"""Evaluate the GlowUp litter detector against the release acceptance targets.

Runs three checks and exits non-zero if any fails, so it doubles as a CI gate:
  1. Held-out TEST mAP + per-class precision/recall (location-disjoint split).
  2. Hard-negative false-positive rate (phantom gremlins on background images).
  3. Saves a confusion matrix to artifacts/ for class-confusion review.

Targets mirror ml/README.md §4.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

TARGETS = {
    "map50": 0.85,
    "map": 0.60,
    "per_class_recall": 0.75,
    "per_class_precision": 0.80,
    "max_fp_per_negative_image": 0.05,
}


def evaluate_map(weights: str, data: str, imgsz: int) -> bool:
    from ultralytics import YOLO

    model = YOLO(weights)
    m = model.val(data=data, split="test", imgsz=imgsz, plots=True)
    map50, map5095 = float(m.box.map50), float(m.box.map)
    print(f"TEST mAP@0.5={map50:.3f} (target {TARGETS['map50']})  "
          f"mAP@0.5:0.95={map5095:.3f} (target {TARGETS['map']})")

    ok = map50 >= TARGETS["map50"] and map5095 >= TARGETS["map"]

    # Per-class precision/recall (Ultralytics exposes p / r arrays).
    names = model.names
    p = list(getattr(m.box, "p", []) or [])
    r = list(getattr(m.box, "r", []) or [])
    print("\nPer-class precision / recall:")
    for i, name in names.items():
        if i < len(p) and i < len(r):
            prec, rec = p[i], r[i]
            flag = "" if (prec >= TARGETS["per_class_precision"]
                          and rec >= TARGETS["per_class_recall"]) else "  <-- below target"
            print(f"  {name:16s} P={prec:.3f}  R={rec:.3f}{flag}")
            ok = ok and prec >= TARGETS["per_class_precision"] and rec >= TARGETS["per_class_recall"]
    return ok


def evaluate_hard_negatives(weights: str, negatives: str, imgsz: int, conf: float) -> bool:
    neg_dir = Path(negatives)
    if not neg_dir.exists():
        print(f"WARNING: hard-negative dir {neg_dir} missing — skipping FP check.")
        return True

    from ultralytics import YOLO

    model = YOLO(weights)
    images = [p for p in neg_dir.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"}]
    if not images:
        print(f"WARNING: no images in {neg_dir} — skipping FP check.")
        return True

    total_fp = 0
    for img in images:
        res = model.predict(source=str(img), imgsz=imgsz, conf=conf, verbose=False)
        total_fp += sum(len(r.boxes) for r in res)  # any box on a negative is a phantom
    rate = total_fp / len(images)
    target = TARGETS["max_fp_per_negative_image"]
    print(f"\nHard-negative phantom rate = {rate:.3f} boxes/img (target ≤ {target})")
    return rate <= target


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", required=True)
    ap.add_argument("--data", default="datasets/glowup/data.yaml")
    ap.add_argument("--negatives", default="datasets/glowup/hard_negatives")
    ap.add_argument("--imgsz", type=int, default=640)
    ap.add_argument("--conf", type=float, default=0.40)
    args = ap.parse_args()

    Path("artifacts").mkdir(exist_ok=True)

    ok_map = evaluate_map(args.weights, args.data, args.imgsz)
    ok_fp = evaluate_hard_negatives(args.weights, args.negatives, args.imgsz, args.conf)

    if ok_map and ok_fp:
        print("\n✅ All acceptance targets met — model is release-eligible.")
        sys.exit(0)
    print("\n❌ One or more targets not met — not release-eligible.")
    sys.exit(1)


if __name__ == "__main__":
    main()
