import React, { useState } from 'react';
import axios from 'axios';

const CreateCompanyForm = () => {
    const [companyData, setCompanyData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        image: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name: companyData.name,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email,
            image: companyData.image,
        }

        try {
            const res = await axios.post('http://localhost:8800/api/companys', formData);
            setSuccess('Company created successfully!');
            setError('');
            setCompanyData({
                name: '',
                address: '',
                phone: '',
                email: '',
                image: null,
            });
        } catch (err) {
            setError('Error creating company. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Company</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-400 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-600 border border-green-400 rounded">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Company Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={companyData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={companyData.address}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={companyData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={companyData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Company Image URL (optional)
                    </label>
                    <input
                        type="text"
                        name="image"
                        id="image"
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Request Create Company
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCompanyForm;
