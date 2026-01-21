import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../../ui/popover';
import type { LeaveAppChainListDto } from '../../../../../../types/core/Settings/leaveAppChain';

interface AppChainHistoryTableProps {
  AppChainHistorys: LeaveAppChainListDto[];
  onEdit: (AppChainHistory: LeaveAppChainListDto) => void;
  onDelete: (AppChainHistory: LeaveAppChainListDto) => void;
  onToggleStatus?: (AppChainHistory: LeaveAppChainListDto) => void;
}

const AppChainHistoryTable: React.FC<AppChainHistoryTableProps> = ({
  AppChainHistorys,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [selectedAppChainHistory, setSelectedAppChainHistory] = useState<LeaveAppChainListDto | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const handleViewDetails = (AppChainHistory: LeaveAppChainListDto) => {
    setSelectedAppChainHistory(AppChainHistory);
    setActiveModal('view');
    setPopoverOpen(null);
  };

  const handleEdit = (AppChainHistory: LeaveAppChainListDto) => {
    onEdit(AppChainHistory);
    setPopoverOpen(null);
  };

  const handleDelete = (AppChainHistory: LeaveAppChainListDto) => {
    onDelete(AppChainHistory);
    setPopoverOpen(null);
  };

  const handleToggleStatus = (AppChainHistory: LeaveAppChainListDto) => {
    if (onToggleStatus) {
      onToggleStatus(AppChainHistory);
    }
    setPopoverOpen(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedAppChainHistory(null);
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
      YES: "bg-green-500 text-white border border-green-200",
      NO: "bg-red-500 text-white border border-red-200",
    };
    return (
      colors[booleanColor] || "bg-green-100 text-gray-800 border border-green-200"
    );
  };

  const getStatusColor = (isActive: boolean): string => {
    return isActive ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200";
  };

  const getBooleanIcon = (value: boolean) => {
    return value ? (<CheckCircle className="h-4 w-4 text-white" />) : (<XCircle className="h-4 w-4 text-white" />);
  };

  const getBooleanSmallIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-2.5 w-2.5 text-white" />
    ) : (
      <XCircle className="h-2.5 w-2.5 text-white" />
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl shadow-sm overflow-hidden bg-white"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Effective From
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Effective To
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IsActive
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Added Steps
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Leave Policy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {AppChainHistorys.length === 0 ? (
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
                AppChainHistorys.map((AppChainHistory, index) => (
                  <motion.tr
                    key={AppChainHistory.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {AppChainHistory.effectiveFromStr}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {AppChainHistory.effectiveToStr}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-4 font-semibold gap-2 rounded-full ${getBooleanColor(
                            AppChainHistory.isActiveStr
                          )}`}
                        >
                          {getBooleanIcon(AppChainHistory.isActive)}
                          {AppChainHistory.isActiveStr}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {AppChainHistory.addedSteps}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {AppChainHistory.leavePolicy}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Popover
                        open={popoverOpen === AppChainHistory.id}
                        onOpenChange={(open) =>
                          setPopoverOpen(open ? AppChainHistory.id : null)
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
                              onClick={() => handleViewDetails(AppChainHistory)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEdit(AppChainHistory)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <PenBox size={16} />
                              Edit
                            </button>
                            {onToggleStatus && (
                              <button
                                onClick={() =>
                                  handleToggleStatus(AppChainHistory)
                                }
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 ${
                                  AppChainHistory.isActive
                                    ? "text-amber-600 hover:bg-amber-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {AppChainHistory.isActive ? (
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
                              onClick={() => handleDelete(AppChainHistory)}
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
      </motion.div>
    </>
  );
};

export default AppChainHistoryTable;