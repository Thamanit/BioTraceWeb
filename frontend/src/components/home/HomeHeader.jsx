import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HomeHeader = () => {
    const navigate = useNavigate();
    function handleGoCompany() {
        navigate('/companies');
    }
    return (
        <div className=''>
            <h1 className="text-3xl font-bold mb-4 flex gap-2">"Detecting <p className='text-yellow-300 text-shadow'>diabetes</p> right at your fingertips and vision."</h1>
            <p className="mb-4 text-lg">
                Painless. Diabetes Detection with BioTrace
            </p>
            <Link to="/companies/register">
                <button
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow-lg"
                // Todo Add onClick Event
                >
                    Upload Image
                </button>
            </Link>
            <Link to="/results">
                <button
                    className="ml-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-lg"
                >
                    View Past Records
                </button>
            </Link>

        </div>
    )
}

export default HomeHeader