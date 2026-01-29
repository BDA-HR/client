import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, MoreHorizontal, Clock, User, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import type { SupportTicket } from '../../../../types/crm';

const statusColors = {
  'Open': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Pending': 'bg-purple-100 text-purple-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800',
  'Critical': 'bg-red-100 text-red-800'
};

const channelColors = {
  'email': 'bg-blue-100 text-blue-800',
  'chat': 'bg-green-100 text-green-800',
  'phone': 'bg-purple-100 text-purple-800',
  'web': 'bg-orange-100 text-orange-800',
  'social': 'bg-pink-100 text-pink-800'
};

interface TicketListProps {
  tickets: SupportTicket[];
  onStatusChange: (ticketId: string, newStatus: SupportTicket['status']) => void;
  onEdit: (ticket: SupportTicket) => void;
}

export default function TicketList({ tickets, onStatusChange, onEdit }: TicketListProps) {
  const navigate = useNavigate();

  if (tickets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500">All caught up! No support tickets match your current filters.</p>
      </motion.div>
    );
  }

  const getSLAStatus = (ticket: SupportTicket) => {
    const now = new Date();
    const deadline = new Date(ticket.slaDeadline);
    const timeLeft = deadline.getTime() - now.getTime();
    const twoHours = 2 * 60 * 60 * 1000;

    if (['Resolved', 'Closed'].includes(ticket.status)) {
      return { status: 'completed', color: 'text-green-600', icon: CheckCircle };
    } else if (timeLeft < 0) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertTriangle };
    } else if (timeLeft < twoHours) {
      return { status: 'at-risk', color: 'text-orange-600', icon: Clock };
    } else {
      return { status: 'on-track', color: 'text-green-600', icon: CheckCircle };
    }
  };

  const formatTimeLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeLeft = deadlineDate.getTime() - now.getTime();
    
    if (timeLeft < 0) {
      const overdue = Math.abs(timeLeft);
      const hours = Math.floor(overdue / (1000 * 60 * 60));
      const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m overdue`;
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m left`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>SLA Status</TableHead>
              <TableHead>CSAT</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const slaStatus = getSLAStatus(ticket);
              const SLAIcon = slaStatus.icon;
              
              return (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">#{ticket.id}</div>
                      <div className="text-sm text-gray-900 font-medium line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {ticket.description}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {ticket.category}
                        </Badge>
                        {ticket.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {ticket.customerInfo.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {ticket.customerInfo.email}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          ticket.customerInfo.tier === 'Enterprise' ? 'border-purple-300 text-purple-700' :
                          ticket.customerInfo.tier === 'Premium' ? 'border-blue-300 text-blue-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {ticket.customerInfo.tier}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={ticket.status}
                      onValueChange={(value) => onStatusChange(ticket.id, value as SupportTicket['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge className={channelColors[ticket.channel]}>
                      {ticket.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{ticket.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`flex items-center space-x-1 ${slaStatus.color}`}>
                        <SLAIcon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">
                          {slaStatus.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeLeft(ticket.slaDeadline)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.customerSatisfaction ? (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {ticket.customerSatisfaction.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No rating</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => navigate(`/crm/support/${ticket.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(ticket)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/crm/support/${ticket.id}/history`)}>
                          <Clock className="w-4 h-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}