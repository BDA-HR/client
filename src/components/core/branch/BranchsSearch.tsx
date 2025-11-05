import { motion } from 'framer-motion';
import { Search, RefreshCw, X } from 'lucide-react';
import { Button } from '../../ui/button';

interface BranchSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const BranchSearch: React.FC<BranchSearchProps> = ({ 
  searchTerm, 
  onSearchChange,
  onRefresh,
  loading = false
}) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  const hasSearchTerm = searchTerm !== '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="branch-search" className="sr-only">
            Search branches
          </label>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="branch-search"
              name="branch-search"
              type="text"
              placeholder="Search branches by name, status..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {/* Clear search "X" button */}
            {hasSearchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onRefresh}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </motion.div>
  );
};