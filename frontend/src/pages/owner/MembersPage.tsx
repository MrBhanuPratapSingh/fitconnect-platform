import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import {
  getMembers, addMember, deactivateMember,
  getPaymentsForMember, createDuePayment, markPaymentPaid,
} from '../../api/memberApi';
import type { Member, MemberCreateRequest, FeePayment, FeePaymentRequest } from '../../api/memberApi';

function MembersPage() {
  const [gymId, setGymId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);
  const [payments, setPayments] = useState<Record<number, FeePayment[]>>({});

  useEffect(() => { init(); }, []);

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

  const togglePayments = async (memberId: number) => {
    if (!gymId) return;
    if (expandedMemberId === memberId) {
      setExpandedMemberId(null);
      return;
    }
    setExpandedMemberId(memberId);
    if (!payments[memberId]) {
      const res = await getPaymentsForMember(gymId, memberId);
      setPayments({ ...payments, [memberId]: res.data });
    }
  };

  const handleMarkPaid = async (memberId: number, paymentId: number) => {
    if (!gymId) return;
    const today = new Date().toISOString().split('T')[0];
    await markPaymentPaid(gymId, paymentId, today);
    const res = await getPaymentsForMember(gymId, memberId);
    setPayments({ ...payments, [memberId]: res.data });
  };

  const handleAddDue = async (memberId: number, data: FeePaymentRequest) => {
    if (!gymId) return;
    await createDuePayment(gymId, memberId, data);
    const res = await getPaymentsForMember(gymId, memberId);
    setPayments({ ...payments, [memberId]: res.data });
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
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m.id} className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{m.fullName}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {m.phone || '—'} · {m.email || '—'} · Joined {m.joinDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      m.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/30 text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                    <button onClick={() => togglePayments(m.id)} className="text-blue-400 hover:text-blue-300 text-xs">
                      {expandedMemberId === m.id ? 'Hide fees' : 'View fees'}
                    </button>
                    {m.status === 'ACTIVE' && (
                      <button onClick={() => handleDeactivate(m.id)} className="text-red-400 hover:text-red-300 text-xs">
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>

                {expandedMemberId === m.id && (
                  <div className="border-t border-slate-700 p-4">
                    <FeePaymentsPanel
                      memberId={m.id}
                      payments={payments[m.id] || []}
                      onMarkPaid={(paymentId) => handleMarkPaid(m.id, paymentId)}
                      onAddDue={(data) => handleAddDue(m.id, data)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeePaymentsPanel({
  memberId, payments, onMarkPaid, onAddDue,
}: {
  memberId: number;
  payments: FeePayment[];
  onMarkPaid: (paymentId: number) => void;
  onAddDue: (data: FeePaymentRequest) => void;
}) {
  const [showAddDue, setShowAddDue] = useState(false);
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDue({ amount: Number(amount), dueDate });
    setShowAddDue(false);
    setAmount('');
  };

  const statusColor = (status: string) => {
    if (status === 'PAID') return 'bg-green-500/10 text-green-400';
    if (status === 'OVERDUE') return 'bg-red-500/10 text-red-400';
    return 'bg-yellow-500/10 text-yellow-400';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-slate-300 font-medium">Fee payments</p>
        <button onClick={() => setShowAddDue(!showAddDue)} className="text-blue-400 hover:text-blue-300 text-xs">
          {showAddDue ? 'Cancel' : '+ Add due amount'}
        </button>
      </div>

      {showAddDue && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
            Add
          </button>
        </form>
      )}

      {payments.length === 0 ? (
        <p className="text-slate-500 text-sm">No fee records yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-lg px-3 py-2 flex justify-between items-center">
              <div>
                <span className="text-white text-sm">₹{p.amount}</span>
                <span className="text-slate-400 text-xs ml-2">Due {p.dueDate}</span>
                {p.paidDate && <span className="text-slate-400 text-xs ml-2">· Paid {p.paidDate}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                {p.status !== 'PAID' && (
                  <button onClick={() => onMarkPaid(p.id)} className="text-green-400 hover:text-green-300 text-xs">
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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