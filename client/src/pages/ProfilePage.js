import React, { useState, useEffect } from 'react';
import { SunFill, MoonFill, EyeFill, EyeSlashFill, PersonCircle, PencilSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import styles from './ProfilePage.module.css';
import { useAuth } from '../context/AuthContext';

const ProfilePage = React.memo(() => {
    const { user } = useAuth();
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
        if (password.length > 7) strength++;
        if (password.length > 10) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
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

    const getPasswordStrengthLabel = () => {
        if (newPassword.length === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength > 2 && passwordStrength <= 4) return 'Medium';
        if (passwordStrength > 4) return 'Strong';
        return '';
    };

    return (
        <div className={`${styles.authBody} ${theme === 'dark' ? styles.dark : ''}`}>
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
                        <button className={`${styles.editBtn} ${styles.avatarEditBtn}`}>
                            <PencilSquare size={15} />
                        </button>
                    </div>
                    <div className={styles.profileInfo}>
                        <div className={styles.infoField}>
                            <h5>{user ? user.name : t('guest')}</h5>
                            <button className={styles.editBtn}>
                                <PencilSquare size={15} />
                            </button>
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
                    <button type="submit" className={styles.updatePasswordBtn}>{t('Update Password')}</button>
                </div>
            </div>
        </div>
    );
});

export default ProfilePage;
