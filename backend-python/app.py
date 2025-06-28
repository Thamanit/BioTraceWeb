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

app = Flask(__name__)
CORS(app)

stage_names_eye = [
    "No DR - Healthy",
    "Mild DR - Early signs",
    "Moderate DR - Some vision impact",
    "Severe DR - High risk of vision loss",
    "Proliferative DR - Advanced stage, possible blindness"
]

# stage_names_finger = [
#     "Arc",    # index 0
#     "Whorl",  # index 1
#     "Loop"    # index 2
# ]


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load PyTorch model for eye
model_eye = EfficientNet.from_name('efficientnet-b6')
model_eye._fc = torch.nn.Linear(model_eye._fc.in_features, 5)
model_eye.load_state_dict(torch.load("model/EyeAI.pth", map_location=device))
model_eye.to(device)
model_eye.eval()

# Load TensorFlow model for finger
model_finger = tf.keras.models.load_model("model/FingerAI.h5")

FIREBASE_EYE_URL = "https://biotrace-69031-default-rtdb.asia-southeast1.firebasedatabase.app/eye_results.json"
FIREBASE_FINGER_URL = "https://biotrace-69031-default-rtdb.asia-southeast1.firebasedatabase.app/fingerprint_results.json"

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
    stage = stage_names_eye[pred]
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
    
    stage_names_finger = [
        "Arc",    # index 0
        "Whorl",  # index 1
        "Loop"    # index 2
    ]
    stage = stage_names_finger[pred]
    
    print(f"[DEBUG] Predicted index: {pred}")
    print(f"[DEBUG] Mapped label: {stage} with confidence {confidence:.4f}")
    
    return stage, float(confidence)




def save_and_predict(files, predict_func, firebase_url, userEmail):
    os.makedirs('uploads', exist_ok=True)
    results = []

    for file in files:
        filename = file.filename
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
            "confidence": confidence,
            "userEmail": userEmail,
            "timestamp": time.strftime("%Y-%m-%d %H:%M")
        }

        # เปลี่ยน key สำหรับ fingerprint ให้ตรงกับ React
        if 'fingerprint' in firebase_url:
            result["predicted_label"] = result.pop("prediction")

        # ส่งผลลัพธ์ไป Firebase
        try:
            response = requests.post(firebase_url, data=json.dumps(result))
            if response.status_code != 200:
                print(f"[WARN] Firebase POST failed for {filename}: Status {response.status_code}")
        except Exception as e:
            print(f"[ERROR] Firebase error for {filename}: {e}")

        results.append({
            "filename": filename,
            "prediction": stage,
            "confidence": round(confidence * 100, 2),
            "userEmail": userEmail,
            "timestamp": time.strftime("%Y-%m-%d %H:%M")
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
