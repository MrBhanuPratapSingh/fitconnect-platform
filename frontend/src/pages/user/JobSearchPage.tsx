import { useEffect, useState } from 'react';
import UserSidebar from '../../components/user/UserSidebar';
import { searchJobs, applyToJob } from '../../api/jobSearchApi';
import type { JobPostPublic } from '../../api/jobSearchApi';
import { getRatingSummary } from '../../api/reviewApi';
import { useAuth } from '../../context/AuthContext';

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface JobWithExtras extends JobPostPublic {
  distanceKm: number | null;
  gymRating: number;
}

function JobSearchPage() {
  const [allJobs, setAllJobs] = useState<JobWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState(''); // only updates on Search click/Enter
  const [minSalary, setMinSalary] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'salary' | 'rating' | 'newest'>('newest');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(null)
    );
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await searchJobs();
      const jobs = res.data;

      const uniqueGymIds = [...new Set(jobs.map((j) => j.gymId))];
      const ratingMap = new Map<number, number>();

      await Promise.all(
        uniqueGymIds.map(async (gymId) => {
          try {
            const summaryRes = await getRatingSummary(gymId);
            ratingMap.set(gymId, summaryRes.data.averageRating);
          } catch {
            ratingMap.set(gymId, 0);
          }
        })
      );

      const enriched: JobWithExtras[] = jobs.map((job) => ({
        ...job,
        distanceKm: null,
        gymRating: ratingMap.get(job.gymId) ?? 0,
      }));

      setAllJobs(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(keywordInput);
  };

  const handleApply = async (jobId: number) => {
    if (!user) return;
    try {
      await applyToJob(jobId, {
        applicantUserId: user.id,
        applicantName: user.fullName,
        applicantEmail: user.email,
      });
      setAppliedJobIds(new Set([...appliedJobIds, jobId]));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply');
    }
  };

  const visibleJobs = allJobs
    .map((job) => ({
      ...job,
      distanceKm:
        userLocation && job.gymLatitude != null && job.gymLongitude != null
          ? distanceKm(userLocation.lat, userLocation.lng, job.gymLatitude, job.gymLongitude)
          : null,
    }))
    .filter((job) => {
      if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()) &&
          !job.gymName.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
      if (minSalary && job.salary < Number(minSalary)) return false;
      if (minRating && job.gymRating < Number(minRating)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'salary') return b.salary - a.salary;
      if (sortBy === 'rating') return b.gymRating - a.gymRating;
      if (sortBy === 'distance') {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });

  return (
    <div className="min-h-screen flex bg-slate-900">
      <UserSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Find training jobs</h1>
        <p className="text-slate-400 text-sm mb-6">
          {visibleJobs.length} open position{visibleJobs.length !== 1 ? 's' : ''} from all gyms
          {userLocation ? ' · using your location' : ''}
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6 flex-wrap">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
            <option value="newest">Sort: Newest</option>
            <option value="distance">Sort: Distance</option>
            <option value="salary">Sort: Salary</option>
            <option value="rating">Sort: Gym rating</option>
          </select>
          <input
            type="number"
            placeholder="Min salary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
          />
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
            <option value="">Any gym rating</option>
            <option value="3">3 stars and up</option>
            <option value="4">4 stars and up</option>
            <option value="4.5">4.5 stars and up</option>
          </select>
          <input
            placeholder="Search by job title or gym"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="flex-1 min-w-[180px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : visibleJobs.length === 0 ? (
          <p className="text-slate-400">No jobs match your filters.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleJobs.map((job) => {
              const alreadyApplied = appliedJobIds.has(job.id);
              return (
                <div key={job.id} className="bg-slate-800 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{job.title}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {job.gymName} · {job.gymAddress}
                      {job.distanceKm != null && ` · ${job.distanceKm} km away`}
                      {job.gymRating > 0 && ` · ${job.gymRating.toFixed(1)} ★`}
                    </p>
                    <p className="text-slate-300 text-sm mt-2">
                      ₹{job.salary}/mo · {job.employmentType.replace('_', ' ')}
                    </p>
                    {job.description && (
                      <p className="text-slate-400 text-xs mt-2 max-w-md">{job.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={alreadyApplied}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
                  >
                    {alreadyApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSearchPage;