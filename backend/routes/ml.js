import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { verifyToken, verifyAdmin } from '../utils/verifyToken.js';
import { getResult, getAllResults } from '../controllers/mlController.js';

const fingerLabels = [
  "Right Thumb",
  "Right Index",
  "Right Middle",
  "Right Ring",
  "Right Little",
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Little",
];
const eyeLabels = ["Left Eye", "Right Eye"];

const router = express.Router();
const upload = multer({ dest: 'temp_uploads/' });

router.get('/results', verifyToken, getResult);

router.get('/results/all', verifyAdmin, getAllResults);

router.post('/upload', upload.any(), async (req, res) => {
  try {
    const { userEmail, gender, age } = req.body;
    if (!userEmail) return res.status(400).json({ error: 'Missing userEmail' });
    if (!gender) return res.status(400).json({ error: 'Missing gender' });
    if (!age) return res.status(400).json({ error: 'Missing age' });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No files uploaded' });

    console.log('Files received:', req.files.map(f => f));

    // แยกไฟล์ตาม prefix "eye_" และ "finger_"
    const eyeFiles = req.files.filter(f => f.fieldname.toLowerCase().startsWith('eye_'));
    const fingerFiles = req.files.filter(f => f.fieldname.toLowerCase().startsWith('finger_'));

    console.log('Eye files:', eyeFiles.map(f => f.fieldname));
    console.log('Finger files:', fingerFiles.map(f => f.fieldname));

    //validate file label from eye and finger
    const validateFiles = (files, labels) => {
      if (files.length !== labels.length) {
        throw new Error(`Expected ${labels.length} files, but got ${files.length}`);
      }
      files.forEach(file => {
        const label = file.fieldname.split('_')[1];
        if (!labels.includes(label)) {
          throw new Error(`Invalid file label: ${file.originalname}`);
        }
      });
    };

    validateFiles(eyeFiles, eyeLabels);
    validateFiles(fingerFiles, fingerLabels);

    const sendFilesToPython = async (eye_files, finger_files, endpoint) => {
      if (eye_files.length + finger_files.length === 0) return null;

      const formData = new FormData();
      formData.append('userEmail', userEmail);
      formData.append('gender', gender);
      formData.append('age', age);

      eye_files.forEach(file => {
        formData.append('eye', fs.createReadStream(file.path), file.fieldname);
      });

      finger_files.forEach(file => {
        formData.append('finger', fs.createReadStream(file.path), file.fieldname);
      });

      const pythonApiUrl = `${process.env.PYTHON_URL}/${endpoint}`;
      const response = await axios.post(pythonApiUrl, formData, {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log(`Response from ${endpoint}:`, response.data);
      return response.data;
    };

    const results = await sendFilesToPython(eyeFiles, fingerFiles, 'upload');

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
      results
    });
  } catch (error) {
    console.error('Error uploading to Python:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload images to Python server' });
  }
});

export default router;
