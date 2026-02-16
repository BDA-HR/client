import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { showToast } from "../../../../layout/layout";
import { useCRMSettings } from "../../../../hooks/useCRMSettings";
import LeadStatusesHeader from "./LeadStatusesHeader";
import LeadStatusesSearchFilter from "./LeadStatusesSearchFilter";
import LeadStatusesTable from "./LeadStatusesTable";
import AddLeadStatusModal from "./AddLeadStatusModal";
import EditLeadStatusModal from "./EditLeadStatusModal";
import DeleteLeadStatusModal from "./DeleteLeadStatusModal";

export interface LeadStatus {
  id: string;
  name: string;
  priority?: number;
  is_active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

const LeadStatusesSection: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<LeadStatus | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<LeadStatus | null>(null);

  const leadStatuses: LeadStatus[] = settings.leadStatuses || [];

  const saveLeadStatuses = async (updatedStatuses: LeadStatus[]) => {
    await saveSettings({ leadStatuses: updatedStatuses });
  };

  const handleAddSubmit = async (statusData: Omit<LeadStatus, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => {
    const newStatus: LeadStatus = {
      ...statusData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    await saveLeadStatuses([...leadStatuses, newStatus]);
    showToast.success("Lead status added successfully");
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (statusData: Omit<LeadStatus, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => {
    if (editingStatus) {
      const updatedStatuses = leadStatuses.map(s =>
        s.id === editingStatus.id
          ? { ...s, ...statusData, updatedAt: new Date().toISOString(), updatedBy: 'Current User' }
          : s
      );
      await saveLeadStatuses(updatedStatuses);
      showToast.success("Lead status updated successfully");
      setEditingStatus(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingStatus) {
      const updatedStatuses = leadStatuses.filter(s => s.id !== deletingStatus.id);
      await saveLeadStatuses(updatedStatuses);
      showToast.success("Lead status deleted successfully");
      setDeletingStatus(null);
    }
  };

  const handleToggleActive = async (status: LeadStatus) => {
    const updatedStatuses = leadStatuses.map(s =>
      s.id === status.id ? { ...s, is_active: !s.is_active } : s
    );
    await saveLeadStatuses(updatedStatuses);
    showToast.success(`Lead status ${!status.is_active ? 'activated' : 'deactivated'}`);
  };

  const filteredStatuses = leadStatuses.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStatuses = filteredStatuses.sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      <LeadStatusesHeader />

      <LeadStatusesSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <LeadStatusesTable
        statuses={sortedStatuses}
        onEdit={setEditingStatus}
        onDelete={setDeletingStatus}
        onToggleActive={handleToggleActive}
      />

      {filteredStatuses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Lead Statuses Found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No lead statuses match your search."
              : "Get started by creating your first lead status."}
          </p>
        </motion.div>
      )}

      <AddLeadStatusModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <EditLeadStatusModal
        isOpen={!!editingStatus}
        onClose={() => setEditingStatus(null)}
        onSubmit={handleEditSubmit}
        status={editingStatus}
      />

      <DeleteLeadStatusModal
        isOpen={!!deletingStatus}
        onClose={() => setDeletingStatus(null)}
        onConfirm={handleDeleteConfirm}
        statusName={deletingStatus?.name || ''}
      />
    </motion.section>
  );
};

export default LeadStatusesSection;
