import { motion } from "framer-motion";
import { useState } from "react";
import type { UUID } from "crypto";

import type {
  LeavePolicyAddDto,
  LeavePolicyListDto,
  LeavePolicyModDto,
  LeaveTypeOptionDto,
} from "../../../../types/core/Settings/leavepolicy";
import { PolicyStatus, YesNo } from "../../../../types/core/enum";
import LeavePolicySection from "../../../../components/settings/hrSettings/leave/leavepolicy/LeavePolicySection";

/* -------------------------------- helpers -------------------------------- */

const booleanToYesNo = (value: boolean) => (value ? YesNo["0"] : YesNo["1"]);

/* -------------------------------- component -------------------------------- */

const LeavePolicy = () => {
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [policyViewMode, setPolicyViewMode] = useState<"grid" | "list">("grid");

  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);

  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyListDto[]>([]);

  /* 🔹 Leave types come from API later */
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<
    LeaveTypeOptionDto[]
  >([]);

  const getLeaveTypeName = (leaveTypeId: UUID) =>
    leaveTypeOptions.find((lt) => lt.id === leaveTypeId)?.name ?? "Unknown";

  /* ------------------------------- filtering -------------------------------- */
  const filteredLeavePolicies = leavePolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(policySearchTerm.toLowerCase()) ||
      policy.leaveType.toLowerCase().includes(policySearchTerm.toLowerCase())
  );

  /* ----------------------------- add policy --------------------------------- */
  const handleAddLeavePolicy = (policyData: LeavePolicyAddDto) => {
    const newLeavePolicy: LeavePolicyListDto = {
      id: crypto.randomUUID() as UUID,

      leaveTypeId: policyData.leaveTypeId,
      code: policyData.code,
      name: policyData.name,

      allowEncashment: policyData.allowEncashment,
      requiresAttachment: policyData.requiresAttachment,
      status: policyData.status,

      leaveType: getLeaveTypeName(policyData.leaveTypeId),

      statusStr: policyData.status as PolicyStatus,
      allowEncashmentStr: booleanToYesNo(policyData.allowEncashment),
      requiresAttachmentStr: booleanToYesNo(policyData.requiresAttachment),

      createdAt: new Date().toISOString(),
      createdAtAm: "", // populate when Amharic calendar exists
      modifiedAt: new Date().toISOString(),
      modifiedAtAm: "",
      rowVersion: "1",
      isDeleted: false,
    };

    setLeavePolicies((prev) => [...prev, newLeavePolicy]);
    setIsAddPolicyModalOpen(false);
  };

  /* ----------------------------- edit policy -------------------------------- */
  const handlePolicyEdit = (policy: LeavePolicyModDto) => {
    setLeavePolicies((prev) =>
      prev.map((p) =>
        p.id === policy.id
          ? {
              ...p,
              code: policy.code,
              name: policy.name,
              allowEncashment: policy.allowEncashment,
              requiresAttachment: policy.requiresAttachment,
              status: policy.status,
              leaveTypeId: policy.leaveTypeId,

              leaveType: getLeaveTypeName(policy.leaveTypeId),

              statusStr: policy.status as PolicyStatus,
              allowEncashmentStr: booleanToYesNo(policy.allowEncashment),
              requiresAttachmentStr: booleanToYesNo(policy.requiresAttachment),

              updatedAt: new Date().toISOString(),
              updatedBy: "user",
              rowVersion: policy.rowVersion,
            }
          : p
      )
    );
  };

  /* ---------------------------- delete policy -------------------------------- */
  const handlePolicyDelete = (policy: LeavePolicyListDto) => {
    setLeavePolicies((prev) => prev.filter((p) => p.id !== policy.id));
  };

  /* ---------------------------- modal control -------------------------------- */
  const handleOpenAddPolicyModal = () => setIsAddPolicyModalOpen(true);

  const handleCloseAddPolicyModal = () => setIsAddPolicyModalOpen(false);

  /* -------------------------------- render ---------------------------------- */
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >

      <LeavePolicySection
        searchTerm={policySearchTerm}
        setSearchTerm={setPolicySearchTerm}
        viewMode={policyViewMode}
        setViewMode={setPolicyViewMode}
        leavePolicies={filteredLeavePolicies}
        onEdit={handlePolicyEdit}
        onDelete={handlePolicyDelete}
        onAddClick={handleOpenAddPolicyModal}
        leaveTypeOptions={leaveTypeOptions}
        onAddLeavePolicy={handleAddLeavePolicy}
        isAddPolicyModalOpen={isAddPolicyModalOpen}
        onCloseAddPolicyModal={handleCloseAddPolicyModal}
        onOpenAddPolicyModal={handleOpenAddPolicyModal}
      />
    </motion.section>
  );
};

export default LeavePolicy;
