import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface FiscYearSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const FiscYearSearch: React.FC<FiscYearSearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-6 bg-white p-3 rounded shadow-md"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search fiscal years by name, duration, or status..."
          className="pl-10 pr-4 py-2 w-1/2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};