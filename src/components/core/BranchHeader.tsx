import { motion } from 'framer-motion';

const BranchHeader = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="flex flex-col"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
      >
        Branch <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">Management</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400"
      >
        Manage branch operations, users, inventory, and financial accounts
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

export default BranchHeader;