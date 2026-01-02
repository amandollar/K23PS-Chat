import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
             const token = localStorage.getItem('token');
             if(token) {
                 try {
                     // Optionally verify token with backend here
                     // For now just decode or assume valid if exists and we have user data stored
                     const userData = JSON.parse(localStorage.getItem('user'));
                     if(userData) setUser(userData);
                 } catch(err) {
                     console.error(err);
                     localStorage.removeItem('token');
                     localStorage.removeItem('user');
                 }
             }
             setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (username, password) => {
        const apiUrl = import.meta.env.VITE_API_URL?.trim();
        const res = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const register = async (username, password) => {
        const apiUrl = import.meta.env.VITE_API_URL?.trim();
        const res = await axios.post(`${apiUrl}/api/auth/register`, { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
