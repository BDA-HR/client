import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, MoreHorizontal, Phone, Mail, User, Building, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu';
import { Pagination } from '../../../ui/pagination';
import { showToast } from '../../../../layout/layout';
import ChangeLeadStatusModal from './ChangeLeadStatusModal';
import type { Lead } from '../../../../types/crm';

interface AssignedLeadsTableProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: Lead['status']) => void;
}

export default function AssignedLeadsTable({ leads, onStatusChange }: AssignedLeadsTableProps) {
  const navigate = useNavigate();
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [changingStatusLead, setChangingStatusLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = leads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return leads.slice(startIndex, endIndex);
  }, [leads, currentPage]);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'New': 'bg-orange-100 text-orange-800',
      'Contacted': 'bg-orange-100 text-orange-800',
      'Qualified': 'bg-orange-100 text-orange-800',
      'Proposal Sent': 'bg-orange-100 text-orange-800',
      'Closed Won': 'bg-orange-100 text-orange-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceColor = () => {
    return 'bg-orange-100 text-orange-800';
  };

  const handleChangeStatus = (lead: Lead) => {
    setChangingStatusLead(lead);
    setIsChangeStatusModalOpen(true);
  };

  const handleStatusChange = (newStatus: Lead['status']) => {
    if (changingStatusLead) {
      onStatusChange(changingStatusLead.id, newStatus);
      setIsChangeStatusModalOpen(false);
      setChangingStatusLead(null);
      showToast.success(`Lead status updated to ${newStatus}`);
    }
  };

  const handleViewDetail = (leadId: string) => {
    navigate(`/crm/leads/assigned/${leadId}`);
  };

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white rounded-lg border"
      >
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned leads</h3>
        <p className="text-gray-500">Leads will appear here once they are assigned to sales reps.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {paginatedLeads.map((lead) => (
            <TableRow key={lead.id}>
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
                <Badge className={getSourceColor()}>
                  {lead.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{lead.score}</span>
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
                    <DropdownMenuItem onClick={() => handleChangeStatus(lead)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Change Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewDetail(lead.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Detail
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        itemLabel="leads"
      />

      <ChangeLeadStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => {
          setIsChangeStatusModalOpen(false);
          setChangingStatusLead(null);
        }}
        onSubmit={handleStatusChange}
        lead={changingStatusLead}
      />
    </div>
  );
}
