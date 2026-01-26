import React, { useState } from "react";
import { motion } from "framer-motion";
import type { UUID } from "../../../../../types/core/Settings/policyAssignmentRule";
import PolicyAssignmentRuleTable from "./PolicyAssignmentRuleTable";
import type { PolicyAssignmentRuleListDto, PolicyAssignmentRuleAddDto, PolicyAssignmentRuleModDto } from "../../../../../types/core/Settings/policyAssignmentRule";
import PolicyAssignmentRuleHeader from "./policyAssignmentRuleHeader";
import AddPolicyAssignmentRuleModal from "./AddPolicyAssignmentRule";
import { 
  useAllPolicyAssignmentRules, 
  useCreatePolicyAssignmentRule, 
  useUpdatePolicyAssignmentRule, 
  useDeletePolicyAssignmentRule 
} from "../../../../../services/core/settings/ModHrm/LeavePolicyAssignmentRule/policyAssignmentRule.query";
import { useNavigate } from "react-router-dom";

// Add props interface to receive leavePolicyId
interface PolicyAssignmentRuleSectionProps {
  leavePolicyId: UUID;
}
const PolicyAssignmentRuleSection: React.FC<PolicyAssignmentRuleSectionProps> = ({
  leavePolicyId,
}) => {
  const navigate = useNavigate();
  const [isAddPolicyAssignmentRuleModalOpen, setIsAddPolicyAssignmentRuleModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyAssignmentRuleListDto | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<PolicyAssignmentRuleListDto | null>(null);

  // React Query hooks
  const {
    data: policyAssignmentRules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAllPolicyAssignmentRules(leavePolicyId);

  const createMutation = useCreatePolicyAssignmentRule();
  const updateMutation = useUpdatePolicyAssignmentRule();
  const deleteMutation = useDeletePolicyAssignmentRule();

  // CRUD handlers
  const handleAddPolicyAssignmentRule = async (ruleData: PolicyAssignmentRuleAddDto) => {
    try {
      await createMutation.mutateAsync(ruleData);
      refetch();
      setIsAddPolicyAssignmentRuleModalOpen(false);
    } catch (err) {
      console.error("Failed to create policy assignment rule:", err);
    }
  };

  const handleEditPolicyAssignmentRule = async (rule: PolicyAssignmentRuleListDto) => {
    setEditingPolicy(rule);
  };

  const handleDeletePolicyAssignmentRule = async (rule: PolicyAssignmentRuleListDto) => {
    try {
      await deleteMutation.mutateAsync(rule.id as UUID);
      refetch();
    } catch (err) {
      console.error("Failed to delete policy assignment rule:", err);
    }
  };

  const handleViewHistory = () => {
    navigate(`/settings/hr/leave/policyAssignmentRuleHistory/${leavePolicyId}`);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PolicyAssignmentRuleHeader
          onAddClick={() => setIsAddPolicyAssignmentRuleModalOpen(true)}
          onViewHistory={handleViewHistory}
        />
      </motion.div>

      {/* Error Banner */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <span className="font-medium">
            {(error as Error)?.message || "Failed to load policy assignment rules"}
          </span>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* No data message */}
      {!isLoading && policyAssignmentRules.length === 0 && !isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <span className="text-yellow-700 font-medium">
              No Policy Assignment Rules Found
            </span>
          </div>
        </motion.div>
      )}

      {/* Show table if there's data */}
      {!isLoading && policyAssignmentRules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-0 pb-0"
        >
          <PolicyAssignmentRuleTable
            policyAssignmentRule={policyAssignmentRules}
            onEdit={handleEditPolicyAssignmentRule}
            onDelete={handleDeletePolicyAssignmentRule}
          />
        </motion.div>
      )}

      {/* Modals */}
      <AddPolicyAssignmentRuleModal
        isOpen={isAddPolicyAssignmentRuleModalOpen}
        onClose={() => setIsAddPolicyAssignmentRuleModalOpen(false)}
        onAddPolicyAssignmentRule={handleAddPolicyAssignmentRule}
        leavePolicyId={leavePolicyId}
      />
    </div>
  );
};

export default PolicyAssignmentRuleSection;
