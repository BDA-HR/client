import React, { useState } from 'react';
import { Search, UserSearch } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";

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

  // Validate code input - only allow 10 alphanumeric characters
  const validateCode = (code: string): boolean => {
    if (code === "") return true; // Empty is valid (for clearing)
    return /^[a-zA-Z0-9]{0,10}$/.test(code); // Allow up to 10 alphanumeric characters
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

  const hasSearchTerm = searchQuery !== '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input - Left side */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative max-w-md">
              <label htmlFor="employee-search" className="sr-only">
                Search employees
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="employee-search"
                name="employee-search"
                type="text"
                placeholder="Search by employee code"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
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
          </form>
        </div>

        {/* Search Button - Right side */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md cursor-pointer"
            disabled={searchQuery.length === 0}
          >
            <UserSearch className="h-4 w-4" />
            Search Employee
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeSearch;