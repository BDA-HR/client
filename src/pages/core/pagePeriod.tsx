import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PeriodTable } from '../../components/core/period/PeriodTable';
import { ViewPeriodModal } from '../../components/core/period/ViewPeriodModal';
import EditPeriodModal from '../../components/core/period/EditPeriodModal';
import { DeletePeriodModal } from '../../components/core/period/DeletePeriodModal';
import { AddPeriodModal } from '../../components/core/period/AddPeriodModal';
import PeriodSearchFilters from '../../components/core/period/PeriodSearchFilters';
import { 
  usePeriods, 
  useCreatePeriod, 
  useUpdatePeriod, 
  useDeletePeriod,
  usePeriodValidation
} from '../../services/core/period/period.queries';
import type { PeriodListDto, EditPeriodDto, UUID, AddPeriodDto } from '../../types/core/period';
import type { Quarter } from '../../types/core/enum';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PagePeriod() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Correct AddPeriodDto based on your types
  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: "",
    dateStart: new Date().toISOString().split('T')[0],
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quarter: "" as Quarter, // Changed from quarterId to quarter
    fiscalYearId: "" as UUID,
    // No isActive field - it will be set to active by default on the server
  });

  const itemsPerPage = 10;

  // React Query hooks
  const {
    data: periods = [],
    isLoading,
    error: queryError,
    refetch,
  } = usePeriods();

  const createPeriodMutation = useCreatePeriod({
    onSuccess: (newPeriodData) => {
      setFormError(null);
      setIsModalOpen(false);
      // Reset to default values
      setNewPeriod({
        name: "",
        dateStart: new Date().toISOString().split('T')[0],
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quarter: "" as Quarter,
        fiscalYearId: "" as UUID,
      });
      
      // Check if the new period is active
      if (newPeriodData.isActive === "0") {
        toast.success("Active period added successfully!");
      } else {
        toast.success("Period added successfully!");
      }
    },
    onError: (error) => {
      setFormError(error.message || "Failed to add period");
      toast.error("Failed to add period");
    },
  });

  const updatePeriodMutation = useUpdatePeriod({
    onSuccess: (updatedPeriod) => {
      setFormError(null);
      setEditModalOpen(false);
      setSelectedPeriod(null);
      
      if (updatedPeriod.isActive === "0") {
        toast.success("Period updated and set as active!");
      } else {
        toast.success("Period updated successfully!");
      }
    },
    onError: (error) => {
      setFormError(error.message || "Failed to update period");
      toast.error("Failed to update period");
    },
  });

  const deletePeriodMutation = useDeletePeriod({
    onSuccess: () => {
      setFormError(null);
      setDeleteModalOpen(false);
      setSelectedPeriod(null);
      toast.success("Period deleted successfully!");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to delete period");
      toast.error("Failed to delete period");
    },
  });

  const { validateDates } = usePeriodValidation();

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

  // Pagination calculations
  const totalItems = filteredPeriods.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPeriods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPeriods.slice(startIndex, endIndex);
  }, [filteredPeriods, currentPage, itemsPerPage]);

  const handleAddPeriod = async () => {
    setFormError(null);
    
    // Validate dates
    const dateError = validateDates(newPeriod.dateStart, newPeriod.dateEnd);
    if (dateError) {
      setFormError(dateError);
      toast.error(dateError);
      return;
    }

    // No try/catch needed - error is handled by mutation's onError
    await createPeriodMutation.mutateAsync(newPeriod);
  };

  const handleEditPeriod = async (periodData: EditPeriodDto) => {
    setFormError(null);
    
    // Validate dates
    const dateError = validateDates(periodData.dateStart, periodData.dateEnd);
    if (dateError) {
      setFormError(dateError);
      toast.error(dateError);
      return;
    }

    // No try/catch needed - error is handled by mutation's onError
    await updatePeriodMutation.mutateAsync(periodData);
  };

  const handleDeletePeriod = async (periodId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deletePeriodMutation.mutateAsync(periodId);
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddPeriodClick = () => {
    setIsModalOpen(true);
  };

  const handleViewHistory = () => {
    navigate('/core/fiscal-year/overview');
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    if (selectedPeriod) {
      await handleDeletePeriod(selectedPeriod.id);
    }
  };

  // Combine query error and form error
  const displayError = queryError?.message || formError;

  // Clear errors
  const clearErrors = () => {
    setFormError(null);
    if (queryError) {
      refetch();
    }
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
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {displayError.includes("load") ? (
                  <>
                    Failed to load periods.{" "}
                    <button
                      onClick={() => refetch()}
                      className="underline hover:text-red-800 font-semibold focus:outline-none"
                      disabled={isLoading}
                    >
                      Try again
                    </button>
                  </>
                ) : displayError.includes("update") ? (
                  "Failed to update period. Please try again."
                ) : displayError.includes("delete") ? (
                  "Failed to delete period. Please try again."
                ) : displayError.includes("End date") ? (
                  displayError
                ) : (
                  displayError
                )}
              </span>
              <button
                onClick={clearErrors}
                className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
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
                loading={isLoading}
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
          onConfirm={handleDeleteConfirmation}
        />
      </div>
    </div>
  );
}