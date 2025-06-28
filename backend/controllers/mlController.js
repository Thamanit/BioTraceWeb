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
        const eyes = await fetchEyeResults();
        const fingers = await fetchFingerprintResults();
        const latestEye = Object.values(eyes)
            .filter(eye => eye.userEmail === email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];  // latest first

        const latestFinger = Object.values(fingers)
            .filter(finger => finger.userEmail === email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

        res.status(200).json({
            eyes: [latestEye] || [],
            fingers: [latestFinger] || []
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllResults = async (req, res) => {
    try {
        const eyes = await fetchEyeResults();
        const fingers = await fetchFingerprintResults();
        res.status(200).json({
            fingers: Object.values(fingers),
            eyes: Object.values(eyes)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};