import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getApiURL } from '../../lib/route';

const MyCompany = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            // todo - fetch companies associated with the logged in user /api/companyowner/companies
            const response = await axios.get(`${getApiURL()}/companyowner/companies`,{withCredentials:true});
            setCompanies(response.data);
            setLoading(false);
        };

        fetchCompanies();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">My Companies</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.map((company) => (
                    <div key={company._id} className="bg-white rounded-lg shadow-md p-6 transform transition">
                        <img
                            src={company.image}
                            alt={company.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{company.name}</h2>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Address:</span> {company.address}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Phone:</span> {company.phone}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Email:</span> {company.email}
                        </p>
                        <p className={`text-sm font-medium mt-4 ${company.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                            {company.isVerified ? 'Verified' : 'Not Verified'}
                        </p>
                        <button onClick={() => navigate('/mycompany/company/' + company._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600">View Company</button>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default MyCompany;