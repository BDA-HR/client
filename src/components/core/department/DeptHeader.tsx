import { motion } from 'framer-motion';
import AddDeptModal from './AddDeptModal';
import type { AddDeptDto } from '../../../types/core/dept';

interface DepartmentManagementHeaderProps {
  onAddDepartment: (department: AddDeptDto) => void;
  branchId: string;
}

const DepartmentManagementHeader: React.FC<DepartmentManagementHeaderProps> = ({ 
  onAddDepartment, 
  branchId 
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex space-y-2 justify-between items-center"
    >
      <h1 className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent text-3xl font-bold">
        Departments
      </h1>
      <AddDeptModal 
        onAddDepartment={onAddDepartment} 
        branchId={branchId} 
      />
    </motion.div>
  );
};

export default DepartmentManagementHeader;