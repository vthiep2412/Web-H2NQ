
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token, redirect to the /troll page
        return <Navigate to="/troll" />;
    }

    return children;
};

export default ProtectedRoute;
