import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

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
}

const EmployeeSearchFilters: React.FC<EmployeeSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  employees
}) => {
  const departments = [...new Set(employees.map(emp => emp.department))];
  const statuses = ['active', 'on-leave'];
  const contractTypes = ['Full-time', 'Part-time', 'Freelance', 'Internship'];

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm p-4 md:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-sm"
          >
            Add New Employee
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative flex-1"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <Input
              type="text"
              className="pl-10 bg-white"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="text-sm border rounded-md px-3 py-2 bg-white"
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
            className="text-sm border rounded-md px-3 py-2 bg-white"
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
            className="text-sm border rounded-md px-3 py-2 bg-white"
            value={filters.contractType}
            onChange={(e) => setFilters({...filters, contractType: e.target.value})}
          >
            <option value="">All Contracts</option>
            {contractTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:bg-green-50"
            onClick={() => setFilters({ department: '', status: '', contractType: '' })}
          >
            Clear
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15,
      duration: 0.5
    }
  }
};

type Employee = {
  id: string;
  name: string;
  email: string;
  payroll: string;
  department: string;
  role: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  status: "active" | "on-leave";
};

export default EmployeeSearchFilters;