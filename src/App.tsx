import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Layout from './layout/layout';
import Dashboard from './pages/modules/HR';
import Modules from './pages/Modules';
import { ModuleProvider } from './ModuleContext';
import InventoryDashboard from './pages/modules/Inventory';
import CoreDashboard from './pages/modules/Core';
import Finance from './pages/modules/Finance';
import Procurement from './pages/modules/Procurement';
import JobGrade from './pages/hr/employeepage/JobGrade';
import Termination from './pages/hr/employeepage/Termination';
import CandidatePipeline from './pages/hr/recruitmentpage/CandidatePipeline';
import OnBoarding from './pages/hr/recruitmentpage/OnBoarding';
import RecruitmentList from './pages/hr/recruitmentpage/RecruitmentList';
import CRMDashboard from './pages/modules/CRM';
import EmployeeManagementPage from './pages/hr/employeepage/EmployeeRecord';
import LeaveEntitlementPage from './pages/hr/leavepage/LeaveEntitlementPage';
import LeaveList from './pages/hr/leavepage/LeaveList';
import LeaveRequestForm from './pages/hr/leavepage/LeaveRequestForm';
import Training from './pages/hr/trainingpage/Training';
import AttendanceList from './pages/hr/attendancepage/AttendanceList';
import ShiftScheduler from './pages/hr/attendancepage/ShiftScheduler';
import TimeClock from './pages/hr/attendancepage/TimeClock';
import TimeClockFormContainer from './pages/hr/attendancepage/TimeClockFormContainer';
import EmployeeDetailsPage from './components/hr/EmployeeDetailsPage';
// import TimeClockDisplay from './components/hr/TimeClockDisplay';


function App() {
const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
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
          <Route path='/crm' element={<CRMDashboard />} />          
          <Route path='/finance' element={<Finance />} />
          <Route path='/procurement' element={<Procurement />} />
          <Route path='/employees/record' element={<EmployeeManagementPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          <Route path='/employees/jobgrade' element={<JobGrade />} />
          <Route path='/employees/termination' element={<Termination />} />
          <Route path='/recruitment/pipeline' element={<CandidatePipeline />} />
          <Route path='/recruitment/candidates/:candidateId' element={<CandidatePipeline />} />
          <Route path='/recruitment/onboarding' element={<OnBoarding />} />
          <Route path='/recruitment/list' element={<RecruitmentList />} />
          <Route path='/leave/list' element={<LeaveList />} />
          <Route path='/leave/form' element={<LeaveRequestForm />} />
          <Route path='/leave/entitlement' element={<LeaveEntitlementPage />} />
          <Route path='/attendance/list' element={<AttendanceList />} />
          <Route path='/shift-scheduler' element={<ShiftScheduler />} />
          <Route path='/time-clock' element={<TimeClock />} />
          {/* <Route path="/time-display" element={<TimeClockDisplay schedule={schedule} />} /> */}
          <Route path="/attendance/form" element={<TimeClockFormContainer />} />
          
          <Route path='/training' element={<Training />} />



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
