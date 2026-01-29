import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Card, CardContent } from '../../../ui/card';

interface FilterState {
  searchTerm: string;
  stage: string;
  owner: string;
  amountRange: string;
  probability: string;
  dateRange: string;
}

interface SalesFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

const owners = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

export default function SalesFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalCount,
  filteredCount
}: SalesFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.stage !== 'all') count++;
    if (filters.owner !== 'all') count++;
    if (filters.amountRange !== 'all') count++;
    if (filters.probability !== 'all') count++;
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
                  placeholder="Search opportunities by name or description..."
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
            {/* Stage Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stage</label>
              <Select value={filters.stage} onValueChange={(value) => handleFilterChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Qualification">Qualification</SelectItem>
                  <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Closed Won">Closed Won</SelectItem>
                  <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Owner</label>
              <Select value={filters.owner} onValueChange={(value) => handleFilterChange('owner', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {owners.map((owner) => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Deal Size</label>
              <Select value={filters.amountRange} onValueChange={(value) => handleFilterChange('amountRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small (&lt; $50K)</SelectItem>
                  <SelectItem value="medium">Medium ($50K - $200K)</SelectItem>
                  <SelectItem value="large">Large (&gt; $200K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Probability Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Probability</label>
              <Select value={filters.probability} onValueChange={(value) => handleFilterChange('probability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Probabilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Probabilities</SelectItem>
                  <SelectItem value="low">Low (&lt; 30%)</SelectItem>
                  <SelectItem value="medium">Medium (30% - 70%)</SelectItem>
                  <SelectItem value="high">High (&gt; 70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Close Date</label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div className="font-medium">
                  {filteredCount} of {totalCount} deals
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
              
              {filters.stage !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Stage: {filters.stage}</span>
                  <button
                    onClick={() => handleFilterChange('stage', 'all')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {filters.owner !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>Owner: {filters.owner}</span>
                  <button
                    onClick={() => handleFilterChange('owner', 'all')}
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