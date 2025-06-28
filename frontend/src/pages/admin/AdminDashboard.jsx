import React, { useEffect, useState } from 'react';
import { getApiURL } from '../../lib/route';
import axios from "axios";

function AdminDashboard() {
    const [eyeResults, setEyeResults] = useState([]);
    const [fingerprintResults, setFingerprintResults] = useState([]);

    const fetchResults = async () => {
        try {
            const response = await axios.get(getApiURL() + "/ml/results/all", {
                withCredentials: true, // sends cookies/auth with request
            });
            const data = response.data;
            setEyeResults(data.eyes);
            setFingerprintResults(data.fingers);
        } catch (error) {
            console.error("Error fetching eye results:", error);
        }
    }

    // ใช้ useEffect เพื่อดึงข้อมูลจาก Firebase เมื่อโหลดเพจ
    useEffect(() => {
        fetchResults();

        // ตั้งเวลาให้ดึงข้อมูลใหม่ทุกๆ 5 วินาที
        const interval = setInterval(() => {
            fetchResults();
        }, 5000);

        // ล้างการตั้งเวลาเมื่อ component นี้ถูกลบ
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 space-y-10">
            {/* ผลลัพธ์การตรวจสอบตา */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-blue-600">🩺 Eye Detection Results</h2>
                {eyeResults.length > 0 ? (
                    eyeResults.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border rounded bg-white shadow">
                            <p><strong>User Email:</strong> {item.userEmail}</p>
                            <p><strong>Image:</strong> {item.filename}</p>
                            <p><strong>Prediction:</strong> {item.prediction}</p>
                            <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%</p>
                            <p><strong>Timestamp:</strong> {item.timestamp}</p>
                        </div>
                    ))
                ) : (
                    <p>No eye results available.</p>
                )}
            </section>

            {/* ผลลัพธ์การตรวจสอบลายนิ้วมือ */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-green-600">🧬 Fingerprint Detection Results</h2>
                {fingerprintResults.length > 0 ? (
                    fingerprintResults.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border rounded bg-white shadow">
                            <p><strong>User Email:</strong> {item.userEmail}</p>
                            <p><strong>Image:</strong> {item.filename}</p>
                            <p><strong>Prediction:</strong> {item.predicted_label}</p>
                            <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%</p>
                            <p><strong>Timestamp:</strong> {item.timestamp}</p>
                        </div>
                    ))
                ) : (
                    <p>No fingerprint results available.</p>
                )}
            </section>
        </div>
    );
}

export default AdminDashboard;
