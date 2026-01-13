import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building, ChevronRight, ChevronLeft } from 'lucide-react';
import { BranchSearch } from '../branch/BranchsSearch'; 
import { useBranches } from '../../../services/core/branch/branch.queries';

const AllBranchs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use React Query hook
  const { 
    data: branches = [], 
    isLoading, 
    error: queryError,
    refetch 
  } = useBranches(); // Gets all branches

  // Helper functions moved inside component
  const getStatusColor = (status: string): string => {
    switch (status) {
      case '0': return 'bg-green-100 text-green-800 border border-green-200';
      case '1': return 'bg-red-100 text-red-800 border border-red-200';
      case '2': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "0":
        return "Active";
      case "1":
        return "Inactive";
      case "2":
        return "Under Construction";
      default:
        return status;
    }
  };

  const getBranchTypeText = (branchType: string): string => {
    switch (branchType) {
      case "0":
        return "Head Office";
      case "1":
        return "Regional";
      case "2":
        return "Local";
      case "3":
        return "Virtual";
      default:
        return branchType;
    }
  };

  // Filter branches based on search term - using useMemo for performance
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) {
      return branches;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return branches.filter(branch =>
      branch.name?.toLowerCase().includes(lowercasedSearch) ||
      branch.location?.toLowerCase().includes(lowercasedSearch) ||
      branch.code?.toLowerCase().includes(lowercasedSearch) ||
      branch.comp?.toLowerCase().includes(lowercasedSearch)
    );
  }, [branches, searchTerm]);

  // Paginate filtered branches
  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBranches, currentPage]);

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const totalItems = filteredBranches.length;

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle error message
  const errorMessage = queryError?.message || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header - Always visible */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-2">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white">
            All Branches
          </h2>
        </div>
      </div>

      <BranchSearch 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onRefresh={() => refetch()}
        loading={isLoading}
      />

      {/* Error message for API errors */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {errorMessage.includes("load") ? (
                <>
                  Failed to load branches.{" "}
                  <button
                    onClick={() => refetch()}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                    disabled={isLoading}
                  >
                    Try again
                  </button>
                </>
              ) : (
                errorMessage
              )}
            </span>
            <button
              onClick={() => {}}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </motion.div>
      )}

      {/* Branch Table - Only show when not loading and no error */}
      {!isLoading && !errorMessage && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5,
              },
            },
          }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Opened
                  </th>
                </motion.tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBranches.length > 0 ? (
                  paginatedBranches.map((branch, index) => (
                    <motion.tr
                      key={branch.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-1 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                          >
                            <Building className="text-emerald-600 h-5 w-5" />
                          </motion.div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                              {branch.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                              {branch.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {getBranchTypeText(branch.branchType)}
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            branch.branchStat
                          )}`}
                        >
                          {getStatusText(branch.branchStatStr)}
                        </span>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm font-medium hidden md:table-cell text-gray-600">
                        <div className="flex items-center">
                          <span className="truncate max-w-[120px]">
                            {branch.location}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        <div className="flex items-center">
                          <span className="truncate max-w-[120px]">
                            {branch.comp}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        <div className="flex items-center">
                          <span>{branch.openDateStr}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {branches.length === 0 
                        ? "No branches available." 
                        : "No branches found matching your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Only show if there are results */}
          {paginatedBranches.length > 0 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span>{" "}
                    branches
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AllBranchs;
