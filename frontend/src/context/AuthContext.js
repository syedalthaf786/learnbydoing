import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/Admindash');
          break;
        case 'mentor':
          navigate('/mentor/Mentordash');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/Admindash');
          break;
        case 'mentor':
          navigate('/mentor/Mentordash');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.put('/api/auth/profile', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser(response.data);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Profile update failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMentor: user?.role === 'mentor',
    isUser: user?.role === 'user',
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;