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

    // Optional: ดึงทุก 5 วินาที
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Prediction Results</h2>
      {results.map((item, index) => (
        <div key={index}>
          <p><strong>Image:</strong> {item.filename}</p>
          <p><strong>Prediction:</strong> {item.prediction}</p>
          <p><strong>Confidence:</strong> {item.confidence}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Results;