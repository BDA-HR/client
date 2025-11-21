import { motion } from "framer-motion";
import { useState } from "react";
import LeaveSearchFilters from './LeaveSearchFilter';
import LeaveTypeCard from "./LeaveTypeCard";
import AddLeaveTypeModal from "./AddLeaveTypeModal";
import EditLeaveTypeModal from "./EditLeaveTypeModal";
import DeleteLeaveTypeModal from "./DeleteLeaveTypeModal";
import type { LeaveTypeListDto, LeaveTypeAddDto, LeaveTypeModDto } from '../../../../../types/hr/leavetype';

interface LeaveTypeSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  leaveTypes: LeaveTypeListDto[];
  onEdit: (leaveType: LeaveTypeListDto | LeaveTypeModDto) => void;
  onDelete: (leaveType: LeaveTypeListDto) => void;
  isAddModalOpen: boolean;
  onAddLeaveType: (leaveType: LeaveTypeAddDto) => void;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

const LeaveTypeSection: React.FC<LeaveTypeSectionProps> = ({
  searchTerm,
  setSearchTerm,
  leaveTypes,
  onEdit,
  onDelete,
  isAddModalOpen,
  onAddLeaveType,
  onCloseAddModal,
  onOpenAddModal
}) => {
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveTypeListDto | null>(null);
  const [deletingLeaveType, setDeletingLeaveType] = useState<LeaveTypeListDto | null>(null);

  const handleEdit = (leaveType: LeaveTypeListDto) => {
    setEditingLeaveType(leaveType);
  };

  const handleDelete = (leaveType: LeaveTypeListDto) => {
    setDeletingLeaveType(leaveType);
  };

  const handleSaveEdit = (updatedLeaveType: LeaveTypeModDto) => {
    console.log('Updating leave type:', updatedLeaveType);
    onEdit(updatedLeaveType);
    setEditingLeaveType(null);
  };

  const handleConfirmDelete = (leaveType: LeaveTypeListDto) => {
    onDelete(leaveType);
    setDeletingLeaveType(null);
  };

  const handleCloseEditModal = () => {
    setEditingLeaveType(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingLeaveType(null);
  };

  return (
    <>
      {/* Search and Filters Section for Leave Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pb-2"
      >
        <LeaveSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={onOpenAddModal}
        />
      </motion.div>

      {/* Leave Types Content - Grid View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-0 pb-0 -mt-2"
      >
        {leaveTypes.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-gray-500 text-lg">
              No leave types found matching your search.
            </div>
            <p className="text-gray-400 mt-2">
              Try adjusting your search terms or add a new leave type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {leaveTypes.map((leaveType) => (
              <LeaveTypeCard
                key={leaveType.id}
                leaveType={leaveType}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Leave Type Modal */}
      <AddLeaveTypeModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onAddLeaveType={onAddLeaveType}
      />

      {/* Edit Leave Type Modal */}
      <EditLeaveTypeModal
        isOpen={!!editingLeaveType}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        leaveType={editingLeaveType}
      />

      {/* Delete Leave Type Modal */}
      <DeleteLeaveTypeModal
        leaveType={deletingLeaveType}
        isOpen={!!deletingLeaveType}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default LeaveTypeSection;