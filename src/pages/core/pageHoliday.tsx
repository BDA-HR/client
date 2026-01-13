import { useState, useEffect } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { HolidayHeader } from '../../components/core/holiday/HolidayHeader';
import { AddHolidayModal } from '../../components/core/holiday/AddHolidayModal';
import { EditHolidayModal } from '../../components/core/holiday/EditHolidayModal';
import { DeleteHolidayModal } from '../../components/core/holiday/DeleteHolidayModal';
import { HolidayList } from '../../components/core/holiday/HolidayList';
import { 
  useHolidays, 
  useCreateHoliday, 
  useUpdateHoliday, 
  useDeleteHoliday 
} from '../../services/core/holiday/holiday.queries';
import { useFiscalYears } from '../../services/core/fiscalyear/fisc.queries';
import type { AddHolidayDto, HolidayListDto, EditHolidayDto, UUID } from '../../types/core/holiday';
import type { FiscYearListDto } from '../../types/core/fisc';
import { motion } from 'framer-motion';

const getDefaultHoliday = (fiscalYears: FiscYearListDto[]): AddHolidayDto => ({
  name: '',
  date: new Date().toISOString(),
  isPublic: true,
  fiscalYearId: fiscalYears.length > 0 ? fiscalYears[0].id : '' as UUID,
});

export default function PageHoliday() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<AddHolidayDto>({
    name: '',
    date: new Date().toISOString(),
    isPublic: true,
    fiscalYearId: '' as UUID,
  });
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayListDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // React Query hooks
  const {
    data: holidays = [],
    isLoading: holidaysLoading,
    error: holidaysError,
    refetch: refetchHolidays,
  } = useHolidays();

  const {
    data: fiscalYears = [],
    isLoading: fiscalYearsLoading,
    error: fiscalYearsError,
  } = useFiscalYears();

  const createHolidayMutation = useCreateHoliday({
    onSuccess: () => {
      setFormError(null);
      setAddModalOpen(false);
      setNewHoliday(getDefaultHoliday(fiscalYears));
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create holiday');
    },
  });

  const updateHolidayMutation = useUpdateHoliday({
    onSuccess: () => {
      setFormError(null);
      setEditModalOpen(false);
      setSelectedHoliday(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update holiday');
    },
  });

  const deleteHolidayMutation = useDeleteHoliday({
    onSuccess: () => {
      setFormError(null);
      setDeleteModalOpen(false);
      setSelectedHoliday(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to delete holiday');
    },
  });

  // Set default fiscal year for new holidays when fiscal years are loaded
  useEffect(() => {
    if (fiscalYears.length > 0 && !newHoliday.fiscalYearId) {
      setNewHoliday(prev => ({
        ...prev,
        fiscalYearId: fiscalYears[0].id
      }));
    }
  }, [fiscalYears, newHoliday.fiscalYearId]);

  // Reset newHoliday when add modal opens with current fiscal years
  useEffect(() => {
    if (addModalOpen && fiscalYears.length > 0) {
      setNewHoliday(getDefaultHoliday(fiscalYears));
    }
  }, [addModalOpen, fiscalYears]);

  const handleAddHoliday = async (): Promise<void> => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await createHolidayMutation.mutateAsync(newHoliday);
  };

  const handleEditHoliday = async (holidayData: EditHolidayDto): Promise<void> => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await updateHolidayMutation.mutateAsync(holidayData);
  };

  const handleDeleteHoliday = async (holidayId: UUID): Promise<void> => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deleteHolidayMutation.mutateAsync(holidayId);
  };

  const handleAddModalOpenChange = (open: boolean) => {
    setAddModalOpen(open);
    if (!open) {
      setNewHoliday(getDefaultHoliday(fiscalYears));
    }
  };

  // Handler for editing holiday
  const handleEdit = (holiday: HolidayListDto) => {
    setSelectedHoliday(holiday);
    setEditModalOpen(true);
  };

  // Handler for deleting holiday
  const handleDelete = (holiday: HolidayListDto) => {
    setSelectedHoliday(holiday);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    if (selectedHoliday) {
      await handleDeleteHoliday(selectedHoliday.id);
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedHoliday(null);
  };

  // Combine errors from both queries
  const displayError = holidaysError?.message || fiscalYearsError?.message || formError;

  // Combined loading state
  const isLoading = holidaysLoading || fiscalYearsLoading;

  // Clear errors
  const clearErrors = () => {
    setFormError(null);
    if (holidaysError || fiscalYearsError) {
      refetchHolidays();
    }
  };

  // Get current fiscal year for display
  const currentFiscalYear = fiscalYears.find(fy => fy.isActive === '0')?.name || 
                           (fiscalYears.length > 0 ? fiscalYears[0].name : 'N/A');

  return (
    <div className="bg-gray-50 -mt-6 py-4 -mx-2">
      <Dialog>
        <HolidayHeader 
          setDialogOpen={setAddModalOpen}
        />
        
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
                    Failed to load holidays.{" "}
                    <button
                      onClick={() => refetchHolidays()}
                      className="underline hover:text-red-800 font-semibold focus:outline-none"
                      disabled={isLoading}
                    >
                      Try again
                    </button>
                  </>
                ) : displayError.includes("create") ? (
                  "Failed to create holiday. Please try again."
                ) : displayError.includes("update") ? (
                  "Failed to update holiday. Please try again."
                ) : displayError.includes("delete") ? (
                  "Failed to delete holiday. Please try again."
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
        
        {/* Main Content */}
        <div className="w-full mx-auto px-4 py-6">
          <HolidayList
            holidays={holidays}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentFiscalYear={currentFiscalYear}
          />
        </div>

        <AddHolidayModal
          open={addModalOpen}
          onOpenChange={handleAddModalOpenChange}
          newHoliday={newHoliday}
          setNewHoliday={setNewHoliday}
          onAddHoliday={handleAddHoliday}
          fiscalYears={fiscalYears}
        />
      </Dialog>

      {/* Edit Modal */}
      <EditHolidayModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        onSave={handleEditHoliday}
        holiday={selectedHoliday}
        fiscalYears={fiscalYears}
      />

      <DeleteHolidayModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirmation}
        holiday={selectedHoliday}
      />
    </div>
  );
}