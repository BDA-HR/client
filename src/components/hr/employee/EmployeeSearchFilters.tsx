import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import AddEmployeeModal from './AddEmployeeModal';
import type { Employee } from '../../../types/employee';

interface EmployeeSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    department: string;
    status: string;
    contractType: string;
  };
  setFilters: (filters: any) => void;
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const EmployeeSearchFilters: React.FC<EmployeeSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  employees,
  onAddEmployee,
  onRefresh,
  loading = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Extract unique values for filter dropdowns
  const departments = [...new Set(employees.map(emp => emp.department))];
  const statuses = ['active', 'on-leave'];
  const contractTypes = ['Full-time', 'Part-time', 'Freelance', 'Internship'];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Section */}
          <div className="flex-1">
            <label htmlFor="employee-search" className="sr-only">
              Search employees
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="employee-search"
                name="employee-search"
                type="text"
                placeholder="Search employees by name, department, position..."
                className="block w-full md:w-3/4 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters and Actions Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'active' ? 'Active' : 'On Leave'}
                  </option>
                ))}
              </select>
              
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                value={filters.contractType}
                onChange={(e) => setFilters({...filters, contractType: e.target.value})}
              >
                <option value="">All Contracts</option>
                {contractTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setFilters({ 
                  department: '', 
                  status: '', 
                  contractType: '' 
                })}
              >
                Clear Filters
              </Button>
              
              {onRefresh && (
                <Button
                  onClick={onRefresh}
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:from-green-600 hover:to-emerald-600 shadow-sm flex items-center gap-2"
              >
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={onAddEmployee}
      />
    </>
  );
};

export default EmployeeSearchFilters;