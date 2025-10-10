import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, Briefcase, Layers, TrendingUp, Award, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import JobGradeHeader from '../../../components/hr/jobgrade/JobGradeHeader';
import JobGradeCard from '../../../components/hr/jobgrade/JobGradeCard';
import JobGradeAnalytics from '../../../components/hr/jobgrade/JobGradeAnalytics';
import { generateJobGrades } from '../../../components/hr/jobgrade/JobGradeData';
import AddJobGradeModal from '../../../components/hr/jobgrade/AddJobGrade';
import JobGradeSearchFilters from '../../../components/hr/jobgrade/JobGradeSearchFilters';
import type { JobGrade } from '../../../types/jobgrade';
import type { LucideIcon } from 'lucide-react';

const JobGradePage = () => {
  const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<JobGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', skillLevel: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const data = generateJobGrades(120);
    setJobGrades(data);
    setFilteredGrades(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let results = jobGrades;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      results = results.filter(g =>
        g.title.toLowerCase().includes(t) ||
        g.grade.toLowerCase().includes(t) ||
        g.roles.some(r => r.toLowerCase().includes(t))
      );
    }
    if (filters.category) results = results.filter(g => g.category === filters.category);
    if (filters.skillLevel) results = results.filter(g => g.skill === filters.skillLevel);

    setFilteredGrades(results);
  }, [searchTerm, filters, jobGrades]);

  const handleAddGrade = (newGrade: Omit<JobGrade, 'id' | 'icon' | 'category'>) => {
    const num = parseInt(newGrade.grade.match(/\d+/)?.[0] || '0', 10);
    let Icon: LucideIcon = Briefcase;
    if (num >= 7) Icon = ShieldCheck;
    else if (num >= 5) Icon = Award;
    else if (num >= 3) Icon = TrendingUp;
    else if (num >= 1) Icon = Layers;

    const gradeWithId: JobGrade = {
      ...newGrade,
      id: `grade-${Date.now()}`,
      icon: Icon,
      category: 'Uncategorized', // fallback
    };

    setJobGrades(p => [gradeWithId, ...p]);
    setFilteredGrades(p => [gradeWithId, ...p]);
    setExpandedCard(gradeWithId.id);
  };

  return (
    <motion.div className="p-6 min-h-screen bg-gray-50" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }}>
      <JobGradeHeader
        jobGrades={jobGrades}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <JobGradeSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        jobGrades={jobGrades}
      />

      <AddJobGradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGrade={handleAddGrade}
        skillLevels={Array.from(new Set(jobGrades.map(g => g.skill)))}
      />

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredGrades.length} of {jobGrades.length} job grades
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        </div>
      ) : filteredGrades.length ? (
        <motion.div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"}>
          <AnimatePresence>
            {filteredGrades.map(g => (
              <JobGradeCard
                key={g.id}
                {...g}
                expanded={expandedCard === g.id}
                onToggleExpand={() => setExpandedCard(prev => prev === g.id ? null : g.id)}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-green-100">
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
              setFilters({ category: '', skillLevel: '' });
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {!loading && filteredGrades.length > 0 && (
        <JobGradeAnalytics jobGrades={jobGrades} filteredGrades={filteredGrades} />
      )}
    </motion.div>
  );
};

export default JobGradePage;
