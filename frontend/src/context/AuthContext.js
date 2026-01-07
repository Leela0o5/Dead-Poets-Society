import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on refresh
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/me'); 
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  // Login
  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user || data); // Adjust based on your backend response
    return data;
  };

  // Register
  const register = async (credentials) => {
    const { data } = await api.post('/auth/register', credentials);
    setUser(data.user || data);
    return data;
  };

  // Logout
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);