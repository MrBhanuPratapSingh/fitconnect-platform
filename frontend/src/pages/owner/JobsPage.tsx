import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import type { Gym } from '../../api/gymApi';
import { getMyJobs, createJob, closeJob, getApplicationsForJob, updateApplicationStatus } from '../../api/jobApi';
import type { JobPost, JobPostCreateRequest, JobApplication } from '../../api/jobApi';

function JobsPage() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Record<number, JobApplication[]>>({});

  useEffect(() => { init(); }, []);

const init = async () => {
  try {
    const gymRes = await getMyGym();
    setGym(gymRes.data);
    const jobsRes = await getMyJobs(gymRes.data.id);
    setJobs(jobsRes.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleCreated = (job: JobPost) => {
    setJobs([...jobs, job]);
    setShowForm(false);
  };

 const handleClose = async (jobId: number) => {
  if (!gym || !confirm('Close this job post?')) return;
  await closeJob(gym.id, jobId);
  setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'CLOSED' } : j));
};

const toggleApplications = async (jobId: number) => {
  if (!gym) return;
  if (expandedJobId === jobId) {
    setExpandedJobId(null);
    return;
  }
  setExpandedJobId(jobId);
  if (!applications[jobId]) {
    const res = await getApplicationsForJob(gym.id, jobId);
    setApplications({ ...applications, [jobId]: res.data });
  }
};

 const handleStatusUpdate = async (jobId: number, applicationId: number, status: string) => {
  if (!gym) return;
  await updateApplicationStatus(gym.id, applicationId, status);
  setApplications({
    ...applications,
    [jobId]: applications[jobId].map(a => a.id === applicationId ? { ...a, status } : a),
  });
};

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Job posts</h1>
            <p className="text-slate-400 text-sm">{jobs.length} total</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {showForm ? 'Cancel' : '+ Post a job'}
          </button>
        </div>

        {showForm && gym && <CreateJobForm gym={gym} onCreated={handleCreated} />}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-slate-400">No job posts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{job.title}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      ₹{job.salary}/mo · {job.employmentType.replace('_', ' ')} · {job.applicantCount} applicants
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      job.status === 'OPEN' ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/30 text-slate-400'
                    }`}>{job.status}</span>
                    <button onClick={() => toggleApplications(job.id)} className="text-blue-400 hover:text-blue-300 text-xs">
                      {expandedJobId === job.id ? 'Hide applicants' : 'View applicants'}
                    </button>
                    {job.status === 'OPEN' && (
                      <button onClick={() => handleClose(job.id)} className="text-red-400 hover:text-red-300 text-xs">
                        Close
                      </button>
                    )}
                  </div>
                </div>

                {expandedJobId === job.id && (
                  <div className="mt-4 border-t border-slate-700 pt-4">
                    {!applications[job.id] || applications[job.id].length === 0 ? (
                      <p className="text-slate-500 text-sm">No applicants yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {applications[job.id].map((app) => (
                          <div key={app.id} className="bg-slate-900 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="text-white text-sm">{app.applicantName}</p>
                              <p className="text-slate-400 text-xs">{app.applicantEmail} · {app.applicantPhone}</p>
                            </div>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusUpdate(job.id, app.id, e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                            >
                              <option value="APPLIED">Applied</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="REJECTED">Rejected</option>
                              <option value="HIRED">Hired</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
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

function CreateJobForm({ gym, onCreated }: { gym: Gym; onCreated: (j: JobPost) => void }) {
  const [form, setForm] = useState<JobPostCreateRequest>({
    gymName: gym.name,
    gymAddress: gym.address,
    gymLatitude: gym.latitude ?? undefined,
    gymLongitude: gym.longitude ?? undefined,
    title: '',
    description: '',
    salary: 0,
    employmentType: 'FULL_TIME',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSubmitting(true);
  try {
    const res = await createJob(gym.id, form);
    onCreated(res.data);
  } catch (err: any) {
    setError(err.response?.data?.error || 'Failed to create job post');
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Job title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
            placeholder="e.g. Strength Trainer"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Salary (₹/month)</label>
          <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Employment type</label>
          <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-slate-400 block mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2">
          <button type="submit" disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {submitting ? 'Posting...' : 'Post job'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobsPage;