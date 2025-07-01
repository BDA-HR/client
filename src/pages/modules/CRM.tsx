import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import LeadOverview from '../../components/crm/LeadOverview';
import ContactOverview from '../../components/crm/ContactOverview';
import SalesOverview from '../../components/crm/SalesOverview';
import MarketingOverview from '../../components/crm/MarketingOverview';
import SupportOverview from '../../components/crm/SupportOverview';
import ActivityOverview from '../../components/crm/ActivityOverview';
import AnalyticsOverview from '../../components/crm/AnalyticsOverview';
import { useModule } from '../../ModuleContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
};

export default function CRMDashboard() {
  const { activeModule } = useModule();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <section className="mb-6 flex flex-col sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeModule === 'CRM'
              ? <>CRM Module <span className="text-orange-600">Dashboard</span></>
              : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage leads, contacts, sales, marketing, support, and more.
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button size="sm">
            <Plus size={16} /> New Entry
          </Button>
        </div>
      </section>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadOverview />
        <ContactOverview />
        <SalesOverview />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <MarketingOverview />
        <SupportOverview />
        <ActivityOverview />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6">
        <AnalyticsOverview />
      </motion.div>
    </motion.div>
  );
}
