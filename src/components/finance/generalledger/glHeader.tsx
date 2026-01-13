import { motion } from 'framer-motion';

export const GlHeader = () => {
  return (
    <div>
      <div className="w-full mx-auto flex justify-between items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 bg-clip-text text-transparent mr-2">
              General 
            </span>
            Ledger
          </h1>
        </motion.div>
      </div>
    </div>
  );
};