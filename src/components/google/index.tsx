import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import './styles.css';
import type { GoogleLoginButtonProps } from './indexModel';
import { useGoogleLoginController } from './indexController';

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = (props) => {
    const {
        handleGoogleLogin,
        isLoading,
        disabled,
        buttonText
    } = useGoogleLoginController(props);

    return (
        <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={disabled || isLoading}
        >
            <FaGoogle className="google-icon" />
            {isLoading ? 'Entrando...' : buttonText}
        </button>
    );
};

export default GoogleLoginButton;