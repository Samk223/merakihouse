import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore auth state from LocalStorage on mount
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user_info");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/login", { email, password });
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem("auth_token", userToken);
        localStorage.setItem("user_info", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/register", {
        name,
        email,
        password,
        password_confirmation: password, // auto-confirm in frontend
      });
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem("auth_token", userToken);
        localStorage.setItem("user_info", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear local credentials even if the logout api fails (e.g. token expired)
      setToken(null);
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await apiClient.get("/profile");
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem("user_info", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
