# Adaptive Traffic Management System

## 📸 Project Screenshots

### 🏠 Home Page
<img src="Images/Home_Page.png" width="700"/>

### 📥 Input Page
<img src="Images/Input_Image.jpg" width="700"/>

### 🚦 Traffic Signal
<img src="Images/Signal.png" width="700"/>

### 📊 Comparison View
<img src="Images/Comparion.jpg" width="700"/>

---

## Introduction

This project is a Traffic Light Management System that dynamically adjusts traffic light timings based on the number of vehicles in each lane. The system uses YOLO for vehicle detection and a Flask API for receiving and processing uploaded images of traffic scenes. It counts the number of vehicles detected in each image and can be integrated with a traffic light control system.

## Features

* Vehicle Detection: Uses the YOLOv8 model to detect vehicles in the camera feed.
* Flask API: A REST API that accepts image uploads, processes the images, and returns the vehicle count for each uploaded image.
* Dynamic Traffic Lights: The system adjusts traffic light durations based on the vehicle count in each lane.
* Timer Display: Displays the countdown of green light durations for each direction (left, right, up, down).
* Custom Visualization: Shows a custom graphical representation of traffic lights and lanes on a split-screen view.

# Requirements

* Python 3.x
* Ultralytics YOLO: For object detection.
* OpenCV (opencv-python)
* Flask: For creating the web API.
* Werkzeug: For secure file handling.
* PIL (Pillow): For image manipulation

# Installation & Setup

1. Clone the repository:

```bash
cd technex-2025

Install dependencies:

pip install -r requirements.txt

Place YOLO model:

Ensure you have the YOLOv8 model (yolov8n.pt) in the root directory of your project or update the path in app.py.

model = YOLO("yolov8n.pt")  # Replace with your YOLO model weights

Running the Flask App:

python app.py

By default, the API will be available at http://0.0.0.0:5000
.

Uploading Images

The API accepts a POST request at the /upload endpoint. It expects images to be uploaded in a multipart/form-data request.

The API accepts multiple image files at once.

Each image will be processed by the YOLO model, and the number of vehicles detected in the image will be returned in the response.

Sample Request:

curl -X POST -F "image=@image1.jpg" -F "image=@image2.jpg" http://127.0.0.1:5000/upload

Response:

{
  "vehicle_counts": [5, 3]
}
File Handling

Uploaded Files: Images are temporarily stored in the uploads/ directory. Ensure this directory exists before uploading files, or it will be created automatically.

Allowed File Formats: Only png, jpg, jpeg, and gif are accepted for image uploads.

Future Enhancements

Dynamic Traffic Light Adjustment: The system can be extended to control real-world traffic lights by integrating with a physical system like Arduino.

Vehicle Type Detection: Detect specific vehicle types (e.g., cars, trucks, motorcycles) for further traffic management.

Real-Time Detection: Implement real-time detection using video streams instead of static images.

© 2025 Algo Riders. All Rights Reserved.