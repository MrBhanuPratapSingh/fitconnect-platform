import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function UserSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      isActive ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTrainer = user?.role === 'TRAINER';

  return (
    <div className="w-56 bg-slate-800 flex flex-col gap-1 p-4 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          F
        </div>
        <span className="text-white font-medium">FitConnect</span>
      </div>

      <NavLink to="/user/dashboard" end className={linkClass}>Find gyms</NavLink>
      <NavLink to="/user/applications" className={linkClass}>My applications</NavLink>
      {isTrainer && <NavLink to="/user/jobs" className={linkClass}>Find jobs</NavLink>}

      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-medium">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-slate-400 truncate">{user?.fullName}</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition">
          Log out
        </button>
      </div>
    </div>
  );
}

export default UserSidebar;