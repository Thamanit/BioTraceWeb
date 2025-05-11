import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getApiURL } from '../../lib/route';

const VerifyCompanies = () => {
    axios.defaults.withCredentials = true;
    const [companies, setCompanies] = useState([])
    const fetchUnverifiedCompanies = async () => {
        try {
            //Todo : Add the API endpoint to fetch unverified companies don't forget to do {withCredentials: true} in axios
            const response = await axios.get(`${getApiURL()}/companys/getUnverified`)
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching unverified companies:', error)
            toast.error('Failed to load unverified companies.')
        }
    }

    //Todo : Call the fetchUnverifiedCompanies when rendering
    useEffect(()=>{
        fetchUnverifiedCompanies();
    },[])
    //////////////////////////////

    // Verify a company
    const handleVerify = async (companyId) => {
        try {
            await axios.patch(`${getApiURL()}/companys/${companyId}/verify`, {}, {
                withCredentials: true
            })
            setCompanies(companies.filter(company => company._id !== companyId))
            await fetchUnverifiedCompanies()
            toast.success('Company verified successfully!')
        } catch (error) {
            console.error('Error verifying company:', error)
            toast.error('Failed to verify the company.')
        }
    }

    return (
        <div className="flex flex-col flex-grow text-white p-8 w-full">
            <div className="max-h-[200px] text-2xl font-bold">Verify Unverified Companies</div>
            <div className="flex-grow bg-slate-50 mt-10 rounded-md shadow-inner p-6 text-black">
                {companies.length === 0 ? (
                    <p>No patients yet.</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Phone</th>
                                <th className="border p-2">Address</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company._id}>
                                    <td className="border p-2">{company.name}</td>
                                    <td className="border p-2">{company.email}</td>
                                    <td className="border p-2">{company.phone}</td>
                                    <td className="border p-2">{company.address}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleVerify(company._id)}
                                            className="bg-green-500 text-white py-1 px-3 rounded"
                                        >
                                            Verify
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default VerifyCompanies
