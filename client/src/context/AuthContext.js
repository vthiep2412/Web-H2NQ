// Happy coding :D!
// Happy coding :D
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    // Verify token validity and get user data from server
                    const res = await fetch('/api/auth/me', {
                        headers: {
                            'x-auth-token': token,
                        },
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        // Token invalid or expired, clear it
                        console.error("Failed to fetch user data, token might be invalid.");
                        setToken(null);
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    setToken(null);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // No need to decode here, useEffect will fetch fresh user data
        navigate('/ai');
    };

    const logout = () => {
        console.log("Logging out...");
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        window.location.href = '/auth'; // Force full page reload to /auth
    };

    const updateUser = useCallback((newUserData) => {
        setUser(prevUser => ({ ...prevUser, ...newUserData }));
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};