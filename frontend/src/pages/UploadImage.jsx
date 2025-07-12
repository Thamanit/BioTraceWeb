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
    "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Little",
    "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Little",
  ];
  const eyeLabels = ["Left Eye", "Right Eye"];

  const [fingerFiles, setFingerFiles] = useState({});
  const [eyeFiles, setEyeFiles] = useState({});
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropFinger = (e, finger) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      setFingerFiles((prev) => ({ ...prev, [finger]: e.dataTransfer.files[0] }));
    }
  };

  const handleDropEye = (e, eye) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      setEyeFiles((prev) => ({ ...prev, [eye]: e.dataTransfer.files[0] }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to upload images.");
      return;
    }

    if (!gender || !age) {
      toast.error("Please fill in gender and age.");
      return;
    }

    if (
      Object.values(fingerFiles).filter(Boolean).length < 10 ||
      Object.values(eyeFiles).filter(Boolean).length < 2
    ) {
      toast.error("Please upload all required images.");
      return;
    }

    const formData = new FormData();

    Object.entries(fingerFiles).forEach(([finger, file]) => {
      if (file) formData.append(`finger_${finger}`, file);
    });

    Object.entries(eyeFiles).forEach(([eye, file]) => {
      if (file) formData.append(`eye_${eye}`, file);
    });

    formData.append("userEmail", user.email || "");
    formData.append("gender", gender);
    formData.append("age", age);

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
      setGender("");
      setAge("");
      navigate("/results");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Fingerprint & Eye Images</h2>

      {/* Gender & Age */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            min="0"
            max="120"
            required
          />
        </div>
      </div>

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
                    "Drop or Click"
                  )}
                </div>
                <span className="mt-2 font-medium text-center text-sm">{finger}</span>
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
                    "Drop or Click"
                  )}
                </div>
                <span className="mt-2 font-medium text-sm">{eye}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Progress */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mt-4">
            <div
              className="bg-blue-600 h-4"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload All"}
        </button>
      </form>
    </div>
  );
};

export default UploadImage;
