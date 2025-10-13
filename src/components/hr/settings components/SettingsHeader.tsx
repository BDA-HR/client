// SettingsHeader.tsx
import { Grid, List } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface SettingsHeaderProps {
  onViewModeChange: (mode: 'grid' | 'list') => void;
  currentViewMode: 'grid' | 'list';
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onViewModeChange,
  currentViewMode
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your HR settings and configurations</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="flex border border-gray-200 rounded-lg p-1">
          <Button
            variant={currentViewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className={`cursor-pointer ${
              currentViewMode === 'grid' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'text-gray-600'
            }`}
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={currentViewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className={`cursor-pointer ${
              currentViewMode === 'list' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'text-gray-600'
            }`}
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Add New Setting Button */}
        <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
          Add New Setting
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;