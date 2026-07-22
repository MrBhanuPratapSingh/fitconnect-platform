import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import { getMembers, addMember, deactivateMember } from '../../api/memberApi';
import type { Member, MemberCreateRequest } from '../../api/memberApi';

function MembersPage() {
  const [gymId, setGymId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const gymRes = await getMyGym();
      const id = gymRes.data.id;
      setGymId(id);

      const membersRes = await getMembers(id);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdded = (newMember: Member) => {
    setMembers([...members, newMember]);
    setShowForm(false);
  };

  const handleDeactivate = async (memberId: number) => {
    if (!gymId) return;
    if (!confirm('Deactivate this member?')) return;
    await deactivateMember(gymId, memberId);
    setMembers(members.map(m => m.id === memberId ? { ...m, status: 'INACTIVE' } : m));
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Members</h1>
            <p className="text-slate-400 text-sm">{members.length} total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add member'}
          </button>
        </div>

        {showForm && gymId && (
          <AddMemberForm gymId={gymId} onAdded={handleAdded} />
        )}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-slate-400">No members yet. Add your first one above.</p>
        ) : (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-700/50 text-slate-400 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-slate-700">
                    <td className="px-4 py-3 text-white">{m.fullName}</td>
                    <td className="px-4 py-3 text-slate-300">{m.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{m.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{m.joinDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        m.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/30 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleDeactivate(m.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
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

function AddMemberForm({ gymId, onAdded }: { gymId: number; onAdded: (m: Member) => void }) {
  const [form, setForm] = useState<MemberCreateRequest>({
    fullName: '', phone: '', email: '', joinDate: new Date().toISOString().split('T')[0],
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
      const res = await addMember(gymId, form);
      onAdded(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}
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
          <label className="text-xs text-slate-400 block mb-1">Join date</label>
          <input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2">
          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {submitting ? 'Adding...' : 'Add member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MembersPage;