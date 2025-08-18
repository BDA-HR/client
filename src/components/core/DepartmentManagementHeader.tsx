import { motion } from 'framer-motion';

const DepartmentManagementHeader = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-2"
    >
      <h1 className="text-3xl font-bold text-gray-800">
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">Department
          </span> Management</h1>
      <p className="text-gray-600">
        Manage all departments, their status, and team members
      </p>
    </motion.div>
  );
};

export default DepartmentManagementHeader;