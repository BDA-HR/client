import React from 'react';
import { Clock, User, Edit, Phone, Mail, Target, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';

interface HistoryEntry {
  id: string;
  type: 'status_change' | 'assignment' | 'score_update' | 'field_update' | 'communication' | 'note_added';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  oldValue?: string;
  newValue?: string;
}

interface LeadHistoryProps {
  leadId: string;
}

export default function LeadHistory({ leadId }: LeadHistoryProps) {
  // In a real app, this would be fetched from an API
  const historyEntries: HistoryEntry[] = [
    {
      id: '1',
      type: 'status_change',
      title: 'Status Changed',
      description: 'Lead status updated from "New" to "Contacted"',
      timestamp: '2024-01-16T14:30:00Z',
      user: 'Sarah Johnson',
      oldValue: 'New',
      newValue: 'Contacted'
    },
    {
      id: '2',
      type: 'communication',
      title: 'Email Sent',
      description: 'Follow-up email sent with product information',
      timestamp: '2024-01-16T14:15:00Z',
      user: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'score_update',
      title: 'Lead Score Updated',
      description: 'Lead score increased based on engagement',
      timestamp: '2024-01-16T10:45:00Z',
      user: 'System',
      oldValue: '65',
      newValue: '75'
    },
    {
      id: '4',
      type: 'communication',
      title: 'Phone Call',
      description: 'Initial contact call completed - 15 minutes',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'Sarah Johnson'
    },
    {
      id: '5',
      type: 'assignment',
      title: 'Lead Assigned',
      description: 'Lead assigned to sales representative',
      timestamp: '2024-01-15T09:15:00Z',
      user: 'System',
      newValue: 'Sarah Johnson'
    },
    {
      id: '6',
      type: 'field_update',
      title: 'Lead Information Updated',
      description: 'Company information and job title updated',
      timestamp: '2024-01-15T09:10:00Z',
      user: 'Sarah Johnson'
    },
    {
      id: '7',
      type: 'note_added',
      title: 'Note Added',
      description: 'Initial qualification notes added',
      timestamp: '2024-01-15T09:05:00Z',
      user: 'Sarah Johnson'
    }
  ];

  const getHistoryIcon = (type: HistoryEntry['type']) => {
    const icons = {
      status_change: <CheckSquare className="w-4 h-4" />,
      assignment: <User className="w-4 h-4" />,
      score_update: <Target className="w-4 h-4" />,
      field_update: <Edit className="w-4 h-4" />,
      communication: <Mail className="w-4 h-4" />,
      note_added: <Edit className="w-4 h-4" />
    };
    return icons[type];
  };

  const getHistoryColor = (type: HistoryEntry['type']) => {
    const colors = {
      status_change: 'bg-green-100 text-green-800',
      assignment: 'bg-blue-100 text-blue-800',
      score_update: 'bg-purple-100 text-purple-800',
      field_update: 'bg-yellow-100 text-yellow-800',
      communication: 'bg-orange-100 text-orange-800',
      note_added: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lead History</h3>
        <Badge variant="outline" className="text-sm">
          {historyEntries.length} entries
        </Badge>
      </div>

      <div className="space-y-4">
        {historyEntries.map((entry, index) => (
          <Card key={entry.id}>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getHistoryColor(entry.type)} flex-shrink-0`}>
                  {getHistoryIcon(entry.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{entry.description}</p>
                  
                  {/* Show old/new values for certain types */}
                  {(entry.oldValue || entry.newValue) && (
                    <div className="flex items-center space-x-2 text-sm">
                      {entry.oldValue && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          From: {entry.oldValue}
                        </span>
                      )}
                      {entry.newValue && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          To: {entry.newValue}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                    <User className="w-3 h-3" />
                    <span>by {entry.user}</span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Timeline connector */}
              {index < historyEntries.length - 1 && (
                <div className="ml-6 mt-4 border-l-2 border-gray-200 h-4"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {historyEntries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
            <p className="text-gray-500">Lead history will appear here as actions are taken.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}