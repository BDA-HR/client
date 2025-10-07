import { motion } from 'framer-motion';
import { BadgePlus, History } from 'lucide-react';
import { DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';

export const FiscalYearManagementHeader = ({ 
  setDialogOpen, 
  onViewHistory,
  totalItems 
}: { 
  setDialogOpen: (open: boolean) => void;
  onViewHistory: () => void;
  totalItems: number;
}) => {
  return (
    <div className="p-2">
      <div className="w-full mx-auto flex justify-between items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent mr-2">
              Fiscal 
            </span>
            Year
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-3">
          {/* Add Fiscal Year Button */}
          <DialogTrigger asChild>
            <Button
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              <BadgePlus size={18} />
              <span>Add Fiscal Year</span>
            </Button>
          </DialogTrigger>
                    {/* View History Button */}
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer border-emerald-200"
          >
            <History size={18} />
            <span>View History ({totalItems})</span>
          </Button>

        </div>
      </div>
    </div>
  );
};