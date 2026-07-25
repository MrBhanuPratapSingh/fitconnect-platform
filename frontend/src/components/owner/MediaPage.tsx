import { useEffect, useState } from 'react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import { getMyGym } from '../../api/gymApi';
import type { Gym } from '../../api/gymApi';
import { uploadMedia, deleteMedia } from '../../api/mediaApi';

function MediaPage() {
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

  const handleAdded = () => {
    setShowForm(false);
    init();
  };

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Delete this media?')) return;
    await deleteMedia(mediaId);
    init();
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <OwnerSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Photos & videos</h1>
            <p className="text-slate-400 text-sm">{gym?.media?.length || 0} total</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            {showForm ? 'Cancel' : '+ Upload'}
          </button>
        </div>

        {showForm && <UploadMediaForm onAdded={handleAdded} />}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : !gym?.media?.length ? (
          <p className="text-slate-400">No photos or videos yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {gym.media.map((m: any) => (
              <div key={m.id} className="bg-slate-800 rounded-lg overflow-hidden">
                {m.type === 'PHOTO' ? (
                  <img src={m.url} alt="" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <video src={m.url} className="w-full h-32 object-cover" controls />
                )}
                <div className="p-2 flex justify-between items-center">
                  <span className="text-xs text-slate-400">{m.isCover ? 'Cover' : m.type}</span>
                  <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 text-xs">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadMediaForm({ onAdded }: { onAdded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [isCover, setIsCover] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    // Auto-detect type from the file's mime type
    setType(selected.type.startsWith('video') ? 'VIDEO' : 'PHOTO');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file first');
      return;
    }
    setError('');
    setSubmitting(true);
    setProgress(0);
    try {
      await uploadMedia(file, type, isCover);
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 mb-6">
      <p className="text-xs text-slate-400 mb-3">
        Choose a photo or video from your device.
      </p>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium hover:file:bg-blue-700 file:cursor-pointer"
        />

        {file && (
          <p className="text-xs text-slate-400">
            Selected: {file.name} ({type})
          </p>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isCover" checked={isCover}
            onChange={(e) => setIsCover(e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="isCover" className="text-sm text-slate-300">Set as cover photo</label>
        </div>

        <button type="submit" disabled={submitting || !file}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition w-fit">
          {submitting ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default MediaPage;