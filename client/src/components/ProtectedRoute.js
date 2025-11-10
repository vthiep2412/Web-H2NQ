// Happy coding :D!
// Happy coding :D

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, isLoggingOut } = useAuth(); // Get isLoggingOut

    if (!token) {
        if (isLoggingOut) {
            // If no token and logging out, redirect to /auth
            console.log("Redirecting to /auth after logout.");
            // window.location.href = '/auth';
            return <Navigate to="/auth" />;
        } else {
            // If no token and not logging out, redirect to the /troll page (unauthorized access)
            console.log("Bro? really?");
            return <Navigate to="/troll" />;
        }
    }

    return children;
};

export default ProtectedRoute;
