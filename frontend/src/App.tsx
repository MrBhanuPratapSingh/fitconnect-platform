import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import MembersPage from './pages/owner/MembersPage';
import TrainersPage from './pages/owner/TrainersPage';
import FeesPage from './pages/owner/FeesPage';
import JobsPage from './pages/owner/JobsPage';
import ReviewsPage from './pages/owner/ReviewsPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import GymProfilePage from './pages/user/GymProfilePage';
import JobSearchPage from './pages/user/JobSearchPage';
import MyApplicationsPage from './pages/user/MyApplicationsPage';

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
        path="/owner/trainers"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <TrainersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/fees"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <FeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/jobs"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <JobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/reviews"
        element={
          <ProtectedRoute allowedRoles={['GYM_OWNER']}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/gyms/:gymId"
        element={
          <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
            <GymProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/user/jobs"
  element={
    <ProtectedRoute allowedRoles={['TRAINER']}>
      <JobSearchPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/user/applications"
  element={
    <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
      <MyApplicationsPage />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;