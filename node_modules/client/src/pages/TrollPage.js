
import React from 'react';
import { Link } from 'react-router-dom';
import './TrollPage.css';

const TrollPage = () => {
    return (
        <div className="troll-container">
            <div className="troll-box">
                <h1>Oops!</h1>
                <p>Looks like you don't have the secret key.</p>
                <img src="https://media.tenor.com/v_p_l8pL5-UAAAAC/rick-astley-rick-roll.gif" alt="Troll Meme" />
                <p>You know the rules, and so do I.</p>
                <Link to="/auth" className="troll-link">Go back to safety</Link>
            </div>
        </div>
    );
};

export default TrollPage;
