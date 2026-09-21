
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login } from "../services/staff/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedStaff = localStorage.getItem("user");

    if (token && savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }

    setIsLoading(false);
  }, []);

  const loginUser = useCallback(async ({ email, password, rememberMe }) => {
    const res = await login({ email, password });

    const token = res?.token || res?.data?.token;
    const user = res?.user || res?.data?.user;

    if (!token || !user) {
      throw new Error("Invalid response from server");
    }

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));

    setStaff(user);

    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setStaff(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        staff,
        isAuthenticated: !!staff,
        isLoading,
        login: loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}