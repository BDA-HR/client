import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockSupportTickets } from '../../data/crmMockData';
import TicketList from '../../components/crm/customerService/components/TicketList';
import TicketFilters from '../../components/crm/customerService/components/TicketFilters';
import TicketForm from '../../components/crm/customerService/components/TicketForm';
import KnowledgeBase from '../../components/crm/customerService/components/KnowledgeBase';
import type { SupportTicket } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  slaStatus?: string;
}

export default function CustomerService() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    slaStatus: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tickets' | 'knowledge'>('tickets');

  // Helper function to get SLA status
  const getSLAStatus = (ticket: SupportTicket) => {
    const now = new Date();
    const deadline = new Date(ticket.slaDeadline);
    const timeLeft = deadline.getTime() - now.getTime();
    const twoHours = 2 * 60 * 60 * 1000;

    if (['Resolved', 'Closed'].includes(ticket.status)) {
      return 'completed';
    } else if (timeLeft < 0) {
      return 'overdue';
    } else if (timeLeft < twoHours) {
      return 'at-risk';
    } else {
      return 'on-track';
    }
  };

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      ticket.customerInfo.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
    const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || ticket.category === filters.category;
    const matchesAssignedTo = filters.assignedTo === 'all' || ticket.assignedTo === filters.assignedTo;
    
    // SLA Status filtering
    const matchesSLA = !filters.slaStatus || filters.slaStatus === 'all' || getSLAStatus(ticket) === filters.slaStatus;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignedTo && matchesSLA;
  });

  const handleAddTicket = (ticketData: Partial<SupportTicket>) => {
    const ticket: SupportTicket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      escalationLevel: 0,
      internalNotes: [],
      publicReplies: [],
      relatedTickets: [],
      knowledgeBaseArticles: [],
      slaPolicy: {
        id: '1',
        name: 'Standard SLA',
        responseTime: 240,
        resolutionTime: 1440,
        priority: ticketData.priority || 'Medium',
        businessHoursOnly: true
      }
    } as SupportTicket;
    
    const now = new Date();
    const deadline = new Date(now.getTime() + ticket.slaPolicy.resolutionTime * 60 * 1000);
    ticket.slaDeadline = deadline.toISOString();
    
    setTickets([...tickets, ticket]);
    showToast.success('Support ticket created successfully');
  };

  const handleEditTicket = (ticketData: Partial<SupportTicket>) => {
    if (selectedTicket) {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, ...ticketData, updatedAt: new Date().toISOString() }
          : ticket
      );
      setTickets(updatedTickets);
      setSelectedTicket(null);
      showToast.success('Ticket updated successfully');
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = { 
          ...ticket, 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        };
        
        if (['Resolved', 'Closed'].includes(newStatus) && !ticket.resolvedAt) {
          updatedTicket.resolvedAt = new Date().toISOString();
          const createdTime = new Date(ticket.createdAt).getTime();
          const resolvedTime = new Date().getTime();
          updatedTicket.resolutionTime = Math.floor((resolvedTime - createdTime) / (1000 * 60));
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    showToast.success(`Ticket ${newStatus.toLowerCase()}`);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    showToast.success('Ticket deleted successfully');
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      assignedTo: 'all',
      slaStatus: 'all'
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-600">Manage support tickets and customer satisfaction</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tickets')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'tickets' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tickets
            </button>
            <button
              onClick={() => setViewMode('knowledge')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'knowledge' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Knowledge Base
            </button>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'tickets' && (
        <>
          <TicketFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            totalCount={tickets.length}
            filteredCount={filteredTickets.length}
          />

          <TicketList
            tickets={filteredTickets}
            onStatusChange={handleStatusChange}
            onEdit={(ticket) => {
              setSelectedTicket(ticket);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteTicket}
          />
        </>
      )}

      {viewMode === 'knowledge' && (
        <KnowledgeBase />
      )}

      <TicketForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddTicket}
        mode="add"
      />

      <TicketForm
        ticket={selectedTicket}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleEditTicket}
        mode="edit"
      />
    </motion.div>
  );
}
