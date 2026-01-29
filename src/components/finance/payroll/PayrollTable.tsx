import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreVertical,
  Eye,
  PenBox,
  Users,
  DollarSign,
  Calendar,
  Shield,
  Clock,
  Loader,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';

interface PayrollItem {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  benefits: number;
  deductions: number;
  netPay: number;
  status: 'Active' | 'On Leave' | 'Pending' | 'Terminated';
  lastPayDate: string;
  nextPayDate: string;
}

interface PayrollTableProps {
  data: PayrollItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewDetails: (item: any) => void;
  onEdit: (item: any) => void;
  onProcessPayroll: (item: any) => void;
  onGeneratePayslip: (item: any) => void;
  loading?: boolean;
}

const PayrollTable: React.FC<PayrollTableProps> = ({
  data,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetails,
  onEdit,
  onProcessPayroll,
  onGeneratePayslip,
  loading = false,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      'Active': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      'On Leave': { bg: 'bg-amber-100', text: 'text-amber-800' },
      'Pending': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Terminated': { bg: 'bg-rose-100', text: 'text-rose-800' },
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const getDepartmentBadge = (department: string) => {
    const colors: Record<string, string> = {
      'IT': 'bg-blue-100 text-blue-800',
      'HR': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-emerald-100 text-emerald-800',
      'Sales': 'bg-cyan-100 text-cyan-800',
      'Operations': 'bg-amber-100 text-amber-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Engineering': 'bg-indigo-100 text-indigo-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[department] || 'bg-gray-100 text-gray-800'}`}>
        {department}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading payroll data...</span>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }}>
      <div className="overflow-x-auto rounded-xl border border-indigo-200 shadow-sm">
        <table className="min-w-full divide-y divide-indigo-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-white">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Position & Department
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider hidden lg:table-cell">
                Compensation
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider hidden md:table-cell">
                Payment Info
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-indigo-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users className="h-16 w-16 text-indigo-300 mb-4" />
                    <p className="text-xl font-semibold text-indigo-700 mb-2">No payroll data found</p>
                    <p className="text-sm text-indigo-500">Add employees or process payroll to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
                  }}
                  className="transition-colors hover:bg-indigo-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Users className="text-indigo-600 h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">ID: {item.employeeId}</div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900">{item.position}</div>
                      {getDepartmentBadge(item.department)}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="space-y-2">
                      {/* <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Salary:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${item.salary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Benefits:</span>
                        <span className="text-sm font-medium text-emerald-700">
                          +${item.benefits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deductions:</span>
                        <span className="text-sm font-medium text-rose-700">
                          -${item.deductions.toLocaleString()}
                        </span>
                      </div> */}
                      <div className="flex justify-between pt-2">
                        <span className="text-sm font-medium text-gray-900">Net Pay:</span>
                        <span className="text-sm font-bold text-indigo-900">
                          ${item.netPay.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Last Paid: {item.lastPayDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <Calendar className="w-3 h-3" />
                        <span>Next Pay: {item.nextPayDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover
                      open={popoverOpen === item.id.toString()}
                      onOpenChange={(open) =>
                        setPopoverOpen(open ? item.id.toString() : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0" align="end">
                        <div className="py-1">
                          <button
                            onClick={() => onViewDetails(item)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 rounded text-indigo-700 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                          <button
                            onClick={() => onEdit(item)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 rounded text-indigo-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit Employee
                          </button>
                          <button
                            onClick={() => onProcessPayroll(item)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 rounded text-emerald-700 flex items-center gap-2"
                          >
                            <DollarSign size={16} />
                            Process Payroll
                          </button>
                          <button
                            onClick={() => onGeneratePayslip(item)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 rounded text-purple-700 flex items-center gap-2"
                          >
                            <Shield size={16} />
                            Generate Payslip
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-indigo-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-indigo-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{totalItems}</span> employees
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-indigo-300 text-indigo-500 hover:bg-indigo-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-indigo-300 bg-white text-sm font-medium text-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PayrollTable;