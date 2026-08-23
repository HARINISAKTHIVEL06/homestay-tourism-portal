import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('homestay_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem('homestay_token');
            if (token) {
                try {
                    const res = await API.get('/auth/me');
                    if (res.data.success) {
                        setUser(res.data.data);
                        localStorage.setItem('homestay_user', JSON.stringify(res.data.data));
                    }
                } catch (err) {
                    console.error('Auth verification error:', err);
                    logout();
                }
            }
            setLoading(false);
        };
        fetchMe();
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        if (res.data.success) {
            const { token, refreshToken, ...userData } = res.data.data;
            localStorage.setItem('homestay_token', token);
            localStorage.setItem('homestay_refresh_token', refreshToken);
            localStorage.setItem('homestay_user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
    };

    const register = async (formData) => {
        const res = await API.post('/auth/register', formData);
        if (res.data.success) {
            const { token, refreshToken, ...userData } = res.data.data;
            localStorage.setItem('homestay_token', token);
            localStorage.setItem('homestay_refresh_token', refreshToken);
            localStorage.setItem('homestay_user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (e) {
            // Ignore logout request errors
        } finally {
            localStorage.removeItem('homestay_token');
            localStorage.removeItem('homestay_refresh_token');
            localStorage.removeItem('homestay_user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
