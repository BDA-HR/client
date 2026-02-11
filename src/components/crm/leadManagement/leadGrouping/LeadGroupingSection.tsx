import { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '../../../../layout/layout';
import LeadGroupingHeader from './LeadGroupingHeader';
import LeadGroupingTable from './LeadGroupingTable';
import AddLeadGroupModal from './AddLeadGroupModal';
import LeadGroupConditionModal from './LeadGroupConditionModal';

export interface LeadGroup {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockLeadGroups: LeadGroup[] = [
  {
    id: '1',
    name: 'High Value Prospects',
    code: 'HVP',
    status: 'Active',
    leadCount: 45,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Website Leads',
    code: 'WEB',
    status: 'Active',
    leadCount: 120,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    name: 'Enterprise Leads',
    code: 'ENT',
    status: 'Active',
    leadCount: 28,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
];

export default function LeadGroupingSection() {
  const [leadGroups, setLeadGroups] = useState<LeadGroup[]>(mockLeadGroups);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LeadGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<LeadGroup | null>(null);

  const handleAddGroup = (groupData: Omit<LeadGroup, 'id' | 'leadCount' | 'createdAt' | 'updatedAt'>) => {
    const newGroup: LeadGroup = {
      ...groupData,
      id: Date.now().toString(),
      leadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLeadGroups([...leadGroups, newGroup]);
    showToast.success('Lead group created successfully');
  };

  const handleEditGroup = (groupData: Omit<LeadGroup, 'id' | 'leadCount' | 'createdAt' | 'updatedAt'>) => {
    if (editingGroup) {
      const updatedGroups = leadGroups.map(group =>
        group.id === editingGroup.id
          ? { ...group, ...groupData, updatedAt: new Date().toISOString() }
          : group
      );
      setLeadGroups(updatedGroups);
      showToast.success('Lead group updated successfully');
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this lead group?')) {
      setLeadGroups(leadGroups.filter(group => group.id !== groupId));
      showToast.success('Lead group deleted successfully');
    }
  };

  const handleConditionClick = (group: LeadGroup) => {
    setSelectedGroup(group);
    setIsConditionModalOpen(true);
  };

  const handleEdit = (group: LeadGroup) => {
    setEditingGroup(group);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingGroup(null);
  };

  const handleCloseConditionModal = () => {
    setIsConditionModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <LeadGroupingHeader onAddGroup={() => setIsAddModalOpen(true)} />

      <LeadGroupingTable
        leadGroups={leadGroups}
        onEdit={handleEdit}
        onDelete={handleDeleteGroup}
        onConditionClick={handleConditionClick}
      />

      <AddLeadGroupModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingGroup ? handleEditGroup : handleAddGroup}
        editingGroup={editingGroup}
      />

      {selectedGroup && (
        <LeadGroupConditionModal
          isOpen={isConditionModalOpen}
          onClose={handleCloseConditionModal}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
        />
      )}
    </motion.div>
  );
}
