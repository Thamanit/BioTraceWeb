import React, { useEffect, useState } from 'react';

function Results() {
    const [eyeResults, setEyeResults] = useState([]);
    const [fingerprintResults, setFingerprintResults] = useState([]);
    
    // ฟังก์ชันเพื่อดึงข้อมูลจาก Firebase
    const fetchEyeResults = async () => {
        try {
            const response = await fetch("https://biotrace-69031-default-rtdb.asia-southeast1.firebasedatabase.app/eye_results.json");
            const data = await response.json();
            console.log("Eye Results Data:", data);  // เพิ่มการแสดงผลข้อมูล
            setEyeResults(data ? Object.values(data) : []);
        } catch (error) {
            console.error("Error fetching eye results:", error);
        }
    };

    const fetchFingerprintResults = async () => {
        try {
            const response = await fetch("https://biotrace-69031-default-rtdb.asia-southeast1.firebasedatabase.app/fingerprint_results.json");
            const data = await response.json();
            console.log("Fingerprint Results Data:", data);  // เพิ่มการแสดงผลข้อมูล
            setFingerprintResults(data ? Object.values(data) : []);
        } catch (error) {
            console.error("Error fetching fingerprint results:", error);
        }
    };

    // ใช้ useEffect เพื่อดึงข้อมูลจาก Firebase เมื่อโหลดเพจ
    useEffect(() => {
        fetchEyeResults();
        fetchFingerprintResults();

        // ตั้งเวลาให้ดึงข้อมูลใหม่ทุกๆ 5 วินาที
        const interval = setInterval(() => {
            fetchEyeResults();
            fetchFingerprintResults();
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
                            <p><strong>Image:</strong> {item.filename}</p>
                            <p><strong>Prediction:</strong> {item.prediction}</p>
                            <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%</p>
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
                            <p><strong>Image:</strong> {item.filename}</p>
                            <p><strong>Prediction:</strong> {item.predicted_label}</p>
                            <p><strong>Confidence:</strong> {(item.confidence * 100).toFixed(2)}%</p>
                        </div>
                    ))
                ) : (
                    <p>No fingerprint results available.</p>
                )}
            </section>
        </div>
    );
}

export default Results;
