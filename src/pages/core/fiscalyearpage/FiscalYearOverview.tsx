import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../../components/core/fiscalyear/FiscYearHeader';
import { AddFiscalYearModal } from '../../../components/core/fiscalyear/AddFiscYearModal';
import { ViewFiscModal } from '../../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../../components/core/fiscalyear/DeleteFiscModal';
import { fiscalYearService } from '../../../services/core/fiscservice';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../../types/core/fisc';
import PeriodSection from '../../../components/core/fiscalyear/PeriodSection';
import ActiveFisc from '../../../components/core/fiscalyear/ActFiscYear';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';

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
  const activeYear = years.find(year => year.isActive === 'Yes') || null;

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
    } catch (err) {
      console.error('Error updating fiscal year:', err);
      setError('Failed to update fiscal year');
    }
  };



  const handleYearDelete = async (yearId: UUID) => {
    try {
      await fiscalYearService.deleteFiscalYear(yearId);
      setYears(years.filter(year => year.id !== yearId));
      setDeleteModalOpen(false);
      
      if (paginatedYears.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting fiscal year:', err);
      setError('Failed to delete fiscal year');
    }
  };

  const handleAddFiscalYear = async (): Promise<void> => {
    const createdYear = await fiscalYearService.createFiscalYear(newYear);
    setYears([createdYear, ...years]);
    setAddModalOpen(false);
    setCurrentPage(1);
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
      <div className="bg-gray-50">
        <Dialog>
          <FiscalYearManagementHeader setDialogOpen={setAddModalOpen} />
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Single Error Message - Shows instead of both ActiveFisc and Table */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm p-6 mb-6"
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

            {!loading && !error && (
              <>
                <ActiveFisc
                  activeYear={activeYear}
                  loading={loading}
                  error={error}
                  onViewDetails={handleViewDetails}
                />

                {/* View History Button */}

              </>
            )}
          </div>
<div className="w-full mx-4 mt-2">
                  <Button
                    onClick={handleViewHistory}
                    variant={'outline'}
                    className=" cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View History ({totalItems} fiscal year{totalItems !== 1 ? 's' : ''})
                  </Button>
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
      <PeriodSection />
    </>
  );
}