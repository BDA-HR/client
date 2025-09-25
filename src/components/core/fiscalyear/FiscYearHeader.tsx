import { motion } from 'framer-motion';
import { BadgePlus } from 'lucide-react';
import { DialogTrigger } from '../../ui/dialog';

export const FiscalYearManagementHeader = ({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
        initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">
  <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent mr-2">
    Fiscal 
  </span>
  Year
</h1>
        </motion.div>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <BadgePlus size={18} />
            <span>Add Fiscal Year</span>
          </motion.button>
        </DialogTrigger>
      </div>
    </div>
  );
};