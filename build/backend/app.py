"""
Adaptive Traffic Management System - Flask Backend
----------------------------------------------------
Accepts traffic-lane images, runs YOLOv8 vehicle detection on each,
and returns vehicle counts plus computed adaptive green-light durations.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO
from PIL import Image

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # allow requests from the Vite dev server (different origin/port)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
MODEL_PATH = os.path.join(os.path.dirname(BASE_DIR), "yolov8n.pt")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB per request

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

# COCO class ids that correspond to road vehicles. YOLOv8n is pretrained on
# COCO, whose classes 2, 3, 5, 7 are car, motorcycle, bus, truck. We also
# count bicycles (class 1) as light two-wheelers.
VEHICLE_CLASS_IDS = {1, 2, 3, 5, 7}

# Signal-timing tunables
MIN_GREEN_TIME = 10   # seconds - floor, so no lane is ever starved
MAX_GREEN_TIME = 60   # seconds - ceiling, so no lane hogs the whole cycle
BASE_GREEN_TIME = 10  # seconds - starting allowance before vehicles are added
TIME_PER_VEHICLE = 2  # seconds added per detected vehicle

print("Loading YOLOv8 model...")
model = YOLO(MODEL_PATH)
print("Model loaded.")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def count_vehicles(image_path):
    """Run YOLO on a single image and return the number of vehicle detections."""
    results = model(image_path, verbose=False)
    count = 0
    for result in results:
        if result.boxes is None:
            continue
        for cls_id in result.boxes.cls.tolist():
            if int(cls_id) in VEHICLE_CLASS_IDS:
                count += 1
    return count


def compute_green_time(vehicle_count):
    """Map a vehicle count to a green-light duration, clamped to [MIN, MAX]."""
    raw_time = BASE_GREEN_TIME + vehicle_count * TIME_PER_VEHICLE
    return max(MIN_GREEN_TIME, min(MAX_GREEN_TIME, raw_time))


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Traffic Management API is running"})


@app.route("/upload", methods=["POST"])
def upload_images():
    """
    Accepts one or more images under the form field name "image"
    (multiple files can share the same field name), runs vehicle
    detection on each, and returns counts + suggested green times
    in the same order the files were received.

    Response:
    {
      "vehicle_counts": [5, 3, 8, 1],
      "green_times": [20, 16, 30, 10],
      "directions": ["left", "right", "up", "down"]
    }
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file(s) provided under field 'image'"}), 400

    files = request.files.getlist("image")
    if not files or all(f.filename == "" for f in files):
        return jsonify({"error": "No selected files"}), 400

    vehicle_counts = []
    saved_paths = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            saved_paths.append(filepath)

            try:
                count = count_vehicles(filepath)
            except Exception as exc:  # pragma: no cover - defensive
                return jsonify({"error": f"Detection failed for {filename}: {exc}"}), 500

            vehicle_counts.append(count)
        else:
            return jsonify({"error": f"File type not allowed: {file.filename}"}), 400

    green_times = [compute_green_time(c) for c in vehicle_counts]
    directions = ["left", "right", "up", "down"][: len(vehicle_counts)]

    # Clean up temp files after inference
    for path in saved_paths:
        try:
            os.remove(path)
        except OSError:
            pass

    return jsonify(
        {
            "vehicle_counts": vehicle_counts,
            "green_times": green_times,
            "directions": directions,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
