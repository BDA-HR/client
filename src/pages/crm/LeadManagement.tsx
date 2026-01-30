import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import LeadList from '../../components/crm/leadManagement/components/LeadList';
import LeadForm from '../../components/crm/leadManagement/components/LeadForm';
import LeadFilters from '../../components/crm/leadManagement/components/LeadFilters';
import type { Lead } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  status: string;
  source: string;
  assignedTo: string;
  scoreRange: string;
  dateRange: string;
}

export default function LeadManagement() {
  const navigate = useNavigate();
  
  // Load leads from localStorage or use mock data
  const loadLeads = () => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      try {
        return JSON.parse(storedLeads);
      } catch (error) {
        console.error('Error parsing stored leads:', error);
        return mockLeads;
      }
    }
    return mockLeads;
  };

  const [leads, setLeads] = useState<Lead[]>(loadLeads());
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: 'all',
    source: 'all',
    assignedTo: 'all',
    scoreRange: 'all',
    dateRange: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Reload leads when component mounts or when returning from add/import pages
  useEffect(() => {
    const reloadLeads = () => {
      const storedLeads = localStorage.getItem('leads');
      if (storedLeads) {
        try {
          const parsedLeads = JSON.parse(storedLeads);
          setLeads(parsedLeads);
        } catch (error) {
          console.error('Error parsing stored leads:', error);
        }
      }
    };

    // Reload on mount
    reloadLeads();

    // Listen for storage changes (in case of updates from other tabs)
    window.addEventListener('storage', reloadLeads);
    
    // Listen for focus event (when returning to this tab/window)
    window.addEventListener('focus', reloadLeads);

    return () => {
      window.removeEventListener('storage', reloadLeads);
      window.removeEventListener('focus', reloadLeads);
    };
  }, []);

  // Filter leads based on current filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || lead.status === filters.status;
    const matchesSource = filters.source === 'all' || lead.source === filters.source;
    const matchesAssignedTo = filters.assignedTo === 'all' || 
      (filters.assignedTo === 'unassigned' ? !lead.assignedTo : lead.assignedTo === filters.assignedTo);
    
    const matchesScore = filters.scoreRange === 'all' || 
      (filters.scoreRange === 'hot' && lead.score >= 80) ||
      (filters.scoreRange === 'warm' && lead.score >= 60 && lead.score < 80) ||
      (filters.scoreRange === 'cold' && lead.score < 60);
    
    const matchesDate = filters.dateRange === 'all' || (() => {
      const leadDate = new Date(lead.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case 'today':
          return leadDate >= today;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return leadDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          return leadDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
          return leadDate >= quarterAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesSource && matchesAssignedTo && matchesScore && matchesDate;
  });

  const handleAddLead = (leadData: Partial<Lead>) => {
    const lead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Lead;
    
    const updatedLeads = [lead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    showToast.success('Lead added successfully');
  };

  const handleEditLead = (leadData: Partial<Lead>) => {
    if (selectedLead) {
      const updatedLeads = leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, ...leadData, updatedAt: new Date().toISOString() }
          : lead
      );
      setLeads(updatedLeads);
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      setSelectedLead(null);
      setIsEditDialogOpen(false);
      showToast.success('Lead updated successfully');
    }
  };

  const handleDeleteLead = (leadId: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    showToast.success('Lead deleted successfully');
  };

  const handleAssignRep = (leadId: string, repName: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, assignedTo: repName, updatedAt: new Date().toISOString() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const handleBulkAction = (action: string, leadIds: string[]) => {
    switch (action) {
      case 'delete':
        showToast.promise(
          new Promise((resolve) => {
            setTimeout(() => {
              const updatedLeads = leads.filter(lead => !leadIds.includes(lead.id));
              setLeads(updatedLeads);
              localStorage.setItem('leads', JSON.stringify(updatedLeads));
              setSelectedLeads([]);
              resolve(true);
            }, 1000);
          }),
          {
            loading: `Deleting ${leadIds.length} lead(s)...`,
            success: `${leadIds.length} lead(s) deleted successfully`,
            error: 'Failed to delete leads'
          }
        );
        break;
      case 'assign':
        // In a real app, this would open an assignment dialog
        const assignee = prompt('Assign to:');
        if (assignee) {
          const updatedLeads = leads.map(lead => 
            leadIds.includes(lead.id) 
              ? { ...lead, assignedTo: assignee, updatedAt: new Date().toISOString() }
              : lead
          );
          setLeads(updatedLeads);
          localStorage.setItem('leads', JSON.stringify(updatedLeads));
          setSelectedLeads([]);
          showToast.success(`${leadIds.length} lead(s) assigned to ${assignee}`);
        }
        break;
      case 'status-contacted':
      case 'status-qualified':
        const newStatus = action.replace('status-', '') as Lead['status'];
        const statusUpdatedLeads = leads.map(lead => 
          leadIds.includes(lead.id) 
            ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
            : lead
        );
        setLeads(statusUpdatedLeads);
        localStorage.setItem('leads', JSON.stringify(statusUpdatedLeads));
        setSelectedLeads([]);
        showToast.success(`${leadIds.length} lead(s) moved to ${newStatus}`);
        break;
    }
  };

  const handleSelectLead = (leadId: string, selected: boolean) => {
    if (selected) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      source: 'all',
      assignedTo: 'all',
      scoreRange: 'all',
      dateRange: 'all'
    });
  };

  const handleCommunicationSent = (_communication: any) => {
    // In a real app, this would log the communication
    showToast.success('Communication sent successfully');
  };

  const handleScoreUpdate = (leadId: string, newScore: number, _breakdown: any[]) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, score: newScore, updatedAt: new Date().toISOString() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    showToast.success('Lead score updated successfully');
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
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
      />

      {/* Leads List */}
      <LeadList
        leads={filteredLeads}
        onStatusChange={handleStatusChange}
        onEdit={(lead) => {
          setSelectedLead(lead);
          setIsEditDialogOpen(true);
        }}
        onDelete={handleDeleteLead}
        onAssignRep={handleAssignRep}
        onBulkAction={handleBulkAction}
        selectedLeads={selectedLeads}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
      />

      {/* Add Lead Form */}
      <LeadForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddLead}
        mode="add"
      />

      {/* Edit Lead Form */}
      <LeadForm
        lead={selectedLead}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleEditLead}
        mode="edit"
      />
    </motion.div>
  );
}