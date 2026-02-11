import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../../../ui/button';
import { showToast } from '../../../../layout/layout';
import { mockActivities } from '../../../../data/crmMockData';
import TaskList from './TaskList';
import ActivityForm from './ActivityForm';
import type { Activity } from '../../../../types/crm';

export default function TasksSection() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & Activities</h1>
          <p className="text-gray-600">Manage your tasks, meetings, and calls</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      <TaskList
        activities={activities}
        onStatusChange={handleStatusChange}
        onEdit={(activity) => {
          setSelectedActivity(activity);
          setIsEditDialogOpen(true);
        }}
        onDelete={handleDeleteActivity}
      />

      <ActivityForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddActivity}
        mode="add"
      />

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
