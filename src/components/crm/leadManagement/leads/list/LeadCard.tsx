import { motion } from 'framer-motion';
import { Eye, Edit, MoreHorizontal, Phone, Mail, User, Building, MapPin } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Badge } from '../../../../ui/badge';
import { Card, CardContent } from '../../../../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../../../../../types/crm';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export default function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'New': 'bg-orange-100 text-orange-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-orange-100 text-orange-800',
      'Proposal Sent': 'bg-purple-100 text-purple-800',
      'Closed Won': 'bg-orange-100 text-orange-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceColor = (source: string) => {
    const sourceColors: Record<string, string> = {
      'Website': 'bg-orange-100 text-orange-800',
      'Email Campaign': 'bg-orange-100 text-orange-800',
      'Social Media': 'bg-purple-100 text-purple-800',
      'Phone': 'bg-orange-100 text-orange-800',
      'Referral': 'bg-pink-100 text-pink-800',
      'Event': 'bg-indigo-100 text-indigo-800'
    };
    return sourceColors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {lead.firstName} {lead.lastName}
                </h3>
                <p className="text-sm text-gray-600">{lead.jobTitle}</p>
              </div>
            </div>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{lead.company}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{lead.email}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>

            {lead.city && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{lead.city}, {lead.state}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex space-x-2">
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <Badge className={getSourceColor(lead.source)}>
                {lead.source}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Score: {lead.score}</div>
              {lead.assignedTo && (
                <div className="text-xs text-gray-500">{lead.assignedTo}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}