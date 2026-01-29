import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Upload, Route, Heart, BarChart3, MessageSquare, Settings, List } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import LeadList from '../../components/crm/leadManagement/components/LeadList';
import LeadForm from '../../components/crm/leadManagement/components/LeadForm';
import LeadFilters from '../../components/crm/leadManagement/components/LeadFilters';
import LeadCommunication from '../../components/crm/leadManagement/components/LeadCommunication';
import LeadScoring from '../../components/crm/leadManagement/components/LeadScoring';
import LeadAnalytics from '../../components/crm/leadManagement/components/LeadAnalytics';
import LeadRouting from '../../components/crm/leadManagement/components/LeadRouting';
import LeadNurturing from '../../components/crm/leadManagement/components/LeadNurturing';
import type { Lead, RoutingRule } from '../../types/crm';

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
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('leads');
  
  // Dialog states for communication and scoring (still modals)
  const [isCommunicationDialogOpen, setIsCommunicationDialogOpen] = useState(false);
  const [isScoringDialogOpen, setIsScoringDialogOpen] = useState(false);

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
      showToast.success('Lead updated successfully');
    }
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

  const handleCommunicationSent = (communication: any) => {
    // In a real app, this would log the communication
    showToast('Communication sent successfully', 'success');
  };

  const handleRoutingRulesUpdate = (rules: RoutingRule[]) => {
    // In a real app, this would save the routing rules
    showToast.success('Routing rules updated successfully');
  };

  const handleScoreUpdate = (leadId: string, newScore: number, breakdown: any[]) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, score: newScore, updatedAt: new Date().toISOString() }
        : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    showToast('Lead score updated successfully', 'success');
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
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/crm/leads/import')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            onClick={() => navigate('/crm/leads/add')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Routing
          </TabsTrigger>
          <TabsTrigger value="nurturing" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Nurturing
          </TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6 mt-6">
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
        onCommunicate={(lead) => {
          setSelectedLead(lead);
          setIsCommunicationDialogOpen(true);
        }}
        onScore={(lead) => {
          setSelectedLead(lead);
          setIsScoringDialogOpen(true);
        }}
        onBulkAction={handleBulkAction}
        selectedLeads={selectedLeads}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
      />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <LeadAnalytics
            isOpen={true}
            onClose={() => setActiveTab('leads')}
          />
        </TabsContent>

        {/* Routing Tab */}
        <TabsContent value="routing" className="mt-6">
          <LeadRouting
            isOpen={true}
            onClose={() => setActiveTab('leads')}
            onRulesUpdate={handleRoutingRulesUpdate}
          />
        </TabsContent>

        {/* Nurturing Tab */}
        <TabsContent value="nurturing" className="mt-6">
          <LeadNurturing
            isOpen={true}
            onClose={() => setActiveTab('leads')}
          />
        </TabsContent>
      </Tabs>

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

      {/* Lead Communication Dialog */}
      {selectedLead && (
        <LeadCommunication
          lead={selectedLead}
          isOpen={isCommunicationDialogOpen}
          onClose={() => {
            setIsCommunicationDialogOpen(false);
            setSelectedLead(null);
          }}
          onCommunicationSent={handleCommunicationSent}
        />
      )}

      {/* Lead Scoring Dialog */}
      {selectedLead && (
        <LeadScoring
          lead={selectedLead}
          isOpen={isScoringDialogOpen}
          onClose={() => {
            setIsScoringDialogOpen(false);
            setSelectedLead(null);
          }}
          onScoreUpdate={handleScoreUpdate}
        />
      )}
    </motion.div>
  );
}