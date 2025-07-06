import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Logo from '@/images/Icon.png';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', path: '/admin' },
        // { name: 'Company Verification', path: '/admin/company-verification' },
    ];

    return (
        <div className="flex min-h-screen text-gray-700">
            {/* Sidebar */}
            <aside className="w-64 bg-[#20916a] text-white flex flex-col p-6">
                <div className="flex items-center mb-6">
                    <img src={Logo} alt="Admin Logo" className="h-12 w-12 mr-3" />
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`block py-2 px-4 rounded-lg hover:bg-[#20916a] transition-colors ${location.pathname === item.path ? 'bg-[#20916a]' : ''
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 bg-gray-100">
                {/* Top Navbar */}
                <div className="flex items-center justify-between mb-6 bg-white py-4 px-6 shadow-md rounded-md">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white py-1 px-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition"
                        >
                            Go Back to Home
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="font-medium">{user.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 text-white py-1 px-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 text-white py-1 px-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <Outlet />
                </section>
            </main>

            <ToastContainer />
        </div>
    );
}

export default AdminLayout;