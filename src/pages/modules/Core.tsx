import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import BranchOverview from '../../components/core/BranchOverview';
import DepartmentOverview from '../../components/core/DepartmentOverview';
import FiscalYearOverview from '../../components/core/FiscalYearOverview';
import HierarchyOverview from '../../components/core/HierarchyOverview';
import UserOverview from '../../components/core/UserOverview';
import { useModule } from '../../ModuleContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 }}
};

export default function CoreDashboard() {
  const { activeModule } = useModule();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <section className="mb-6 flex flex-col sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeModule === 'Core'
              ? <>Core Module <span className="text-emerald-600">Dashboard</span></>
              : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your branches, departments, fiscal years, hierarchy, and users.
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button size="sm">
            <Plus size={16} /> New
          </Button>
        </div>
      </section>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BranchOverview />
        <DepartmentOverview />
        <FiscalYearOverview />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <HierarchyOverview />
        <UserOverview />
      </motion.div>
    </motion.div>
  );
}
