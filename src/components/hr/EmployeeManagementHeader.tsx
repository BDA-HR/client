import { motion } from 'framer-motion';

const EmployeeManagementHeader = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex flex-col"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-900"
      >
         <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Employee</span> Management
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600"
      >
        View and manage employee records
      </motion.p>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      duration: 0.5
    }
  }
};

export default EmployeeManagementHeader;