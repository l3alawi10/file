import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/sections/LandingPage';
import AdminDashboard from '@/sections/AdminDashboard';
import VerificationPage from '@/sections/VerificationPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/verify/:token" element={<VerificationPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
