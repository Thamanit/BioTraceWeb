import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getApiURL } from '../../lib/route';

const MySpecificCompanyUpdate = () => {
    const { id: companyId } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) return;

        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${getApiURL()}/companyowner/company/${companyId}`,{withCredentials:true});
                setCompany(response.data);
                setFormData({
                    name: response.data.name,
                    address: response.data.address,
                    phone: response.data.phone,
                    email: response.data.email,
                    image: response.data.image
                });
                // toast.success("Company data loaded successfully!");
            } catch (error) {
                console.error("Error loading company data:", error);
                toast.error("Lower level: Failed to load company data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${getApiURL()}/companyowner/company/${companyId}`, formData,{withCredentials:true});
            setCompany(response.data);
            toast.success("Company updated successfully!");
            navigate('/mycompany');
        } catch (error) {
            console.error("Error updating company:", error);
            toast.error("Failed to update company.");
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">Update Company</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                    Update Company
                </button>
            </form>
        </div>
    );
};

export default MySpecificCompanyUpdate;