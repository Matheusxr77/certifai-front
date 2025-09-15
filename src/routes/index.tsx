import { 
    Routes, 
    Route, 
    Navigate 
} from 'react-router-dom';

import Login from '../pages/login/index.tsx';
import Register from '../pages/register/index.tsx';
import Home from '../pages/home/index.tsx';
import Confirmation from '../pages/confirmation/index.tsx';
import ForgotPassword from '../pages/forgotPassword/index.tsx';
import ResetPassword from '../pages/resetPassword/index.tsx';
import Profile from '../pages/profile/index.tsx';
import UnderConstruction from '../components/UnderConstruction/index.tsx';
import Management from '../pages/management/index.tsx';
import Certifications from '../pages/certifications/index.tsx';
import Questions from '../pages/questions/index.tsx';
import Calendar from '../pages/calendar/index.tsx';
import Tests from '../pages/tests/index.tsx';
import Simulation from '../pages/tests/components/Simulation/index.tsx';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/verify" element={<Confirmation />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/under-construction" element={<UnderConstruction />} />
            <Route path="/management" element={<Management />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/simulation/:provaId" element={<Simulation />} />
        </Routes>
    );
}

export default AppRoutes;