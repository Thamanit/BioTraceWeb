import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Mail, Globe, MapPin, Phone, Lock, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { getApiURL } from "../../lib/route";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    country: "",
    city: "",
    phone: "",
    password: "",
  });

  const { loading, login, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateInputs = () => {
    const { username, email, country, city, phone, password } = userInfo;
    if (!username || !email || !country || !city || !phone || !password) {
      toast.error("All fields are required.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      toast.error("Phone number should contain only digits.");
      return false;
    }
    return true;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate input fields
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await axios.post(getApiURL()+"/auth/register", userInfo);
      login(res.data.details);
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError({ message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen from-burning-orange to-orange-800 bg-gradient-to-br">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Create an Account</h2>
        
        {[
          { id: "username", type: "text", placeholder: "Username", icon: <User /> },
          { id: "email", type: "email", placeholder: "Email", icon: <Mail /> },
          { id: "country", type: "text", placeholder: "Country", icon: <Globe /> },
          { id: "city", type: "text", placeholder: "City", icon: <MapPin /> },
          { id: "phone", type: "text", placeholder: "Phone", icon: <Phone /> },
          { id: "password", type: "password", placeholder: "Password", icon: <Lock /> },
        ].map(({ id, type, placeholder, icon }) => (
          <div className="relative" key={id}>
            {icon && <span className="absolute top-3 left-3 text-gray-400">{icon}</span>}
            <input
              id={id}
              type={type}
              placeholder={placeholder}

              
              value={userInfo[id]}
              onChange={handleChange}
              className="w-full px-10 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}

        <button
          disabled={loading}
          onClick={handleClick}
          className="w-full px-4 py-2 mt-6 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : "Register"}
        </button>
      </div>
    </div>
  );
};

export default Register;
