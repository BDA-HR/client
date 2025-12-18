import React, { useState } from 'react';
import { BadgePlus, Search, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface EmployeeSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchEmployee: () => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearchEmployee,
}) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Validate code input - only allow 10 alphanumeric characters
  const validateCode = (code: string): boolean => {
    if (code === "") return true; 
    return /^[a-zA-Z0-9]{0,10}$/.test(code); 
  };

  const handleInputChange = (value: string) => {
    // Only allow alphanumeric characters
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '');
    
    if (validateCode(alphanumericValue)) {
      onSearchChange(alphanumericValue);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery && searchQuery.length !== 10) {
      setError("Code must be exactly 10 characters");
      return;
    }
    
    console.log("Searching for employee with code:", searchQuery);
    setError(null);
    onSearchEmployee(); // Trigger search when form is submitted
  };

  const clearSearch = () => {
    onSearchChange('');
    setError(null);
  };

  const handleAddEmployee = () => {
    navigate('/core/Add-Employee');
  };

  const hasSearchTerm = searchQuery !== '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 🔍 Search Input Container */}
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
                placeholder="Search by employee code"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                maxLength={10}
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
            
            {/* Error message */}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* 🔍 Search Button and ➕ Add Employee Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={handleAddEmployee}
              size="sm"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white w-full sm:w-auto cursor-pointer"
            >
              <BadgePlus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EmployeeSearch;