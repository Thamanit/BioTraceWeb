import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { getApiURL } from "../lib/route";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  axios.defaults.withCredentials = true;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const [fingerFiles, setFingerFiles] = useState({});
  const [eyeFiles, setEyeFiles] = useState({});

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // refs สำหรับเปิดไฟล์ตอนคลิกกล่อง
  const fingerInputRefs = useRef({});
  const eyeInputRefs = useRef({});

  const handleFingerChange = (e, finger) => {
    const file = e.target.files[0];
    if (file) setFingerFiles((prev) => ({ ...prev, [finger]: file }));
  };

  const handleEyeChange = (e, eye) => {
    const file = e.target.files[0];
    if (file) setEyeFiles((prev) => ({ ...prev, [eye]: file }));
  };

  // ฟังก์ชันเปิดกล่องเลือกไฟล์
  const openFingerFileDialog = (finger) => {
    if (fingerInputRefs.current[finger]) {
      fingerInputRefs.current[finger].click();
    }
  };
  const openEyeFileDialog = (eye) => {
    if (eyeInputRefs.current[eye]) {
      eyeInputRefs.current[eye].click();
    }
  };

  // drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropFinger = (e, finger) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFingerFiles((prev) => ({ ...prev, [finger]: e.dataTransfer.files[0] }));
    }
  };

  const handleDropEye = (e, eye) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setEyeFiles((prev) => ({ ...prev, [eye]: e.dataTransfer.files[0] }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to upload images.");
      return;
    }

    if (
      Object.values(fingerFiles).filter(Boolean).length === 0 &&
      Object.values(eyeFiles).filter(Boolean).length === 0
    ) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();

    console.log("fingerFiles", fingerFiles);

    Object.entries(fingerFiles).forEach(([finger, file]) => {
      if (file) formData.append(`finger_${finger}`, file);
    });

    Object.entries(eyeFiles).forEach(([eye, file]) => {
      if (file) formData.append(`eye_${eye}`, file);
    });

    formData.append("userEmail", user.email || "");

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await axios.post(`${getApiURL()}/ml/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Images uploaded!");
      setFingerFiles({});
      setEyeFiles({});
      setUploadProgress(0);

      navigate("/results");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Fingerprint & Eye Images</h2>

      <form onSubmit={handleUpload} className="space-y-8">
        {/* Fingerprint Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Fingerprint Images</h3>
          <div className="grid grid-cols-5 gap-4">
            {fingerLabels.map((finger) => (
              <div
                key={finger}
                className="border p-3 rounded shadow flex flex-col items-center cursor-pointer"
                onClick={() => openFingerFileDialog(finger)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropFinger(e, finger)}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fingerInputRefs.current[finger] = el)}
                  onChange={(e) => handleFingerChange(e, finger)}
                  disabled={isUploading}
                />
                <div className="w-24 h-24 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400 text-sm select-none">
                  {fingerFiles[finger] ? (
                    <img
                      src={URL.createObjectURL(fingerFiles[finger])}
                      alt={finger}
                      className="w-full h-full object-cover rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    "Drop image or click here"
                  )}
                </div>
                <span className="mt-2 font-medium">{finger}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Eye Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Eye Images</h3>
          <div className="flex gap-6">
            {eyeLabels.map((eye) => (
              <div
                key={eye}
                className="border p-3 rounded shadow flex flex-col items-center cursor-pointer"
                onClick={() => openEyeFileDialog(eye)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropEye(e, eye)}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (eyeInputRefs.current[eye] = el)}
                  onChange={(e) => handleEyeChange(e, eye)}
                  disabled={isUploading}
                />
                <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400 text-sm select-none">
                  {eyeFiles[eye] ? (
                    <img
                      src={URL.createObjectURL(eyeFiles[eye])}
                      alt={eye}
                      className="w-full h-full object-cover rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    "Drop image or click here"
                  )}
                </div>
                <span className="mt-2 font-medium">{eye}</span>
              </div>
            ))}
          </div>
        </section>

        {isUploading && (
          <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mt-4">
            <div
              className="bg-blue-600 h-4"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload All"}
        </button>
      </form>
    </div>
  );
};

export default UploadImage;
