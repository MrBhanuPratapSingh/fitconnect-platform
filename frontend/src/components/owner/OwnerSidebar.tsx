import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function OwnerSidebar() {
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

  return (
    <div className="w-56 bg-slate-800 flex flex-col gap-1 p-4 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          F
        </div>
        <span className="text-white font-medium">FitConnect</span>
      </div>

      <NavLink to="/owner/dashboard" end className={linkClass}>Dashboard</NavLink>
      <NavLink to="/owner/gym-profile" className={linkClass}>Gym profile</NavLink>
      <NavLink to="/owner/members" className={linkClass}>Members</NavLink>
      <NavLink to="/owner/trainers" className={linkClass}>Trainers</NavLink>
      <NavLink to="/owner/fees" className={linkClass}>Fees & salary</NavLink>
      <NavLink to="/owner/jobs" className={linkClass}>Job posts</NavLink>
      <NavLink to="/owner/reviews" className={linkClass}>Reviews</NavLink>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-medium">
            {user?.fullName?.charAt(0) || 'O'}
          </div>
          <span className="text-sm text-slate-400 truncate">{user?.fullName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-red-400 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default OwnerSidebar;