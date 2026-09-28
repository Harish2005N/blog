import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/index.js";
import authApi from "../api/auth.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const verifyAndFetch = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
      return setLoading(false);
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    verifyAndFetch();
  }, [verifyAndFetch]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
