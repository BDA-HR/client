
import { Routes, Route } from 'react-router-dom';
import CRMDashboard from './CRMDashboard';

export default function CRMRouter() {
  return (
    <Routes>
      <Route path="/" element={<CRMDashboard />} />
      <Route path="/dashboard" element={<CRMDashboard />} />
    </Routes>
  );
}