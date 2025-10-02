import React, { useState } from 'react';
import { SunFill, MoonFill } from 'react-bootstrap-icons';
import './AuthPage.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [avatarUrl, setAvatarUrl] = useState(''); // Re-add state for avatar URL
    const [theme, setTheme] = useState(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    );
    const { login } = useAuth(); // Use login from AuthContext

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSignUpClick = () => {
        setIsSignUp(true);
    };

    const handleSignInClick = () => {
        setIsSignUp(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, avatarUrl }), // Include avatarUrl
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token); // Use login from AuthContext
            } else {
                console.error('Registration failed:', data);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token); // Use login from AuthContext
            } else {
                console.error('Login failed:', data);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className={`auth-body ${theme}`}>
             <button onClick={toggleTheme} className="theme-toggle-btn-auth">
                {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
            </button>
            <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegister}>
                        <img src="/H2NQ-LOGO.png" alt="H2NQ Logo" className="auth-logo" />
                        <h1>Create Account</h1>
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <img src="/H2NQ-LOGO.png" alt="H2NQ Logo" className="auth-logo" />
                        <h1>Sign In</h1>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <a href="/forgot-password" className="forgot-password-link">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
