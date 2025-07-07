import { useEffect } from 'react';
import { 
    DEFAULT_GOOGLE_CONFIG, 
    DEFAULT_BUTTON_TEXT, 
    ERROR_MESSAGES 
} from './indexModel';

import type { 
    GoogleLoginButtonProps, 
    GoogleCredentialResponse, 
    GoogleJWTPayload 
} from './indexModel';

export const useGoogleLoginController = (props: GoogleLoginButtonProps) => {
    const {
        onSuccess,
        onError,
        isLoading = false,
        disabled = false,
        buttonText = DEFAULT_BUTTON_TEXT
    } = props;

    // Carregar e inicializar o script do Google
    useEffect(() => {
        const script = document.createElement('script');
        script.src = DEFAULT_GOOGLE_CONFIG.scriptUrl;
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        script.onerror = () => onError(ERROR_MESSAGES.SCRIPT_LOAD_ERROR);
        
        document.head.appendChild(script);

        return () => {
            // Cleanup: remover script se componente for desmontado
            try {
                document.head.removeChild(script);
            } catch (error) {
                // Ignorar erro se script já foi removido
            }
        };
    }, []);

    const initializeGoogleSignIn = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: DEFAULT_GOOGLE_CONFIG.clientId,
                callback: handleCredentialResponse,
                auto_select: DEFAULT_GOOGLE_CONFIG.autoSelect,
                cancel_on_tap_outside: DEFAULT_GOOGLE_CONFIG.cancelOnTapOutside
            });
        }
    };

    const handleCredentialResponse = (response: GoogleCredentialResponse) => {
        try {
            // Decodificar o JWT token do Google
            const payload: GoogleJWTPayload = JSON.parse(
                atob(response.credential.split('.')[1])
            );
            
            onSuccess(
                response.credential,
                payload.email,
                payload.name
            );
        } catch (error) {
            onError(ERROR_MESSAGES.PROCESSING_ERROR);
        }
    };

    const handleGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            onError(ERROR_MESSAGES.UNAVAILABLE_ERROR);
        }
    };

    return {
        handleGoogleLogin,
        isLoading,
        disabled,
        buttonText
    };
};