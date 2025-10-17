import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import JobGradeHeader from '../../../components/hr/jobgrade/JobGradeHeader';
import JobGradeCard from '../../../components/hr/jobgrade/JobGradeCard';
import JobGradeSearchFilters from '../../../components/hr/jobgrade/JobGradeSearchFilters';
import AddJobGradeModal from '../../../components/hr/jobgrade/AddJobGrade';
import EditJobGradeModal from '../../../components/hr/jobgrade/EditJobGradeModal';
import DeleteJobGradeModal from '../../../components/hr/jobgrade/DeleteJobGradeModal';
import { jobGradeMockData } from '../../../components/hr/jobgrade/JobGradeData';
import type { JobGradeListDto, JobGradeAddDto, JobGradeModDto } from '../../../types/hr/jobgrade';
import type { UUID } from 'crypto';

const ITEMS_PER_PAGE = 20; // Good for grid layout (3x3)

const JobGradePage = () => {
  const [jobGrades, setJobGrades] = useState<JobGradeListDto[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<JobGradeListDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    minSalary: '' as number | '',
    maxSalary: '' as number | '',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<JobGradeListDto | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<JobGradeListDto | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Calculate pagination values
  const totalItems = filteredGrades.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentGrades = filteredGrades.slice(startIndex, endIndex);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setJobGrades(jobGradeMockData);
      setFilteredGrades(jobGradeMockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = jobGrades;
    
    // Search filter
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      results = results.filter(grade =>
        grade.name.toLowerCase().includes(t)
      );
    }
    
    // Salary filters - Fixed type comparison
    if (filters.minSalary !== '') {
      results = results.filter(grade => grade.startSalary >= Number(filters.minSalary));
    }
    if (filters.maxSalary !== '') {
      results = results.filter(grade => grade.maxSalary <= Number(filters.maxSalary));
    }

    setFilteredGrades(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, jobGrades]);

  const handleAddGrade = (newGrade: JobGradeAddDto) => {
    const gradeWithId: JobGradeListDto = {
      ...newGrade,
      id: generateUUID() as UUID,
      rowVersion: '1'
    };

    setJobGrades(prev => [gradeWithId, ...prev]);
    setFilteredGrades(prev => [gradeWithId, ...prev]);
    setExpandedCard(gradeWithId.id);
    setCurrentPage(1); // Go to first page to see the new grade
  };

  const handleEdit = (jobGrade: JobGradeListDto) => {
    setEditingGrade(jobGrade);
    setIsEditModalOpen(true);
  };

  const handleDelete = (jobGrade: JobGradeListDto) => {
    setDeletingGrade(jobGrade);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (jobGrade: JobGradeListDto) => {
    setJobGrades(prev => prev.filter(grade => grade.id !== jobGrade.id));
    setFilteredGrades(prev => prev.filter(grade => grade.id !== jobGrade.id));
    setIsDeleteModalOpen(false);
    setDeletingGrade(null);
  };

  const handleSaveEdit = (updatedGrade: JobGradeModDto) => {
    setJobGrades(prev => prev.map(grade => 
      grade.id === updatedGrade.id ? { ...grade, ...updatedGrade } : grade
    ));
    setFilteredGrades(prev => prev.map(grade => 
      grade.id === updatedGrade.id ? { ...grade, ...updatedGrade } : grade
    ));
    setIsEditModalOpen(false);
    setEditingGrade(null);
  };

  // UUID generator for new grades
  const generateUUID = (): string => {
    return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return (
    <motion.section 
      className="min-h-screen bg-gray-50 space-y-6" 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <JobGradeHeader
        jobGrades={jobGrades}
      />

      <JobGradeSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        jobGrades={jobGrades}
        onAddClick={() => setIsAddModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <AddJobGradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGrade={handleAddGrade}
      />

      <EditJobGradeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGrade(null);
        }}
        onSave={handleSaveEdit}
        jobGrade={editingGrade}
      />

      <DeleteJobGradeModal
        jobGrade={deletingGrade}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingGrade(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center py-12"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          </div>
        </motion.div>
      )}

      {!loading && currentGrades.length ? (
        <>
          <motion.div 
            className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {currentGrades.map(grade => (
                <JobGradeCard
                  key={grade.id}
                  jobGrade={grade}
                  expanded={expandedCard === grade.id}
                  onToggleExpand={() => setExpandedCard(prev => prev === grade.id ? null : grade.id)}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      ) : !loading && (
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
              setFilters({ minSalary: '', maxSalary: '' });
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* {!loading && filteredGrades.length > 0 && (
        <JobGradeAnalytics jobGrades={jobGrades} filteredGrades={filteredGrades} />
      )} */}
    </motion.section>
  );
};

export default JobGradePage;