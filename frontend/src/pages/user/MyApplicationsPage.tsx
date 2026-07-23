import { useEffect, useState } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { getMyApplications } from '../../api/jobSearchApi';
import type { MyApplication } from '../../api/jobSearchApi';
import { useAuth } from '../../context/AuthContext';

function MyApplicationsPage() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { init(); }, []);

  const init = async () => {
    if (!user) return;
    try {
      const res = await getMyApplications(user.id);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'HIRED': return 'bg-green-500/10 text-green-400';
      case 'SHORTLISTED': return 'bg-blue-500/10 text-blue-400';
      case 'REJECTED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-slate-600/30 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <UserSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-white mb-1">My applications</h1>
        <p className="text-slate-400 text-sm mb-6">{applications.length} total</p>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-slate-400">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-800 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{app.jobTitle}</p>
                  <p className="text-slate-400 text-xs mt-1">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${statusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplicationsPage;