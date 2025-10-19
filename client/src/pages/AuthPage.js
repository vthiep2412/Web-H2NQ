import { checkPasswordStrength } from '../utils/password'; // Import password strength checker
import React, { useState, useEffect } from 'react';
import { SunFill, MoonFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import styles from './AuthPage.module.css'; // Import CSS module
import { useAuth } from '../context/AuthContext'; // Import useAuth
import Modal from '../components/Modal'; // Import the Modal component
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
    const location = useLocation();
    const [isSignUp, setIsSignUp] = useState(location.state?.formType === 'signup');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [avatarUrl] = useState(''); // Re-add state for avatar URL
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); // New state for password strength
    const [theme, setTheme] = useState(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    );
    const { login } = useAuth(); // Use login from AuthContext

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0 && showModal && modalMessage.includes("blocked")) {
            // If countdown reaches 0 and modal is showing a blocked message, close it
            setShowModal(false);
            setModalMessage('');
        }
        return () => clearInterval(timer);
    }, [countdown, showModal, modalMessage]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSignUpClick = () => {
        setIsSignUp(true);
        setShowModal(false); // Close modal on form switch
    };

    const handleSignInClick = () => {
        setIsSignUp(false);
        setShowModal(false); // Close modal on form switch
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setShowModal(false);
    
        if (password !== confirmPassword) {
            setModalMessage('Passwords do not match!');
            setShowModal(true);
            return;
        }

        const MIN_PASSWORD_STRENGTH = 3; // Define minimum acceptable strength
        if (passwordStrength < MIN_PASSWORD_STRENGTH) {
            setModalMessage('Password is too weak. Please use a stronger password.');
            setShowModal(true);
            return;
        }
    
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, avatarUrl }),
            });
    
            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
    
                if (res.status === 429 && errorData) {
                    setModalMessage(errorData.msg);
                    setCountdown(errorData.timeLeft || 0);
                } else if (errorData) {
                    // Display more specific error messages from the server
                    const message = Array.isArray(errorData.errors)
                        ? errorData.errors.map(err => err.msg).join(', ')
                        : errorData.msg || 'Registration failed';
                    setModalMessage(message);
                } else {
                    setModalMessage('Registration failed. Please try again later.');
                }
                setShowModal(true);
                return;
            }
    
            const data = await res.json();
            login(data.token);
    
        } catch (error) {
            console.error('Error during registration:', error);
            setModalMessage('Unable to connect to the server. Please check your network.');
            setShowModal(true);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setShowModal(false);
    
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: email, password }),
            });
    
            if (!res.ok) {
                // Attempt to parse error response as JSON
                const errorData = await res.json().catch(() => null);
    
                if (res.status === 429 && errorData) {
                    setModalMessage(errorData.msg);
                    setCountdown(errorData.timeLeft || 0);
                } else if (res.status === 400 && errorData) {
                    setModalMessage(errorData.msg || 'Wrong email or password');
                }
                else {
                    // Fallback for non-JSON responses or other errors
                    setModalMessage('Login failed. Please try again later.');
                }
                setShowModal(true);
                return; // Stop execution after handling error
            }
    
            const data = await res.json();
            login(data.token); // Use login from AuthContext
    
        } catch (error) {
            console.error('Error during login:', error);
            // This will catch network errors or issues with the fetch itself
            setModalMessage('Unable to connect to the server. Please check your network.');
            setShowModal(true);
        }
    };

    return (
        <div className={`${styles.authBody} ${theme === 'dark' ? styles.dark : ''}`}>
             <button onClick={toggleTheme} className={styles.themeToggleBtnAuth}>
                {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
            </button>
            <div className={`${styles.authContainer} ${isSignUp ? styles.rightPanelActive : ""}`} id="container">
                <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                    <form onSubmit={handleRegister}>
                        <img src="/H2NQ-SVG.svg" alt="H2NQ Logo" className={styles.authLogo} />
                        <h1>Create Account</h1>
                        <input type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className={styles.passwordContainer}>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <span onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </span>
                        </div>
                        {isSignUp && password.length > 0 && (
                            <div className={styles.passwordStrengthIndicator}>
                                Password Strength: {' '}
                                {passwordStrength <= 2 && <span style={{ color: 'red' }}>Weak</span>}
                                {passwordStrength > 2 && passwordStrength <= 5 && <span style={{ color: 'orange' }}>Medium</span>}
                                {passwordStrength > 5 && <span style={{ color: 'green' }}>Strong</span>}
                            </div>
                        )}
                        <div className={styles.passwordContainer}>
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
                                {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                            </span>
                        </div>
                        <button type="submit" id="signUpBtn" style={{ marginTop: '10px' }}>Sign Up</button>
                        <span className={styles.mobileToggleLink} onClick={handleSignInClick}>Already have an account? Sign In</span>
                    </form>
                </div>
                <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                    <form onSubmit={handleLogin}>
                        <img src="/H2NQ-SVG.svg" alt="H2NQ Logo" className={styles.authLogo} />
                        <h1>Sign In</h1>
                        <input type="text" placeholder="Username or Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className={styles.passwordContainer}>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <span onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
                                {showPassword ? <EyeSlashFill /> : <EyeFill />}
                            </span>
                        </div>
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
            <Modal show={showModal} onClose={() => setShowModal(false)} theme={theme}>
                <p>
                    {modalMessage.includes("blocked") && countdown > 0
                        ? `Too many failed login attempts. You are blocked. Try again in ${Math.floor(countdown / 60)}m ${countdown % 60}s.`
                        : modalMessage}
                </p>
            </Modal>
        </div>
    );
};

export default AuthPage;
