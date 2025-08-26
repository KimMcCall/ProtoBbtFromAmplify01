import React, { createContext, useContext, useState } from "react";

const kArg = { isAuthenticated: false, login: () => {}, logout: () => {} };
const AuthContext = createContext(kArg);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Or based on a token

  const login = () => {
    // Logic to set authentication, e.g., store token in localStorage
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Logic to clear authentication, e.g., remove token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
