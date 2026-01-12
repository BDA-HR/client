import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../components/core/fiscalyear/FiscYearHeader';
import { AddFiscalYearModal } from '../../components/core/fiscalyear/AddFiscYearModal';
import { ViewFiscModal } from '../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../components/core/fiscalyear/DeleteFiscModal';
import { 
  useFiscalYears, 
  useCreateFiscalYear, 
  useUpdateFiscalYear, 
  useDeleteFiscalYear 
} from '../../services/core/fiscalyear/fisc.queries';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../types/core/fisc';
import PeriodSection from '../../components/core/period/PeriodSection';
import ActiveFisc from '../../components/core/fiscalyear/ActFiscYear';
import { motion } from 'framer-motion';
import PagePublicHoliday from './pageHoliday';

const getDefaultFiscalYear = (): AddFiscYearDto => ({
  name: '',
  dateStart: new Date().toISOString(),
  dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
});

export default function FiscalYearOverview() {
  const navigate = useNavigate();
  const [newYear, setNewYear] = useState<AddFiscYearDto>(getDefaultFiscalYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<FiscYearListDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const itemsPerPage = 10;

  // React Query hooks
  const {
    data: years = [],
    isLoading,
    error: queryError,
    refetch,
  } = useFiscalYears();

  const createFiscalYearMutation = useCreateFiscalYear({
    onSuccess: () => {
      setFormError(null);
      setAddModalOpen(false);
      setCurrentPage(1);
      setNewYear(getDefaultFiscalYear());
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create fiscal year');
    },
  });

  const updateFiscalYearMutation = useUpdateFiscalYear({
    onSuccess: () => {
      setFormError(null);
      setEditModalOpen(false);
      setSelectedYear(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update fiscal year');
    },
  });

  const deleteFiscalYearMutation = useDeleteFiscalYear({
    onSuccess: () => {
      setFormError(null);
      setDeleteModalOpen(false);
      setSelectedYear(null);
      
      // Adjust pagination if needed
      if (paginatedYears.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to delete fiscal year');
    },
  });

  // Get active fiscal year
  const activeYear = useMemo(() => 
    years.find(year => year.isActive === '0') || null,
    [years]
  );

  const totalItems = years.length;
  const paginatedYears = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return years.slice(startIndex, startIndex + itemsPerPage);
  }, [years, currentPage, itemsPerPage]);

  const handleYearUpdate = async (updatedYear: EditFiscYearDto) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await updateFiscalYearMutation.mutateAsync(updatedYear);
  };

  const handleYearDelete = async (yearId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deleteFiscalYearMutation.mutateAsync(yearId);
  };

  const handleAddFiscalYear = async (): Promise<void> => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await createFiscalYearMutation.mutateAsync(newYear);
  };

  const handleViewDetails = (year: FiscYearListDto) => {
    setSelectedYear(year);
    setViewModalOpen(true);
  };

  const handleViewHistory = () => {
    navigate('/core/fiscal-year/history');
  };

  const handleAddModalOpenChange = (open: boolean) => {
    setAddModalOpen(open);
    if (!open) {
      setNewYear(getDefaultFiscalYear());
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
    <>
      <div className="bg-gray-50 -mt-6 py-4 -mx-2">
        <Dialog>
          <FiscalYearManagementHeader 
            setDialogOpen={setAddModalOpen}
            onViewHistory={handleViewHistory}
            totalItems={totalItems}
          />
          
          <div className="w-full mx-auto px-2 py-4">
            {/* Error message for API errors */}
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
                        Failed to load fiscal years.{" "}
                        <button
                          onClick={() => refetch()}
                          className="underline hover:text-red-800 font-semibold focus:outline-none"
                          disabled={isLoading}
                        >
                          Try again
                        </button>
                      </>
                    ) : displayError.includes("create") ? (
                      "Failed to create fiscal year. Please try again."
                    ) : displayError.includes("update") ? (
                      "Failed to update fiscal year. Please try again."
                    ) : displayError.includes("delete") ? (
                      "Failed to delete fiscal year. Please try again."
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

            {!isLoading && !displayError && (
              <ActiveFisc
                activeYear={activeYear}
                loading={isLoading}
                error={displayError}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>

          {/* Add Modal */}
          <AddFiscalYearModal
            open={addModalOpen}
            onOpenChange={handleAddModalOpenChange}
            newYear={newYear}
            setNewYear={setNewYear}
            onAddFiscalYear={handleAddFiscalYear}
          />
        </Dialog>

        {/* Separate modals */}
        <ViewFiscModal
          fiscalYear={selectedYear}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        <EditFiscModal
          fiscalYear={selectedYear}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleYearUpdate}
        />

        <DeleteFiscModal
          fiscalYear={selectedYear}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
onConfirm={async () => {
  if (selectedYear) {
    await handleYearDelete(selectedYear.id);
  }
}}
        />
      </div>
      <PagePublicHoliday/>
      <PeriodSection />
    </>
  );
}