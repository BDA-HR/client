import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Vacancy } from '../../types/vacancy';

interface VacanciesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    department: string;
    location: string;
    type: string;
    status: string;
  };
  setFilters: (filters: any) => void;
  vacancies: Vacancy[];
}

const VacanciesFilters = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  vacancies
}: VacanciesFiltersProps) => {
  // Get unique values for filters
  const departments = Array.from(new Set(vacancies.map(v => v.department)));
  const locations = Array.from(new Set(vacancies.map(v => v.location)));
  const types = Array.from(new Set(vacancies.map(v => v.type)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Vacancies</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <Select
            value={filters.department || 'all'}
            onValueChange={(value) => setFilters({ ...filters, department: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div>
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => setFilters({ ...filters, location: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VacanciesFilters;
