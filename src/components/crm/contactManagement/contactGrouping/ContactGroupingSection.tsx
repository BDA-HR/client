import { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '../../../../layout/layout';
import ContactGroupingHeader from './ContactGroupingHeader';
import ContactGroupingTable from './ContactGroupingTable';
import AddContactGroupModal from './AddContactGroupModal';
import ContactGroupConditionModal from './ContactGroupConditionModal';

export interface ContactGroup {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockContactGroups: ContactGroup[] = [
  {
    id: '1',
    name: 'VIP Customers',
    code: 'VIP',
    status: 'Active',
    contactCount: 32,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Enterprise Contacts',
    code: 'ENT',
    status: 'Active',
    contactCount: 85,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
];

export default function ContactGroupingSection() {
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>(mockContactGroups);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null);

  const handleAddGroup = (groupData: Omit<ContactGroup, 'id' | 'contactCount' | 'createdAt' | 'updatedAt'>) => {
    const newGroup: ContactGroup = {
      ...groupData,
      id: Date.now().toString(),
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContactGroups([...contactGroups, newGroup]);
    showToast.success('Contact group created successfully');
  };

  const handleEditGroup = (groupData: Omit<ContactGroup, 'id' | 'contactCount' | 'createdAt' | 'updatedAt'>) => {
    if (editingGroup) {
      const updatedGroups = contactGroups.map(group =>
        group.id === editingGroup.id
          ? { ...group, ...groupData, updatedAt: new Date().toISOString() }
          : group
      );
      setContactGroups(updatedGroups);
      showToast.success('Contact group updated successfully');
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this contact group?')) {
      setContactGroups(contactGroups.filter(group => group.id !== groupId));
      showToast.success('Contact group deleted successfully');
    }
  };

  const handleConditionClick = (group: ContactGroup) => {
    setSelectedGroup(group);
    setIsConditionModalOpen(true);
  };

  const handleEdit = (group: ContactGroup) => {
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
      <ContactGroupingHeader onAddGroup={() => setIsAddModalOpen(true)} />

      <ContactGroupingTable
        contactGroups={contactGroups}
        onEdit={handleEdit}
        onDelete={handleDeleteGroup}
        onConditionClick={handleConditionClick}
      />

      <AddContactGroupModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingGroup ? handleEditGroup : handleAddGroup}
        editingGroup={editingGroup}
      />

      {selectedGroup && (
        <ContactGroupConditionModal
          isOpen={isConditionModalOpen}
          onClose={handleCloseConditionModal}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
        />
      )}
    </motion.div>
  );
}
