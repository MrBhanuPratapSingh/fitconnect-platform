import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import { getReviews, getRatingSummary } from '../../api/reviewApi';
import type { Review, RatingSummary } from '../../api/reviewApi';

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const gymRes = await getMyGym();
      const gymId = gymRes.data.id;

      const [reviewsRes, summaryRes] = await Promise.all([
        getReviews(gymId),
        getRatingSummary(gymId),
      ]);

      setReviews(reviewsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Reviews</h1>
            <p className="text-slate-400 text-sm">{summary?.totalReviews || 0} total</p>
          </div>
          {summary && summary.totalReviews > 0 && (
            <div className="text-right">
              <p className="text-2xl font-semibold text-white">{summary.averageRating.toFixed(1)} ★</p>
              <p className="text-slate-400 text-xs">average rating</p>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-400">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-medium">{review.userName}</span>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                {review.comment && <p className="text-slate-300 text-sm">{review.comment}</p>}
                <p className="text-slate-500 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;