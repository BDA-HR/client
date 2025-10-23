import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../../ui/button';
import type { EmployeeListDto } from '../../../types/hr/employee';

interface EmployeeSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    department: string;
    status: string;
    employmentType: string;
  };
  setFilters: (filters: any) => void;
  employees: EmployeeListDto[];
  onRefresh?: () => void;
  loading?: boolean;
}

const EmployeeSearchFilters: React.FC<EmployeeSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  employees,
  // onRefresh,
  // loading = false
}) => {
  const navigate = useNavigate();
  
  // Extract unique values for filter dropdowns from actual data
  // const departments = [...new Set(employees.map(emp => emp.department))];
  const employmentTypes = [...new Set(employees.map(emp => emp.employmentType))];

  const handleAddEmployee = () => {
    navigate('/hr/employees/record/Add');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const hasSearchTerm = searchTerm !== '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* 🔍 Search Input - Takes full width on mobile, left on desktop */}
        <div className="w-full lg:flex-1">
          <div className="relative w-full max-w-md">
            <label htmlFor="employee-search" className="sr-only">
              Search Employees
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="employee-search"
              name="employee-search"
              type="text"
              placeholder="Search employees by name, code, department, position..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  <span className="sr-only">Clear search</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🎚 Filters and Actions Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              {/* <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 cursor-pointer min-w-[140px]"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select> */}
            </div>
            
            <select
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 cursor-pointer min-w-[140px]"
              value={filters.employmentType}
              onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
            >
              <option value="">All Employment Types</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100 whitespace-nowrap w-full sm:w-auto"
              onClick={() => setFilters({ 
                department: '', 
                status: '', 
                employmentType: '' 
              })}
            >
              Clear Filters
            </Button>
            
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100 whitespace-nowrap w-full sm:w-auto"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )} */}
            
            <Button
              onClick={handleAddEmployee}
              size="sm"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto"
            >
              Add Employee
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeSearchFilters;