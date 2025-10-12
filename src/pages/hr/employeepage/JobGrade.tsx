import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import JobGradeHeader from '../../../components/hr/jobgrade/JobGradeHeader';
import JobGradeCard from '../../../components/hr/jobgrade/JobGradeCard';
import JobGradeAnalytics from '../../../components/hr/jobgrade/JobGradeAnalytics';
import AddJobGradeModal from '../../../components/hr/jobgrade/AddJobGrade';
import EditJobGradeModal from '../../../components/hr/jobgrade/EditJobGradeModal';
import DeleteJobGradeModal from '../../../components/hr/jobgrade/DeleteJobGradeModal';
import JobGradeSearchFilters from '../../../components/hr/jobgrade/JobGradeSearchFilters';
import { jobGradeMockData } from '../../../components/hr/jobgrade/JobGradeData';
import type { JobGradeListDto, JobGradeAddDto, JobGradeModDto } from '../../../types/hr/jobgrade';
import type { UUID } from 'crypto';

const ITEMS_PER_PAGE = 9; // Good for grid layout (3x3)

const JobGradePage = () => {
  const [jobGrades, setJobGrades] = useState<JobGradeListDto[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<JobGradeListDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    category: '',
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
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
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
    
    // Category filter
    if (filters.category) {
      results = results.filter(grade => {
        const name = grade.name.toLowerCase();
        if (filters.category === 'Entry Level') return name.includes('entry');
        if (filters.category === 'Junior') return name.includes('junior');
        if (filters.category === 'Mid Level') return name.includes('mid');
        if (filters.category === 'Senior') return name.includes('senior');
        if (filters.category === 'Lead') return name.includes('lead');
        if (filters.category === 'Principal') return name.includes('principal');
        if (filters.category === 'Director') return name.includes('director');
        if (filters.category === 'Executive') return name.includes('executive');
        return true;
      });
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <JobGradeSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        jobGrades={jobGrades}
        onAddClick={() => setIsAddModalOpen(true)}
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

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {endIndex} of {totalItems} job grades
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
        </div>
      ) : currentGrades.length ? (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-center mt-6">
              <nav className="flex items-center gap-1 flex-wrap justify-center">
                {/* Prev Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <ChevronLeft size={16} />
                    <span className="md:hidden">Previous</span>
                  </Button>
                </motion.div>

                {/* Page Numbers with Ellipsis */}
                {(() => {
                  const pageButtons: React.JSX.Element[] = [];
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);

                  // Always show first page
                  if (start > 1) {
                    pageButtons.push(
                      <motion.div
                        key={1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant={currentPage === 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className={`
                            ${currentPage === 1
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md border-transparent'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                            transition-all duration-200 min-w-[38px] relative overflow-hidden
                          `}
                        >
                          {1}
                        </Button>
                      </motion.div>
                    );
                    if (start > 2) {
                      pageButtons.push(
                        <motion.span 
                          key="start-ellipsis" 
                          className="px-2 text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ...
                        </motion.span>
                      );
                    }
                  }

                  // Middle pages
                  for (let i = start; i <= end; i++) {
                    pageButtons.push(
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant={currentPage === i ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className={`
                            ${currentPage === i
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md border-transparent'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                            transition-all duration-200 min-w-[38px] relative overflow-hidden
                          `}
                        >
                          <motion.span
                            key={currentPage === i ? 'active' : 'inactive'}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {i}
                          </motion.span>
                        </Button>
                      </motion.div>
                    );
                  }

                  // Always show last page
                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pageButtons.push(
                        <motion.span 
                          key="end-ellipsis" 
                          className="px-2 text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ...
                        </motion.span>
                      );
                    }
                    pageButtons.push(
                      <motion.div
                        key={totalPages}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className={`
                            ${currentPage === totalPages
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md border-transparent'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                            transition-all duration-200 min-w-[38px] relative overflow-hidden
                          `}
                        >
                          {totalPages}
                        </Button>
                      </motion.div>
                    );
                  }

                  return pageButtons;
                })()}

                {/* Next Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <span className="md:hidden">Next</span>
                    <ChevronRight size={16} />
                  </Button>
                </motion.div>
              </nav>
            </div>
          )}
        </>
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
              setFilters({ category: '', minSalary: '', maxSalary: '' });
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {!loading && filteredGrades.length > 0 && (
        <JobGradeAnalytics jobGrades={jobGrades} filteredGrades={filteredGrades} />
      )}
    </motion.section>
  );
};

export default JobGradePage;