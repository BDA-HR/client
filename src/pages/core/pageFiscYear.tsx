import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../components/core/fiscalyear/FiscYearHeader';
import { AddFiscalYearModal } from '../../components/core/fiscalyear/AddFiscYearModal';
import { ViewFiscModal } from '../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../components/core/fiscalyear/DeleteFiscModal';
import { fiscalYearService } from '../../services/core/fiscservice';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../types/core/fisc';
import PeriodSection from '../../components/core/period/PeriodSection';
import ActiveFisc from '../../components/core/fiscalyear/ActFiscYear';
import { motion } from 'framer-motion';
import PagePublicHoliday from './pagePublicHoliday';

const getDefaultFiscalYear = (): AddFiscYearDto => ({
  name: '',
  dateStart: new Date().toISOString(),
  dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
});

export default function FiscalYearOverview() {
  const navigate = useNavigate();
  const [years, setYears] = useState<FiscYearListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newYear, setNewYear] = useState<AddFiscYearDto>(getDefaultFiscalYear());

  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<FiscYearListDto | null>(null);

  const itemsPerPage = 10;
  const totalItems = years.length;
  const paginatedYears = years.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get active fiscal year
  const activeYear = years.find(year => year.isActive === '0') || null;

  // Load fiscal years from API
  useEffect(() => {
    loadFiscalYears();
  }, []);
  
  useEffect(() => {
    if (addModalOpen) {
      setNewYear(getDefaultFiscalYear());
    }
  }, [addModalOpen]);

  const loadFiscalYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const fiscalYears = await fiscalYearService.getAllFiscalYears();
      setYears(fiscalYears);
    } catch (err) {
      setError('Failed to load fiscal years');
      console.error('Error loading fiscal years:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleYearUpdate = async (updatedYear: EditFiscYearDto) => {
    try {
      const result = await fiscalYearService.updateFiscalYear(updatedYear);
      setYears(years.map(year => year.id === result.id ? result : year));
      setEditModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error updating fiscal year:', err);
      setError('Failed to update fiscal year');
      throw err;
    }
  };

  const handleYearDelete = async (yearId: UUID) => {
    try {
      await fiscalYearService.deleteFiscalYear(yearId);
      setYears(years.filter(year => year.id !== yearId));
      setDeleteModalOpen(false);
      setError(null);
      
      if (paginatedYears.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting fiscal year:', err);
      setError('Failed to delete fiscal year');
    }
  };

  const handleAddFiscalYear = async (): Promise<void> => {
    try {
      const createdYear = await fiscalYearService.createFiscalYear(newYear);
      setYears([createdYear, ...years]);
      setAddModalOpen(false);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error('Error creating fiscal year:', err);
      setError('Failed to create fiscal year');
      throw err;
    }
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
                        Failed to load fiscal years.{" "}
                        <button
                          onClick={loadFiscalYears}
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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            )}

            {!loading && !error && (
              <ActiveFisc
                activeYear={activeYear}
                loading={loading}
                error={error}
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
          onConfirm={handleYearDelete}
        />
      </div>
      <PagePublicHoliday/>
      <PeriodSection />
      
    </>
  );
}