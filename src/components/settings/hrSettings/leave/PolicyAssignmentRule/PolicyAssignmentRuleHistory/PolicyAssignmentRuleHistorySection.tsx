import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type {
  PolicyAssignmentRuleListDto,
  PolicyAssignmentRuleModDto,
  UUID,
} from "../../../../../../types/core/Settings/policyAssignmentRule";
import DeletePolicyAssignmentRuleModal from "./deletePolicyAssignmentRuleModal";
import EditPolicyAssignmentRuleModal from "./EditPolicyAssignmentRuleModal";
import PolicyAssignmentRuleHistoryTable from "./PolicyAssignmentRuleHistoryTable";
import PolicyAssignmentRuleSearchFilter from "./PolicyAssignmentRuleSearchFilter";
import {
  useAllPolicyAssignmentRules,
  useUpdatePolicyAssignmentRule,
  useDeletePolicyAssignmentRule,
} from "../../../../../../services/core/settings/ModHrm/LeavePolicyAssignmentRule/policyAssignmentRule.query";
import { ActiveFiscalYear } from "../../../../../../services/core/fyNameList";

interface PolicyAssignmentRuleHistorySectionProps {
  leavePolicyId: UUID;
}

const PolicyAssignmentRuleHistorySection: FC<
  PolicyAssignmentRuleHistorySectionProps
> = ({ leavePolicyId }) => {
  // React Query: get all policy assignment rules
  const {
    data: policyAssignmentRules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAllPolicyAssignmentRules(leavePolicyId);

  // React Query: update & delete
  const updateMutation = useUpdatePolicyAssignmentRule();
  const deleteMutation = useDeletePolicyAssignmentRule();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPolicyAssignmentRule, setEditingPolicyAssignmentRule] =
    useState<PolicyAssignmentRuleListDto | null>(null);
  const [deletingPolicyAssignmentRule, setDeletingPolicyAssignmentRule] =
    useState<PolicyAssignmentRuleListDto | null>(null);

  // Filtered results
  const filteredPolicyAssignmentRules = policyAssignmentRules.filter((rule) =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit handlers
  const handleEdit = (rule: PolicyAssignmentRuleListDto) =>
    setEditingPolicyAssignmentRule(rule);
  const handleCloseEditModal = () => setEditingPolicyAssignmentRule(null);

  const handleEditPolicyAssignmentRule = async (
    updated: PolicyAssignmentRuleModDto,
  ) => {
    if (!editingPolicyAssignmentRule) return;
    try {
      await updateMutation.mutateAsync({
        ...updated,
        id: editingPolicyAssignmentRule.id,
      });
      refetch();
      handleCloseEditModal();
    } catch (err) {
      console.error("Failed to update policy assignment rule:", err);
    }
  };

  // Delete handlers
  const handleDelete = (rule: PolicyAssignmentRuleListDto) =>
    setDeletingPolicyAssignmentRule(rule);
  const handleCloseDeleteModal = () => setDeletingPolicyAssignmentRule(null);

  const handleDeletePolicyAssignmentRule = async () => {
    if (!deletingPolicyAssignmentRule) return;
    try {
      await deleteMutation.mutateAsync(deletingPolicyAssignmentRule.id as UUID);
      refetch();
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to delete policy assignment rule:", err);
    }
  };

  const { getActiveFiscalYear } = ActiveFiscalYear();
  const fy = getActiveFiscalYear.data ?? [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pb-2"
      >
        <PolicyAssignmentRuleSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Error state */}
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

      {/* No data message */}
      {!isLoading && filteredPolicyAssignmentRules.length === 0 && !isError && (
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

      {/* Table */}
      {!isLoading && filteredPolicyAssignmentRules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PolicyAssignmentRuleHistoryTable
            policyAssignmentRule={filteredPolicyAssignmentRules}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={() => {}} // you can implement toggle later
          />
        </motion.div>
      )}

      {/* Edit Modal */}
      <EditPolicyAssignmentRuleModal
        isOpen={!!editingPolicyAssignmentRule}
        onClose={handleCloseEditModal}
        onEditLeavePolicyConfig={handleEditPolicyAssignmentRule}
        leavePolicyConfig={editingPolicyAssignmentRule}
        leavePolicyId={leavePolicyId}
        fiscalYear={fy}
      />

      {/* Delete Modal */}
      <DeletePolicyAssignmentRuleModal
        isOpen={!!deletingPolicyAssignmentRule}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeletePolicyAssignmentRule}
        leavePolicyConfig={deletingPolicyAssignmentRule}
      />
    </div>
  );
};

export default PolicyAssignmentRuleHistorySection;
