import React, { useContext } from 'react';
import Logo from '@/images/Icon.png';
import MenuComponent from './MenuComponent';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Navigation = () => {
    const navigate = useNavigate();
    const { user, logout, hasCompanyOwner } = useContext(AuthContext);

    return (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 flex h-[50px] justify-between bg-white shadow-md rounded-md overflow-hidden w-[90%] max-w-[1024px]'>
            <div className='flex m-1'>
                <img src={Logo} className='h-full mx-5' alt='Logo' />
                <h1 className='text-md font-bold m-auto'>
                    BioTrace
                </h1>
            </div>
            <div className='flex-grow mx-2 flex gap-2 justify-center'>
                <MenuComponent name={'home'} path='/' />
                {/* {user&&<MenuComponent name={'booking'} path='/bookings' />}
                {user&&<MenuComponent name={'workspace'} path='/workspaces' />}
                <MenuComponent name={'companies'} path='/companies' />
                {hasCompanyOwner && <MenuComponent name={'my company'} path='/mycompany' />} */}
                {user?.isAdmin && <MenuComponent name={'Dashboard'} path='/admin' />}
            </div>
            <div className='flex justify-center gap-5 py-1 m-2'>
                {user?.username}
                {
                    user && (
                        <button onClick={() => logout()} className='bg-red-800 rounded-lg text-[15px] px-3 font-bold shadow-md border-b-2 border-blue-500 text-white active:bg-blue-500 active:border-blue-600 active:text-slate-100'>
                            Logout
                        </button>
                    )
                }
                {
                    !user && (
                        <>
                            <button onClick={() => navigate('/login')} className='bg-blue-400 rounded-lg text-[15px] px-3 font-bold shadow-md border-b-2 border-blue-500 text-white active:bg-blue-500 active:border-blue-600 active:text-slate-100'>
                                Login
                            </button>
                            <button onClick={() => navigate('/register')} className='bg-fuchsia-950 rounded-lg text-[15px] px-3 font-bold shadow-md border-b-2 border-blue-500 text-white active:bg-blue-500 active:border-blue-600 active:text-slate-100'>
                                Register
                            </button>
                        </>
                    )
                }

                


            </div>
        </div>
    );
}