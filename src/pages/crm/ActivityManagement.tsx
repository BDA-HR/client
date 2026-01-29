import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, CheckSquare, Bell } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockActivities } from '../../data/crmMockData';
import ActivityCalendar from '../../components/crm/activityManagement/components/ActivityCalendar';
import TaskList from '../../components/crm/activityManagement/components/TaskList';
import TimeTracking from '../../components/crm/activityManagement/components/TimeTracking';
import NotificationCenter from '../../components/crm/activityManagement/components/NotificationCenter';
import ActivityForm from '../../components/crm/activityManagement/components/ActivityForm';
import type { Activity } from '../../types/crm';

export default function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [viewMode, setViewMode] = useState<'calendar' | 'tasks' | 'time' | 'notifications'>('calendar');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddActivity = (activityData: Partial<Activity>) => {
    const activity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminder: activityData.reminder || false
    } as Activity;
    
    setActivities([...activities, activity]);
    showToast.success('Activity created successfully');
  };

  const handleEditActivity = (activityData: Partial<Activity>) => {
    if (selectedActivity) {
      const updatedActivities = activities.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...activity, ...activityData, updatedAt: new Date().toISOString() }
          : activity
      );
      setActivities(updatedActivities);
      setSelectedActivity(null);
      showToast.success('Activity updated successfully');
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
        
        // Set completed date if status is Completed
        if (newStatus === 'Completed' && !activity.completedDate) {
          updatedActivity.completedDate = new Date().toISOString();
        }
        
        return updatedActivity;
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    showToast.success(`Activity ${newStatus.toLowerCase()}`);
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
    showToast.success('Activity deleted successfully');
  };

  // Calculate stats
  const totalActivities = activities.length;
  const pendingActivities = activities.filter(a => a.status === 'Pending').length;
  const inProgressActivities = activities.filter(a => a.status === 'In Progress').length;
  const completedActivities = activities.filter(a => a.status === 'Completed').length;
  const overdueActivities = activities.filter(a => {
    const scheduledDate = new Date(a.scheduledDate);
    const now = new Date();
    return scheduledDate < now && a.status !== 'Completed';
  }).length;

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
          <p className="text-gray-600">Manage tasks, meetings, calls, and time tracking</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1 inline" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('tasks')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'tasks' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 mr-1 inline" />
              Tasks
            </button>
            <button
              onClick={() => setViewMode('time')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'time' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 mr-1 inline" />
              Time Tracking
            </button>
            <button
              onClick={() => setViewMode('notifications')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'notifications' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-4 h-4 mr-1 inline" />
              Notifications
            </button>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingActivities}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressActivities}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedActivities}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueActivities}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'calendar' && (
        <ActivityCalendar
          activities={activities}
          onStatusChange={handleStatusChange}
          onEdit={(activity) => {
            setSelectedActivity(activity);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteActivity}
        />
      )}

      {viewMode === 'tasks' && (
        <TaskList
          activities={activities}
          onStatusChange={handleStatusChange}
          onEdit={(activity) => {
            setSelectedActivity(activity);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteActivity}
        />
      )}

      {viewMode === 'time' && (
        <TimeTracking activities={activities} />
      )}

      {viewMode === 'notifications' && (
        <NotificationCenter activities={activities} />
      )}

      {/* Add Activity Form */}
      <ActivityForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddActivity}
        mode="add"
      />

      {/* Edit Activity Form */}
      <ActivityForm
        activity={selectedActivity}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedActivity(null);
        }}
        onSubmit={handleEditActivity}
        mode="edit"
      />
    </motion.div>
  );
}