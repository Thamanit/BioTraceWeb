import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Lock, Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { getApiURL } from "../../lib/route";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, login, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateInputs = () => {
    const { username, password } = credentials;
    if (!username || !password) {
      toast.error("Please fill in both username and password fields.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await axios.post(`${getApiURL()}/auth/login`, credentials, {withCredentials: true});
      await login(res.data?.user);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError({ message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen from-burning-orange to-orange-800 bg-gradient-to-br">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign In</h2>
        <div className="relative">
          <User className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
            className="w-full px-10 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="username"
          />
        </div>
        <div className="relative mt-4">
          <Lock className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="w-full px-10 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="current-password"
          />
        </div>
        <button
          disabled={loading}
          onClick={handleClick}
          className="w-full px-4 py-2 mt-6 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? <Loader className="w-5 h-5 mx-auto animate-spin" /> : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;