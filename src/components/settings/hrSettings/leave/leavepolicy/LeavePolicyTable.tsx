import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
  Cog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../ui/popover";
import type { LeavePolicyListDto } from "../../../../../types/core/Settings/leavepolicy";
import { useNavigate } from "react-router-dom";

interface LeavePolicyTableProps {
  leavePolicies: LeavePolicyListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (leaveType: LeavePolicyListDto) => void;
  onDelete: (leaveType: LeavePolicyListDto) => void;
  onToggleStatus?: (leaveType: LeavePolicyListDto) => void;
}


const LeavePolicyTable: React.FC<LeavePolicyTableProps> = ({
  leavePolicies,
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


   const handleEdit = (leaveType: LeavePolicyListDto) => {
     onEdit(leaveType);
     setPopoverOpen(null);
   };

   const handleDelete = (leaveType: LeavePolicyListDto) => {
     onDelete(leaveType);
     setPopoverOpen(null);
   };

   const handleToggleStatus = (leaveType: LeavePolicyListDto) => {
     if (onToggleStatus) {
       onToggleStatus(leaveType);
     }
     setPopoverOpen(null);
   };
  const getBooleanColor = (value: boolean) =>
    value
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300";

  const getBooleanIcon = (value: boolean) =>
    value ? (
      <CheckCircle className="h-3 w-3 text-green-800" />
    ) : (
      <XCircle className="h-3 w-3 text-red-800" />
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
      className="rounded-xl shadow-sm overflow-hidden bg-white"
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
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                    Leave Policy Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allow Encashment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requires Attachment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy Configure
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {leavePolicies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No leave policies found.
                    </td>
                  </tr>
                ) : (
                  leavePolicies.map((leavePolicy, index) => (
                    <motion.tr
                      key={leavePolicy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-600 font-medium">
                              {leavePolicy.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {leavePolicy.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicy.code}
                      </td>

                      {/* Allow Encashment */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                            leavePolicy.allowEncashment
                          )}`}
                        >
                          {getBooleanIcon(leavePolicy.allowEncashment)}
                          {leavePolicy.allowEncashment ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Requires Attachment */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                            leavePolicy.requiresAttachment
                          )}`}
                        >
                          {getBooleanIcon(leavePolicy.requiresAttachment)}
                          {leavePolicy.requiresAttachment ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                            leavePolicy.status
                          )}`}
                        >
                          {leavePolicy.status === "0" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Leave Type */}
                      <td className="px-4 py-3 align-middle text-center">
                        {leavePolicy.leaveType}
                      </td>

                      {/* Leave Config */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/settings/hr/leave/leavePolicyConfig/${leavePolicy.id}`
                              )
                            }
                            className="flex items-center gap-2 p-1 rounded hover:bg-muted transition"
                            title="Configure Leave Policy"
                          >
                            <Cog className="w-6 h-6 cursor-pointer text-gray-500" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-middle text-right  text-sm font-medium">
                        <Popover
                          open={popoverOpen === leavePolicy.id}
                          onOpenChange={(open) =>
                            setPopoverOpen(open ? leavePolicy.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-0" align="end">
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(leavePolicy)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                              >
                                <PenBox size={16} />
                                Edit
                              </button>
                              {handleToggleStatus && (
                                <button
                                  onClick={() => handleToggleStatus(leavePolicy)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-gray-700"
                                >
                                  {leavePolicy.status ? (
                                    <>
                                      <XCircle size={16} />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={16} />
                                      Activate
                                    </>
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(leavePolicy)}
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
                    <span className="font-medium">{totalItems}</span> leave policies
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

export default LeavePolicyTable;
