import { Plus } from 'lucide-react';
import { Button } from '../../../ui/button';

interface ContactGroupingHeaderProps {
  onAddGroup: () => void;
}

export default function ContactGroupingHeader({ onAddGroup }: ContactGroupingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Grouping</h1>
        <p className="text-gray-600 mt-1">Create and manage contact groups based on criteria</p>
      </div>
      <Button 
        onClick={onAddGroup}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Group
      </Button>
    </div>
  );
}
