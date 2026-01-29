import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Card, CardContent } from '../../../ui/card';
import { useCRMSettings } from '../../../../hooks/useCRMSettings';

interface FilterState {
  searchTerm: string;
  status: string;
  source: string;
  assignedTo: string;
  scoreRange: string;
  dateRange: string;
}

interface LeadFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function LeadFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalCount,
  filteredCount
}: LeadFiltersProps) {
  // Get CRM settings for dropdown options
  const { 
    leadStatusNames, 
    leadSourceNames,
    loading: settingsLoading 
  } = useCRMSettings();

  const salesReps = [
    'Sarah Johnson',
    'Mike Wilson',
    'Emily Davis',
    'Robert Chen',
    'Lisa Anderson'
  ];
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status !== 'all') count++;
    if (filters.source !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    if (filters.scoreRange !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Quick Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadStatusNames.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Source</label>
              <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadSourceNames.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assigned To</label>
              <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sales Reps</SelectItem>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Lead Score</label>
              <Select value={filters.scoreRange} onValueChange={(value) => handleFilterChange('scoreRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="hot">Hot (80-100)</SelectItem>
                  <SelectItem value="warm">Warm (60-79)</SelectItem>
                  <SelectItem value="cold">Cold (0-59)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Created</label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div className="font-medium">
                  {filteredCount} of {totalCount} leads
                </div>
                {activeFiltersCount > 0 && (
                  <div className="text-xs text-gray-500">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Search: "{filters.searchTerm}"</span>
                  <button
                    onClick={() => handleFilterChange('searchTerm', '')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Status: {filters.status}</span>
                  <button
                    onClick={() => handleFilterChange('status', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.source !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Source: {filters.source}</span>
                  <button
                    onClick={() => handleFilterChange('source', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.assignedTo !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Assigned: {filters.assignedTo}</span>
                  <button
                    onClick={() => handleFilterChange('assignedTo', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.scoreRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Score: {filters.scoreRange}</span>
                  <button
                    onClick={() => handleFilterChange('scoreRange', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Date: {filters.dateRange}</span>
                  <button
                    onClick={() => handleFilterChange('dateRange', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}