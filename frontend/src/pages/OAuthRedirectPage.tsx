import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      login(token, {
        id: payload.userId,
        fullName: payload.sub, // email as fallback name; refined once a real profile fetch exists
        email: payload.sub,
        role: payload.role,
      });

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