import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../ui/popover';
import type { LeaveTypeListDto } from '../../../../../types/core/Settings/leavetype';

interface LeaveTypeTableProps {
  leaveTypes: LeaveTypeListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (leaveType: LeaveTypeListDto) => void;
  onDelete: (leaveType: LeaveTypeListDto) => void;
  onToggleStatus?: (leaveType: LeaveTypeListDto) => void;
}

const LeaveTypeTable: React.FC<LeaveTypeTableProps> = ({
  leaveTypes,
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeListDto | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const handleViewDetails = (leaveType: LeaveTypeListDto) => {
    setSelectedLeaveType(leaveType);
    setActiveModal('view');
    setPopoverOpen(null);
  };

  const handleEdit = (leaveType: LeaveTypeListDto) => {
    onEdit(leaveType);
    setPopoverOpen(null);
  };

  const handleDelete = (leaveType: LeaveTypeListDto) => {
    onDelete(leaveType);
    setPopoverOpen(null);
  };

  const handleToggleStatus = (leaveType: LeaveTypeListDto) => {
    if (onToggleStatus) {
      onToggleStatus(leaveType);
    }
    setPopoverOpen(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedLeaveType(null);
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Paid': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Unpaid': 'bg-red-100 text-red-800 border border-red-200',
      'Special': 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getBooleanColor = (booleanColor: string): string => {
    const colors: Record<string, string> = {
      YES: "bg-green-100 text-green-800 border border-green-300",
      No: "bg-red-100 text-red-700 border border-red-300",
    };
    return (
      colors[booleanColor] || "bg-green-100 text-gray-800 border border-green-200"
    );
  };

  const getStatusColor = (isActive: boolean): string => {
    return isActive
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";
  };

  const getBooleanIcon = (value: boolean) => {
    return value ? (<CheckCircle className="h-3 w-3 text-green-800" />) : (<XCircle className="h-3 w-3 text-red-800" />);
  };

  const getBooleanSmallIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-2.5 w-2.5 text-green-800" />
    ) : (
      <XCircle className="h-2.5 w-2.5 text-red-800" />
    );
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    })
  };
  console.log("leave type", leaveTypes);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Leave Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Requires Approval?
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Allow Half Day?
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Holidays as Leave?
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveTypes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-gray-400 text-lg mb-2">
                            No leave types found
                          </div>
                          <p className="text-gray-400 text-sm">
                            Try adjusting your search terms or add a new leave type.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leaveTypes.map((leaveType, index) => (
                      <motion.tr
                        key={leaveType.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={rowVariants}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ rotate: 10 }}
                              className="shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                            >
                              <span className="text-emerald-600 font-medium">
                                {leaveType.name.charAt(0).toUpperCase()}
                              </span>
                            </motion.div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {leaveType.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <span>Is Active?: </span>
                                <span
                                  className={`px-2 py-1 inline-flex text-[10px] leading-2 font-semibold rounded-full gap-0.5 ${getStatusColor(
                                    leaveType.isActive
                                  )}`}
                                >
                                  {getBooleanSmallIcon(leaveType.isActive)}{" "}
                                  {leaveType.isActiveStr}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getCategoryColor(
                                leaveType.leaveCategory
                              )}`}
                            >
                              {leaveType.leaveCategoryStr}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-2 font-semibold gap-1 rounded-full ${getBooleanColor(
                                leaveType.requiresApprovalStr
                              )}`}
                            >
                              {getBooleanIcon(leaveType.requiresApproval)}{" "}
                              {leaveType.requiresApprovalStr}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-2 font-semibold gap-1 rounded-full ${getBooleanColor(
                                leaveType.allowHalfDayStr
                              )}`}
                            >
                              {getBooleanIcon(leaveType.allowHalfDay)}{" "}
                              {leaveType.allowHalfDayStr}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* {getBooleanIcon(leaveType.holidaysAsLeave)} */}
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-2 font-semibold gap-1 rounded-full ${getBooleanColor(leaveType.holidaysAsLeaveStr)}`}
                            >
                              {getBooleanIcon(leaveType.holidaysAsLeave)}{" "}
                              {leaveType.holidaysAsLeaveStr}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Popover
                            open={popoverOpen === leaveType.id}
                            onOpenChange={(open) =>
                              setPopoverOpen(open ? leaveType.id : null)
                            }
                          >
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
                                  onClick={() => handleViewDetails(leaveType)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                                >
                                  <Eye size={16} />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEdit(leaveType)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                                >
                                  <PenBox size={16} />
                                  Edit
                                </button>
                                {onToggleStatus && (
                                  <button
                                    onClick={() => handleToggleStatus(leaveType)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 ${leaveType.isActive
                                      ? "text-amber-600 hover:bg-amber-50"
                                      : "text-green-600 hover:bg-green-50"
                                      }`}
                                  >
                                    {leaveType.isActive ? (
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
                                  onClick={() => handleDelete(leaveType)}
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
                      <span className="font-medium">{totalItems}</span> leave types
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

      {/* View Details Modal - Keep only this one since delete has its own component now */}
      {activeModal === "view" && selectedLeaveType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-lg">
                    {selectedLeaveType.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedLeaveType.name}
                  </h2>
                  <p className="text-sm text-gray-500">Leave Type Details</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Category
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getCategoryColor(
                        selectedLeaveType.leaveCategory
                      )}`}
                    >
                      {selectedLeaveType.leaveCategoryStr}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Status
                  </label>
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                      selectedLeaveType.isActive
                    )}`}
                  >
                    {selectedLeaveType.isActiveStr}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Approval Required
                  </label>
                  <div className="flex items-center gap-2">
                    {getBooleanIcon(selectedLeaveType.requiresApproval)}
                    <span className="text-gray-900">
                      {selectedLeaveType.requiresApprovalStr}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Half Day Allowed
                  </label>
                  <div className="flex items-center gap-2">
                    {getBooleanIcon(selectedLeaveType.allowHalfDay)}
                    <span className="text-gray-900">
                      {selectedLeaveType.allowHalfDayStr}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Holidays Count as Leave
                  </label>
                  <div className="flex items-center gap-2">
                    {getBooleanIcon(selectedLeaveType.holidaysAsLeave)}
                    <span className="text-gray-900">
                      {selectedLeaveType.holidaysAsLeaveStr}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Created Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedLeaveType.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default LeaveTypeTable;