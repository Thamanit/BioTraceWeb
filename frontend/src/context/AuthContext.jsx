import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getApiURL } from '../lib/route';

export const AuthContext = createContext({
  user: undefined,
  loading: false,
  error: null,
  login: () => { },
  logout: () => { },
  setError: () => { },
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCompanyOwner, setHasCompanyOwner] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchHasCompany = async () => {
      const response = await axios.get(`${getApiURL()}/companyowner`, { withCredentials: true });
      if (response.status === 200) {
        setHasCompanyOwner(true);
      }
    }
    const validateToken = async () => {
      try {
        const response = await axios.get(`${getApiURL()}/auth/validate`, { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
          fetchHasCompany();
        }
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  // Function to handle login
  const login = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      setUser(userData);
      setLoading(false);
    } catch (err) {
      setError("Login failed");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${getApiURL()}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setError(null);
      setHasCompanyOwner(false);
      setLoading(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        setError,
        hasCompanyOwner,
      }}
    >
      {
        loading ? <div>Loading...</div> : children
      }
    </AuthContext.Provider>
  );
};