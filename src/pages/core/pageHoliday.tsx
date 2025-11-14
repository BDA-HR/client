import { useState, useEffect } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { HolidayHeader } from '../../components/core/holiday/HolidayHeader';
import { AddHolidayModal } from '../../components/core/holiday/AddHolidayModal';
import { EditHolidayModal } from '../../components/core/holiday/EditHolidayModal';
import { DeleteHolidayModal } from '../../components/core/holiday/DeleteHolidayModal';
import { HolidayList } from '../../components/core/holiday/HolidayList';
import { holidayService } from '../../services/core/holidayservice';
import { fiscalYearService } from '../../services/core/fiscservice';
import type { AddHolidayDto, HolidayListDto, EditHolidayDto, UUID } from '../../types/core/holiday';
import {motion} from 'framer-motion';
import type { FiscYearListDto } from '../../types/core/fisc';

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
  const [holidays, setHolidays] = useState<HolidayListDto[]>([]);
  const [fiscalYears, setFiscalYears] = useState<FiscYearListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load holidays and fiscal years on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reset newHoliday when add modal opens with current fiscal years
  useEffect(() => {
    if (addModalOpen && fiscalYears.length > 0) {
      setNewHoliday(getDefaultHoliday(fiscalYears));
    }
  }, [addModalOpen, fiscalYears]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load holidays and fiscal years in parallel
      const [holidaysData, fiscalYearsData] = await Promise.all([
        holidayService.getAllHolidays(),
        fiscalYearService.getAllFiscalYears()
      ]);
      
      setHolidays(holidaysData);
      setFiscalYears(fiscalYearsData);
      
      // Set default fiscal year for new holidays
      if (fiscalYearsData.length > 0) {
        setNewHoliday(prev => ({
          ...prev,
          fiscalYearId: fiscalYearsData[0].id
        }));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load holidays data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (): Promise<void> => {
    try {
      setError(null);
      const createdHoliday = await holidayService.createHoliday(newHoliday);
      setHolidays(prev => [createdHoliday, ...prev]);
      setAddModalOpen(false);
      setNewHoliday(getDefaultHoliday(fiscalYears));
    } catch (error) {
      console.error('Error adding holiday:', error);
      setError('Failed to create holiday');
      throw error;
    }
  };

  const handleEditHoliday = async (holidayData: EditHolidayDto): Promise<void> => {
    try {
      setError(null);
      const updatedHoliday = await holidayService.updateHoliday(holidayData);
      setHolidays(prev => prev.map(h => 
        h.id === updatedHoliday.id ? updatedHoliday : h
      ));
      setEditModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error updating holiday:', error);
      setError('Failed to update holiday');
      throw error;
    }
  };

  const handleDeleteHoliday = async (holidayId: UUID): Promise<void> => {
    try {
      setError(null);
      await holidayService.deleteHoliday(holidayId);
      setHolidays(prev => prev.filter(h => h.id !== holidayId));
      setDeleteModalOpen(false);
      setSelectedHoliday(null);
    } catch (error) {
      console.error('Error deleting holiday:', error);
      setError('Failed to delete holiday');
      throw error;
    }
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

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedHoliday(null);
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
                        Failed to load holidays.{" "}
                        <button
                          onClick={loadData}
                          className="underline hover:text-red-800 font-semibold focus:outline-none"
                        >
                          Try again
                        </button>{" "}
                        later.
                      </>
                    ) : error.includes("create") ? (
                      "Failed to create fiscal year. Please try again."
                    ) : error.includes("update") ? (
                      "Failed to update fiscal year. Please try again."
                    ) : error.includes("delete") ? (
                      "Failed to delete fiscal year. Please try again."
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
        
        {/* Main Content */}
        <div className="w-full mx-auto px-4 py-6">
          <HolidayList
            holidays={holidays}
            loading={loading}
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
  onConfirm={handleDeleteHoliday}
  holiday={selectedHoliday}
/>
    </div>
  );
}