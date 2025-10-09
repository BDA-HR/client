import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeriodTable } from '../../components/core/period/PeriodTable';
import { ViewPeriodModal } from '../../components/core/period/ViewPeriodModal';
import EditPeriodModal from '../../components/core/period/EditPeriodModal';
import { DeletePeriodModal } from '../../components/core/period/DeletePeriodModal';
import { AddPeriodModal } from '../../components/core/period/AddPeriodModal';
import { periodService } from '../../services/core/periodservice';
import type { PeriodListDto, EditPeriodDto, UUID, AddPeriodDto } from '../../types/core/period';
import { motion } from 'framer-motion';
import PeriodSearchFilters from '../../components/core/period/PeriodSearchFilters';
import toast from 'react-hot-toast';

export default function PagePeriod() {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<PeriodListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);

  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: "",
    dateStart: new Date().toISOString().split('T')[0],
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: "0",
    quarterId: "" as UUID,
    fiscalYearId: "" as UUID,
  });

  const itemsPerPage = 10;

  // Filter periods based on search term - shows ALL periods (active and inactive)
  const filteredPeriods = useMemo(() => {
    if (!searchTerm.trim()) {
      return periods;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return periods.filter(period => {
      // Direct field matches
      if (period.name?.toLowerCase().includes(term)) return true;
      if (period.quarter?.toLowerCase().includes(term)) return true;
      if (period.fiscYear?.toLowerCase().includes(term)) return true;
      if (period.isActiveStr?.toLowerCase().includes(term)) return true;
      
      // Status code matches
      if (term === '0' && period.isActive === '0') return true;
      if (term === '1' && period.isActive === '1') return true;
      
      // Status text matches (with partial matching)
      if (period.isActive === '0') {
        if (term === 'active') return true;
        if (term === 'act') return true;
        if ('active'.includes(term)) return true;
      }
      
      if (period.isActive === '1') {
        if (term === 'inactive') return true;
        if (term === 'inact') return true;
        if ('inactive'.includes(term)) return true;
      }
      
      return false;
    });
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
      
      const periodsData = await periodService.getAllPeriods();
      setPeriods(periodsData);
    } catch (err) {
      setError('Failed to load periods');
      console.error('Error loading periods:', err);
      setPeriods([]); // Ensure periods is empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async () => {
    try {
      toast.loading("Adding period...");
      setError(null);
      
      const createdPeriod = await periodService.createPeriod(newPeriod);
      setPeriods((prev) => [createdPeriod, ...prev]);
      setNewPeriod({
        name: "",
        dateStart: new Date().toISOString().split('T')[0],
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: "0",
        quarterId: "" as UUID,
        fiscalYearId: "" as UUID,
      });
      setIsModalOpen(false);
      toast.dismiss();
      toast.success("Period added successfully!");
    } catch (err) {
      console.error("Error adding period:", err);
      toast.dismiss();
      setError("Failed to add period");
      toast.error("Failed to add period");
      throw err;
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

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  const handleAddPeriodClick = () => {
    setIsModalOpen(true);
  };

  const handleViewHistory = () => {
    navigate('/core/fiscal-year/overview');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full -mt-4 mx-auto py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            <span className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent'>
              Period History
            </span>
          </h1>
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
        {!loading && (
          <>
            {/* Search Filters */}
            <PeriodSearchFilters
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
              onClearFilters={handleClearFilters}
              onAddPeriod={handleAddPeriodClick}
              onViewHistory={handleViewHistory}
              totalItems={periods.length}
              filteredItems={filteredPeriods.length}
              isHistoryView={true}
            />

            {/* Add padding between search filters and table */}
            <div className="mt-6">
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
            </div>
          </>
        )}

        {/* Add Period Modal */}
        <AddPeriodModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          newPeriod={newPeriod}
          setNewPeriod={setNewPeriod}
          onAddPeriod={handleAddPeriod}
        />

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