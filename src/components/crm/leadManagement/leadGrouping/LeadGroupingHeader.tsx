import { Plus } from 'lucide-react';
import { Button } from '../../../ui/button';

interface LeadGroupingHeaderProps {
  onAddGroup: () => void;
}

export default function LeadGroupingHeader({ onAddGroup }: LeadGroupingHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Grouping</h1>
        <p className="text-gray-600">Create and manage lead groups based on conditions</p>
      </div>
      <Button 
        onClick={onAddGroup}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Lead Group
      </Button>
    </div>
  );
}
