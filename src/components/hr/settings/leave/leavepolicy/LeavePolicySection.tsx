import { motion } from "framer-motion";
import { useState } from "react";
import LeavePolicyHeader from './LeavePolicyHeader';
import LeavePolicySearchFilters from './LeavePolicySearchFilter';
import LeavePolicyCard from "./LeavePolicyCard";
import AddLeavePolicyModal from "./AddLeavePolicyModal";
import EditLeavePolicyModal from "./EditLeavePolicyModal";
import DeleteLeavePolicyModal from "./DeleteLeavePolicyModal";
import type { LeavePolicyListDto, LeavePolicyAddDto, LeavePolicyModDto, LeaveTypeOptionDto } from '../../../../../types/hr/leavepolicy';

interface LeavePolicySectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  leavePolicies: LeavePolicyListDto[];
  onEdit: (policy: LeavePolicyListDto | LeavePolicyModDto) => void;
  onDelete: (policy: LeavePolicyListDto) => void;
  onAddClick: () => void;
  leaveTypeOptions: LeaveTypeOptionDto[];
  onAddLeavePolicy: (policy: LeavePolicyAddDto) => void;
  isAddPolicyModalOpen: boolean;
  onCloseAddPolicyModal: () => void;
  onOpenAddPolicyModal: () => void;
}

const LeavePolicySection: React.FC<LeavePolicySectionProps> = ({
  searchTerm,
  setSearchTerm,
  leavePolicies,
  onEdit,
  onDelete,
  leaveTypeOptions,
  onAddLeavePolicy,
  isAddPolicyModalOpen,
  onCloseAddPolicyModal,
  onOpenAddPolicyModal
}) => {
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicyListDto | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<LeavePolicyListDto | null>(null);

  const handleEdit = (policy: LeavePolicyListDto) => {
    setEditingPolicy(policy);
  };

  const handleDelete = (policy: LeavePolicyListDto) => {
    setDeletingPolicy(policy);
  };

  const handleSaveEdit = (updatedPolicy: LeavePolicyModDto) => {
    console.log('Updating policy:', updatedPolicy);
    onEdit(updatedPolicy);
    setEditingPolicy(null);
  };

  const handleConfirmDelete = (policy: LeavePolicyListDto) => {
    onDelete(policy);
    setDeletingPolicy(null);
  };

  const handleCloseEditModal = () => {
    setEditingPolicy(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingPolicy(null);
  };

  return (
    <>
      {/* Leave Policy Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LeavePolicyHeader />
      </motion.div>

      {/* Search and Filters Section for Leave Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pb-2" // Reduced bottom padding
      >
        <LeavePolicySearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={onOpenAddPolicyModal}
        />
      </motion.div>

      {/* Leave Policies Content - Grid View Only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-0 pb-0" // Removed top padding
      >
        {leavePolicies.length === 0 ? (
          <div className="text-center py-8"> {/* Reduced padding */}
            <div className="text-gray-500 text-lg">
              No leave policies found matching your search.
            </div>
            <p className="text-gray-400 mt-2">
              Try adjusting your search terms or add a new leave policy.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Grid only */}
            {leavePolicies.map((policy) => (
              <LeavePolicyCard
                key={policy.id}
                leavePolicy={policy}
                viewMode="grid" // Hardcoded to grid
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Leave Policy Modal */}
      <AddLeavePolicyModal
        isOpen={isAddPolicyModalOpen}
        onClose={onCloseAddPolicyModal}
        onAddLeavePolicy={onAddLeavePolicy}
        leaveTypeOptions={leaveTypeOptions}
      />

      {/* Edit Leave Policy Modal */}
      <EditLeavePolicyModal
        isOpen={!!editingPolicy}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        policy={editingPolicy}
        leaveTypeOptions={leaveTypeOptions}
      />

      {/* Delete Leave Policy Modal */}
      <DeleteLeavePolicyModal
        policy={deletingPolicy}
        isOpen={!!deletingPolicy}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default LeavePolicySection;