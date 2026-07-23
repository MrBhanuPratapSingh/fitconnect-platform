import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { getPublicGym } from '../../api/publicGymApi';
import { getReviews, getRatingSummary } from '../../api/reviewApi';
import type { Review, RatingSummary } from '../../api/reviewApi';
import type { GymPublicResponse } from '../../types/gym';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

function GymProfilePage() {
  const { gymId } = useParams<{ gymId: string }>();
  const [gym, setGym] = useState<GymPublicResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => { init(); }, [gymId]);

  const init = async () => {
    if (!gymId) return;
    setLoading(true);
    try {
      const id = Number(gymId);
      const [gymRes, reviewsRes, summaryRes] = await Promise.all([
        getPublicGym(id),
        getReviews(id),
        getRatingSummary(id),
      ]);
      setGym(gymRes.data);
      setReviews(reviewsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (review: Review) => {
    setReviews([review, ...reviews]);
    setShowReviewForm(false);
    init(); // refresh summary too
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-900">
        <UserSidebar />
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen flex bg-slate-900">
        <UserSidebar />
        <div className="flex-1 flex items-center justify-center text-slate-400">Gym not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      <UserSidebar />
      <div className="flex-1 p-8 max-w-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">{gym.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{gym.address}</p>
            {summary && summary.totalReviews > 0 && (
              <p className="text-yellow-400 text-sm mt-2">
                {summary.averageRating.toFixed(1)} ★ <span className="text-slate-400">({summary.totalReviews} reviews)</span>
              </p>
            )}
          </div>
          <button onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {showReviewForm ? 'Cancel' : 'Write a review'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <InfoCard label="Timing" value={gym.openingTime && gym.closingTime ? `${gym.openingTime.slice(0,5)} - ${gym.closingTime.slice(0,5)}` : '—'} />
          <InfoCard label="Fee" value={gym.feePlans[0] ? `₹${gym.feePlans[0].amount}/mo` : '—'} />
          <InfoCard label="Contact" value={gym.contactPhone || '—'} />
          <InfoCard label="Since" value={gym.establishedYear?.toString() || '—'} />
        </div>

        {gym.description && (
          <div className="mb-6">
            <p className="text-white font-medium mb-1">About</p>
            <p className="text-slate-300 text-sm leading-relaxed">{gym.description}</p>
          </div>
        )}

        {gym.achievements.length > 0 && (
          <div className="mb-6">
            <p className="text-white font-medium mb-2">Achievements</p>
            <div className="flex gap-2 flex-wrap">
              {gym.achievements.map((a) => (
                <span key={a.id} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                  {a.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {showReviewForm && gymId && (
          <ReviewForm gymId={Number(gymId)} onSubmitted={handleReviewSubmitted} />
        )}

        <div>
          <p className="text-white font-medium mb-3">Reviews</p>
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">{review.userName}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  {review.comment && <p className="text-slate-300 text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function ReviewForm({ gymId, onSubmitted }: { gymId: number; onSubmitted: (r: Review) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // review-service needs userId + userName in the body (no auth context there yet)
      const res = await axiosClient.post(`/api/gyms/${gymId}/reviews`, {
        userId: 1, // placeholder — replaced below once we wire real user id
        userName: user?.fullName || 'Anonymous',
        rating,
        comment,
      });
      onSubmitted(res.data as Review);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="text-xs text-slate-400 block mb-1">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-3">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
        </select>
        <label className="text-xs text-slate-400 block mb-1">Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm mb-3" />
        <button type="submit" disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          {submitting ? 'Submitting...' : 'Submit review'}
        </button>
      </form>
    </div>
  );
}

export default GymProfilePage;