import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import MembersPage from './pages/owner/MembersPage';
import TrainersPage from './pages/owner/TrainersPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/members"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <MembersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl">
              User dashboard coming soon
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
      <Route
  path="/owner/trainers"
  element={
    <ProtectedRoute allowedRoles={['GYM_OWNER']}>
      <TrainersPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;