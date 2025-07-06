// ฟังก์ชันเพื่อดึงข้อมูลจาก Firebase
const fetchEyeResults = async () => {
    try {
        const response = await fetch(process.env.FIREBASE_URL + "/eye_results.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching eye results:", error);
        return null;
    }
};

const fetchResults = async () => {
    try {
        const response = await fetch(process.env.FIREBASE_URL + "/results.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching eye results:", error);
        return null;
    }
};

const fetchFingerprintResults = async () => {
    try {
        const response = await fetch(process.env.FIREBASE_URL + "/fingerprint_results.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching fingerprint results:", error);
        return null;
    }
};

export const getResult = async (req, res) => {
    try {
        const email = req.user.email;
        const results = await fetchResults();

        const latestResult = Object.values(results)
            .filter(result => result.userEmail === email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

        res.status(200).json({
            results: [latestResult] || [],
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllResults = async (req, res) => {
    try {
        const results = await fetchResults();
        res.status(200).json({
            results: Object.values(results)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};