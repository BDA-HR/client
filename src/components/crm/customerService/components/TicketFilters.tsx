import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, User, Tag } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Badge } from '../../../ui/badge';
import { Card, CardContent } from '../../../ui/card';

interface FilterState {
  searchTerm: string;
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  channel: string;
  slaStatus: string;
}

interface TicketFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function TicketFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalCount, 
  filteredCount 
}: TicketFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all'
  );

  const agents = [
    'Tech Support Team',
    'Product Team',
    'Customer Success',
    'Engineering Team',
    'Sales Team'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardContent className="p-6">
          {/* Search and Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tickets by title, description, or customer..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Quick Priority Filter */}
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced</span>
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
            >
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Category
                </label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Assigned To
                </label>
                <Select value={filters.assignedTo} onValueChange={(value) => updateFilter('assignedTo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Channel Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Channel</label>
                <Select value={filters.channel} onValueChange={(value) => updateFilter('channel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="web">Web Form</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SLA Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  SLA Status
                </label>
                <Select value={filters.slaStatus} onValueChange={(value) => updateFilter('slaStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All SLA Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All SLA Status</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Search: "{filters.searchTerm}"</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('searchTerm', '')}
                  />
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Status: {filters.status}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('status', 'all')}
                  />
                </Badge>
              )}
              {filters.priority !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Priority: {filters.priority}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('priority', 'all')}
                  />
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Category: {filters.category}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('category', 'all')}
                  />
                </Badge>
              )}
              {filters.assignedTo !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Agent: {filters.assignedTo}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('assignedTo', 'all')}
                  />
                </Badge>
              )}
              {filters.channel !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Channel: {filters.channel}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('channel', 'all')}
                  />
                </Badge>
              )}
              {filters.slaStatus !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>SLA: {filters.slaStatus.replace('-', ' ')}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('slaStatus', 'all')}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-red-600">{filteredCount}</span> of{' '}
              <span className="font-medium">{totalCount}</span> tickets
            </div>
            
            {filteredCount !== totalCount && (
              <div className="text-sm text-gray-500">
                {totalCount - filteredCount} tickets filtered out
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}