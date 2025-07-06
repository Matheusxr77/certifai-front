import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/index.tsx';
import Register from '../pages/register/index.tsx';
import Home from '../pages/home/index.tsx';
import Confirmation from '../pages/confirmation/index.tsx';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/verify" element={<Confirmation />} />
            <Route path="/dashboard" element={<Home />} />
        </Routes>
    );
}

export default AppRoutes;