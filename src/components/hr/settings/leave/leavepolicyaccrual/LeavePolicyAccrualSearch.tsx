import React from 'react';
import { Input } from '../../../../ui/input';
import { Button } from '../../../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../ui/select';
import { Search, Filter } from 'lucide-react';

interface LeavePolicyTableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  requiresAttachmentFilter: string;
  onRequiresAttachmentFilterChange: (value: string) => void;
  holidaysAsLeaveFilter: string;
  onHolidaysAsLeaveFilterChange: (value: string) => void;
  leaveTypeFilter: string;
  onLeaveTypeFilterChange: (value: string) => void;
  leaveTypes: string[];
  onClearFilters: () => void;
}

const LeavePolicyAccrualSearch: React.FC<LeavePolicyTableSearchProps> = ({
  searchTerm,
  onSearchChange,
  requiresAttachmentFilter,
  onRequiresAttachmentFilterChange,
  holidaysAsLeaveFilter,
  onHolidaysAsLeaveFilterChange,
  leaveTypeFilter,
  onLeaveTypeFilterChange,
  leaveTypes,
  onClearFilters
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search policies by name or type..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={requiresAttachmentFilter} onValueChange={onRequiresAttachmentFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Attachment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attachments</SelectItem>
              <SelectItem value="true">Requires Attachment</SelectItem>
              <SelectItem value="false">No Attachment</SelectItem>
            </SelectContent>
          </Select>

          <Select value={holidaysAsLeaveFilter} onValueChange={onHolidaysAsLeaveFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Holidays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Holidays</SelectItem>
              <SelectItem value="true">Holidays as Leave</SelectItem>
              <SelectItem value="false">Exclude Holidays</SelectItem>
            </SelectContent>
          </Select>

          <Select value={leaveTypeFilter} onValueChange={onLeaveTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {leaveTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeavePolicyAccrualSearch;