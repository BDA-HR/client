import { Plus, List, Calendar } from 'lucide-react';
import { Button } from '../../../ui/button';

interface ActivityHeaderProps {
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  onAddActivity: () => void;
}

export default function ActivityHeader({ viewMode, onViewModeChange, onAddActivity }: ActivityHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Management</h1>
        <p className="text-gray-600">Track and manage all customer interactions and tasks</p>
      </div>
      <div className="flex space-x-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
              viewMode === 'list' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
              viewMode === 'calendar' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
        <Button 
          onClick={onAddActivity}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>
    </div>
  );
}
