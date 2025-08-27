import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MoreVertical, Clock } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import type { FiscYearListDto } from '../../types/fiscalYear';
import { formatDate } from '../../data/fiscalYear';

interface FiscalYearTableProps {
  years: FiscYearListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onYearUpdate: (updatedYear: FiscYearListDto) => void;
  onYearStatusChange: (yearId: string, newStatus: string) => void;
  onYearDelete: (yearId: string) => void;
  onViewDetails: (year: FiscYearListDto) => void;
  onEdit: (year: FiscYearListDto) => void;
}

export const FiscalYearTable: React.FC<FiscalYearTableProps> = ({
  years,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onYearStatusChange,
  onYearDelete,
  onViewDetails,
  onEdit,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const getStatusColor = (status: string): string => {
    return status === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getYearColor = (year: string): string => {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year.split(' ')[1]);
    
    if (yearNum === currentYear) return 'text-emerald-600';
    if (yearNum > currentYear) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
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
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <motion.tr 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Fiscal Year
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Modified
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </motion.tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {years.map((year, index) => (
              <motion.tr 
                key={year.id}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <Calendar className="text-emerald-600 h-5 w-5" />
                    </motion.div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium truncate max-w-[120px] md:max-w-none ${getYearColor(year.name)}`}>
                        {year.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                        {formatDate(year.startDate)} - {formatDate(year.endDate)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{formatDate(year.startDate)} - {formatDate(year.endDate)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(year.isActive)}`}>
                    {year.isActive === "Yes" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {formatDate(year.createdAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {formatDate(year.modifiedAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Popover open={popoverOpen === year.id} onOpenChange={(open) => setPopoverOpen(open ? year.id : null)}>
                    <PopoverTrigger asChild>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </motion.button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end">
                      <div className="py-1">
                        <button 
                          onClick={() => onViewDetails(year)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => onEdit(year)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onYearStatusChange(year.id, year.isActive === 'Yes' ? 'No' : 'Yes')}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                        >
                          {year.isActive === 'Yes' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => onYearDelete(year.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </motion.div>
  );
};