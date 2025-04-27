import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HomeHeader = () => {
    const navigate = useNavigate();
    function handleGoCompany() {
        navigate('/companies');
    }
    return (
        <div className=''>
            <h1 className="text-3xl font-bold mb-4 flex gap-2">A <p className='text-yellow-300 text-shadow'>Fabulous Place</p> for Digital Nomad</h1>
            <p className="mb-4 text-lg">
                Get a great opportunity for digital nomads to find a places for work
            </p>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2 shadow-lg"
                onClick={handleGoCompany}
            >
                Find a Company
            </button>
            OR
            <Link to="/companies/register">
                <button
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow-lg"
                // Todo Add onClick Event
                >
                    Register a Company
                </button>
            </Link>
        </div>
    )
}

export default HomeHeader