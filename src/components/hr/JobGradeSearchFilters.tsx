import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface JobGradeSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    department: string;
    category: string;
    skillLevel: string;
  };
  setFilters: (filters: any) => void;
  jobGrades: JobGrade[];
}

const JobGradeSearchFilters: React.FC<JobGradeSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  jobGrades
}) => {
  const categories = [...new Set(jobGrades.map(grade => grade.category).filter(Boolean))];

  return (
<motion.div variants={itemVariants} className="mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    {/* Search Input */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search job grades, titles, or roles..."
        className="pl-10 bg-white w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Filters */}
    <div className="flex items-center flex-wrap gap-3">
      <Filter className="h-4 w-4 text-gray-500" />

      <select
        className="text-sm border rounded-md px-3 py-1 bg-white"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <Button 
        variant="ghost" 
        size="sm" 
        className="text-green-600 hover:bg-green-50"
        onClick={() => setFilters({ department: '', category: '', skillLevel: '' })}
      >
        Clear Filter
      </Button>
    </div>
  </div>
</motion.div>

  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

type JobGrade = {
  id: string;
  grade: string;
  title: string;
  experience: string;
  roles: string[];
  salary: SalaryRange;
  skill: string;
  icon: React.ElementType;
  descriptions: JobDescription[];
  department?: string;
  category?: string;
};

type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
};

export default JobGradeSearchFilters;