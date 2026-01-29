import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, Mail, Calendar, CheckSquare, FileText, Clock, User } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Badge } from '../../../ui/badge';

interface Activity {
  id: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Task';
  note: string;
  date: string;
  user: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface LeadActivitiesProps {
  leadId: string;
}

const typeIcons = {
  'Call': Phone,
  'Email': Mail,
  'Meeting': Calendar,
  'Task': CheckSquare
};

const typeColors = {
  'Call': 'bg-green-100 text-green-800',
  'Email': 'bg-blue-100 text-blue-800',
  'Meeting': 'bg-purple-100 text-purple-800',
  'Task': 'bg-orange-100 text-orange-800'
};

const statusColors = {
  'Completed': 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

export default function LeadActivities({ leadId }: LeadActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'Call',
      note: 'Initial discovery call - discussed current challenges and budget',
      date: '2024-01-18T14:00:00Z',
      user: 'Sarah Johnson',
      status: 'Completed'
    },
    {
      id: '2',
      type: 'Email',
      note: 'Sent product brochure and pricing information',
      date: '2024-01-17T10:30:00Z',
      user: 'Sarah Johnson',
      status: 'Completed'
    },
    {
      id: '3',
      type: 'Meeting',
      note: 'Product demo scheduled for next week',
      date: '2024-01-25T15:00:00Z',
      user: 'Sarah Johnson',
      status: 'Pending'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'Call' as Activity['type'],
    note: '',
    date: '',
    user: 'Current User'
  });

  const handleAddActivity = () => {
    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity,
      status: new Date(newActivity.date) > new Date() ? 'Pending' : 'Completed'
    };
    
    setActivities([activity, ...activities]);
    setNewActivity({
      type: 'Call',
      note: '',
      date: '',
      user: 'Current User'
    });
    setIsAddDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Activity Timeline</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="activityType">Activity Type</Label>
                <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value as Activity['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="activityDate">Date & Time</Label>
                <Input
                  id="activityDate"
                  type="datetime-local"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="activityNote">Notes</Label>
                <Textarea
                  id="activityNote"
                  value={newActivity.note}
                  onChange={(e) => setNewActivity({...newActivity, note: e.target.value})}
                  placeholder="Describe what happened or what needs to be done..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddActivity} className="bg-orange-600 hover:bg-orange-700">
                  Add Activity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activities Timeline */}
      <Card>
        <CardContent className="pt-6">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h4>
              <p className="text-gray-500 mb-4">Start tracking interactions with this lead</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = typeIcons[activity.type];
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={typeColors[activity.type]}>
                            {activity.type}
                          </Badge>
                          <Badge className={statusColors[activity.status]}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(activity.date)}
                        </div>
                      </div>
                      
                      <p className="text-gray-900 mb-2">{activity.note}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {activity.user}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}