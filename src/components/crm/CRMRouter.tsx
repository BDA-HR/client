
import { Routes, Route } from 'react-router-dom';
import CRMDashboard from './CRMDashboard';
import ContactManagement from "./contactManagement/ContactManagement";
import SalesManagement from "./salesManagement/SalesManagement";
import MarketingAutomation from "./marketingAutomation/MarketingAutomation";
import CustomerSupport from "./customerSupport/CustomerSupport";
import ActivityManagement from "./activityManagement/ActivityManagement";
import AnalyticsReporting from "./analytics/AnalyticsReporting";
import LeadManagement from '../../pages/crm/LeadManagement';

export default function CRMRouter() {
  return (
    <Routes>
      <Route path="/" element={<CRMDashboard />} />
      <Route path="/dashboard" element={<CRMDashboard />} />
      <Route path="/leads" element={<LeadManagement />} />
      <Route path="/contacts" element={<ContactManagement />} />
      <Route path="/sales" element={<SalesManagement />} />
      <Route path="/marketing" element={<MarketingAutomation />} />
      <Route path="/support" element={<CustomerSupport />} />
      <Route path="/activities" element={<ActivityManagement />} />
      <Route path="/analytics" element={<AnalyticsReporting />} />
    </Routes>
  );
}