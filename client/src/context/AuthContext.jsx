import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('staypredict_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('staypredict_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('staypredict_user', JSON.stringify(currentUser));
        } else {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('staypredict_token', jwtToken);
    localStorage.setItem('staypredict_user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (data) => {
    const res = await signupUser(data);
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('staypredict_token', jwtToken);
    localStorage.setItem('staypredict_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('staypredict_token');
    localStorage.removeItem('staypredict_user');
  };

  const quickDemoLogin = async (role) => {
    let email = 'patient@staypredict.health';
    if (role === 'admin') email = 'admin@staypredict.health';
    if (role === 'staff') email = 'staff@staypredict.health';
    return await login(email, 'password123');
  };

  const value = {
    user,
    token,
    role: user?.role || 'guest',
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    isPatient: user?.role === 'patient',
    loading,
    login,
    signup,
    logout,
    quickDemoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
