import { useEffect, useState } from 'react';
import { getMyGym, createGym } from '../../api/gymApi';
import type { Gym, GymCreateRequest } from '../../api/gymApi';
import OwnerSidebar from '../../components/owner/OwnerSidebar';

function OwnerDashboardPage() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchGym();
  }, []);

  const fetchGym = async () => {
    try {
      const response = await getMyGym();
      setGym(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setShowCreateForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-900">
        <OwnerSidebar />
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        {showCreateForm ? (
          <CreateGymForm onCreated={(newGym) => { setGym(newGym); setShowCreateForm(false); }} />
        ) : gym ? (
          <DashboardOverview gym={gym} />
        ) : null}
      </div>
    </div>
  );
}

function CreateGymForm({ onCreated }: { onCreated: (gym: Gym) => void }) {
  const [form, setForm] = useState<GymCreateRequest>({
    name: '', address: '', contactPhone: '', contactEmail: '', description: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await createGym(form);
      onCreated(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create gym');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-white mb-1">Set up your gym</h1>
      <p className="text-slate-400 text-sm mb-6">This creates your gym's public profile.</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Gym name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Address</label>
          <input name="address" value={form.address} onChange={handleChange} required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Contact phone</label>
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Contact email</label>
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>

        <button type="submit" disabled={submitting}
          className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
          {submitting ? 'Creating...' : 'Create gym'}
        </button>
      </form>
    </div>
  );
}

function DashboardOverview({ gym }: { gym: Gym }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-white mb-1">Dashboard</h1>
      <p className="text-slate-400 text-sm mb-6">{gym.name}</p>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Active members" value="0" />
        <StatCard label="Fee collected" value="₹0" />
        <StatCard label="Fee overdue" value="₹0" />
        <StatCard label="Average rating" value="—" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default OwnerDashboardPage;