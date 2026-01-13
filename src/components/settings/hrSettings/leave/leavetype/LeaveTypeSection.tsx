import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from 'lucide-react';
import { leaveTypeService } from '../../../../../services/core/settings/ModHrm/LeaveTypeService';
import type { LeaveTypeListDto, LeaveTypeAddDto, LeaveTypeModDto, UUID } from '../../../../../types/core/Settings/leavetype';
import LeaveSearchFilters from './LeaveSearchFilter';
import LeaveTypeCard from "./LeaveTypeCard";
import AddLeaveTypeModal from "./AddLeaveTypeModal";
import EditLeaveTypeModal from "./EditLeaveTypeModal";
import DeleteLeaveTypeModal from "./DeleteLeaveTypeModal";

const LeaveTypeSection: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveTypeListDto | null>(null);
  const [deletingLeaveType, setDeletingLeaveType] = useState<LeaveTypeListDto | null>(null);

  // Filter leave types based on search term
  const filteredLeaveTypes = leaveTypes.filter(leaveType =>
    leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const leaveTypesData = await leaveTypeService.getAllLeaveTypes();
      setLeaveTypes(leaveTypesData);
    } catch (err) {
      console.error('Failed to fetch leave types:', err);
      setError('Failed to load leave types. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleAddLeaveType = async (leaveTypeData: LeaveTypeAddDto) => {
    try {
      const newLeaveType = await leaveTypeService.createLeaveType(leaveTypeData);
      setLeaveTypes((prev) => [...prev, newLeaveType]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Failed to create leave type:', err);
      setError('Failed to create leave type. Please try again.');
      throw err;
    }
  };

  const handleEditLeaveType = async (updatedLeaveType: LeaveTypeModDto) => {
    try {
      const result = await leaveTypeService.updateLeaveType(updatedLeaveType);
      setLeaveTypes((prev) =>
        prev.map((lt) => (lt.id === result.id ? result : lt))
      );
      setEditingLeaveType(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update leave type:', err);
      setError('Failed to update leave type. Please try again.');
      throw err;
    }
  };

  const handleDeleteLeaveType = async (leaveTypeId: UUID) => {
    try {
      await leaveTypeService.deleteLeaveType(leaveTypeId);
      setLeaveTypes((prev) => prev.filter((lt) => lt.id !== leaveTypeId));
      setDeletingLeaveType(null);
      setError(null);
    } catch (err) {
      console.error('Failed to delete leave type:', err);
      setError('Failed to delete leave type. Please try again.');
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEdit = (leaveType: LeaveTypeListDto) => {
    setEditingLeaveType(leaveType);
  };

  const handleDelete = (leaveType: LeaveTypeListDto) => {
    setDeletingLeaveType(leaveType);
  };

  const handleCloseEditModal = () => {
    setEditingLeaveType(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingLeaveType(null);
  };

  return (
    <div className="space-y-6">
      {/* Error message for API errors */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {error.includes("load") ? (
                <>
                  Failed to load leave types.{" "}
                  <button
                    onClick={fetchLeaveTypes}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                  >
                    Try again
                  </button>{" "}
                  later.
                </>
              ) : error.includes("create") ? (
                "Failed to create leave type. Please try again."
              ) : error.includes("update") ? (
                "Failed to update leave type. Please try again."
              ) : error.includes("delete") ? (
                "Failed to delete leave type. Please try again."
              ) : (
                error
              )}
            </span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

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
          onAddClick={handleOpenAddModal}
        />
      </motion.div>
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* No leave types message - Show when not loading and leaveTypes array is empty */}
      {!loading && leaveTypes.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">No Leave Types Found</h3>
              <p className="text-yellow-700 text-sm mt-1">
                There are currently no leave types in the system. Please add a leave type to get started.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leave Types Content - Grid View */}
      {!loading && leaveTypes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-0 pb-0 -mt-2"
        >
          {filteredLeaveTypes.length === 0 ? (
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
              {filteredLeaveTypes.map((leaveType) => (
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
      )}

      {/* Add Leave Type Modal */}
      <AddLeaveTypeModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddLeaveType={handleAddLeaveType}
      />

      {/* Edit Leave Type Modal */}
      <EditLeaveTypeModal
        isOpen={!!editingLeaveType}
        onClose={handleCloseEditModal}
        onSave={handleEditLeaveType}
        leaveType={editingLeaveType}
      />

      {/* Delete Leave Type Modal */}
      <DeleteLeaveTypeModal
        leaveType={deletingLeaveType}
        isOpen={!!deletingLeaveType}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteLeaveType}
      />
    </div>
  );
};

export default LeaveTypeSection;