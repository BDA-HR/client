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
import type { PolicyAssignmentRuleListDto } from "../../../../../../types/core/Settings/policyAssignmentRule";

interface PolicyAssignmentRuleHistoryTableProps {
  policyAssignmentRule: PolicyAssignmentRuleListDto[];
  onEdit: (policyAssignmentRule: PolicyAssignmentRuleListDto) => void;
  onDelete: (policyAssignmentRule: PolicyAssignmentRuleListDto) => void;
  onToggleStatus?: (policyAssignmentRule: PolicyAssignmentRuleListDto) => void;
}

const PolicyAssignmentRuleHistoryTable: React.FC<PolicyAssignmentRuleHistoryTableProps> = ({
  policyAssignmentRule,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const handleEdit = (rule: PolicyAssignmentRuleListDto) => {
    onEdit(rule);
    setPopoverOpen(null);
  };

  const handleDelete = (rule: PolicyAssignmentRuleListDto) => {
    onDelete(rule);
    setPopoverOpen(null);
  };

  const handleToggleStatus = (rule: PolicyAssignmentRuleListDto) => {
    if (onToggleStatus) {
      onToggleStatus(rule);
    }
    setPopoverOpen(null);
  };

  const getBooleanColor = (value: boolean): string => {
    return value
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  };

  const getBooleanIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      "High": "bg-red-100 text-red-800 border border-red-200",
      "Medium": "bg-yellow-100 text-yellow-800 border border-yellow-200", 
      "Low": "bg-green-100 text-green-800 border border-green-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border border-gray-200";
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
                  Code
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
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
                  Effective From
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Effective To
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
              {policyAssignmentRule.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No policy assignment rules found.
                  </td>
                </tr>
              ) : (
                policyAssignmentRule.map((rule, index) => (
                  <motion.tr
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* Code */}
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {rule.code}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {rule.name}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold rounded-full ${getPriorityColor(
                          rule.priority
                        )}`}
                      >
                        {rule.priority}
                      </span>
                    </td>

                    {/* Is Active */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                          rule.isActive
                        )}`}
                      >
                        {getBooleanIcon(rule.isActive)}
                        {rule.isActive ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Effective From */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {rule.effectiveFromStr || rule.effectiveFrom}
                      </span>
                    </td>

                    {/* Effective To */}
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-700">
                        {rule.effectiveToStr || rule.effectiveTo || "N/A"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-middle text-center">
                      <Popover
                        open={popoverOpen === rule.id}
                        onOpenChange={(open) =>
                          setPopoverOpen(open ? rule.id : null)
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
                              onClick={() => handleEdit(rule)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                              <PenBox size={16} />
                              Edit
                            </button>
                            {onToggleStatus && (
                              <button
                                onClick={() => handleToggleStatus(rule)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                              >
                                {rule.isActive ? (
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
                              onClick={() => handleDelete(rule)}
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

export default PolicyAssignmentRuleHistoryTable;
