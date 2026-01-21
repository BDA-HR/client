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
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../ui/popover";
import { useNavigate } from "react-router-dom";
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
                Condition
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
                  No leave policies found.
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

                  {/* Allow Encashment */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-3 font-semibold gap-1 rounded-full ${getBooleanColor(
                        policyAssignmentRule.priority === "High"
                      )}`}
                    >
                      {getBooleanIcon(policyAssignmentRule.priority === "High")}
                      {policyAssignmentRule.priority ? "Yes" : "No"}
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

                  {/* Status */}
                  <td className="px-4 py-3 align-middle text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                        policyAssignmentRule.effectiveFrom
                      )}`}
                    >
                      {policyAssignmentRule.effectiveFrom === "0"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
                  {/*effectiveTo*/}
                  <td className="px-4 py-3 align-middle text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                        policyAssignmentRule.effectiveTo || ""
                      )}`}
                    >
                      {policyAssignmentRule.effectiveTo === "0"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Leave Config */}
                  <td className="px-4 py-3 align-middle text-center">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/settings/hr/leave/policyAssignmentRuleConfig/${policyAssignmentRule.id}`
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
