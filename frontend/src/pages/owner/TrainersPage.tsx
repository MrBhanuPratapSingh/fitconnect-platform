import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import {
  getTrainers, addTrainer, deactivateTrainer,
  getSalaryHistory, createSalary, markSalaryPaid,
} from '../../api/trainerApi';
import type { Trainer, TrainerCreateRequest, SalaryPayment, SalaryPaymentRequest } from '../../api/trainerApi';

function TrainersPage() {
  const [gymId, setGymId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedTrainerId, setExpandedTrainerId] = useState<number | null>(null);
  const [salaries, setSalaries] = useState<Record<number, SalaryPayment[]>>({});

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const gymRes = await getMyGym();
      const id = gymRes.data.id;
      setGymId(id);
      const res = await getTrainers(id);
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

  const toggleSalary = async (trainerId: number) => {
    if (!gymId) return;
    if (expandedTrainerId === trainerId) {
      setExpandedTrainerId(null);
      return;
    }
    setExpandedTrainerId(trainerId);
    if (!salaries[trainerId]) {
      const res = await getSalaryHistory(gymId, trainerId);
      setSalaries({ ...salaries, [trainerId]: res.data });
    }
  };

  const handleMarkPaid = async (trainerId: number, paymentId: number) => {
    if (!gymId) return;
    const today = new Date().toISOString().split('T')[0];
    await markSalaryPaid(gymId, paymentId, today);
    const res = await getSalaryHistory(gymId, trainerId);
    setSalaries({ ...salaries, [trainerId]: res.data });
  };

  const handleAddSalary = async (trainerId: number, data: SalaryPaymentRequest) => {
    if (!gymId) return;
    await createSalary(gymId, trainerId, data);
    const res = await getSalaryHistory(gymId, trainerId);
    setSalaries({ ...salaries, [trainerId]: res.data });
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
          <div className="flex flex-col gap-3">
            {trainers.map((t) => (
              <div key={t.id} className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{t.fullName}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {t.specialization || '—'} · {t.experienceYears ?? '—'} yrs · {t.shiftTiming || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/30 text-slate-400'
                    }`}>{t.status}</span>
                    <button onClick={() => toggleSalary(t.id)} className="text-blue-400 hover:text-blue-300 text-xs">
                      {expandedTrainerId === t.id ? 'Hide salary' : 'View salary'}
                    </button>
                    {t.status === 'ACTIVE' && (
                      <button onClick={() => handleDeactivate(t.id)} className="text-red-400 hover:text-red-300 text-xs">
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>

                {expandedTrainerId === t.id && (
                  <div className="border-t border-slate-700 p-4">
                    <SalaryPanel
                      trainerId={t.id}
                      payments={salaries[t.id] || []}
                      onMarkPaid={(paymentId) => handleMarkPaid(t.id, paymentId)}
                      onAdd={(data) => handleAddSalary(t.id, data)}
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

function SalaryPanel({
  trainerId, payments, onMarkPaid, onAdd,
}: {
  trainerId: number;
  payments: SalaryPayment[];
  onMarkPaid: (paymentId: number) => void;
  onAdd: (data: SalaryPaymentRequest) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [salaryMonth, setSalaryMonth] = useState(new Date().toISOString().slice(0, 7)); // "YYYY-MM"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ amount: Number(amount), salaryMonth });
    setShowAdd(false);
    setAmount('');
  };

  const statusColor = (status: string) =>
    status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400';

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-slate-300 font-medium">Salary payments</p>
        <button onClick={() => setShowAdd(!showAdd)} className="text-blue-400 hover:text-blue-300 text-xs">
          {showAdd ? 'Cancel' : '+ Add salary entry'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required
            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
          <input type="month" value={salaryMonth} onChange={(e) => setSalaryMonth(e.target.value)} required
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
            Add
          </button>
        </form>
      )}

      {payments.length === 0 ? (
        <p className="text-slate-500 text-sm">No salary records yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-lg px-3 py-2 flex justify-between items-center">
              <div>
                <span className="text-white text-sm">₹{p.amount}</span>
                <span className="text-slate-400 text-xs ml-2">{p.salaryMonth}</span>
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