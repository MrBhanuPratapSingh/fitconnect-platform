import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl">Home page coming soon</div>} />
      <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-2xl">Login page coming soon</div>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;