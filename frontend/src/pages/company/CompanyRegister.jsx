import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { getApiURL } from '../../lib/route';

const UploadImage = () => {
    axios.defaults.withCredentials = true;

    const { user } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error('Please select an image file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userEmail', user.email);

        try {
            setIsUploading(true);
            const response = await axios.post(`${getApiURL()}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Image uploaded successfully!');
            setImageFile(null);
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Image upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="flex flex-col text-white p-8 w-full">
            <h1 className='text-2xl font-bold mb-4'>Upload Image</h1>
            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-black"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>
        </div>
    )
}

export default UploadImage