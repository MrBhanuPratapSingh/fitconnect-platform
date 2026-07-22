import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import ProtectedRoute from './components/common/ProtectedRoute';

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
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl">
              Owner dashboard coming soon
            </div>
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
    </Routes>
  );
}

export default App;