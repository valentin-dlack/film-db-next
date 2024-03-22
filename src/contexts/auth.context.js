// AuthProvider.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
  };

  // Simulating user loading, you need to replace this with actual logic to load user
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after a certain time (simulating user loading)
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}> {/* Include loading in value */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
