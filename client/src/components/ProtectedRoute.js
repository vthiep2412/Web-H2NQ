// Happy coding :D

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // If no token, redirect to the /troll page
        return <Navigate to="/troll" />;
    }

    return children;
};

export default ProtectedRoute;
