import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import type { LeavePolicyConfigListDto } from "../../../../../../types/core/Settings/leavePolicyConfig";

interface LeavePolicyConfigTableProps {
  leavePolicyConfig: LeavePolicyConfigListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (leaveType: LeavePolicyConfigListDto) => void;
  onDelete: (leaveType: LeavePolicyConfigListDto) => void;
  onToggleStatus?: (leaveType: LeavePolicyConfigListDto) => void;
}


const LeavePolicyConfigTable: React.FC<LeavePolicyConfigTableProps> = ({
  leavePolicyConfig,
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const getBooleanColor = (value: boolean) =>
    value
      ? "bg-green-500 text-white border border-green-200"
      : "bg-red-500 text-white border border-red-200";

  const getBooleanIcon = (value: boolean) =>
    value ? (
      <CheckCircle className="h-3 w-3 text-white" />
    ) : (
      <XCircle className="h-3 w-3 text-white" />
    );
 const getStatusColor = (status: string): string => {
   const colors: Record<string, string> = {
     0: "bg-green-100 text-green-800 border border-green-200",
     1: "bg-red-100 text-red-800 border border-red-200",
   };
   console.log("status", status);
   return (
     colors[status] || "bg-gray-100 text-gray-800 border border-gray-200"

   );
 };

     const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-b-xl shadow-sm overflow-hidden bg-white"
    >
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 align-middle">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                    Annual Entitlement
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Accrual Frequency
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Accrual Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Max Days PerReq
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Max Carry Over Days
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Min Service Months
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Is Active
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                    Fiscal Year
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {leavePolicyConfig.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No leave policy configurations found.
                    </td>
                  </tr>
                ) : (
                  leavePolicyConfig.map((leavePolicyConfig, index) => (
                    <motion.tr
                      key={leavePolicyConfig.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {leavePolicyConfig.annualEntitlement}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* accrualFrequency */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.accrualFrequencyStr}
                      </td>
                      {/* accrualRate */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.accrualRate}
                      </td>
                      {/* accrualRate */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.accrualRate}
                      </td>

                      {/* maxDaysPerReq */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.maxDaysPerReq}
                      </td>

                      {/* minServiceMonths */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.minServiceMonths}
                      </td>
                      {/* isActive */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                            leavePolicyConfig.isActive,
                          )}`}
                        >
                          {getBooleanIcon(leavePolicyConfig.isActive)}
                          {leavePolicyConfig.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      {/* fiscalYear */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicyConfig.fiscalYear}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
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
                    <span className="font-medium">{totalItems}</span> configurations
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
          )}
        </>
      )}
    </motion.div>
  );
};

export default LeavePolicyConfigTable;
