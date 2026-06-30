# GlowUp Litter Detector — model card & training pipeline

On-device object detector that finds litter on the ground from the iPhone
camera. Each detected item becomes an AR **gremlin** the player banishes by
picking the litter up. This directory contains the full, reproducible pipeline:
dataset assembly → training → evaluation → Core ML export.

> **Status:** pipeline + evaluation harness are complete and runnable. The
> trained weights are **not** committed (large binaries; see `.gitignore`).
> Producing the shipped `LitterDetector.mlpackage` requires running `train.py`
> on a GPU box / Mac with the datasets below. The accuracy figures in this card
> are the **acceptance targets** the eval harness checks against — not yet
> measured numbers. Treat them as the bar a release build must clear.

---

## 1. Problem framing

- **Task:** multi-class 2D object detection, 9 litter classes (`labelmap.json`).
- **Where it runs:** real time on-device via Vision + Core ML, throttled to
  ~6 Hz, on the A-series Neural Engine. No frames leave the phone (privacy +
  offline + zero per-call cost).
- **Hard part:** ground litter is small, cluttered, motion-blurred, and shot at
  a steep angle in highly variable lighting. The dominant failure mode is
  *false positives* (leaves, gum, drains, shadows → phantom gremlins), so the
  pipeline invests heavily in hard-negative mining and the app gates detections
  temporally before spawning anything (`DetectionGate`).

## 2. Architecture

- **Detector:** YOLOv8s (anchor-free, single-stage). Chosen for the best
  accuracy/latency trade-off on the Neural Engine; `yolov8n` is the fallback for
  older devices. Input 640×640, letterbox-free `scaleFit` at inference so small
  ground items aren't squashed.
- **Export:** Ultralytics → Core ML (`coremltools`) with an `nms` pipeline head,
  FP16 weights, `computeUnits = .all`.
- **Why not Create ML?** Create ML's object detector is a great no-code baseline
  and is documented in `train.py` as an alternative; YOLO gives us PR curves,
  per-class metrics, and hard-negative control we need to hit the accuracy bar.

## 3. Datasets

Assembled and remapped to our 9 classes by `prepare_dataset.py`:

| Source | Lic. | Use |
| --- | --- | --- |
| **TACO** (Trash Annotations in Context) | CC BY 4.0 | primary; remap 60 → 9 classes |
| **TrashNet** | MIT | per-object crops for class balance |
| **Roboflow Universe** litter/trash sets | mixed (filtered to permissive) | volume + diversity |
| **GlowUp field set** | first-party | *ground-angle*, low-light, motion-blur, regional litter; the distribution that matters most |
| **Hard negatives** | first-party + open | leaves, rocks, gum, drains, manhole covers, shadows, wet pavement — background-only images |

**Splits:** 70 / 15 / 15 train/val/test, split **by capture session/location** (not
random frames) so near-duplicate frames can't leak across splits and inflate
metrics. The test set is frozen and location-disjoint from train.

**Augmentation:** mosaic, copy-paste, HSV jitter, random perspective (simulates
the downward phone angle), motion blur, low-light gamma, JPEG compression.

## 4. Acceptance targets (what "high accuracy" means here)

Checked automatically by `evaluate.py`; a release build must pass all:

| Metric | Target |
| --- | --- |
| **mAP@0.5** (test) | ≥ **0.85** |
| **mAP@0.5:0.95** (test) | ≥ 0.60 |
| **Per-class recall** (each class) | ≥ 0.75 |
| **Per-class precision** (each class) | ≥ 0.80 |
| **False-positive rate on hard-negative set** | ≤ 0.05 phantom boxes / image |
| **On-device latency** (A16, 640²) | ≤ 30 ms / frame (≈33 fps headroom for 6 Hz) |
| **Confidence calibration** (ECE) | ≤ 0.05 |

Precision/false-positives are weighted above raw recall on purpose: a missed
gremlin is invisible to the player; a phantom gremlin breaks trust and the game.

## 5. Evaluation methodology (the "well tested" part)

1. **Held-out test mAP** — `evaluate.py` runs Ultralytics `val` on the frozen,
   location-disjoint test split and prints mAP\@0.5, mAP\@0.5:0.95, and the full
   per-class precision/recall table.
2. **Hard-negative suite** — runs inference over background-only images and
   asserts the phantom-box rate stays under target. This is the headline guard
   against false gremlins.
3. **Confusion matrix** — saved to `artifacts/` to catch class confusions
   (e.g. cup ↔ container) that hurt the sorting bonus.
4. **Calibration** — reliability diagram + Expected Calibration Error, so the
   app's confidence thresholds mean what they say.
5. **Slice metrics** — accuracy reported per lighting (day/dusk/night), per
   surface (grass/pavement/sand), and per distance bucket, so we don't ship a
   model that only works on sunny sidewalks.
6. **On-device parity** — `convert_coreml.py` verifies the Core ML output
   matches the PyTorch model on a sample batch within tolerance, so export
   doesn't silently regress accuracy.
7. **Regression gate** — these checks run in CI on every model bump; a PR that
   lowers any metric below target fails.

The app-side decision logic (NMS, temporal track confirmation, ground-plane and
distance gating) is **separately unit-tested** in Swift
(`GlowUpTests/DetectionGateTests.swift`, `NonMaxSuppressionTests.swift`) because
field-perceived accuracy depends on it as much as on raw mAP.

## 6. Reproduce

```bash
cd ml
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

python prepare_dataset.py --out datasets/glowup     # assemble + remap + split
python train.py --data datasets/glowup/data.yaml --model yolov8s --epochs 120
python evaluate.py --weights runs/detect/train/weights/best.pt \
                   --data datasets/glowup/data.yaml \
                   --negatives datasets/glowup/hard_negatives
python convert_coreml.py --weights runs/detect/train/weights/best.pt \
                         --out artifacts/LitterDetector.mlpackage
```

Drop `artifacts/LitterDetector.mlpackage` into the Xcode app target (it loads by
name in `CoreMLLitterDetector`). Until then the app runs the `MockLitterDetector`
so the AR flow is fully demoable.

## 7. Ethics & safety

- The model never directs anyone to pick up hazardous waste; classes are
  everyday litter only. Hazards are **reported**, not detected-for-pickup.
- Frames are processed on-device and discarded; nothing is uploaded.
- Bias review: slice metrics across neighborhoods/surfaces/lighting are part of
  the release gate so the game works as well in underserved areas as anywhere.
