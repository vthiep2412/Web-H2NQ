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
            console.log("User logged out: redirecting to /auth");
            return <Navigate to="/auth" />;
        } else {
            // If no token and not logging out, redirect to the /troll page (unauthorized access)
            console.log("Bro? really?"); // this is for troll the user if they try to access protected route without being logged in
            return <Navigate to="/troll" />;
        }
    }

    return children;
};

export default ProtectedRoute;
