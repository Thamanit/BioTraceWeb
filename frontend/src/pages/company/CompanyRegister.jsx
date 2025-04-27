import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { getApiURL } from '../../lib/route';

const CompanyRegister = () => {
    axios.defaults.withCredentials = true;
    
    const {user} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ownerEmail: user.email,
        phone: '',
        address: '',
        image: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const validateEmail = (email) =>{
        return !/\S+@\S+\.\S+/.test(email)
    }

    const validateForm = () => {
        // Todo - Validate form fields must have
        // 1. Company name (required)
        // 2. Email (valid email)
        // 3. Phone number (at least 10 characters)
        // 4. Address (required)
        const newErrors = {}
        if (!formData.name) newErrors.name = 'Company name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        if (!formData.phone || formData.phone.length != 10) newErrors.phone = 'Phone is required and length must be 10'
        if (!formData.address) newErrors.address = 'Address is required'
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formErrors = validateForm()
        if (Object.keys(formErrors).length === 0) {
            try {
                // Todo - Send formData to backend in body of POST request
                await axios.post(`${getApiURL()}/companys`,formData,{withCredentials:true})
                toast.success('Company registered successfully!')
                setFormData({ name: '', email: '', phone: '', address: '', image: '' })
                setErrors({})
            } catch (error) {
                console.error('Failed to register company:', error)
                toast.error('Failed to register company. Please try again later.')
            }
        } else {
            setErrors(formErrors)
        }
    }

    return (
        <div className="flex flex-col flex-grow text-white p-8 w-full">
            <div className='max-h-[200px] text-2xl font-bold'>
                Company Register
            </div>
            <div className='flex-grow bg-slate-50 mt-10 rounded-md shadow-inner p-6 text-black'>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Owner Email</label>
                        <input
                            disabled
                            type="email"
                            name="ownerEmail"
                            value={formData.ownerEmail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.email && <p className="text-red-500">{errors.ownerEmail}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Company Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Image (Optional)</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.image && <p className="text-red-500">{errors.image}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded ml-auto">
                        Request Company Registration
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompanyRegister