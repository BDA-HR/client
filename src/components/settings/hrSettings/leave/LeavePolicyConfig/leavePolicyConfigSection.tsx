import { motion } from "framer-motion";
import React, { useState } from "react";
import LeavePolicyConfigPageHeader from "./leavePolicyConfigPageHeader";
import type { LeavePolicyConfigListDto, UUID } from "../../../../../types/core/Settings/leavePolicyConfig";
import LeavePolicyConfigHeader from "./LeavePolicyConfig/leaveConfigHeader";
import LeavePolicyConfigCard from "./LeavePolicyConfig/LeavePolicyConfigCard";
import AddLeavePolicyConfig from "./LeavePolicyConfig/AddLeavePolicyConfig";
import DeleteLeavePolicyConfig from "./LeavePolicyConfig/DeleteLeavePolicyConfig";
import LeaveAppChainSection from "../LeaveAppChain/LeaveAppChainSection";
import LeavePolicyConfigTable from "./LeavePolicyConfig/LeavePolicyConfigTable";
import PolicyAssignmentRuleSection from "../PolicyAssignmentRule/PolicyAssignmenRuleSection";
import { ActiveFiscalYear } from "../../../../../services/core/fyNameList";

interface LeavePolicyConfigSectionProps {
  leavePolicyId: UUID;
}

//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState<string | null>(null);
const mockActiveConfig: LeavePolicyConfigListDto[] = [{
  id: "bf250852-ed18-4dfa-931e-c726f191e38a",
  annualEntitlement: 30,
  accrualFrequency: "MONTHLY",
  accrualRate: 2.5,
  maxDaysPerReq: 25,
  maxCarryOverDays: 15,
  minServiceMonths: 6,
  isActive: true,

  annualEntitlementStr: "30 days",
  accrualFrequencyStr: "Monthly",
  accrualRateStr: "2.5",
  maxDaysPerReqStr: "25",
  maxCarryOverDaysStr: "15",
  minServiceMonthsStr: "6",
  isActiveStr: "Active",

  leavePolicy: "Executive & Senior Leave Policy",
  fiscalYear: "2025/2026",
  isDeleted: false,
  rowVersion: "AAAdE",
  createdAt: "2025-10-01T10:00:00Z",
  createdAtAm: "2025-10-01T10:00:00Z",
  modifiedAtAm: "2025-10-01T10:00:00Z",
  modifiedAt: "2025-10-01T10:00:00Z",
}];

const LeavePolicyConfigSection: React.FC<LeavePolicyConfigSectionProps> = ({
  leavePolicyId,
}) => {
    const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
      const [editingPolicy, setEditingPolicy] = useState<LeavePolicyConfigListDto | null>(
        null
      );
      const [deletingPolicy, setDeletingPolicy] =
        useState<LeavePolicyConfigListDto | null>(null);
        const { getActiveFiscalYear } = ActiveFiscalYear();
        
          const fy = getActiveFiscalYear.data ?? [];
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LeaveAppChainSection leavePolicyId={leavePolicyId} />
      </motion.div>
      {/* Error Banner */}
      {/* {error && (
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
      )} */}

      {/* Loading */}
      {/* {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )} */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pb-2"
      >
        <LeavePolicyConfigHeader
          onAddClick={() => setIsAddPolicyModalOpen(true)}
          onViewHistory={() => {}}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pb-2"
      >
        {/* <LeavePolicyConfigCard
          activeConfig={mockActiveConfig}
          loading={false}
          error={null}
          onViewDetails={() => {}}
        /> */}
        <LeavePolicyConfigTable
          leavePolicyConfig={mockActiveConfig} // empty array is fine
          onEdit={setEditingPolicy as any}
          onDelete={setDeletingPolicy as any}
        />
      </motion.div>

      {/* Modals */}
      <AddLeavePolicyConfig
        isOpen={isAddPolicyModalOpen}
        onClose={() => setIsAddPolicyModalOpen(false)}
        leavePolicyId={leavePolicyId}
        fiscalYear={fy}
        // onAddLeavePolicy={handleAddLeavePolicy}
        // leaveTypeOptions={leaveTypeOptions}
      />
      <PolicyAssignmentRuleSection leavePolicyId={leavePolicyId} />
    </div>
  );
};

export default LeavePolicyConfigSection;
