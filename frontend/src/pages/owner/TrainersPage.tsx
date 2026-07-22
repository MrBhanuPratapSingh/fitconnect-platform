import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import { getTrainers, addTrainer, deactivateTrainer } from '../../api/trainerApi';
import type { Trainer, TrainerCreateRequest } from '../../api/trainerApi';

function TrainersPage() {
  const [gymId, setGymId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const gymRes = await getMyGym();
      setGymId(gymRes.data.id);
      const res = await getTrainers(gymRes.data.id);
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdded = (t: Trainer) => {
    setTrainers([...trainers, t]);
    setShowForm(false);
  };

  const handleDeactivate = async (id: number) => {
    if (!gymId || !confirm('Deactivate this trainer?')) return;
    await deactivateTrainer(gymId, id);
    setTrainers(trainers.map(t => t.id === id ? { ...t, status: 'INACTIVE' } : t));
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Trainers</h1>
            <p className="text-slate-400 text-sm">{trainers.length} total</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {showForm ? 'Cancel' : '+ Add trainer'}
          </button>
        </div>

        {showForm && gymId && <AddTrainerForm gymId={gymId} onAdded={handleAdded} />}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : trainers.length === 0 ? (
          <p className="text-slate-400">No trainers yet.</p>
        ) : (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-700/50 text-slate-400 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Shift</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((t) => (
                  <tr key={t.id} className="border-t border-slate-700">
                    <td className="px-4 py-3 text-white">{t.fullName}</td>
                    <td className="px-4 py-3 text-slate-300">{t.specialization || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{t.experienceYears ?? '—'} yrs</td>
                    <td className="px-4 py-3 text-slate-300">{t.shiftTiming || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        t.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/30 text-slate-400'
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.status === 'ACTIVE' && (
                        <button onClick={() => handleDeactivate(t.id)} className="text-red-400 hover:text-red-300 text-xs">
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AddTrainerForm({ gymId, onAdded }: { gymId: number; onAdded: (t: Trainer) => void }) {
  const [form, setForm] = useState<TrainerCreateRequest>({
    fullName: '', phone: '', email: '', specialization: '', shiftTiming: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await addTrainer(gymId, form);
      onAdded(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add trainer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Full name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Specialization</label>
          <input name="specialization" value={form.specialization} onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Shift timing</label>
          <input name="shiftTiming" value={form.shiftTiming} onChange={handleChange} placeholder="e.g. 6 AM - 2 PM"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Join date</label>
          <input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2">
          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {submitting ? 'Adding...' : 'Add trainer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TrainersPage;