import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/api/auth/login', { email, password });
      const { token, fullName, email: userEmail, role } = response.data;

      login(token, { fullName, email: userEmail, role });

      // Route based on role
      if (role === 'GYM_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-xl p-8 border border-slate-700">
        <h1 className="text-2xl font-semibold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-6">Log in as a gym owner or a member.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-medium py-2.5 rounded-lg mb-4 hover:bg-slate-100 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h11.8c-.5 2.7-2 5-4.3 6.5v5.4h7C42.6 37 45.1 31.3 45.1 24.5z"/>
            <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7-5.4c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.6C7.9 41 15.3 46 24 46z"/>
            <path fill="#FBBC05" d="M11.6 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.6H4.3C2.8 17 2 20.4 2 24s.8 7 2.3 10l7.3-5.7z"/>
            <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.2-6.2C34.9 4.3 29.9 2 24 2 15.3 2 7.9 7 4.3 14l7.3 5.6c1.7-5.2 6.6-8.9 12.4-8.9z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-xs text-slate-400 block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
          />

          <label className="text-xs text-slate-400 block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-5 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-5">
          New here?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;