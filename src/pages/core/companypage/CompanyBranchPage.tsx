import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import CompSection from '../../../components/core/company/CompSection';
import AddHierarchy from '../../../components/core/company/HierSection';

const CompanyBranchesPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const handleViewBranches = () => {
    navigate(`/branches?companyId=${companyId}`);
  };


  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      ></motion.div>
        <>
          <CompSection />
          <Button 
              onClick={handleViewBranches}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              View All Branches
            </Button>
          <div className="pt-6">
            <AddHierarchy />
          </div>
        </>
    </div>
  );
};

export default CompanyBranchesPage;