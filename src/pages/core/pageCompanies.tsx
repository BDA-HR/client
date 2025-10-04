import { motion } from 'framer-motion';
import CompSection from '../../components/core/company/CompSection';
import AllBranchs from '../../components/core/company/AllBranches';
const CompanyBranchesPage = () => {


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
          
          {/* Add the AllBranchs component */}
          <AllBranchs />       
          <div className="pt-6">
            {/* <AddHierarchy /> */}
          </div>
        </>
    </div>
  );
};

export default CompanyBranchesPage;