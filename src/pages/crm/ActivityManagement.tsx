import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, List, Clock, Bell } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [secondaryView, setSecondaryView] = useState<'time' | 'notifications' | null>(null);
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
          {/* View Mode Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          >
            {viewMode === 'list' ? (
              <>
                <Calendar className="h-4 w-4" />
                Calendar View
              </>
            ) : (
              <>
                <List className="h-4 w-4" />
                List View
              </>
            )}
          </Button>

          {/* Secondary Views */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSecondaryView(secondaryView === 'time' ? null : 'time')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                secondaryView === 'time' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 mr-1 inline" />
              Time
            </button>
            <button
              onClick={() => setSecondaryView(secondaryView === 'notifications' ? null : 'notifications')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                secondaryView === 'notifications' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-4 h-4 mr-1 inline" />
              Alerts
            </button>
          </div>

          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Activity
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {secondaryView === null && (
        <>
          {viewMode === 'list' && (
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
        </>
      )}

      {secondaryView === 'time' && (
        <TimeTracking activities={activities} />
      )}

      {secondaryView === 'notifications' && (
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