import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface BenefitSetHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onRefresh: () => void;
  onAddBenefitSet: () => void;
  loading?: boolean;
}

const BenefitSetHeader: React.FC<BenefitSetHeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  onAddBenefitSet,
  loading = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-green-100 p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-50 mr-4">
            <DollarSign className="text-green-600" size={24} />
          </div>
           <h1 className="text-2xl font-bold text-green-600">Benefit Sets</h1>

        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search benefit sets..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg p-1 bg-white">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={onRefresh}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={onAddBenefitSet}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:from-green-600 hover:to-emerald-600 shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Benefit Set
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Search icon component
const Search: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
);

export default BenefitSetHeader;