from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # อนุญาตให้ React frontend เรียก API ได้ (CORS)

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})

@app.route('/upload', methods=['POST'])
def upload_images():
    # ตรวจสอบว่ามีไฟล์มาหรือไม่
    if 'userEmail' not in request.form:
        return jsonify({"error": "Missing userEmail"}), 400

    user_email = request.form['userEmail']
    
    # รวบรวมไฟล์ทั้งหมดที่ส่งมา (fingerprint และ eye images)
    uploaded_files = {}
    for key in request.files:
        file = request.files[key]
        # คุณอาจจะเซฟไฟล์ หรือประมวลผลต่อที่นี่
        # ตัวอย่าง: เซฟไฟล์ลงโฟลเดอร์ uploads/
        filename = f"{user_email}_{key}_{file.filename}"
        file.save(f"uploads/{filename}")
        uploaded_files[key] = filename

    return jsonify({
        "message": "Files uploaded successfully",
        "uploaded_files": uploaded_files,
        "userEmail": user_email
    })

if __name__ == '__main__':
    app.run(debug=True)