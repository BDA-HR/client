import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Layout from './layout/layout';
import Dashboard from './pages/modules/Dashboard';
import Modules from './pages/Modules';
import { ModuleProvider } from './ModuleContext';
import InventoryDashboard from './pages/modules/Inventory';
import CoreDashboard from './pages/modules/Core';
import CRM from './pages/modules/CRM';
import Finance from './pages/modules/Finance';
import Procurement from './pages/modules/Procurement';
import EmployeeRecord from './pages/hr/employeepage/EmployeeRecord';
import JobGrade from './pages/hr/employeepage/JobGrade';
import Termination from './pages/hr/employeepage/Termination';
import CandidatePipeline from './pages/hr/recruitmentpage/CandidatePipeline';
import OnBoarding from './pages/hr/recruitmentpage/OnBoarding';
import RecruitmentPlan from './pages/hr/recruitmentpage/RecruitmentPlan';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ModuleProvider>
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />

        {/* Protected layout routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/inventory' element={<InventoryDashboard />} />
          <Route path='/core' element={<CoreDashboard />} />
          <Route path='/crm' element={<CRM />} />          
          <Route path='/finance' element={<Finance />} />
          <Route path='/procurement' element={<Procurement />} />
          <Route path='/employees/record' element={<EmployeeRecord />} />
          <Route path='/employees/jobgrade' element={<JobGrade />} />
          <Route path='/employees/termination' element={<Termination />} />
          <Route path='/recruitment/pipeline' element={<CandidatePipeline />} />
          <Route path='/recruitment/onboarding' element={<OnBoarding />} />
          <Route path='/recruitment/plan' element={<RecruitmentPlan />} />
        </Route>

        {/* Standalone protected route without layout (Modules) */}
        <Route
          path="/"
          element={isAuthenticated ? <Modules /> : <Navigate to="/login" />}
          index
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ModuleProvider>
  );
}

export default App;
