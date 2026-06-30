#!/usr/bin/env python3
"""Train the GlowUp litter detector (YOLOv8).

Augmentations are tuned for ground litter shot at a downward phone angle in
variable light. See ml/README.md for the dataset and acceptance targets.

Create ML alternative (no-code, Mac-only):
    Open Create ML → Object Detection → point at the YOLO/COCO dataset → train.
    Export .mlmodel and skip convert_coreml.py. YOLO is preferred here for the
    PR curves, per-class metrics, and hard-negative control we gate releases on.
"""
from __future__ import annotations

import argparse


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="datasets/glowup/data.yaml")
    ap.add_argument("--model", default="yolov8s", help="yolov8n for older devices")
    ap.add_argument("--epochs", type=int, default=120)
    ap.add_argument("--imgsz", type=int, default=640)
    ap.add_argument("--batch", type=int, default=32)
    ap.add_argument("--device", default="0", help="'0' GPU, 'mps' Apple, 'cpu'")
    args = ap.parse_args()

    from ultralytics import YOLO

    model = YOLO(f"{args.model}.pt")  # COCO-pretrained start (transfer learning)

    model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=args.device,
        patience=25,                 # early stop on plateaued val mAP
        optimizer="AdamW",
        lr0=0.002,
        cos_lr=True,
        # --- augmentation profile for ground litter ---
        mosaic=1.0,
        close_mosaic=15,             # disable mosaic for the final epochs
        copy_paste=0.3,
        degrees=10.0,
        perspective=0.0005,          # simulate the downward camera angle
        hsv_h=0.015, hsv_s=0.7, hsv_v=0.5,
        translate=0.1, scale=0.5, fliplr=0.5,
        # small, dense objects benefit from these:
        box=7.5, cls=0.5, dfl=1.5,
    )

    # Quick val pass so the run prints mAP immediately.
    metrics = model.val(data=args.data, split="val", imgsz=args.imgsz)
    print(f"val mAP@0.5={metrics.box.map50:.3f}  mAP@0.5:0.95={metrics.box.map:.3f}")
    print("Next: evaluate.py on the frozen test split, then convert_coreml.py.")


if __name__ == "__main__":
    main()
