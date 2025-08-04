import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BranchOverviewCard from '../../../components/core/BranchOverviewCard';
import BranchTabs from '../../../components/core/BranchTabs';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { companies } from '../../../data/company';
import AddCompanyForm from '../../../components/core/AddCompanyForm';
const CompanyBranchesPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [currentBranchId, setCurrentBranchId] = useState<number>(1);
  
  const company = companies.find(c => c.id === Number(companyId)) || companies[0];
  const branchDetails = company.branches.find(b => b.id === currentBranchId) || company.branches[0];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{company.name} - <span className='bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent'>Branches</span></h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Manage branch operations, users, inventory, and financial accounts
          </motion.p>
        </div>
        <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
          <Plus size={16} />
          <span>New Branch</span>
        </Button>
      </motion.div>

      <BranchOverviewCard 
        currentBranchId={currentBranchId} 
        setCurrentBranchId={setCurrentBranchId} 
        branches={company.branches}
      />
      <AddCompanyForm />

      <BranchTabs branch={branchDetails} />
    </div>
  );
};

export default CompanyBranchesPage;