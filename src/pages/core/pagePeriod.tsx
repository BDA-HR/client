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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);

  const itemsPerPage = 10;

  // Filter periods based on search term and status
  const filteredPeriods = useMemo(() => {
    let filtered = periods;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(period => 
        statusFilter === "active" ? period.isActive === "0" : period.isActive === "1"
      );
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(period => {
        const regularMatch = 
          period.name.toLowerCase().includes(term) ||
          period.quarter.toLowerCase().includes(term) ||
          period.fiscYear.toLowerCase().includes(term);
        
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
    }
    
    return filtered;
  }, [periods, searchTerm, statusFilter]);

  const totalItems = filteredPeriods.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPeriods = filteredPeriods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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

  const handleStatusFilterChange = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {error.includes("load") ? (
                  <>
                    Failed to load periods.{" "}
                    <button
                      onClick={loadPeriods}
                      className="underline hover:text-red-800 font-semibold focus:outline-none"
                    >
                      Try again
                    </button>{" "}
                    later.
                  </>
                ) : error.includes("update") ? (
                  "Failed to update period. Please try again."
                ) : error.includes("delete") ? (
                  "Failed to delete period. Please try again."
                ) : (
                  error
                )}
              </span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
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
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              onClearFilters={handleClearFilters}
              onAddPeriod={handleAddPeriodClick}
              onViewHistory={() => {}} // Empty function since we're already in history view
              totalItems={periods.length}
              filteredItems={filteredPeriods.length}
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