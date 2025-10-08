import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeriodTable } from '../../components/core/fiscalyear/PeriodTable';
import { ViewPeriodModal } from '../../components/core/fiscalyear/ViewPeriodModal';
import EditPeriodModal from '../../components/core/fiscalyear/EditPeriodModal';
import { DeletePeriodModal } from '../../components/core/fiscalyear/DeletePeriodModal';
import { periodService } from '../../services/core/periodservice';
import type { PeriodListDto, EditPeriodDto, UUID } from '../../types/core/period';
import { motion } from 'framer-motion';
import PeriodSearchFilters from '../../components/core/fiscalyear/PeriodSearchFilters';

export default function PagePeriod() {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<PeriodListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);

  const itemsPerPage = 10;

  // Filter periods based on search term - shows ALL periods (active and inactive)
  const filteredPeriods = useMemo(() => {
    if (!searchTerm.trim()) return periods;

    const term = searchTerm.toLowerCase().trim();
    
    const results = periods.filter(period => {
      // Check regular fields
      const regularMatch = 
        period.name.toLowerCase().includes(term) ||
        period.quarter.toLowerCase().includes(term) ||
        period.fiscYear.toLowerCase().includes(term);
      
      // Check status fields - flexible matching
      const statusMatch = 
        period.isActiveStr.toLowerCase().includes(term) ||
        (period.isActive === '0' && (
          term === 'active' || 
          term === 'act' || 
          term === '0' ||
          'active'.startsWith(term)
        )) ||
        (period.isActive === '1' && (
          term === 'inactive' || 
          term === 'inact' || 
          term === '1' ||
          'inactive'.startsWith(term)
        ));
      
      return regularMatch || statusMatch;
    });
    
    return results;
  }, [periods, searchTerm]);

  const totalItems = filteredPeriods.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPeriods = filteredPeriods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use actual API call
      const periodsData = await periodService.getAllPeriods();
      setPeriods(periodsData);
    } catch (err) {
      setError('Failed to load periods');
      console.error('Error loading periods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPeriod = async (periodData: EditPeriodDto) => {
    try {
      setError(null);
      const updatedPeriod = await periodService.updatePeriod(periodData);
      setPeriods((prev) =>
        prev.map((p) => (p.id === updatedPeriod.id ? updatedPeriod : p))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating period:', err);
      setError('Failed to update period');
      throw err;
    }
  };

  const handleDeletePeriod = async (periodId: UUID) => {
    try {
      await periodService.deletePeriod(periodId);
      setPeriods((prev) => prev.filter((p) => p.id !== periodId));
      setDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting period:', err);
      setError('Failed to delete period');
    }
  };

  const handleViewDetails = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setViewModalOpen(true);
  };

  const handleEdit = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setEditModalOpen(true);
  };

  const handleDelete = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setDeleteModalOpen(true);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddPeriodClick = () => {
    navigate('/core/fiscal-year/overview');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-2 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            <span className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent'>
              Period History
            </span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Viewing all periods including active and inactive ones
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search Filters */}
            <PeriodSearchFilters
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
              onAddPeriod={handleAddPeriodClick}
              onViewHistory={() => {}} // Empty function since we're already in history view
              totalItems={periods.length}
            />

            {/* Periods Table - Shows ALL periods (active and inactive) */}
            <PeriodTable
              periods={paginatedPeriods}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </>
        )}

        {/* View Modal */}
        <ViewPeriodModal
          period={selectedPeriod}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Edit Modal */}
        {selectedPeriod && (
          <EditPeriodModal
            period={selectedPeriod}
            onEditPeriod={handleEditPeriod}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
          />
        )}

        {/* Delete Modal */}
        <DeletePeriodModal
          period={selectedPeriod}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeletePeriod}
        />
      </div>
    </div>
  );
}