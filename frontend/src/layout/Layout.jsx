import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navigation } from '../components/navigation/Navigation';
import Logo from '@/images/Icon.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./AdminLayout";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatbotComponent from "../components/chatbot/ChatbotComponent";

const Layout = () => {
    const location = useLocation();
    const {user} = useContext(AuthContext);
    if (location.pathname === '/login' || location.pathname === '/register') {
        return (
            <div className="bg-white w-screen h-screen flex flex-col overflow-auto">
                <Outlet />
            </div>
        );
    }

    if (location.pathname.startsWith('/admin') && user?.isAdmin) {
        return (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        )
    }

    return (
        <div className="bg-white w-screen h-screen flex flex-col overflow-auto relative">
            {user && <ChatbotComponent/>}
            {/* Fixed Orange background */}
            <div className="from-burning-orange to-orange-700 bg-gradient-to-br fixed top-0 w-screen h-[400px] opacity-90 z-0"></div>


            {/* Fixed Navigation bar */}
            <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1024px] z-[999]">
                <Navigation />
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow mt-[66px] w-full flex justify-center z-10">
                <div className="flex-grow w-full max-w-[1024px] flex flex-col mt-4">
                    <Outlet />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Layout;
