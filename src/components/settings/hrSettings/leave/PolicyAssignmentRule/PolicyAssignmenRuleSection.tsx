import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type {
  LeaveAppChainListDto,
  LeaveAppChainAddDto,
  LeaveAppChainModDto,
  UUID,
} from "../../../../../types/core/Settings/leaveAppChain";
// import EditLeaveAppChainModal from "./EditLeaveAppChainModal";
// import DeleteLeaveAppChainModal from "./DeleteLeaveAppChainModal";
import { leaveAppChainServices } from "../../../../../services/core/settings/ModHrm/leaveAppChainServices";
import PolicyAssignmentRuleTable from "./PolicyAssignmentRuleTable";
import type {  PolicyAssignmentRuleListDto } from "../../../../../types/core/Settings/policyAssignmentRule";
import PolicyAssignmentRuleHeader from "./policyAssignmentRuleHeader";
import AddPolicyAssignmentRuleModal from "./AddPolicyAssignmentRule";

// Add props interface to receive leavePolicyId
interface LeaveAppChainSectionProps {
  leavePolicyId: UUID;
}
const sampleApprovalSteps = [
  {
    id: 1,
    stepNumber: 1,
    stepName: "Initial Review",
    employeeName: "John Manager",
    role: "Manager" as const,
    avatar: "https://i.pravatar.cc/150?u=john.manager@company.com",
    isCompleted: true,
    isActive: false,
  },
  {
    id: 2,
    stepNumber: 2,
    stepName: "Department Approval",
    employeeName: "Sarah Wilson",
    role: "Manager" as const,
    avatar: "https://i.pravatar.cc/150?u=sarah.wilson@company.com",
    isCompleted: false,
    isActive: true,
  },
  {
    id: 3,
    stepNumber: 3,
    stepName: "HR Final Approval",
    employeeName: "Michael Chen",
    role: "HR" as const,
    avatar: "https://i.pravatar.cc/150?u=michael.chen@company.com",
    isCompleted: false,
    isActive: false,
  },
];

const PolicyAssignmentRuleSection: React.FC<LeaveAppChainSectionProps> = ({
  leavePolicyId,
}) => {
  const [leavePolicies, setLeavePolicies] = useState<LeaveAppChainListDto[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddPolicyAssignmentRuleModalOpen, setIsAddPolicyAssignmentRuleModalOpen] = useState(false);
  
  const { listByPolicy, create, update, remove } =
    leaveAppChainServices(leavePolicyId);

  // Fetch policies
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the React Query hook's refetch method
        const result = await listByPolicy.refetch();
        if (result.data) {
          setLeavePolicies(result.data);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load leave approval chains. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (leavePolicyId) {
      fetchData();
    }
  }, [leavePolicyId]); // Re-fetch when 

  // CRUD handlers
  const handleAddPolicyAssignmentRule = async (appChainData: LeaveAppChainAddDto) => {
    try {
      // Add leavePolicyId to the payload
      const payload = { ...appChainData, leavePolicyId };

      const newAppChain = await create.mutateAsync(payload);
      setLeavePolicies((prev) => [...prev, newAppChain]);
      setIsAddPolicyAssignmentRuleModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create leave approval chain. Please try again.");
    }
  };

  const handleEditLeaveAppChain = async (
    updatedAppChain: LeaveAppChainModDto
  ) => {
    try {
      const result = await update.mutateAsync(updatedAppChain);
      setLeavePolicies((prev) =>
        prev.map((p) => (p.id === result.id ? result : p))
      );
      // setEditingAppChain(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update leave approval chain. Please try again.");
    }
  };

  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);

  const handleDeleteLeaveAppChain = async (appChainId: UUID) => {
    try {
      await remove.mutateAsync(appChainId);
      setLeavePolicies((prev) => prev.filter((p) => p.id !== appChainId));
      // setDeletingAppChain(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete leave approval chain. Please try again.");
    }
  };
 const handleViewDetails = (stepId: number) => {
   console.log(`Viewing details for step ${stepId}`);
   // Add your logic here to show step details
 };
 const [editingPolicy, setEditingPolicy] = useState<PolicyAssignmentRuleListDto | null>(
    null
  );
  const [deletingPolicy, setDeletingPolicy] =
    useState<PolicyAssignmentRuleListDto | null>(null);
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
          onViewHistory={() => {}}
        />
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Search Filters */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-2"
        ></motion.div>
      )}

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-0 pb-0"
        >
          <PolicyAssignmentRuleTable
            policyAssignmentRule={[]}
            onEdit={setEditingPolicy as any}
            onDelete={setDeletingPolicy as any}
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
      {/* <EditLeaveAppChainModal
        isOpen={!!editingAppChain}
        onClose={() => setEditingAppChain(null)}
        onSave={handleEditLeaveAppChain}
        appChain={editingAppChain}
      />
      <DeleteLeaveAppChainModal
        isOpen={!!deletingAppChain}
        onClose={() => setDeletingAppChain(null)}
        onConfirm={() =>
          deletingAppChain && handleDeleteLeaveAppChain(deletingAppChain.id)
        }
        appChain={deletingAppChain}
      /> */}
    </div>
  );
};

export default PolicyAssignmentRuleSection;
