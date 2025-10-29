// Happy coding :D!
// Happy coding :D
import React, { useState, useEffect, useRef } from 'react';
import { SunFill, MoonFill, EyeFill, EyeSlashFill, PersonCircle, PencilSquare, ArrowLeft, Check2, X } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import styles from './ProfilePage.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const ProfilePage = React.memo(() => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/troll');
        }
    }, [user, navigate]);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user ? user.name : '');
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { t } = useTranslation();

    const [theme, setTheme] = useState(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 7) strength++; // At least 7 characters
        if (password.length >= 10) strength++; // At least 10 characters
        
        let characterTypeCount = 0;
        if (/[a-z]/.test(password)) characterTypeCount++;
        if (/[A-Z]/.test(password)) characterTypeCount++;
        if (/[0-9]/.test(password)) characterTypeCount++;
        if (/[^A-Za-z0-9]/.test(password)) characterTypeCount++;

        strength += characterTypeCount; // Add score for each type present
        
        if (characterTypeCount >= 3) strength++; // Bonus for 3+ types
        if (characterTypeCount === 4) strength++; // Additional bonus for all 4 types

        return strength;
    };

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(newPassword));
    }, [newPassword]);

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'red';
        if (passwordStrength > 2 && passwordStrength <= 4) return 'orange';
        if (passwordStrength > 4) return 'green';
        return 'grey';
    };

    const handleReturn = () => {
        navigate('/ai');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 1. Get signature from backend
            const token = localStorage.getItem('token');
            const sigRes = await fetch('/api/users/avatar/signature', {
                method: 'POST',
                headers: {
                    'x-auth-token': token,
                },
            });

            if (!sigRes.ok) {
                throw new Error('Failed to get upload signature');
            }

            const { timestamp, signature, upload_preset, transformation } = await sigRes.json();

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('upload_preset', upload_preset);
            formData.append('transformation', transformation);
            formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY);

            const cloudName = process.env.REACT_APP_CLOUD_NAME;
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            const uploadRes = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }

            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.secure_url;

            // 3. Update user avatar in backend
            const userRes = await fetch('/api/users/avatar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ avatarUrl: imageUrl }),
            });

            if (!userRes.ok) {
                throw new Error('Failed to update avatar');
            }

            const updatedUser = await userRes.json();
            login(token, updatedUser); // Update user in AuthContext

        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    };

    const [passwordError, setPasswordError] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const validatePassword = (oldPass, newPass, confirmPass) => {
        if (!oldPass || !newPass || !confirmPass) {
            return 'All password fields are required.';
        }
        if (newPass.length < 6) {
            return 'New password must be at least 6 characters long.';
        }
        if (newPass !== confirmPass) {
            return 'New password and confirm password do not match.';
        }
        // Additional strength validation can be added here if needed,
        // but it's already handled by calculatePasswordStrength for visual feedback
        return '';
    };

    const validateUsername = (username) => {
        if (!username || username.trim() === '') {
            return 'Username cannot be empty';
        }
        if (username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (username.length > 30) {
            return 'Username cannot be longer than 30 characters';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return 'Username can only contain letters, numbers, underscores and hyphens';
        }
        return '';
    };

    const handleUsernameChange = async () => {
        setUsernameError('');
        
        // Validate username
        const validationError = validateUsername(newUsername);
        if (validationError) {
            setUsernameError(validationError);
            return;
        }

        // Check if username is unchanged
        if (newUsername === user.name) {
            setUsernameError('New username is the same as current username');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ name: newUsername }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.msg || 'Failed to update username');
            }

            login(token, data); // Update user in AuthContext
            setIsEditingUsername(false);
            setShowUsernameModal(false);
        } catch (error) {
            setUsernameError(error.message || 'An error occurred while updating username');
            console.error('Error updating username:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        const validationError = validatePassword(oldPassword, newPassword, confirmPassword);
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        setIsPasswordLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Failed to update password');
            }

            // Clear password fields and close modal on success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordModal(false);
        } catch (error) {
            setPasswordError(error.message || 'An error occurred while updating password');
            console.error('Error updating password:', error);
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const getPasswordStrengthLabel = () => {
        if (newPassword.length === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength > 2 && passwordStrength <= 4) return 'Medium';
        if (passwordStrength > 4) return 'Strong';
        return '';
    };

    return (
        <div className={`${styles.authBody} ${theme === 'dark' ? styles.dark : ''}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
            />
            <button onClick={handleReturn} className={styles.returnBtnAuth}>
                <ArrowLeft size={20} />
            </button>
            <button onClick={toggleTheme} className={styles.themeToggleBtnAuth}>
                {theme === 'light' ? <MoonFill size={20} /> : <SunFill size={20} />}
            </button>
            <div className={styles.authContainer} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarContainer}>
                        {user && user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="User Avatar" className={styles.profileAvatar} />
                        ) : (
                            <PersonCircle size={100} />
                        )}
                        <button className={`${styles.editBtn} ${styles.avatarEditBtn}`} onClick={handleAvatarClick}>
                            <PencilSquare size={15} />
                        </button>
                    </div>
                    <div className={styles.profileInfo}>
                        <div className={styles.infoField}>
                            {isEditingUsername ? (
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') setShowUsernameModal(true);
                                        if (e.key === 'Escape') {
                                            setIsEditingUsername(false);
                                            setNewUsername(user.name);
                                        }
                                    }}
                                    className={styles.usernameInput}
                                    autoFocus
                                />
                            ) : (
                                <h5>{user ? user.name : t('guest')}</h5>
                            )}
                            <div className={styles.editUsernameButtons}>
                                {isEditingUsername ? (
                                    <>
                                        <button className={styles.editBtn} onClick={() => {
                                            if (newUsername !== user.name) {
                                                setShowUsernameModal(true);
                                            } else {
                                                setIsEditingUsername(false);
                                            }
                                        }}>
                                            <Check2 size={15} />
                                        </button>
                                        <button className={styles.editBtn} onClick={() => {
                                            setIsEditingUsername(false);
                                            setNewUsername(user.name);
                                        }}>
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <button className={styles.editBtn} onClick={() => setIsEditingUsername(true)}>
                                        <PencilSquare size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.infoField}>
                            <p>{user ? user.email : t('guestEmail')}</p>
                            <button className={styles.editBtn}>
                                <PencilSquare size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.passwordSection}>
                    <h4>{t('Change Password')}</h4>
                    <div className={styles.passwordContainer}>
                        <input
                            type={showOldPassword ? "text" : "password"}
                            placeholder={t('Old Password')}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowOldPassword(!showOldPassword)} className={styles.eyeIcon}>
                            {showOldPassword ? <EyeSlashFill /> : <EyeFill />}
                        </span>
                    </div>
                    <div className={styles.passwordContainer}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder={t('New Password')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowNewPassword(!showNewPassword)} className={styles.eyeIcon}>
                            {showNewPassword ? <EyeSlashFill /> : <EyeFill />}
                        </span>
                    </div>
                    {newPassword.length > 0 && (
                        <div className={styles.passwordStrengthContainer}>
                            <span className={styles.strengthLabel}>
                                Strength: <span style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthLabel()}</span>
                            </span>
                            <div className={styles.passwordStrengthIndicator}>
                                <div className={styles.strengthBar} style={{ width: `${(passwordStrength / 6) * 100}%`, backgroundColor: getPasswordStrengthColor() }}></div>
                            </div>
                        </div>
                    )}
                     <div className={styles.passwordContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t('Confirm Password')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
                            {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                        </span>
                    </div>
                    <button type="button" onClick={() => setShowPasswordModal(true)} className={styles.updatePasswordBtn}>{t('Update Password')}</button>
                    {passwordError && (
                        <div className="alert alert-danger" role="alert" style={{ marginTop: '10px' }}>
                            {passwordError}
                        </div>
                    )}
                </div>
            </div>
            <Modal show={showUsernameModal} onClose={() => {
                setShowUsernameModal(false);
                setUsernameError('');
            }} theme={theme}>
                <h4>{t('Confirm Username Change')}</h4>
                <p>{t('Are you sure you want to change your username to')} "{newUsername}" ?</p>
                {usernameError && (
                    <div className="alert alert-danger" role="alert">
                        {usernameError}
                    </div>
                )}
                <div className={styles.modalActions}>
                    <button
                        onClick={handleUsernameChange}
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? t('Updating...') : t('Approve')}
                    </button>
                </div>
            </Modal>
            <Modal show={showPasswordModal} onClose={() => {
                setShowPasswordModal(false);
                setPasswordError('');
            }} theme={theme}>
                <h4>{t('Confirm Password Change')}</h4>
                <p>{t('Are you sure you want to change your password?')}</p>
                {passwordError && (
                    <div className="alert alert-danger" role="alert">
                        {passwordError}
                    </div>
                )}
                <div className={styles.modalActions}>
                    <button
                        onClick={handlePasswordChange}
                        className="btn btn-primary"
                        disabled={isPasswordLoading}
                    >
                        {isPasswordLoading ? t('Updating...') : t('Approve')}
                    </button>
                </div>
            </Modal>
        </div>
    );
});

export default ProfilePage;
