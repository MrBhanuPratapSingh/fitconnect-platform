import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym, updateGym } from '../../api/gymApi';
import type { Gym, GymCreateRequest } from '../../api/gymApi';

function GymProfileEditPage() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<GymCreateRequest>({
    name: '', address: '', contactPhone: '', contactEmail: '', description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const res = await getMyGym();
      setGym(res.data);
      setForm({
        name: res.data.name,
        address: res.data.address,
        contactPhone: res.data.contactPhone || '',
        contactEmail: res.data.contactEmail || '',
        description: res.data.description || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      const res = await updateGym(form);
      setGym(res.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update gym');
    } finally {
      setSubmitting(false);
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
      <div className="flex-1 p-8 max-w-lg">
        <h1 className="text-xl font-semibold text-white mb-1">Gym profile</h1>
        <p className="text-slate-400 text-sm mb-6">Edit your gym's public information</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-3 py-2 mb-4">
            Gym profile updated
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
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GymProfileEditPage;