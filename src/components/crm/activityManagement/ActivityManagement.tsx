import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Clock, User, CheckCircle, AlertCircle, Phone, Mail, MessageSquare, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { mockActivities } from '../../../data/crmMockData';
import type { Activity } from '../../../types/crm';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const priorityColors = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800'
};

const typeIcons = {
  'Call': Phone,
  'Email': Mail,
  'Meeting': Calendar,
  'Task': CheckCircle,
  'Note': FileText
};

export default function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: 'Task',
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: '',
    relatedTo: {
      type: 'Lead',
      id: '',
      name: ''
    },
    scheduledDate: '',
    reminder: false,
    reminderTime: ''
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.relatedTo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || activity.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Calculate metrics
  const totalActivities = activities.length;
  const pendingActivities = activities.filter(a => a.status === 'Pending').length;
  const completedActivities = activities.filter(a => a.status === 'Completed').length;
  const overdueActivities = activities.filter(a => 
    a.status !== 'Completed' && new Date(a.scheduledDate) < new Date()
  ).length;

  const handleAddActivity = () => {
    const activity: Activity = {
      ...newActivity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Activity;
    
    setActivities([...activities, activity]);
    setNewActivity({
      type: 'Task',
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: '',
      relatedTo: {
        type: 'Lead',
        id: '',
        name: ''
      },
      scheduledDate: '',
      reminder: false,
      reminderTime: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditActivity = () => {
    if (selectedActivity) {
      const updatedActivities = activities.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...selectedActivity, updatedAt: new Date().toISOString() }
          : activity
      );
      setActivities(updatedActivities);
      setIsEditDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleStatusChange = (activityId: string, newStatus: Activity['status']) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        const updatedActivity = { 
          ...activity, 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        };
        
        if (newStatus === 'Completed' && !activity.completedDate) {
          updatedActivity.completedDate = new Date().toISOString();
        }
        
        return updatedActivity;
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const isOverdue = (scheduledDate: string, status: string) => {
    return status !== 'Completed' && new Date(scheduledDate) < new Date();
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
          <h1 className="text-2xl font-bold text-gray-900">Activity Management</h1>
          <p className="text-gray-600">Track and manage all customer interactions and tasks</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Activity Type</Label>
                <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value as Activity['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newActivity.priority} onValueChange={(value) => setNewActivity({...newActivity, priority: value as Activity['priority']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newActivity.assignedTo}
                  onChange={(e) => setNewActivity({...newActivity, assignedTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={newActivity.scheduledDate}
                  onChange={(e) => setNewActivity({...newActivity, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="relatedType">Related To Type</Label>
                <Select 
                  value={newActivity.relatedTo?.type} 
                  onValueChange={(value) => setNewActivity({
                    ...newActivity, 
                    relatedTo: { ...newActivity.relatedTo!, type: value as Activity['relatedTo']['type'] }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                    <SelectItem value="Opportunity">Opportunity</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="relatedName">Related To Name</Label>
                <Input
                  id="relatedName"
                  value={newActivity.relatedTo?.name}
                  onChange={(e) => setNewActivity({
                    ...newActivity, 
                    relatedTo: { ...newActivity.relatedTo!, name: e.target.value }
                  })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="reminder"
                  checked={newActivity.reminder}
                  onCheckedChange={(checked) => setNewActivity({...newActivity, reminder: checked})}
                />
                <Label htmlFor="reminder">Set Reminder</Label>
              </div>
              {newActivity.reminder && (
                <div className="col-span-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="datetime-local"
                    value={newActivity.reminderTime}
                    onChange={(e) => setNewActivity({...newActivity, reminderTime: e.target.value})}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddActivity} className="bg-orange-600 hover:bg-orange-700">
                Create Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingActivities}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedActivities}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueActivities}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Note">Note</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => {
                const IconComponent = typeIcons[activity.type];
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{activity.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={activity.status}
                        onValueChange={(value) => handleStatusChange(activity.id, value as Activity['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[activity.status]}>
                            {activity.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[activity.priority]}>
                        {activity.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{activity.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{activity.relatedTo.type}</div>
                        <div className="text-sm text-gray-500">{activity.relatedTo.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${isOverdue(activity.scheduledDate, activity.status) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(activity.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs">
                          {new Date(activity.scheduledDate).toLocaleTimeString()}
                        </div>
                        {isOverdue(activity.scheduledDate, activity.status) && (
                          <div className="text-xs text-red-600">Overdue</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Activity Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {(() => {
                  const IconComponent = typeIcons[selectedActivity.type];
                  return (
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-orange-600" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-semibold">{selectedActivity.title}</h3>
                  <p className="text-gray-600">{selectedActivity.type} - {selectedActivity.status}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge className={priorityColors[selectedActivity.priority]}>
                    {selectedActivity.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                  <p>{selectedActivity.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Related To</Label>
                  <p>{selectedActivity.relatedTo.type}: {selectedActivity.relatedTo.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Scheduled Date</Label>
                  <p>{new Date(selectedActivity.scheduledDate).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1 whitespace-pre-wrap">{selectedActivity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p>{new Date(selectedActivity.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p>{new Date(selectedActivity.updatedAt).toLocaleString()}</p>
                </div>
                {selectedActivity.completedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Completed</Label>
                    <p>{new Date(selectedActivity.completedDate).toLocaleString()}</p>
                  </div>
                )}
                {selectedActivity.reminder && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Reminder</Label>
                    <p>{selectedActivity.reminderTime ? new Date(selectedActivity.reminderTime).toLocaleString() : 'Set'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={selectedActivity.title}
                  onChange={(e) => setSelectedActivity({...selectedActivity, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  value={selectedActivity.status} 
                  onValueChange={(value) => setSelectedActivity({...selectedActivity, status: value as Activity['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editPriority">Priority</Label>
                <Select 
                  value={selectedActivity.priority} 
                  onValueChange={(value) => setSelectedActivity({...selectedActivity, priority: value as Activity['priority']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={selectedActivity.description}
                  onChange={(e) => setSelectedActivity({...selectedActivity, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditActivity} className="bg-orange-600 hover:bg-orange-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}