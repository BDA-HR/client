import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MoreVertical, Clock, Eye, Pencil, Trash2, Power } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import type { PeriodListDto } from '../../../types/core/period';
import { formatDate } from '../../../utils/format-date';

interface PeriodTableProps {
  periods: PeriodListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewDetails: (period: PeriodListDto) => void;
  onEdit: (period: PeriodListDto) => void;
  onStatusChange: (period: PeriodListDto) => void;
  onDelete: (period: PeriodListDto) => void;
}

export const PeriodTable: React.FC<PeriodTableProps> = ({
  periods,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetails,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
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

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    }),
    hover: { backgroundColor: "rgba(0, 0, 0, 0.05)" }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const getStatusColor = (status: string): string => {
    return status === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getPeriodColor = (name: string): string => {
    // Color coding based on period name or quarter
    if (name.includes('Q1')) return 'text-blue-600';
    if (name.includes('Q2')) return 'text-purple-600';
    if (name.includes('Q3')) return 'text-orange-600';
    if (name.includes('Q4')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <motion.tr 
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Period
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
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
            {periods.map((period, index) => (
              <motion.tr 
                key={period.id}
                custom={index}
                variants={rowVariants}
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
                      <div className={`text-sm font-medium truncate max-w-[120px] md:max-w-none ${getPeriodColor(period.name)}`}>
                        {period.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                        {period.quarter} • {period.fiscYear}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Clock className="text-gray-400 mr-2 h-4 w-4" />
                    <span>{formatDate(period.dateStart)} - {formatDate(period.dateEnd)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(period.isActive)}`}>
                    {period.isActive === "Yes" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {period.createdAt ? formatDate(period.createdAt) : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {period.modifiedAt ? formatDate(period.modifiedAt) : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Popover open={popoverOpen === period.id} onOpenChange={(open) => setPopoverOpen(open ? period.id : null)}>
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
                          onClick={() => onViewDetails(period)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button 
                          onClick={() => onEdit(period)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button 
                          onClick={() => onStatusChange(period)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                        >
                          <Power size={16} />
                          {period.isActive === 'Yes' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => onDelete(period)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                        >
                          <Trash2 size={16} />
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
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};