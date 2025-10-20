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
import JobGrade from './pages/hr/settings/jobgrade/JobGrade';
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
import EmployeeDetailsPage from './components/hr/employee/EmployeeDetailsPage';
import BudgetList from './pages/finance/budgetpage/BudgetList';
import BudgetCreate from './pages/finance/budgetpage/BudgetCreate';
import GlPage from './pages/finance/generalledgerpage/GlPage';
// import BranchOverview from './pages/core/branchpage/BranchOverview';
import FiscalYearOverview from './pages/core/pageFiscYear';
// import HierarchyOverview from './pages/core/hierarchypage/HierarchyOverview';
import UserOverview from './pages/core/pageUserManagement';
import DepartmentOverview from './pages/core/pageDepartments';
import CompanyBranchesPage from './pages/core/pageCompanies';
import CompanyDetailsPage from './components/core/company/CompDetails';
import BranchesPage from './pages/core/pageBranches';
import FiscalYearHistory from './pages/core/pageFiscYearHist';
import PagePeriod from './pages/core/pagePeriod';
import PageSettings from './pages/hr/settings/pageSettings';
import JobGradeSubgrades from './pages/hr/settings/jobgrade/JobGradeSubgrades';
import PageBenefitSet from './pages/hr/settings/pageBenefitSet';
import PageEducationalQual from './pages/hr/settings/pageEducationalQual';
import PagePosition from './pages/hr/settings/position/pagePosition';
import PositionDetails from './pages/hr/settings/position/PositionDetails';


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
          {/* Root path redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public route */}
          <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />

          {/* Protected layout routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>

            {/* START MENU ROUTES */}
            <Route path="/hr" element={<Dashboard />} />
            <Route path='/inventory' element={<InventoryDashboard />} />
            <Route path='/core' element={<CoreDashboard />} />
            <Route path='/crm' element={<CRMDashboard />} />          
            <Route path='/finance' element={<Finance />} />
            <Route path='/procurement' element={<Procurement />} />
            {/* End MENU ROUTES */}

            {/* START HR ROUTES */}
            <Route path='/hr/employees/record' element={<EmployeeManagementPage />} />
            <Route path="/hr/employees/:id" element={<EmployeeDetailsPage />} />
            <Route path='/hr/settings/jobgrade' element={<JobGrade />} />
            <Route path='/hr/settings/jobgrade/:gradeId/steps' element={<JobGradeSubgrades />} />
            <Route path='/hr/employees/termination' element={<Termination />} />
            <Route path='/hr/recruitment/pipeline' element={<CandidatePipeline />} />
            <Route path='/hr/recruitment/candidates/:candidateId' element={<CandidatePipeline />} />
            <Route path='/hr/recruitment/onboarding' element={<OnBoarding />} />
            <Route path='/hr/recruitment/list' element={<RecruitmentList />} />
            <Route path='/hr/leave/list' element={<LeaveList />} />
            <Route path='/hr/leave/form' element={<LeaveRequestForm />} />
            <Route path='/hr/leave/entitlement' element={<LeaveEntitlementPage />} />
            <Route path='/hr/attendance/list' element={<AttendanceList />} />
            <Route path='/hr/shift-scheduler' element={<ShiftScheduler />} />
            <Route path='/hr/time-clock' element={<TimeClock />} />
            <Route path="/hr/attendance/form" element={<TimeClockFormContainer />} />
            <Route path='/hr/settings' element={<PageSettings />} />
            <Route path="/hr/settings/benefitset" element={<PageBenefitSet />} />
            <Route path="/hr/settings/educationqual" element={<PageEducationalQual />} />
            <Route path="/hr/settings/position" element={<PagePosition />} />
            <Route path="/hr/settings/position/:id" element={<PositionDetails />} />
            <Route path='/hr/training' element={<Training />} />
            {/* END HR ROUTES */}

            {/* START FINANCE ROUTES */}
            <Route path='/finance/gl' element={<GlPage />} />
            <Route path='/finance/budget-list' element ={<BudgetList />} />
            <Route path='/finance/budget-create' element ={<BudgetCreate />} />
            {/* End FINANCE ROUTES */}
            
            {/*sTART CORE ROUTES */}
            <Route path='/core/company/:companyId/branches' element={<CompanyBranchesPage />} />
                    <Route path="/branches" element={<BranchesPage />} />
            <Route path='/core/company' element={<CompanyBranchesPage />} />
            {/* <Route path='/core/branch' element={<BranchOverview />} /> */}
            <Route path='/core/fiscal-year' element={<FiscalYearOverview />} />
            <Route path="/core/fiscal-year/history" element={<FiscalYearHistory />} />
            <Route path="/core/fiscal-year/period-history" element={<PagePeriod />} />
            {/* <Route path='/core/hierarchy' element={<HierarchyOverview />} /> */}
            <Route path='/core/users' element={<UserOverview />} />
            <Route path="/core/department" element={<DepartmentOverview />} />
            <Route path="/core/company/:id" element={<CompanyDetailsPage />} />
          </Route>
          {/* END CORE ROUTES */}

          {/* Modules route at /menu */}
          <Route
            path="/modules"
            element={isAuthenticated ? <Modules /> : <Navigate to="/login" />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/404" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </ModuleProvider>
  );
}

export default App;