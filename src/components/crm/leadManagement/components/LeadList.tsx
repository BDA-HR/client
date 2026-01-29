import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, MoreHorizontal, Phone, Mail, User, Building, CheckSquare, Target, MessageSquare } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../../layout/layout';
import { useCRMSettings } from '../../../../hooks/useCRMSettings';
import type { Lead } from '../../../../types/crm';

interface LeadListProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void;
  onEdit: (lead: Lead) => void;
  onCommunicate?: (lead: Lead) => void;
  onScore?: (lead: Lead) => void;
  onBulkAction: (action: string, leadIds: string[]) => void;
  selectedLeads: string[];
  onSelectLead: (leadId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export default function LeadList({
  leads,
  onStatusChange,
  onEdit,
  onCommunicate,
  onScore,
  onBulkAction,
  selectedLeads,
  onSelectLead,
  onSelectAll
}: LeadListProps) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<keyof Lead>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Get CRM settings for dynamic colors and options
  const { 
    leadStatuses, 
    leadSources, 
    leadStatusNames,
    leadSourceNames,
    loading: settingsLoading
  } = useCRMSettings();

  // Helper function to get badge color from CRM settings
  const getStatusColor = (status: string) => {
    // Fallback colors
    const statusColors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Proposal Sent': 'bg-purple-100 text-purple-800',
      'Closed Won': 'bg-emerald-100 text-emerald-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceColor = (source: string) => {
    // Fallback colors
    const sourceColors: Record<string, string> = {
      'Website': 'bg-orange-100 text-orange-800',
      'Email Campaign': 'bg-blue-100 text-blue-800',
      'Social Media': 'bg-purple-100 text-purple-800',
      'Phone': 'bg-green-100 text-green-800',
      'Referral': 'bg-pink-100 text-pink-800',
      'Event': 'bg-indigo-100 text-indigo-800'
    };
    return sourceColors[source] || 'bg-gray-100 text-gray-800';
  };

  const [bulkAction, setBulkAction] = useState('');

  const handleBulkActionExecute = () => {
    if (bulkAction && selectedLeads.length > 0) {
      onBulkAction(bulkAction, selectedLeads);
      setBulkAction('');
    }
  };

  const handleStatusChangeWithConfirmation = (leadId: string, newStatus: Lead['status']) => {
    if (newStatus === 'Closed Won' || newStatus === 'Closed Lost') {
      const confirmed = window.confirm(
        `Are you sure you want to mark this lead as "${newStatus}"? This action will be logged in the audit trail.`
      );
      if (!confirmed) return;
    }
    onStatusChange(leadId, newStatus);
  };

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
        <p className="text-gray-500">Get started by adding your first lead or adjust your filters.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200"
        >
          <span className="text-sm font-medium text-orange-800">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
          </span>
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assign">Reassign</SelectItem>
              <SelectItem value="status-contacted">Mark as Contacted</SelectItem>
              <SelectItem value="status-qualified">Mark as Qualified</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleBulkActionExecute}
            disabled={!bulkAction}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Apply
          </Button>
        </motion.div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedLeads.length === leads.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={(checked) => onSelectLead(lead.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                    <div className="text-sm text-gray-500">{lead.jobTitle}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{lead.company}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getSourceColor(lead.source)}>
                  {lead.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={lead.status}
                  onValueChange={(value) => handleStatusChangeWithConfirmation(lead.id, value as Lead['status'])}
                >
                  <SelectTrigger className="w-32">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatusNames.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${lead.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{lead.score}</span>
                </div>
              </TableCell>
              <TableCell>{lead.assignedTo}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate(`/crm/leads/${lead.id}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(lead)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}