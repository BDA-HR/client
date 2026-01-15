import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../ui/popover";
import type { LeavePolicyListDto } from "../../../../../types/core/Settings/leavepolicy";

interface LeavePolicyTableProps {
  leavePolicies: LeavePolicyListDto[];
  onEdit: (leaveType: LeavePolicyListDto) => void;
  onDelete: (leaveType: LeavePolicyListDto) => void;
  onToggleStatus?: (leaveType: LeavePolicyListDto) => void;
}

const LeavePolicyTable: React.FC<LeavePolicyTableProps> = ({
  leavePolicies,
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

  const getStatusColor = (isActive: boolean) =>
    isActive
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl shadow-sm overflow-hidden bg-white"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Leave Policy Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allow Encashment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requires Attachment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
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
                  colSpan={7}
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
                  <td className="px-4 py-3 whitespace-nowrap">
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    {leavePolicy.code}
                  </td>

                  {/* Allow Encashment */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-4 font-semibold gap-1 rounded-full ${getBooleanColor(
                        leavePolicy.allowEncashment
                      )}`}
                    >
                      {getBooleanIcon(leavePolicy.allowEncashment)}
                      {leavePolicy.allowEncashment ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Requires Attachment */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-4 font-semibold gap-1 rounded-full ${getBooleanColor(
                        leavePolicy.requiresAttachment
                      )}`}
                    >
                      {getBooleanIcon(leavePolicy.requiresAttachment)}
                      {leavePolicy.requiresAttachment ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full `}
                    >
                      {leavePolicy.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Leave Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {leavePolicy.leaveType}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
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
                            onClick={() => onEdit(leavePolicy)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit
                          </button>
                          {onToggleStatus && (
                            <button
                              onClick={() => onToggleStatus(leavePolicy)}
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
                            onClick={() => onDelete(leavePolicy)}
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
  );
};

export default LeavePolicyTable;
