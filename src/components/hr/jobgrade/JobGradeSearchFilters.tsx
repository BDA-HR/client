import React from 'react';
import { motion } from 'framer-motion';
import { Search, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { JobGradeListDto } from '../../../types/hr/jobgrade';

interface JobGradeSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    minSalary: number | '';
    maxSalary: number | '';
  };
  setFilters: (filters: any) => void;
  jobGrades: JobGradeListDto[];
  onAddClick: () => void;
}

const JobGradeSearchFilters: React.FC<JobGradeSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  onAddClick,
}) => {
  const handleSalaryFilterChange = (field: 'minSalary' | 'maxSalary', value: string) => {
    setFilters({
      ...filters,
      [field]: value === '' ? '' : Number(value),
    });
  };

  const clearFilters = () => {
    setFilters({
      minSalary: '',
      maxSalary: '',
    });
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
          <label htmlFor="jobgrade-search" className="sr-only">
            Search job grades
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="jobgrade-search"
              name="jobgrade-search"
              placeholder="Search job grades by name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🎚 Filters + Add Button */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
          {/* Salary Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              placeholder="Min Salary"
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={filters.minSalary}
              onChange={(e) => handleSalaryFilterChange('minSalary', e.target.value)}
            />
            <span className="hidden sm:block text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max Salary"
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={filters.maxSalary}
              onChange={(e) => handleSalaryFilterChange('maxSalary', e.target.value)}
            />

            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap mt-2 sm:mt-0"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>

          {/* ➕ Add Job Grade Button */}
          <Button
            onClick={onAddClick}
            size="sm"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto cursor-pointer">
            <BadgePlus className="h-4 w-4" />
            Add Job Grade
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobGradeSearchFilters;
