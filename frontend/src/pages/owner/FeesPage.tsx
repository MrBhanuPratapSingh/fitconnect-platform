import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import type { Gym } from '../../api/gymApi';
import { addFeePlan, deleteFeePlan } from '../../api/feePlanApi';
import type { FeePlan, FeePlanRequest } from '../../api/feePlanApi';

function FeesPage() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const res = await getMyGym();
      setGym(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdded = (plan: FeePlan) => {
    if (gym) setGym({ ...gym, feePlans: [...gym.feePlans, plan] });
    setShowForm(false);
  };

  const handleDelete = async (planId: number) => {
    if (!gym || !confirm('Delete this fee plan?')) return;
    await deleteFeePlan(planId);
    setGym({ ...gym, feePlans: gym.feePlans.filter((p: any) => p.id !== planId) });
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Fee plans</h1>
            <p className="text-slate-400 text-sm">{gym?.feePlans?.length || 0} total</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {showForm ? 'Cancel' : '+ Add fee plan'}
          </button>
        </div>

        {showForm && <AddFeePlanForm onAdded={handleAdded} />}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : !gym?.feePlans?.length ? (
          <p className="text-slate-400">No fee plans yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {gym.feePlans.map((plan: any) => (
              <div key={plan.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{plan.planName}</p>
                    <p className="text-slate-400 text-xs">{plan.billingCycle}</p>
                  </div>
                  <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-300 text-xs">
                    Delete
                  </button>
                </div>
                <p className="text-2xl font-semibold text-white mt-3">₹{plan.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddFeePlanForm({ onAdded }: { onAdded: (p: FeePlan) => void }) {
  const [form, setForm] = useState<FeePlanRequest>({ planName: '', amount: 0, billingCycle: 'MONTHLY' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await addFeePlan(form);
      onAdded(res.data as FeePlan);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add fee plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Plan name</label>
          <input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} required
            placeholder="e.g. Monthly"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Billing cycle</label>
          <select value={form.billingCycle} onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div className="col-span-3">
          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {submitting ? 'Adding...' : 'Add fee plan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FeesPage;