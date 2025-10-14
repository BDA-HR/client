import React from 'react';
import { motion } from 'framer-motion';
import { Search, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { BenefitSetListDto } from '../../../types/hr/benefit';

interface BenefitSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  benefitSets: BenefitSetListDto[];
  onAddClick: () => void;
}

const BenefitSearchFilters: React.FC<BenefitSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  onAddClick,
}) => {
  const clearFilters = () => {
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 flex-wrap">
        {/* 🔍 Search Input */}
        <div className="w-full lg:flex-1">
          <label htmlFor="benefit-search" className="sr-only">
            Search benefit sets
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="benefit-search"
              name="benefit-search"
              placeholder="Search benefit sets by name..."
              className="block w-1/2 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearFilters}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ➕ Add Benefit Set Button */}
        <div className="flex w-full lg:w-auto">
          <Button
            onClick={onAddClick}
            size="sm"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full lg:w-auto cursor-pointer"
          >
            <BadgePlus className="h-4 w-4" />
            Add Benefit Set
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BenefitSearchFilters;