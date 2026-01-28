import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type {
  LeaveAppChainAddDto,
  UUID,
} from "../../../../../types/core/Settings/leaveAppChain";
import LeaveAppChainHeader from "./LeaveAppChainHeader";
import LeaveAppChainSearchFilters from "./LeaveAppChainSearchFilter";
import AddLeaveAppChainModal from "./AddLeaveAppChainModal";
import { leaveAppChainServices } from "../../../../../services/core/settings/ModHrm/leaveAppChainServices";
import LeaveAppStepCard from "./LeaveAppStep/leaveAppStepCard";
import { useNavigate } from "react-router-dom";
import AddLeaveAppStepModal from "./LeaveAppStep/AddLeaveAppStepModal";
import LeaveAppStepListModal from "./LeaveAppStep/LeaveAppStepListModal";
import { leavePolicyService } from "../../../../../services/core/settings/ModHrm/LeavePolicyService";
import type {
  LeaveAppStepAddDto,
  LeaveAppStepModDto,
} from "../../../../../types/core/Settings/leaveAppStep";
import { leaveAppStepServices } from "../../../../../services/core/settings/ModHrm/leaveAppStepService";
import { toast } from "react-hot-toast";
import { employeeService } from "../../../../../services/hr/employee/employeeName";

interface LeaveAppChainSectionProps {
  leavePolicyId: UUID;
}

const LeaveAppChainSection: React.FC<LeaveAppChainSectionProps> = ({
  leavePolicyId,
}) => {
  const [leavePolicyName, setLeavePolicyName] =
    useState<string>("Leave Policy");
  const [policyLoading, setPolicyLoading] = useState<boolean>(true);
  const [activeChainId, setActiveChainId] = useState<UUID | null>(null);

  const navigate = useNavigate();

  // Services
  const { create, activeAppChain } = leaveAppChainServices(leavePolicyId);

  // Wait until we have an activeChainId before enabling step query
  const { listByChain, create: createStep, update: updateStep, remove: deleteStep } = leaveAppStepServices(
    activeChainId ?? undefined,
  );

  // Fetch leave policy name
  useEffect(() => {
    const fetchLeavePolicyName = async () => {
      if (!leavePolicyId) return setPolicyLoading(false);
      try {
        setPolicyLoading(true);
        const policy =
          await leavePolicyService.getLeavePolicyById(leavePolicyId);
        setLeavePolicyName(policy.name);
      } catch (err: any) {
        console.error(err);
        setLeavePolicyName("Leave Policy");
      } finally {
        setPolicyLoading(false);
      }
    };
    fetchLeavePolicyName();
  }, [leavePolicyId]);

  // Set active chain ID when loaded
  useEffect(() => {
    if (activeAppChain.data) {
      console.log("Active chain data loaded:", activeAppChain.data);
      setActiveChainId(activeAppChain.data.id);
    } else if (activeAppChain.data === null && !activeAppChain.isLoading) {
      // Explicitly handle when there's no active chain
      console.log("No active chain found, resetting activeChainId");
      setActiveChainId(null);
    }
  }, [activeAppChain.data, activeAppChain.isLoading]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("Active chain query state:", {
      data: activeAppChain.data,
      isLoading: activeAppChain.isLoading,
      error: activeAppChain.error,
      status: activeAppChain.status,
    });
  }, [activeAppChain]);

  // Handlers
  const handleAddLeaveAppChain = async (appChainData: LeaveAppChainAddDto) => {
    try {
      const payload = { ...appChainData, leavePolicyId };
      await create.mutateAsync(payload);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create leave approval chain");
    }
  };

  const handleAddStep = async (stepData: LeaveAppStepAddDto) => {
    if (!activeChainId) {
      toast.error("Cannot add step: no active approval chain found");
      return;
    }

    try {
      await createStep.mutateAsync(stepData);
      toast.success("Approval step created successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create approval step");
    }
  };

  const handleUpdateStep = async (stepData: LeaveAppStepModDto) => {
    try {
      await updateStep.mutateAsync(stepData);
    } catch (err: any) {
      console.error(err);
      throw err; // Re-throw to let the modal handle the error display
    }
  };

  const handleDeleteStep = async (stepId: UUID) => {
    try {
      await deleteStep.mutateAsync(stepId);
    } catch (err: any) {
      console.error(err);
      throw err; // Re-throw to let the modal handle the error display
    }
  };

  const [isAddAppChainModalOpen, setIsAddAppChainModalOpen] = useState(false);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [isManageStepsModalOpen, setIsManageStepsModalOpen] = useState(false);

  const { getAllNames } = employeeService();

  const employees = getAllNames.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LeaveAppChainHeader
          leavePolicyName={policyLoading ? "Loading..." : leavePolicyName}
        />
      </motion.div>

      {/* Search Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className=" border rounded-lg"
      >
        <LeaveAppChainSearchFilters
          onAddClick={() => setIsAddAppChainModalOpen(true)}
          onViewHistory={() =>
            navigate(`/settings/hr/leave/leaveAppChainHistory/${leavePolicyId}`)
          }
        />

        {/* Approval Steps */}
        {activeAppChain.isLoading ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-b-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading approval chain...</p>
          </div>
        ) : activeAppChain.data ? (
          <LeaveAppStepCard
            steps={listByChain.data ?? []}
            loading={listByChain.isLoading}
            effectiveFrom={activeAppChain.data.effectiveFromStr}
            effectiveTo={activeAppChain.data.effectiveToStr}
            onAddStepClick={() => setIsAddStepModalOpen(true)}
            onManageStepsClick={() => setIsManageStepsModalOpen(true)}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-b-lg">
            <p className="text-gray-500">No active approval chain found.</p>
            <p className="text-gray-500 mb-4">Please add new approval chain.</p>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AddLeaveAppChainModal
        isOpen={isAddAppChainModalOpen}
        onClose={() => setIsAddAppChainModalOpen(false)}
        onAddLeaveAppChain={handleAddLeaveAppChain}
        leavePolicyId={leavePolicyId}
      />

      <AddLeaveAppStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        onAddLeaveAppStep={handleAddStep}
        leavePolicyId={leavePolicyId}
        employees={employees}
      />

      <LeaveAppStepListModal
        isOpen={isManageStepsModalOpen}
        onClose={() => setIsManageStepsModalOpen(false)}
        steps={listByChain.data ?? []}
        onUpdateStep={handleUpdateStep}
        onDeleteStep={handleDeleteStep}
        employees={employees}
        loading={listByChain.isLoading}
      />
    </div>
  );
};;

export default LeaveAppChainSection;
