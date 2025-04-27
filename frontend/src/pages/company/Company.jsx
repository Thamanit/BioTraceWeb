import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { getApiURL } from '../../lib/route';

const Company = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!id || !loading) return;

        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${getApiURL()}/companys/${id}`);
                setCompany(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching company data:", error);
                toast.error("Failed to fetch company data.");
            }
        };

        fetchCompany();
    }, [id, loading]);

    useEffect(() => {
        if (user && loading) {
            const fetchCompanyEnrollment = async () => {
                const response = await axios.get(`${getApiURL()}/companys/${id}/enrollments`, { withCredentials: true });
                setEnrollment(response.data);
            };
            fetchCompanyEnrollment();
        }
    }, [user, loading]);

    const handleEnroll = async (positionId) => {
        const response = await axios.post(`${getApiURL()}/companys/${id}/enroll`, { positionId: position._id }, { withCredentials: true });
        setShowModal(false);
        setLoading(true);
    };

    const [position, setPosition] = useState(null)

    if (!company) {
        return <div className="text-white p-8">Loading company information...</div>;
    }

    return (
        <div className="flex flex-col flex-grow text-white p-8 w-full">
            <div className="max-h-[200px]">
                <h1 className="text-3xl font-bold text-center mb-4">Company Details</h1>
            </div>
            <div className="flex flex-col md:flex-row bg-white mt-10 text-gray-800 rounded-xl shadow-lg p-8">
                <div className="w-full md:w-1/3 flex items-center justify-center mb-6 md:mb-0">
                    <img
                        src={company.image}
                        alt={company.name}
                        className="w-48 h-48 object-cover rounded-xl shadow-md border-2 border-gray-200"
                    />
                </div>
                <div className="w-full md:w-2/3 p-6">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">{company.name}</h2>
                    <p className="mb-3 text-lg"><span className="font-medium text-gray-700">Address:</span> {company.address}</p>
                    <p className="mb-3 text-lg"><span className="font-medium text-gray-700">Phone:</span> {company.phone}</p>
                    <p className="mb-3 text-lg"><span className="font-medium text-gray-700">Email:</span> {company.email}</p>
                    <p className="mb-3 text-lg"><span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${company.isVerified ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {company.isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                    </p>
                </div>
            </div>

            {
                user?._id === company?.ownerID &&
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => navigate('/mycompany/company/' + company._id)}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
                    >
                        Manage Company
                    </button>
                </div>
            }

            {
                company?.positions?.length > 0 && (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mb-10">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Positions</h2>
                        <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
                            {company.positions.map((position) => (
                                <div key={position._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-800">{position.name}</h3>
                                    <p className="text-gray-600">{position.isOpen ? 'open' : 'close'}</p>
                                    {
                                        position.isOpen && !(enrollment && enrollment.some(e=>e.positionId===position._id)) && (
                                            <button
                                                onClick={() => {
                                                    setPosition(position)
                                                    setShowModal(true)}}
                                                className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
                                            >
                                                Enroll
                                            </button>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* {
            //Todo change this to enrool specific position
            enrollment && enrollment.length <= 0 && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
                    >
                        Enroll
                    </button>
                </div>
            )} */}

            {enrollment && enrollment.length > 0 && (
                <div className="flex justify-center mt-10">
                    <button className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md cursor-not-allowed">
                        You Are Already Enrolled
                    </button>
                </div>
            )}

            {/* Enrollment Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                        <h3 className="text-xl font-bold mb-4 text-black">Confirm Enrollment {position?.name}</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to enroll in this company?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleEnroll}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Company;