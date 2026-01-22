import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type {
  LeaveAppChainListDto,
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
import { leavePolicyService } from "../../../../../services/core/settings/ModHrm/LeavePolicyService";
import type {
  LeaveAppStepAddDto,
  LeaveAppStepListDto,
} from "../../../../../types/core/Settings/leaveAppStep";
import { leaveAppStepServices } from "../../../../../services/core/settings/ModHrm/leaveAppStepService";
import { toast } from "react-hot-toast";

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
  const { listByChain, create: createStep } = leaveAppStepServices(
    activeChainId ?? undefined,
  );

  // Get actual active chain data
  const activeChain = activeAppChain.data;

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
    if (activeChain) {
      setActiveChainId(activeChain.id);
      toast.success(`Active chain loaded: ${activeChain.effectiveFromStr}`);
    }
  }, [activeChain]);

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

  const [isAddAppChainModalOpen, setIsAddAppChainModalOpen] = useState(false);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);

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
        className="pb-2"
      >
        <LeaveAppChainSearchFilters
          onAddClick={() => setIsAddAppChainModalOpen(true)}
          onViewHistory={() =>
            navigate(`/settings/hr/leave/leaveAppChainHistory/${leavePolicyId}`)
          }
        />
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
        leaveAppChainId={activeChainId ?? ("" as UUID)}
      />

      {/* Approval Steps */}
      {activeChain && (
        <LeaveAppStepCard
          steps={listByChain.data ?? []}
          loading={listByChain.isLoading}
          effectiveFrom={activeChain.effectiveFromStr}
          effectiveTo={activeChain.effectiveToStr}
          onAddStepClick={() => setIsAddStepModalOpen(true)}
        />
      )}
    </div>
  );
};

export default LeaveAppChainSection;
