import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getApiURL } from '../lib/route';

const UploadImage = () => {
    axios.defaults.withCredentials = true;

    const { user } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userEmail', user?.email || '');

        try {
            setIsUploading(true);
            await axios.post(`${getApiURL()}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Image uploaded!');
            setImageFile(null);
        } catch {
            toast.error('Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) {
        return <p className="text-red-600">Please log in to upload an image.</p>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Upload Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded ml-2" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default UploadImage;
