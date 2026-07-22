import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/api/auth/register', {
        fullName,
        email,
        password,
        role,
      });
      const { token, fullName: name, email: userEmail, role: userRole } = response.data;

      login(token, { fullName: name, email: userEmail, role: userRole });

      if (userRole === 'GYM_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-xl p-8 border border-slate-700">
        <h1 className="text-2xl font-semibold text-white mb-1">Create your account</h1>
        <p className="text-slate-400 text-sm mb-6">Join as a gym owner or a member.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-xs text-slate-400 block mb-1">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
          />

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
            placeholder="At least 6 characters"
            required
            minLength={6}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
          />

          <label className="text-xs text-slate-400 block mb-1">I am a</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-5 focus:outline-none focus:border-blue-500"
          >
            <option value="USER">Gym member / looking for a gym</option>
            <option value="TRAINER">Trainer looking for jobs</option>
            <option value="GYM_OWNER">Gym owner</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;