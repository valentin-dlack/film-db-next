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
    const token = localStorage.getItem('token');

    if (token) {
      fetch('/api/auth/profile', {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setLoading(false); // Set loading to false after user is loaded
        })
        .catch((error) => {
          console.error(error);
          setLoading(false); // Set loading to false after error
        });
    }
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
