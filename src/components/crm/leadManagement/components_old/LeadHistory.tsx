import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Edit, Phone, Mail, Calendar, CheckSquare, ArrowRight, Filter } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

interface HistoryEntry {
  id: string;
  action: string;
  details: string;
  date: string;
  user: string;
  type: 'status_change' | 'field_update' | 'activity' | 'note' | 'assignment' | 'creation';
  oldValue?: string;
  newValue?: string;
}

interface LeadHistoryProps {
  leadId: string;
}

const typeIcons = {
  'status_change': ArrowRight,
  'field_update': Edit,
  'activity': Calendar,
  'note': Edit,
  'assignment': User,
  'creation': CheckSquare
};

const typeColors = {
  'status_change': 'bg-blue-100 text-blue-800',
  'field_update': 'bg-yellow-100 text-yellow-800',
  'activity': 'bg-purple-100 text-purple-800',
  'note': 'bg-green-100 text-green-800',
  'assignment': 'bg-orange-100 text-orange-800',
  'creation': 'bg-gray-100 text-gray-800'
};

const typeLabels = {
  'status_change': 'Status Change',
  'field_update': 'Field Update',
  'activity': 'Activity',
  'note': 'Note Added',
  'assignment': 'Assignment',
  'creation': 'Created'
};

export default function LeadHistory({ leadId }: LeadHistoryProps) {
  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: '1',
      action: 'Lead created',
      details: 'Lead was created from website form submission',
      date: '2024-01-15T10:30:00Z',
      user: 'System',
      type: 'creation'
    },
    {
      id: '2',
      action: 'Assigned to sales rep',
      details: 'Lead assigned to Sarah Johnson',
      date: '2024-01-15T10:35:00Z',
      user: 'Sales Manager',
      type: 'assignment',
      newValue: 'Sarah Johnson'
    },
    {
      id: '3',
      action: 'Status changed',
      details: 'Status updated from New to Contacted',
      date: '2024-01-16T09:15:00Z',
      user: 'Sarah Johnson',
      type: 'status_change',
      oldValue: 'New',
      newValue: 'Contacted'
    },
    {
      id: '4',
      action: 'Phone call completed',
      details: 'Initial discovery call - 30 minutes',
      date: '2024-01-16T14:00:00Z',
      user: 'Sarah Johnson',
      type: 'activity'
    },
    {
      id: '5',
      action: 'Lead score updated',
      details: 'Score increased from 65 to 85 based on engagement',
      date: '2024-01-17T11:20:00Z',
      user: 'System',
      type: 'field_update',
      oldValue: '65',
      newValue: '85'
    },
    {
      id: '6',
      action: 'Note added',
      details: 'Added note about budget confirmation and timeline',
      date: '2024-01-17T15:30:00Z',
      user: 'Sarah Johnson',
      type: 'note'
    },
    {
      id: '7',
      action: 'Email sent',
      details: 'Sent product brochure and pricing information',
      date: '2024-01-17T16:45:00Z',
      user: 'Sarah Johnson',
      type: 'activity'
    },
    {
      id: '8',
      action: 'Status changed',
      details: 'Status updated from Contacted to Qualified',
      date: '2024-01-18T10:00:00Z',
      user: 'Sarah Johnson',
      type: 'status_change',
      oldValue: 'Contacted',
      newValue: 'Qualified'
    },
    {
      id: '9',
      action: 'Meeting scheduled',
      details: 'Product demo scheduled for January 25th',
      date: '2024-01-18T14:30:00Z',
      user: 'Sarah Johnson',
      type: 'activity'
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');

  const filteredHistory = historyEntries.filter(entry => 
    filterType === 'all' || entry.type === filterType
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(dateString).date;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lead History & Audit Trail</h3>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="status_change">Status Changes</SelectItem>
            <SelectItem value="field_update">Field Updates</SelectItem>
            <SelectItem value="activity">Activities</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="assignment">Assignments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {filteredHistory.map((entry, index) => {
                const IconComponent = typeIcons[entry.type];
                const { date, time } = formatDate(entry.date);
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex items-start space-x-4"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                      <IconComponent className="w-5 h-5 text-orange-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{entry.action}</h4>
                          <Badge className={typeColors[entry.type]}>
                            {typeLabels[entry.type]}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRelativeTime(entry.date)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{entry.details}</p>
                      
                      {/* Show old/new values for changes */}
                      {entry.oldValue && entry.newValue && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                            {entry.oldValue}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            {entry.newValue}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>{entry.user}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{date} at {time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No history found</h4>
              <p className="text-gray-500">No activities match the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {historyEntries.filter(e => e.type === 'status_change').length}
              </div>
              <div className="text-sm text-gray-600">Status Changes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {historyEntries.filter(e => e.type === 'activity').length}
              </div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {historyEntries.filter(e => e.type === 'note').length}
              </div>
              <div className="text-sm text-gray-600">Notes Added</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {historyEntries.filter(e => e.type === 'field_update').length}
              </div>
              <div className="text-sm text-gray-600">Field Updates</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}