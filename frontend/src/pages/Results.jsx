import React, { useEffect, useState } from 'react';
import { getApiURL } from '../lib/route';
import axios from "axios";

function Results() {
    const [results, setResults] = useState([]);

    const fetchResults = async () => {
        try {
            const response = await axios.get(getApiURL() + "/ml/results", {
                withCredentials: true, // sends cookies/auth with request
            });
            const data = response.data;
            setResults(data.results);
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
                <h2 className="text-2xl font-bold mb-4 text-white">🩺 Diabetes Detection Results</h2>
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border rounded bg-white shadow">
                            <p><strong>User Email:</strong> {item?.userEmail}</p>
                            <p><strong>Diabetes Prediction:</strong> {item?.prediction + "%"}</p>
                            <p><strong>Level :</strong> {item?.level}</p>
                            <p><strong>Description :</strong> {item?.description}</p>
                            <p><strong>Timestamp:</strong> {new Date(item?.timestamp).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No eye results available.</p>
                )}
            </section>
        </div>
    );
}

export default Results;