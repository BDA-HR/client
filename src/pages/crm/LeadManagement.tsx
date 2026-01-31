import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import { LeadListHeader, LeadSearchFilters, LeadTable } from '../../components/crm/leadManagement/leads';
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

  const handleEditLead = (lead: Lead) => {
    // Navigate to edit page (to be implemented)
    navigate(`/crm/leads/${lead.id}/edit`);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <LeadListHeader
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
        selectedCount={selectedLeads.length}
      />

      {/* Filters */}
      <LeadSearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Leads Table */}
      <LeadTable
        leads={filteredLeads}
        onStatusChange={handleStatusChange}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        onAssignRep={handleAssignRep}
      />
    </motion.div>
  );
}