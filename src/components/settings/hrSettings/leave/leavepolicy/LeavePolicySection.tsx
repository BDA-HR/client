import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from 'lucide-react';
import { leavePolicyService } from '../../../../../services/hr/settings/LeaveSet/LeavePolicyService';
import { leaveTypeService } from '../../../../../services/hr/settings/LeaveSet/LeaveTypeService';
import type { 
  LeavePolicyListDto, 
  LeavePolicyAddDto, 
  LeavePolicyModDto, 
  LeaveTypeOptionDto,
  UUID 
} from '../../../../../types/hr/leavepolicy';
import LeavePolicyHeader from './LeavePolicyHeader';
import LeavePolicySearchFilters from './LeavePolicySearchFilter';
import LeavePolicyCard from "./LeavePolicyCard";
import AddLeavePolicyModal from "./AddLeavePolicyModal";
import EditLeavePolicyModal from "./EditLeavePolicyModal";
import DeleteLeavePolicyModal from "./DeleteLeavePolicyModal";

const LeavePolicySection: React.FC = () => {
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyListDto[]>([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<LeaveTypeOptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicyListDto | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<LeavePolicyListDto | null>(null);

  // Filter leave policies based on search term
  const filteredLeavePolicies = leavePolicies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchLeavePolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const policiesData = await leavePolicyService.getAllLeavePolicies();
      setLeavePolicies(policiesData);
    } catch (err) {
      console.error('Failed to fetch leave policies:', err);
      setError('Failed to load leave policies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypeOptions = async () => {
    try {
      const leaveTypes = await leaveTypeService.getAllLeaveTypes();
      const options: LeaveTypeOptionDto[] = leaveTypes.map(lt => ({
        id: lt.id,
        name: lt.name,
      }));
      setLeaveTypeOptions(options);
    } catch (err) {
      console.error('Failed to fetch leave type options:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchLeavePolicies(),
        fetchLeaveTypeOptions()
      ]);
    };
    fetchData();
  }, []);

  const handleAddLeavePolicy = async (policyData: LeavePolicyAddDto) => {
    try {
      const newPolicy = await leavePolicyService.createLeavePolicy(policyData);
      setLeavePolicies((prev) => [...prev, newPolicy]);
      setIsAddPolicyModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Failed to create leave policy:', err);
      setError('Failed to create leave policy. Please try again.');
      throw err;
    }
  };

  const handleEditLeavePolicy = async (updatedPolicy: LeavePolicyModDto) => {
    try {
      const result = await leavePolicyService.updateLeavePolicy(updatedPolicy);
      setLeavePolicies((prev) =>
        prev.map((policy) => (policy.id === result.id ? result : policy))
      );
      setEditingPolicy(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update leave policy:', err);
      setError('Failed to update leave policy. Please try again.');
      throw err;
    }
  };

  const handleDeleteLeavePolicy = async (policyId: UUID) => {
    try {
      await leavePolicyService.deleteLeavePolicy(policyId);
      setLeavePolicies((prev) => prev.filter((policy) => policy.id !== policyId));
      setDeletingPolicy(null);
      setError(null);
    } catch (err) {
      console.error('Failed to delete leave policy:', err);
      setError('Failed to delete leave policy. Please try again.');
    }
  };

  const handleOpenAddModal = () => {
    setIsAddPolicyModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddPolicyModalOpen(false);
  };

  const handleEdit = (policy: LeavePolicyListDto) => {
    setEditingPolicy(policy);
  };

  const handleDelete = (policy: LeavePolicyListDto) => {
    setDeletingPolicy(policy);
  };

  const handleCloseEditModal = () => {
    setEditingPolicy(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingPolicy(null);
  };

  return (
    <div className="space-y-6">
      {/* Leave Policy Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LeavePolicyHeader />
        </motion.div>
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
                  Failed to load leave policies.{" "}
                  <button
                    onClick={fetchLeavePolicies}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                  >
                    Try again
                  </button>{" "}
                  later.
                </>
              ) : error.includes("create") ? (
                "Failed to create leave policy. Please try again."
              ) : error.includes("update") ? (
                "Failed to update leave policy. Please try again."
              ) : error.includes("delete") ? (
                "Failed to delete leave policy. Please try again."
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

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      )}


      {/* Search and Filters Section for Leave Policies */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-2"
        >
          <LeavePolicySearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddClick={handleOpenAddModal}
          />
        </motion.div>
      )}
      {!loading && leavePolicies.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">No Leave Policies Found</h3>
              <p className="text-yellow-700 text-sm mt-1">
                There are currently no leave policies in the system. Please add a leave policy to get started.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leave Policies Content - Grid View Only */}
      {!loading && leavePolicies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-0 pb-0"
        >
          {filteredLeavePolicies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">
                No leave policies found matching your search.
              </div>
              <p className="text-gray-400 mt-2">
                Try adjusting your search terms or add a new leave policy.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredLeavePolicies.map((policy) => (
                <LeavePolicyCard
                  key={policy.id}
                  leavePolicy={policy}
                  viewMode="grid"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Add Leave Policy Modal */}
      <AddLeavePolicyModal
        isOpen={isAddPolicyModalOpen}
        onClose={handleCloseAddModal}
        onAddLeavePolicy={handleAddLeavePolicy}
        leaveTypeOptions={leaveTypeOptions}
      />

      {/* Edit Leave Policy Modal */}
      <EditLeavePolicyModal
        isOpen={!!editingPolicy}
        onClose={handleCloseEditModal}
        onSave={handleEditLeavePolicy}
        policy={editingPolicy}
        leaveTypeOptions={leaveTypeOptions}
      />

      {/* Delete Leave Policy Modal */}
      <DeleteLeavePolicyModal
        policy={deletingPolicy}
        isOpen={!!deletingPolicy}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteLeavePolicy}
      />
    </div>
  );
};

export default LeavePolicySection;