import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import JobGradeHeader from '../../../components/hr/JobGradeHeader';
import JobGradeSearchFilters from '../../../components/hr/JobGradeSearchFilters';
import JobGradeCard from '../../../components/hr/JobGradeCard';
import JobGradeAnalytics from '../../../components/hr/JobGradeAnalytics';
import { generateJobGrades } from '../../../components/hr/JobGradeData';

const JobGradePage = () => {
  const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<JobGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    category: '',
    skillLevel: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    const generatedGrades = generateJobGrades(120);
    setJobGrades(generatedGrades);
    setFilteredGrades(generatedGrades);
    setLoading(false);
  }, []);

  useEffect(() => {
    let results = jobGrades;
    
    if (searchTerm) {
      results = results.filter(grade =>
        grade.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filters.department) {
      results = results.filter(grade => grade.department === filters.department);
    }
    if (filters.category) {
      results = results.filter(grade => grade.category === filters.category);
    }
    if (filters.skillLevel) {
      results = results.filter(grade => grade.skill === filters.skillLevel);
    }
    
    setFilteredGrades(results);
  }, [searchTerm, filters, jobGrades]);

  const toggleExpandCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 min-h-screen bg-gray-50"
    >
      <JobGradeHeader 
        jobGrades={jobGrades} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      <JobGradeSearchFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        jobGrades={jobGrades}
      />

      <motion.div variants={itemVariants} className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredGrades.length} of {jobGrades.length} job grades
        </p>
      </motion.div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        </motion.div>
      )}

      {!loading && (
        <motion.div
          variants={itemVariants}
          className={viewMode === 'grid' ? 
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredGrades.map((grade) => (
              <JobGradeCard
                key={grade.id}
                {...grade}
                expanded={expandedCard === grade.id}
                onToggleExpand={() => toggleExpandCard(grade.id)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredGrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-green-100"
        >
          <BookOpen className="h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No job grades found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
          <Button
            variant="ghost"
            className="mt-4 text-green-600 hover:bg-green-50"
            onClick={() => {
              setSearchTerm('');
              setFilters({ department: '', category: '', skillLevel: '' });
            }}
          >
            Reset filters
          </Button>
        </motion.div>
      )}

      {!loading && filteredGrades.length > 0 && (
        <JobGradeAnalytics 
          jobGrades={jobGrades} 
          filteredGrades={filteredGrades} 
        />
      )}
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: 'beforeChildren' }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

// Types
type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
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

export default JobGradePage;