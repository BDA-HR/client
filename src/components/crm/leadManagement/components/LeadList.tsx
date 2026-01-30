import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, MoreHorizontal, Phone, Mail, User, Building, CheckSquare, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Label } from '../../../ui/label';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../../layout/layout';
import type { Lead } from '../../../../types/crm';

interface LeadListProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onAssignRep: (leadId: string, repName: string) => void;
  onBulkAction: (action: string, leadIds: string[]) => void;
  selectedLeads: string[];
  onSelectLead: (leadId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export default function LeadList({
  leads,
  onStatusChange,
  onEdit,
  onDelete,
  onAssignRep,
  onBulkAction,
  selectedLeads,
  onSelectLead,
  onSelectAll
}: LeadListProps) {
  const navigate = useNavigate();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<Lead | null>(null);
  const [selectedRep, setSelectedRep] = useState('');
  
  // Sales reps list
  const salesReps = [
    'Sarah Johnson',
    'Mike Wilson',
    'Emily Davis',
    'Robert Chen',
    'Lisa Anderson'
  ];
  
  // Get CRM settings for dynamic colors and options
  // const { 
  //   leadStatuses, 
  //   leadSources, 
  //   leadStatusNames,
  //   leadSourceNames,
  //   loading: settingsLoading
  // } = useCRMSettings();

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

  const handleDeleteWithConfirmation = (leadId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this lead? This action cannot be undone.'
    );
    if (confirmed) {
      onDelete(leadId);
    }
  };

  const handleAssignRep = (lead: Lead) => {
    setSelectedLeadForAssign(lead);
    setSelectedRep(lead.assignedTo || '');
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (selectedLeadForAssign && selectedRep) {
      onAssignRep(selectedLeadForAssign.id, selectedRep);
      setIsAssignDialogOpen(false);
      setSelectedLeadForAssign(null);
      setSelectedRep('');
      showToast.success(`Lead assigned to ${selectedRep}`);
    }
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
            {/* <TableHead className="w-12">
              <Checkbox
                checked={selectedLeads.length === leads.length}
                onCheckedChange={onSelectAll}
              /> 
            </TableHead>*/}
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
              {/* <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={(checked) => onSelectLead(lead.id, checked as boolean)}
                />
              </TableCell> */}
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
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/crm/leads/${lead.id}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(lead)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAssignRep(lead)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Rep
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleStatusChangeWithConfirmation(lead.id, 'Contacted')}
                      disabled={lead.status === 'Contacted'}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Mark as Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChangeWithConfirmation(lead.id, 'Qualified')}
                      disabled={lead.status === 'Qualified'}
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Mark as Qualified
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChangeWithConfirmation(lead.id, 'Closed Won')}
                      disabled={lead.status === 'Closed Won'}
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Mark as Won
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteWithConfirmation(lead.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Assign Rep Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Sales Rep</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Lead: {selectedLeadForAssign?.firstName} {selectedLeadForAssign?.lastName}</Label>
              <p className="text-sm text-gray-600">{selectedLeadForAssign?.company}</p>
            </div>
            <div>
              <Label htmlFor="salesRep">Select Sales Rep</Label>
              <Select value={selectedRep} onValueChange={setSelectedRep}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssignSubmit}
                disabled={!selectedRep}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}