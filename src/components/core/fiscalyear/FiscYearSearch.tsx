import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="fiscal-year-search" className="sr-only">
            Search fiscal years
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fiscal-year-search"
              name="fiscal-year-search"
              type="text"
              placeholder="Search fiscal years by name, duration, or status..."
              className="block w-full md:w-1/2 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};