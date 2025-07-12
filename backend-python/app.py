import datetime
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from efficientnet_pytorch import EfficientNet
import numpy as np
import requests
import json
import tensorflow as tf
from src.Fingerprint import calculate_diabetes_risk
from src.Retinal import calculate_diabetes_risk_from_eyes
from src.SumDiabetes import manual_weighted_risk
from typing import Optional
from dotenv import load_dotenv
from zoneinfo import ZoneInfo
load_dotenv()

app = Flask(__name__)
CORS(app)

stage_names_eye = [
    "No DR - Healthy", # index 0 + 1 
    "Mild DR - Early signs", # index 1 + 1
    "Moderate DR - Some vision impact", # index 2 + 1
    "Severe DR - High risk of vision loss", # index 3 + 1
    "Proliferative DR - Advanced stage, possible blindness" # index 4 + 1
]

stage_names_finger = [
        "A",    # index 0
        "W",  # index 1
        "L"    # index 2
]

fingerLabels = [
    "Right Thumb",
    "Right Index",
    "Right Middle",
    "Right Ring",
    "Right Little",
    "Left Thumb",
    "Left Index",
    "Left Middle",
    "Left Ring",
    "Left Little",
]
eyeLabels = ["Left Eye", "Right Eye"]


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ✅ Correct variant: EfficientNet-B4
model_eye = EfficientNet.from_name('efficientnet-b4')
model_eye._fc = torch.nn.Linear(model_eye._fc.in_features, 5)  # 5 classes
model_eye.load_state_dict(torch.load("model/EyeAI.pth", map_location=device))
model_eye.to(device)
model_eye.eval()

# Load TensorFlow model for finger
model_finger = tf.keras.models.load_model("model/FingerAI.h5")

FIREBASE_EYE_URL = os.environ.get("FIREBASE_URL") + "eye_results.json"
FIREBASE_FINGER_URL = os.environ.get("FIREBASE_URL") + "fingerprint_results.json"
FIREBASE_RESULT_URL = os.environ.get("FIREBASE_URL") + "results.json"

transform_eye = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def preprocess_image_eye(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Cannot read eye image")
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (456, 456))
    return image

def preprocess_image_finger(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Cannot read finger image")
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (150, 150))
    image = image.astype(np.float32) / 255.0
    return image

def predict_eye(image_path):
    img = preprocess_image_eye(image_path)
    tensor = transform_eye(img).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model_eye(tensor)
        pred = torch.argmax(output, 1).item()
        prob = F.softmax(output, dim=1).squeeze().cpu().numpy()
    stage = pred + 1
    confidence = float(prob[pred])
    return stage, confidence

def predict_finger(image_path):
    img = preprocess_image_finger(image_path)
    
    # Debug input image info
    print(f"[DEBUG] Finger image shape: {img.shape}, min: {img.min():.4f}, max: {img.max():.4f}, mean: {img.mean():.4f}")

    input_tensor = np.expand_dims(img, axis=0)
    
    print(f"[DEBUG] Input tensor shape: {input_tensor.shape}")
    
    preds = model_finger.predict(input_tensor)
    
    print(f"[DEBUG] Model raw output (preds): {preds}")
    
    if np.isnan(preds).any():
        raise ValueError("Model prediction contains NaN")
    
    pred = np.argmax(preds, axis=1)[0]
    confidence = preds[0][pred]
    
    stage = stage_names_finger[pred]
    
    print(f"[DEBUG] Predicted index: {pred}")
    print(f"[DEBUG] Mapped label: {stage} with confidence {confidence:.4f}")
    
    return stage, float(confidence)

def save_and_predict(files, predict_func, firebase_url, userEmail):
    os.makedirs('uploads', exist_ok=True)
    results = []

    for file in files:
        filename = file.filename.split('_')[1]
        save_path = os.path.join('uploads', filename)
        file.save(save_path)

        print(f"[INFO] Saved file {filename} at {save_path}")

        try:
            stage, confidence = predict_func(save_path)
            print(f"[INFO] Prediction for {filename}: {stage} ({confidence:.4f})")
        except Exception as e:
            os.remove(save_path)
            print(f"[ERROR] Prediction failed for {filename}: {e}")
            return {'error': str(e)}, 400

        result = {
            "filename": filename,
            "prediction": stage,
            "confidence": confidence, #%confidenceจากaccuracy ai
            "userEmail": userEmail,
            "timestamp": datetime.datetime.now(ZoneInfo("Asia/Bangkok")).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        }

        # เปลี่ยน key สำหรับ fingerprint ให้ตรงกับ React
        if 'fingerprint' in firebase_url:
            result["predicted_label"] = result.pop("prediction")

        results.append({
            "filename": filename,
            "prediction": stage,
            "confidence": round(confidence * 100, 2),
            "userEmail": userEmail,
            "timestamp": datetime.datetime.now(ZoneInfo("Asia/Bangkok")).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        })

        os.remove(save_path)
        print(f"[INFO] Removed file {filename}")

    return results

