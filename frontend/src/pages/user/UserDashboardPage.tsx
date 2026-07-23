import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { searchGyms } from '../../api/searchApi';
import type { GymSearchResult, SearchParams } from '../../api/searchApi';

function UserDashboardPage() {
  const [gyms, setGyms] = useState<GymSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'fee' | 'rating'>('distance');
  const [maxFee, setMaxFee] = useState('');
  const [minRating, setMinRating] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get the user's location for distance sorting — falls back gracefully if denied
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(null)
    );
  }, []);

  useEffect(() => {
    runSearch();
  }, [userLocation]);

  const runSearch = async () => {
    setLoading(true);
    try {
      const params: SearchParams = {
        keyword: keyword || undefined,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        maxFee: maxFee ? Number(maxFee) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        sortBy,
      };
      const res = await searchGyms(params);
      setGyms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <UserSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Find gyms near you</h1>
        <p className="text-slate-400 text-sm mb-6">
          {userLocation ? 'Using your current location' : 'Enable location for distance sorting'}
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6 flex-wrap">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
            <option value="distance">Sort: Distance</option>
            <option value="fee">Sort: Fee</option>
            <option value="rating">Sort: Rating</option>
          </select>
          <input type="number" placeholder="Max fee" value={maxFee} onChange={(e) => setMaxFee(e.target.value)}
            className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
            <option value="">Any rating</option>
            <option value="3">3 stars and up</option>
            <option value="4">4 stars and up</option>
            <option value="4.5">4.5 stars and up</option>
          </select>
          <input placeholder="Search by gym name" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 min-w-[180px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : gyms.length === 0 ? (
          <p className="text-slate-400">No gyms found. Try adjusting your filters.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {gyms.map((gym) => (
              <Link
                key={gym.id}
                to={`/user/gyms/${gym.id}`}
                className="bg-slate-800 rounded-lg p-4 flex justify-between items-center hover:bg-slate-700/70 transition"
              >
                <div>
                  <p className="text-white font-medium">{gym.name}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {gym.distanceKm != null && `${gym.distanceKm} km away · `}
                    {gym.lowestFee != null ? `₹${gym.lowestFee}/mo · ` : ''}
                    {gym.averageRating.toFixed(1)} ★ ({gym.totalReviews})
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{gym.address}</p>
                </div>
                <span className="text-blue-400 text-sm">View →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboardPage;