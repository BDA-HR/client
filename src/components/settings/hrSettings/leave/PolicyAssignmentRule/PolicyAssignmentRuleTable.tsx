import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../../ui/button";
import type { PolicyAssignmentRuleListDto } from "../../../../../types/core/Settings/policyAssignmentRule";
import PolicyRuleConditionModal from "./PolicyRuleConditionModal";

interface PolicyAssignmentRuleProps {
  policyAssignmentRule: PolicyAssignmentRuleListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}


const PolicyAssignmentRule: React.FC<PolicyAssignmentRuleProps> = ({
  policyAssignmentRule,
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
}) => {
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PolicyAssignmentRuleListDto | null>(null);

  const handleConditionClick = (rule: PolicyAssignmentRuleListDto) => {
    setSelectedRule(rule);
    setConditionModalOpen(true);
  };

  const handleCloseConditionModal = () => {
    setConditionModalOpen(false);
    setSelectedRule(null);
  };

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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Is Active
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {/* code */}
                      <td className="px-3 py-3 text-left">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-600 font-medium">
                              {policyAssignmentRule.code.charAt(0).toUpperCase()}
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
                      <td className="px-4 py-3 text-left">
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
                      <td className="px-4 py-3 text-left">
                        <span className="text-sm text-gray-700">
                          {policyAssignmentRule.effectiveFromStr || policyAssignmentRule.effectiveFrom}
                        </span>
                      </td>
                      
                      {/* Effective To */}
                      <td className="px-4 py-3 text-left">
                        <span className="text-sm text-gray-700">
                          {policyAssignmentRule.effectiveToStr || policyAssignmentRule.effectiveTo || "N/A"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <Button
                          onClick={() => handleConditionClick(policyAssignmentRule)}
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-green-50 hover:text-green-600"
                        >
                          <Settings size={16} />
                        </Button>
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
                    <span className="font-medium">{totalItems}</span> rules
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

      {/* Condition Modal */}
      {selectedRule && (
        <PolicyRuleConditionModal
          isOpen={conditionModalOpen}
          onClose={handleCloseConditionModal}
          ruleId={selectedRule.id}
          ruleName={selectedRule.name}
        />
      )}
    </motion.div>
  );
};

export default PolicyAssignmentRule;
