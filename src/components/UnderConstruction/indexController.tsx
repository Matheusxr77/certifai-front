import { useNavigate } from 'react-router-dom';
import { defaultProps } from './indexModel.tsx';

import type { UnderConstructionProps } from './indexModel.tsx';

export const useUnderConstructionController = (props: UnderConstructionProps) => {
    const navigate = useNavigate();

    const state = {
        title: props.title || defaultProps.title,
        subtitle: props.subtitle || defaultProps.subtitle,
        showBackButton: props.showBackButton ?? defaultProps.showBackButton,
        showHomeButton: props.showHomeButton ?? defaultProps.showHomeButton
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleHomeClick = () => {
        navigate('/dashboard');
    };

    return {
        state,
        handleBackClick,
        handleHomeClick
    };
};