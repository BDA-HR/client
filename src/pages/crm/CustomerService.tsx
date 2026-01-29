import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Headphones } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockSupportTickets } from '../../data/crmMockData';
import TicketStats from '../../components/crm/customerService/components/TicketStats';
import TicketList from '../../components/crm/customerService/components/TicketList';
import TicketFilters from '../../components/crm/customerService/components/TicketFilters';
import TicketForm from '../../components/crm/customerService/components/TicketForm';
import SLATracking from '../../components/crm/customerService/components/SLATracking';
import KnowledgeBase from '../../components/crm/customerService/components/KnowledgeBase';
import type { SupportTicket } from '../../types/crm';

interface FilterState {
  searchTerm: string;
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  channel: string;
  slaStatus: string;
}

export default function CustomerService() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    channel: 'all',
    slaStatus: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tickets' | 'sla' | 'knowledge'>('tickets');

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
    const matchesChannel = filters.channel === 'all' || ticket.channel === filters.channel;
    
    const matchesSLA = filters.slaStatus === 'all' || (() => {
      const now = new Date();
      const deadline = new Date(ticket.slaDeadline);
      const isOverdue = deadline < now && !['Resolved', 'Closed'].includes(ticket.status);
      const isAtRisk = (deadline.getTime() - now.getTime()) < (2 * 60 * 60 * 1000) && !['Resolved', 'Closed'].includes(ticket.status); // 2 hours
      
      switch (filters.slaStatus) {
        case 'overdue': return isOverdue;
        case 'at-risk': return isAtRisk;
        case 'on-track': return !isOverdue && !isAtRisk;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignedTo && matchesChannel && matchesSLA;
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
        responseTime: 240, // 4 hours
        resolutionTime: 1440, // 24 hours
        priority: ticketData.priority || 'Medium',
        businessHoursOnly: true
      }
    } as SupportTicket;
    
    // Calculate SLA deadline
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
        
        // Set resolved date if status is Resolved or Closed
        if (['Resolved', 'Closed'].includes(newStatus) && !ticket.resolvedAt) {
          updatedTicket.resolvedAt = new Date().toISOString();
          
          // Calculate resolution time
          const createdTime = new Date(ticket.createdAt).getTime();
          const resolvedTime = new Date().getTime();
          updatedTicket.resolutionTime = Math.floor((resolvedTime - createdTime) / (1000 * 60)); // in minutes
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    showToast.success(`Ticket ${newStatus.toLowerCase()}`);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      assignedTo: 'all',
      channel: 'all',
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
              onClick={() => setViewMode('sla')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'sla' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              SLA Tracking
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

      {/* Stats */}
      <TicketStats tickets={tickets} />

      {/* Content based on view mode */}
      {viewMode === 'tickets' && (
        <>
          {/* Filters */}
          <TicketFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            totalCount={tickets.length}
            filteredCount={filteredTickets.length}
          />

          {/* Ticket List */}
          <TicketList
            tickets={filteredTickets}
            onStatusChange={handleStatusChange}
            onEdit={(ticket) => {
              setSelectedTicket(ticket);
              setIsEditDialogOpen(true);
            }}
          />
        </>
      )}

      {viewMode === 'sla' && (
        <SLATracking tickets={tickets} />
      )}

      {viewMode === 'knowledge' && (
        <KnowledgeBase />
      )}

      {/* Add Ticket Form */}
      <TicketForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddTicket}
        mode="add"
      />

      {/* Edit Ticket Form */}
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