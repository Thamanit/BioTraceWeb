import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getApiURL } from '../../lib/route';

const CompanyWithEnrollments = () => {
    const { id: companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanyAndEnrollments = async () => {
        try {
            // Fetch company details
            const response = await axios.get(`${getApiURL()}/companyowner/company/${companyId}`,{withCredentials:true})
            setCompany(response.data);

            // Fetch enrollments associated with the company
            const enrollments = await axios.get(`${getApiURL()}/companyowner/company/${companyId}/enrollments`,{withCredentials:true});
            setEnrollments(enrollments.data)
        } catch (error) {
            console.error("Error fetching company or enrollment data:", error);
            toast.error("Failed to fetch company or enrollment data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!companyId) return;
        fetchCompanyAndEnrollments();
    }, [companyId]);

    const navigate = useNavigate();

    if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;
    if (!company) return <div className="text-center py-20 text-gray-600">Company not found</div>;

    //todo make a handleupdate enrollment verification
    const handleUpdateEnrollmentVerify = async (enrollmentId) => {
        const response = await axios.put(`${getApiURL()}/companyowner/company/${companyId}/enrollments/${enrollmentId}`, { status: "Accepted" },{withCredentials:true});
        toast.success("Successfully verified Enrollment");
        if (response.status === 200) {
            fetchCompanyAndEnrollments();
        }
    }

    //todo make a handleupdate enrollment denied
    const handleUpdateEnrollmentDenied = async (enrollmentId) => {
        const response = await axios.put(`${getApiURL()}/companyowner/company/${companyId}/enrollments/${enrollmentId}`, { status: "Denied" },{withCredentials:true});
        toast.info("Successfully Denied Enrollment");
        if (response.status === 200) {
            fetchCompanyAndEnrollments();
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">{company.name}</h1>
            <div className="flex justify-center mt-10 gap-4">
                <button
                    onClick={() => navigate('update')}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
                >
                    Edit Company
                </button>
                <button
                    onClick={() => navigate('positions')}
                    className="px-8 py-3 bg-gradient-to-r from-green-400 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
                >
                    Manage Position
                </button>
            </div>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mb-10">
                <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-64 object-cover rounded-md mb-6"
                />
                <p className="text-lg mb-4">
                    <span className="font-medium text-gray-700">Address:</span> {company.address}
                </p>
                <p className="text-lg mb-4">
                    <span className="font-medium text-gray-700">Phone:</span> {company.phone}
                </p>
                <p className="text-lg mb-4">
                    <span className="font-medium text-gray-700">Email:</span> {company.email}
                </p>
                <p className={`text-lg font-medium ${company.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {company.isActive ? 'Active' : 'Inactive'}
                </p>
            </div>

            {
                //Todo show all positions
            }

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mb-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Positions</h2>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Enrollments</h2>
                {enrollments.length > 0 ? (
                    <ul className="space-y-4">
                        {enrollments.map((enrollment) => (
                            <li key={enrollment._id} className="bg-gray-50 p-4 rounded-lg shadow">
                                <div className="text-lg font-medium text-gray-700 flex justify-between">
                                    {enrollment?.userID?.username}
                                    <span className="text-gray-600 ">Position: {company?.positions?.find(p=>p._id === enrollment.positionId)?.name}</span>
                                </div>
                                <p className="text-gray-600"> {"(" + enrollment?.userID?.email + ")"}</p>
                                <p className="text-gray-600">Status: {enrollment.status}</p>
                                {
                                    //Todo check status and put a verify and declined button
                                    enrollment.status === "Pending" && (
                                        <>
                                            <button onClick={() => handleUpdateEnrollmentVerify(enrollment._id)} className='bg-green-400 p-2 text-white rounded-md hover:bg-green-500'>Verify</button>
                                            <button onClick={() => handleUpdateEnrollmentDenied(enrollment._id)} className='bg-red-400 p-2 text-white rounded-md hover:bg-red-500'>Declined</button>
                                        </>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No enrollments found for this company.</p>
                )}
            </div>
        </div>
    );
};

export default CompanyWithEnrollments;
