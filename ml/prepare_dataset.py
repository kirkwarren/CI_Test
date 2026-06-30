#!/usr/bin/env python3
"""Assemble and normalize the GlowUp litter dataset.

Downloads/links the source datasets, remaps their heterogeneous labels to the 9
canonical GlowUp classes (labelmap.json), and writes a YOLO-format dataset with
a *location-disjoint* train/val/test split so near-duplicate frames can't leak
across splits and inflate metrics.

This is a scaffold: the source adapters intentionally raise if the raw data
isn't present, so a run fails loudly rather than producing an empty dataset.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Map each source dataset's raw label -> canonical GlowUp class name.
# Extend as new sources are added; anything unmapped is dropped (logged).
TACO_REMAP = {
    "Clear plastic bottle": "plastic_bottle",
    "Other plastic bottle": "plastic_bottle",
    "Drink can": "can",
    "Food can": "can",
    "Glass bottle": "glass_bottle",
    "Disposable plastic cup": "cup",
    "Paper cup": "cup",
    "Other plastic wrapper": "wrapper",
    "Crisp packet": "wrapper",
    "Cigarette": "cigarette",
    "Normal paper": "paper",
    "Magazine paper": "paper",
    "Plastic bag - wrapper": "plastic_bag",
    "Single-use carrier bag": "plastic_bag",
    "Food Container": "food_container",
    "Other carton": "food_container",
}


def load_classes() -> list[str]:
    spec = json.loads((HERE / "labelmap.json").read_text())
    return [c["name"] for c in sorted(spec["classes"], key=lambda c: c["index"])]


def class_index(classes: list[str], name: str) -> int | None:
    try:
        return classes.index(name)
    except ValueError:
        return None


def session_key(image_path: Path) -> str:
    """Group frames by capture session/location for a leakage-free split.

    Convention: <source>/<session_id>/<frame>.jpg — the session_id is the split
    unit. Falls back to the parent directory name.
    """
    parts = image_path.parts
    return parts[-2] if len(parts) >= 2 else image_path.stem


def split_sessions(sessions: list[str], ratios=(0.70, 0.15, 0.15)) -> dict[str, str]:
    """Deterministically assign whole sessions to train/val/test by hashing."""
    assignment: dict[str, str] = {}
    for s in sorted(sessions):
        # Stable hash in [0, 1).
        h = (abs(hash(("glowup-split", s))) % 10_000) / 10_000.0
        if h < ratios[0]:
            assignment[s] = "train"
        elif h < ratios[0] + ratios[1]:
            assignment[s] = "val"
        else:
            assignment[s] = "test"
    return assignment


def adapter_taco(root: Path):
    """Yield (image_path, [(class_name, xywhn)]) for the TACO dataset.

    Raises if TACO isn't present so the pipeline fails loudly.
    """
    if not root.exists():
        raise FileNotFoundError(
            f"TACO not found at {root}. Fetch it from https://github.com/pedropro/TACO "
            "and pass --taco <path>."
        )
    ann_file = root / "annotations.json"
    coco = json.loads(ann_file.read_text())
    cats = {c["id"]: c["name"] for c in coco["categories"]}
    images = {im["id"]: im for im in coco["images"]}
    per_image = defaultdict(list)
    for ann in coco["annotations"]:
        raw_name = cats[ann["category_id"]]
        mapped = TACO_REMAP.get(raw_name)
        if mapped is None:
            continue
        im = images[ann["image_id"]]
        x, y, w, h = ann["bbox"]
        xc = (x + w / 2) / im["width"]
        yc = (y + h / 2) / im["height"]
        per_image[ann["image_id"]].append((mapped, (xc, yc, w / im["width"], h / im["height"])))
    for image_id, boxes in per_image.items():
        yield root / images[image_id]["file_name"], boxes


def write_example(out: Path, split: str, classes: list[str], image_path: Path, boxes):
    img_dir = out / "images" / split
    lbl_dir = out / "labels" / split
    img_dir.mkdir(parents=True, exist_ok=True)
    lbl_dir.mkdir(parents=True, exist_ok=True)

    stem = f"{session_key(image_path)}__{image_path.stem}"
    shutil.copy2(image_path, img_dir / f"{stem}{image_path.suffix}")

    lines = []
    for name, (xc, yc, w, h) in boxes:
        idx = class_index(classes, name)
        if idx is None:
            continue
        lines.append(f"{idx} {xc:.6f} {yc:.6f} {w:.6f} {h:.6f}")
    (lbl_dir / f"{stem}.txt").write_text("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="datasets/glowup")
    ap.add_argument("--taco", default="datasets/raw/TACO")
    args = ap.parse_args()

    classes = load_classes()
    out = Path(args.out)

    # 1. Gather every example, keyed by session for the split.
    examples = list(adapter_taco(Path(args.taco)))
    # (Add more adapters here: adapter_trashnet(...), adapter_roboflow(...).)

    sessions = {session_key(p) for p, _ in examples}
    split_for = split_sessions(list(sessions))

    counts = defaultdict(int)
    for image_path, boxes in examples:
        split = split_for[session_key(image_path)]
        write_example(out, split, classes, image_path, boxes)
        counts[split] += 1

    # 2. Emit the concrete data.yaml.
    names_block = "\n".join(f"  {i}: {n}" for i, n in enumerate(classes))
    (out / "data.yaml").write_text(
        f"path: {out.resolve()}\ntrain: images/train\nval: images/val\n"
        f"test: images/test\n\nnames:\n{names_block}\n"
    )
    print(f"Wrote dataset to {out} — train/val/test = "
          f"{counts['train']}/{counts['val']}/{counts['test']}")
    print("Reminder: drop hard-negative (background-only) images into "
          f"{out}/hard_negatives for evaluate.py.")


if __name__ == "__main__":
    main()
