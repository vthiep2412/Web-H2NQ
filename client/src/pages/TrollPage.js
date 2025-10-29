// Happy coding :D!
// Happy coding :D

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TrollPage.css';

const TrollPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/ai');
        }
    }, [user, navigate]);
    return (
        <div className="troll-container">
            <div className="troll-box">
                <h1>Oops!</h1>
                <p>Looks like you don't have the secret key.</p>
                <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTc2ZWhkenFlZnU2eDcxNWF6Njc5bWQwNXFjcTRyZ3ZqZ2drdmh6NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ju7l5y9osyymQ/giphy.gif" alt="Troll GIF" className="troll-gif" />
                <p>You know the rules, and so do I.</p>
                <Link to="/auth" className="troll-link">Go back to safety</Link>
            </div>
        </div>
    );
};

export default TrollPage;
