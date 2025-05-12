import React, { useEffect, useState } from 'react';

function Results() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch("https://biotrace-69031-default-rtdb.asia-southeast1.firebasedatabase.app/results.json");
            const data = await response.json();
            const formatted = data ? Object.values(data) : [];
            setResults(formatted);
        };

        fetchResults();
        const interval = setInterval(fetchResults, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
            {results.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded bg-white shadow">
                    <p><strong>Image:</strong> {item.filename}</p>
                    <p><strong>Prediction:</strong> {item.prediction}</p>
                    <p><strong>Accuracy:</strong> {item.confidence}</p>
                </div>
            ))}
        </div>
    );
}

export default Results;