@app.route('/upload-eye', methods=['POST'])
def upload_eye():
    if 'image' not in request.files:
        return jsonify({'error': 'No eye image files provided'}), 400
    user_email = request.form.get('userEmail')
    images = request.files.getlist('image')
    print(f"[INFO] Eye images received: {[f.filename for f in images]}")
    if len(images) == 0:
        return jsonify({'error': 'No eye image files provided'}), 400
    results = save_and_predict(images, predict_eye, FIREBASE_EYE_URL,user_email)
    if isinstance(results, tuple):
        return jsonify(results[0]), results[1]
    return jsonify({"results": results})

@app.route('/upload-finger', methods=['POST'])
def upload_finger():
    if 'image' not in request.files:
        return jsonify({'error': 'No finger image files provided'}), 400
    images = request.files.getlist('image')
    user_email = request.form.get('userEmail')
    print(f"[INFO] Finger images received: {[f.filename for f in images]}")
    if len(images) == 0:
        return jsonify({'error': 'No finger image files provided'}), 400
    results = save_and_predict(images, predict_finger, FIREBASE_FINGER_URL, user_email)
    if isinstance(results, tuple):
        return jsonify(results[0]), results[1]
    return jsonify({"results": results})

@app.route('/upload', methods=['POST'])
def upload():
    if 'eye' not in request.files and 'finger' not in request.files:
        return jsonify({'error': 'No image files provided for either eye or finger'}), 400

    user_email = request.form.get('userEmail')
    gender = request.form.get('gender')
    age = 0
    try:
        age = int(request.form.get('age', 0))
    except ValueError:
        return jsonify({'error': 'Invalid age provided'}), 400

    results_eye = []
    results_finger = []

    # Process eye images
    if 'eye' in request.files:
        eye_images = request.files.getlist('eye')
        if len(eye_images) > 0:
            print(f"[INFO] Eye images received: {[f.filename for f in eye_images]}")
            eye_results = save_and_predict(eye_images, predict_eye, FIREBASE_EYE_URL, user_email)
            # error handling for eye results
            if isinstance(eye_results, tuple):
                return jsonify(eye_results[0]), eye_results[1]
            results_eye = eye_results

    # Process finger images
    if 'finger' in request.files:
        finger_images = request.files.getlist('finger')
        if len(finger_images) > 0:
            print(f"[INFO] Finger images received: {[f.filename for f in finger_images]}")
            finger_results = save_and_predict(finger_images, predict_finger, FIREBASE_FINGER_URL, user_email)
            # error handling for finger results
            if isinstance(finger_results, tuple):
                return jsonify(finger_results[0]), finger_results[1]
            results_finger= finger_results
    
    # age = 66
    # gender = 'หญิง'  # หรือ 'ชาย'

    eye_risk = 0
    finger_risk = 0

    print(f"[INFO] Eye results: {results_eye}")
    print(f"[INFO] Finger results: {results_finger}")

    eye_left: Optional[dict] = next((r for r in results_eye if r["filename"] == eyeLabels[0]), None)
    eye_right: Optional[dict] = next((r for r in results_eye if r["filename"] == eyeLabels[1]), None)
    if eye_left and eye_right:
        print(f"[INFO] Left Eye Prediction: {eye_left['prediction']}, Right Eye Prediction: {eye_right['prediction']}")
        eye_risk = calculate_diabetes_risk_from_eyes(eye_left['prediction'], eye_right['prediction'], age, gender)
    
    finger_left_thumb: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[0]), None)
    finger_left_index: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[1]), None)
    finger_left_middle: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[2]), None)
    finger_left_ring: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[3]), None)
    finger_left_little: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[4]), None)
    finger_right_thumb: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[5]), None)
    finger_right_index: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[6]), None)
    finger_right_middle: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[7]), None)
    finger_right_ring: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[8]), None)
    finger_right_little: Optional[dict] = next((r for r in results_finger if r["filename"] == fingerLabels[9]), None)

    if (finger_left_thumb and finger_left_index and finger_left_middle and 
        finger_left_ring and finger_left_little and finger_right_thumb and 
        finger_right_index and finger_right_middle and finger_right_ring and 
        finger_right_little):

        fingers_input = {
            'R1': finger_right_thumb['prediction'],
            'R2': finger_right_index['prediction'],
            'R3': finger_right_middle['prediction'],
            'R4': finger_right_ring['prediction'],
            'R5': finger_right_little['prediction'],
            'L1': finger_left_thumb['prediction'],
            'L2': finger_left_index['prediction'],
            'L3': finger_left_middle['prediction'],
            'L4': finger_left_ring['prediction'],
            'L5': finger_left_little['prediction']
        }
        finger_risk = calculate_diabetes_risk(
            fingers_input, gender, age
        )
    
    # Combine results
    result_risk = manual_weighted_risk(eye_risk, finger_risk)

    result = {
        "prediction": result_risk['total_risk'],
        "level": result_risk['level'],
        "description": result_risk['description'],
        "userEmail": user_email,
        "timestamp": datetime.datetime.now(ZoneInfo("Asia/Bangkok")).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    }

    # ส่งผลลัพธ์ไป Firebase
    try:
        response = requests.post(FIREBASE_RESULT_URL, data=json.dumps(result))
    except Exception as e:
        print(f"[ERROR] Firebase error")

    return jsonify({"results": {
        "result": result
    }})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
