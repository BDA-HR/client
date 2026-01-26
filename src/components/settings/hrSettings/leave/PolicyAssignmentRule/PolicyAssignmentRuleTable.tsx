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
} from "../../../../ui/popover";
import type { PolicyAssignmentRuleListDto } from "../../../../../types/core/Settings/policyAssignmentRule";

interface PolicyAssignmentRuleProps {
  policyAssignmentRule: PolicyAssignmentRuleListDto[];
  onEdit: (leaveType: PolicyAssignmentRuleListDto) => void;
  onDelete: (leaveType: PolicyAssignmentRuleListDto) => void;
  onToggleStatus?: (leaveType: PolicyAssignmentRuleListDto) => void;
}


const PolicyAssignmentRule: React.FC<PolicyAssignmentRuleProps> = ({
  policyAssignmentRule,
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

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      "High": "bg-red-100 text-red-800 border border-red-200",
      "Medium": "bg-yellow-100 text-yellow-800 border border-yellow-200", 
      "Low": "bg-green-100 text-green-800 border border-green-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-b-xl shadow-sm overflow-hidden bg-white"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 align-middle">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Code
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Active
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effective From
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effective To
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              policyAssignmentRule.map((policyAssignmentRule, index) => (
                <motion.tr
                  key={policyAssignmentRule.id}
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
                          {policyAssignmentRule.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {policyAssignmentRule.code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* name */}
                  <td className="px-4 py-3 align-middle text-center">
                    {policyAssignmentRule.name}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold rounded-full ${getPriorityColor(
                        policyAssignmentRule.priority
                      )}`}
                    >
                      {policyAssignmentRule.priority}
                    </span>
                  </td>

                  {/* Requires Attachment */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                        policyAssignmentRule.isActive
                      )}`}
                    >
                      {getBooleanIcon(policyAssignmentRule.isActive)}
                      {policyAssignmentRule.isActive ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Effective From */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span className="text-sm text-gray-700">
                      {policyAssignmentRule.effectiveFromStr || policyAssignmentRule.effectiveFrom}
                    </span>
                  </td>
                  
                  {/* Effective To */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span className="text-sm text-gray-700">
                      {policyAssignmentRule.effectiveToStr || policyAssignmentRule.effectiveTo || "N/A"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-middle text-right text-sm font-medium">
                    <Popover
                      open={popoverOpen === policyAssignmentRule.id}
                      onOpenChange={(open) =>
                        setPopoverOpen(open ? policyAssignmentRule.id : null)
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
                            onClick={() => onEdit(policyAssignmentRule)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit
                          </button>
                          {onToggleStatus && (
                            <button
                              onClick={() =>
                                onToggleStatus(policyAssignmentRule)
                              }
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-gray-700"
                            >
                              {policyAssignmentRule.isActive ? (
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
                            onClick={() => onDelete(policyAssignmentRule)}
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

export default PolicyAssignmentRule;
