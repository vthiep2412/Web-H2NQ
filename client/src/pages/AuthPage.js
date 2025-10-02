import React, { useState } from 'react';
import { SunFill, MoonFill } from 'react-bootstrap-icons';
import styles from './AuthPage.module.css'; // Import CSS module
import { useAuth } from '../context/AuthContext'; // Import useAuth

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [avatarUrl] = useState(''); // Re-add state for avatar URL
    const [theme, setTheme] = useState(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    );
    const [error, setError] = useState(null); // New state for error messages
    const { login } = useAuth(); // Use login from AuthContext

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSignUpClick = () => {
        setIsSignUp(true);
        setError(null); // Clear errors on form switch
    };

    const handleSignInClick = () => {
        setIsSignUp(false);
        setError(null); // Clear errors on form switch
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        if (password !== confirmPassword) {
            setError([{ msg: 'Passwords do not match!' }]);
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
                setError(data.errors || [{ msg: data.msg || 'Registration failed' }]);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError([{ msg: 'Server error during registration' }]);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token); // Use login from AuthContext
            } else {
                setError(data.errors || [{ msg: data.msg || 'Login failed' }]);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError([{ msg: 'Server error during login' }]);
        }
    };

    return (
        <div className={`${styles.authBody} ${theme === 'dark' ? styles.dark : ''}`}>
             <button onClick={toggleTheme} className={styles.themeToggleBtnAuth}>
                {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
            </button>
            <div className={`${styles.authContainer} ${isSignUp ? styles.rightPanelActive : ""}`} id="container">
                {error && (
                    <div className={styles.errorMessage}>
                        {error.map((err, index) => (
                            <p key={index}>{err.msg}</p>
                        ))}
                    </div>
                )}
                <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                    <form onSubmit={handleRegister}>
                        <img src="/H2NQ-LOGO.png" alt="H2NQ Logo" className={styles.authLogo} />
                        <h1>Create Account</h1>
                        <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="submit">Sign Up</button>
                        <span className={styles.mobileToggleLink} onClick={handleSignInClick}>Already have an account? Sign In</span>
                    </form>
                </div>
                <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                    <form onSubmit={handleLogin}>
                        <img src="/H2NQ-LOGO.png" alt="H2NQ Logo" className={styles.authLogo} />
                        <h1>Sign In</h1>
                        <input type="text" placeholder="Username or Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <a href="/forgot-password" className={styles.forgotPasswordLink}>Forgot your password?</a>
                        <button type="submit">Sign In</button>
                        <span className={styles.mobileToggleLink} onClick={handleSignUpClick}>Don't have an account? Sign Up</span>
                    </form>
                </div>
                <div className={styles.overlayContainer}>
                    <div className={styles.overlay}>
                        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className={styles.ghost} onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className={styles.ghost} onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
