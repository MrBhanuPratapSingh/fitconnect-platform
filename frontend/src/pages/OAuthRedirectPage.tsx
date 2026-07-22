import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

function OAuthRedirectPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Decode the JWT payload to get role/email without a network call.
    // JWTs are base64url-encoded JSON in three dot-separated parts; we only need the middle one.
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        fullName: payload.sub, // fallback, refined below
        email: payload.sub,
        role: payload.role,
      };

      login(token, user);

      // Optionally fetch full profile for accurate fullName — skipped for now,
      // email/role are enough to route correctly.
      if (payload.role === 'GYM_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Failed to parse token', err);
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <p>Signing you in...</p>
    </div>
  );
}

export default OAuthRedirectPage;