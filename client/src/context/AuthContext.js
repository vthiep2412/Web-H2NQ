// Happy coding :D!
// Happy coding :D
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false); // New state
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
                        setIsLoggingOut(false); // Ensure this is false if token becomes invalid
                        // console.log("Token invalid, logging out.    1");
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    setToken(null);
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsLoggingOut(false); // Ensure this is false on error
                    // console.log("Error occurred, logging out.    2");
                }
            } else {
                setUser(null);
                // setIsLoggingOut(false); // this is wrong
                // console.log("Token invalid, logging out.    3");
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
        setIsLoggingOut(true); // Set flag to true
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        setTimeout(() => setIsLoggingOut(false), 0); // Reset flag after logout process
    };

    const updateUser = useCallback((newUserData) => {
        setUser(prevUser => ({ ...prevUser, ...newUserData }));
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateUser, isLoggingOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};