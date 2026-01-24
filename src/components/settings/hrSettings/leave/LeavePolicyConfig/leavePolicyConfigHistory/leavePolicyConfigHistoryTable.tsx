import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../../ui/popover";
import type { LeavePolicyConfigListDto } from "../../../../../../types/core/Settings/leavePolicyConfig";

interface LeavePolicyHistoryTableProps {
  leavePolicyConfig: LeavePolicyConfigListDto[];
  onEdit: (leavePolicyConfigHistory: LeavePolicyConfigListDto) => void;
  onDelete: (leavePolicyConfigHistory: LeavePolicyConfigListDto) => void;
  onToggleStatus?: (leavePolicyConfigHistory: LeavePolicyConfigListDto) => void;
}

const LeavePolicyConfigHistoryTable: React.FC<LeavePolicyHistoryTableProps> = ({
  leavePolicyConfig,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const handleEdit = (config: LeavePolicyConfigListDto) => {
    onEdit(config);
    setPopoverOpen(null);
  };

  const handleDelete = (config: LeavePolicyConfigListDto) => {
    onDelete(config);
    setPopoverOpen(null);
  };

  const handleToggleStatus = (config: LeavePolicyConfigListDto) => {
    if (onToggleStatus) {
      onToggleStatus(config);
    }
    setPopoverOpen(null);
  };

  const getBooleanColor = (value: string): string => {
    const colors: Record<string, string> = {
      YES: "bg-green-500 text-white border border-green-200",
      NO: "bg-red-500 text-white border border-red-200",
      TRUE: "bg-green-500 text-white border border-green-200",
      FALSE: "bg-red-500 text-white border border-red-200",
    };
    return (
      colors[value.toUpperCase()] ||
      "bg-green-100 text-gray-800 border border-green-200"
    );
  };

  const getStatusColor = (isActive: boolean): string => {
    return isActive
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  };

  const getBooleanIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-4 w-4 text-white" />
    ) : (
      <XCircle className="h-4 w-4 text-white" />
    );
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
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Annual Entitlement
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Accrual Frequency
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Accrual Rate
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Max Days Per Request
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Max Carry Over Days
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Min Service Months
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Is Active
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fiscal Year
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leavePolicyConfig.length === 0 ? (
                <tr>
                  <td
                    colSpan={9} // Fixed: Changed from 7 to 9 (number of columns)
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No leave policies found.
                  </td>
                </tr>
              ) : (
                leavePolicyConfig.map((config, index) => (
                  <motion.tr
                    key={config.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* Annual Entitlement */}
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {config.annualEntitlement}
                      </div>
                    </td>

                    {/* Accrual Frequency */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.accrualFrequencyStr}
                      </span>
                    </td>

                    {/* Accrual Rate */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.accrualRate}
                      </span>
                    </td>

                    {/* Max Days Per Request */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.maxDaysPerReq}
                      </span>
                    </td>

                    {/* Max Carry Over Days */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.maxCarryOverDays}
                      </span>
                    </td>

                    {/* Min Service Months */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.minServiceMonths}
                      </span>
                    </td>

                    {/* Is Active */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBooleanColor(
                          config.isActiveStr,
                        )}`}
                      >
                        {config.isActiveStr}
                      </span>
                    </td>

                    {/* Fiscal Year */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {config.fiscalYear}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-middle text-center">
                      <Popover
                        open={popoverOpen === config.id}
                        onOpenChange={(open) =>
                          setPopoverOpen(open ? config.id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
                        >
                          <div className="space-y-1">
                            <button
                              onClick={() => handleEdit(config)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                              <PenBox size={16} />
                              Edit
                            </button>
                            {onToggleStatus && (
                              <button
                                onClick={() => handleToggleStatus(config)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                              >
                                {config.isActive ? (
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
                              onClick={() => handleDelete(config)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
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

export default LeavePolicyConfigHistoryTable;
