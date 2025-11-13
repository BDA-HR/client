import { motion } from 'framer-motion';
import { BadgePlus, History } from 'lucide-react';
import { DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';

export const PubHolidayHeader = ({ 
  setDialogOpen, 
  totalItems,
}: { 
  setDialogOpen: (open: boolean) => void;
  totalItems?: number;
}) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate('/core/fiscal-year/public-holiday-history');
  };

  return (
    <div className="p-2">
      <div className="w-full mx-auto flex justify-between items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent mr-2">
              Public
            </span>
            Holidays
          </h1>
          {totalItems !== undefined && (
            <p className="text-sm text-gray-600">
              {totalItems} holiday{totalItems !== 1 ? 's' : ''} this year
            </p>
          )}
        </motion.div>
        
        <div className="flex items-center gap-3">
          {/* Add Public Holiday Button */}
          <DialogTrigger asChild>
            <Button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-md text-white flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => setDialogOpen(true)}
            >
              <BadgePlus size={18} />
              <span>Add Holiday</span>
            </Button>
          </DialogTrigger>
          
          {/* View History Button */}
          <Button
            onClick={handleViewHistory}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-all duration-200"
          >
            <History size={18} />
            <span>View History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};