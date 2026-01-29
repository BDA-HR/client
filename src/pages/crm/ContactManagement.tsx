import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockContacts } from '../../data/crmMockData';
import ContactList from '../../components/crm/contactManagement/components/ContactList';
import ContactForm from '../../components/crm/contactManagement/components/ContactForm';
import ContactFilters from '../../components/crm/contactManagement/components/ContactFilters';
import ContactStats from '../../components/crm/contactManagement/components/ContactStats';
import type { Contact } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  stage: string;
  company: string;
  tags: string[];
  isActive: string;
  owner: string;
  dateRange: string;
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    stage: 'all',
    company: 'all',
    tags: [],
    isActive: 'all',
    owner: 'all',
    dateRange: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Filter contacts based on current filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      contact.jobTitle.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStage = filters.stage === 'all' || contact.stage === filters.stage;
    const matchesCompany = filters.company === 'all' || contact.company === filters.company;
    const matchesActive = filters.isActive === 'all' || 
      (filters.isActive === 'active' ? contact.isActive : !contact.isActive);
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.some(tag => contact.tags.includes(tag));
    
    const matchesDate = filters.dateRange === 'all' || (() => {
      const contactDate = new Date(contact.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case 'today':
          return contactDate >= today;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return contactDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          return contactDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
          return contactDate >= quarterAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStage && matchesCompany && matchesActive && matchesTags && matchesDate;
  });

  const handleAddContact = (contactData: Partial<Contact>) => {
    const contact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      stage: 'Lead', // Default stage
      owner: 'Current User', // In real app, get from auth
      consentStatus: 'pending'
    } as Contact;
    
    setContacts([...contacts, contact]);
    showToast.success('Contact added successfully');
  };

  const handleEditContact = (contactData: Partial<Contact>) => {
    if (selectedContact) {
      const updatedContacts = contacts.map(contact => 
        contact.id === selectedContact.id 
          ? { ...contact, ...contactData, updatedAt: new Date().toISOString() }
          : contact
      );
      setContacts(updatedContacts);
      setSelectedContact(null);
      showToast.success('Contact updated successfully');
    }
  };

  const handleDeleteContact = (contactId: string) => {
    // Soft delete - mark as inactive instead of removing
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, isActive: false, updatedAt: new Date().toISOString() }
        : contact
    );
    setContacts(updatedContacts);
    showToast.success('Contact archived successfully');
  };

  const handleBulkAction = (action: string, contactIds: string[]) => {
    switch (action) {
      case 'delete':
        const updatedContacts = contacts.map(contact => 
          contactIds.includes(contact.id) 
            ? { ...contact, isActive: false, updatedAt: new Date().toISOString() }
            : contact
        );
        setContacts(updatedContacts);
        setSelectedContacts([]);
        showToast.success(`${contactIds.length} contact(s) archived successfully`);
        break;
      case 'stage-prospect':
      case 'stage-customer':
        const newStage = action.replace('stage-', '') as Contact['stage'];
        const stageUpdatedContacts = contacts.map(contact => 
          contactIds.includes(contact.id) 
            ? { ...contact, stage: newStage, updatedAt: new Date().toISOString() }
            : contact
        );
        setContacts(stageUpdatedContacts);
        setSelectedContacts([]);
        showToast.success(`${contactIds.length} contact(s) moved to ${newStage} stage`);
        break;
      case 'export':
        // In real app, implement CSV/Excel export
        showToast.success('Export functionality will be implemented');
        break;
    }
  };

  const handleSelectContact = (contactId: string, selected: boolean) => {
    if (selected) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      stage: 'all',
      company: 'all',
      tags: [],
      isActive: 'all',
      owner: 'all',
      dateRange: 'all'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600">Manage your business contacts and relationships</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
      <ContactStats contacts={contacts} />

      {/* Filters */}
      <ContactFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        totalCount={contacts.length}
        filteredCount={filteredContacts.length}
      />

      {/* Contacts List */}
      <ContactList
        contacts={filteredContacts}
        onEdit={(contact) => {
          setSelectedContact(contact);
          setIsEditDialogOpen(true);
        }}
        onDelete={handleDeleteContact}
        onBulkAction={handleBulkAction}
        selectedContacts={selectedContacts}
        onSelectContact={handleSelectContact}
        onSelectAll={handleSelectAll}
      />

      {/* Add Contact Form */}
      <ContactForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddContact}
        mode="add"
      />

      {/* Edit Contact Form */}
      <ContactForm
        contact={selectedContact}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={handleEditContact}
        mode="edit"
      />
    </motion.div>
  );
}