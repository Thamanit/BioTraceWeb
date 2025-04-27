import React from 'react';
import {useNavigate} from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg shadow-md mb-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center">
                <img 
                    src={company.image || 'https://storage.googleapis.com/msgsndr/CaUsaDHBNHw2z2ThM8DV/media/64465bbdd1fb9b690670b270.jpeg'} 
                    alt={company.name} 
                    className="w-full h-[200px] object-cover"
                />
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
                    <p className="text-gray-600 text-sm">{company.address}</p>
                    <p className="text-gray-500 text-sm">{company.phone}</p>
                    <p className="text-gray-500 text-sm">{company.email}</p>
                </div>
                {company.isVerified ? (
                    <button onClick={()=>navigate('/company/'+company._id)} className='text-black w-full bg-green-400 p-2 mt-2 hover:bg-green-500'>
                        View        
                    </button>
                ) : (
                    <span className="text-red-500 font-bold">Closed</span>
                )}
            </div>
        </div>
    );
};

export default CompanyCard;