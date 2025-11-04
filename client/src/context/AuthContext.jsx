import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function fetchMe() {
      try {
        if (!token) return;
        const { data } = await api.get("/api/auth/me");
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  function login(token, user) {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
