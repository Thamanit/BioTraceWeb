import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { verifyToken, verifyAdmin } from '../utils/verifyToken.js';
import { getResult, getAllResults } from '../controllers/mlController.js';

const router = express.Router();
const upload = multer({ dest: 'temp_uploads/' });

router.get('/results', verifyToken, getResult);

router.get('/results/all', verifyAdmin, getAllResults);

router.post('/upload', upload.any(), async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ error: 'Missing userEmail' });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No files uploaded' });

    console.log('Files received:', req.files.map(f => f.originalname));

    // แยกไฟล์ตาม prefix "eye_" และ "finger_"
    const eyeFiles = req.files.filter(f => f.originalname.toLowerCase().startsWith('eye_'));
    const fingerFiles = req.files.filter(f => f.originalname.toLowerCase().startsWith('finger_'));

    console.log('Eye files:', eyeFiles.map(f => f.originalname));
    console.log('Finger files:', fingerFiles.map(f => f.originalname));

    const sendFilesToPython = async (files, endpoint) => {
      if (files.length === 0) return null;

      const formData = new FormData();
      formData.append('userEmail', userEmail);

      files.forEach(file => {
        formData.append('image', fs.createReadStream(file.path), file.originalname);
      });

      const pythonApiUrl = `http://localhost:5000/${endpoint}`;
      const response = await axios.post(pythonApiUrl, formData, {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log(`Response from ${endpoint}:`, response.data);
      return response.data;
    };

    const eyeResult = await sendFilesToPython(eyeFiles, 'upload-eye');
    const fingerResult = await sendFilesToPython(fingerFiles, 'upload-finger');

    // ลบไฟล์ temp ทุกไฟล์หลังส่งเรียบร้อย
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error(`Error deleting file ${file.path}:`, err);
      }
    });

    res.json({
      message: 'Files sent to Python server',
      eyeResult,
      fingerResult,
    });
  } catch (error) {
    console.error('Error uploading to Python:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload images to Python server' });
  }
});

export default router;
