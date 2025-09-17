import { useState, useEffect } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../../components/core/fiscalyear/FiscYearHeader';
import { FiscalYearTable } from '../../../components/core/fiscalyear/FiscYearTable';
import { FiscalYearModal } from '../../../components/core/fiscalyear/FiscYearModal';
import { AddFiscalYearModal } from '../../../components/core/fiscalyear/AddFiscYearModal';
import { fiscalYearService } from '../../../services/core/fiscservice';
import type { FiscYearListDto, AddFiscYearDto, UUID } from '../../../types/core/fisc';

export default function FiscalYearOverview() {
  const [years, setYears] = useState<FiscYearListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newYear, setNewYear] = useState<AddFiscYearDto>({
    name: '',
    dateStart: new Date().toISOString(),
    dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: 'Yes'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'delete' | 'add' | null>(null);
  const [selectedYear, setSelectedYear] = useState<FiscYearListDto | null>(null);

  const itemsPerPage = 10;
  const totalItems = years.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedYears = years.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Load fiscal years from API
  useEffect(() => {
    loadFiscalYears();
  }, []);

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

  const handleYearUpdate = async (updatedYear: FiscYearListDto) => {
    try {
      const editData = {
        id: updatedYear.id,
        name: updatedYear.name,
        dateStart: updatedYear.dateStart,
        dateEnd: updatedYear.dateEnd,
        isActive: updatedYear.isActive,
        rowVersion: updatedYear.rowVersion || '1'
      };
      
      const result = await fiscalYearService.updateFiscalYear(editData);
      setYears(years.map(year => year.id === result.id ? result : year));
      setModalType(null);
    } catch (err) {
      console.error('Error updating fiscal year:', err);
      setError('Failed to update fiscal year');
    }
  };

  const handleYearStatusChange = async (yearId: UUID, newStatus: string) => {
    try {
      const year = years.find(y => y.id === yearId);
      if (!year) return;

      const editData = {
        id: yearId,
        name: year.name,
        dateStart: year.dateStart,
        dateEnd: year.dateEnd,
        isActive: newStatus,
        rowVersion: year.rowVersion || '1'
      };
      
      const result = await fiscalYearService.updateFiscalYear(editData);
      setYears(years.map(y => y.id === result.id ? result : y));
      setModalType(null);
    } catch (err) {
      console.error('Error updating fiscal year status:', err);
      setError('Failed to update status');
    }
  };

  const handleYearDelete = async (yearId: UUID) => {
    try {
      await fiscalYearService.deleteFiscalYear(yearId);
      setYears(years.filter(year => year.id !== yearId));
      setModalType(null);
      
      if (paginatedYears.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting fiscal year:', err);
      setError('Failed to delete fiscal year');
    }
  };

  const handleAddFiscalYear = async () => {
    try {
      if (!newYear.name || !newYear.dateStart || !newYear.dateEnd) {
        alert('Please fill all required fields');
        return;
      }

      const createdYear = await fiscalYearService.createFiscalYear(newYear);
      setYears([createdYear, ...years]);
        setNewYear({
        name: '',
        dateStart: new Date().toISOString(),
        dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: 'Yes'
      });
      
      setDialogOpen(false);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error creating fiscal year:', err);
      setError('Failed to create fiscal year');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <FiscalYearManagementHeader setDialogOpen={setDialogOpen} />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <div className="flex items-center">
                <span>{error}</span>
                <button 
                  onClick={loadFiscalYears}
                  className="ml-4 text-red-800 hover:text-red-900 underline font-medium cursor-pointer"
                >
                  Try Again
                </button>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="absolute top-0 right-0 p-2"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {!loading && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Fiscal Years</h2>
                <p className="text-sm text-gray-600">
                  {totalItems} fiscal year{totalItems !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <FiscalYearTable
                years={paginatedYears}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onYearUpdate={handleYearUpdate}
                onYearStatusChange={handleYearStatusChange}
                onYearDelete={handleYearDelete}
                onViewDetails={(year) => {
                  setSelectedYear(year);
                  setModalType('view');
                }}
                onEdit={(year) => {
                  setSelectedYear(year);
                  setModalType('edit');
                }}
              />
            </>
          )}
        </div>

        <AddFiscalYearModal
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          newYear={newYear}
          setNewYear={setNewYear}
          onAddFiscalYear={handleAddFiscalYear}
        />

        <FiscalYearModal
          modalType={modalType}
          selectedYear={selectedYear}
          newYear={newYear}
          setNewYear={setNewYear}
          onClose={() => setModalType(null)}
          onYearUpdate={handleYearUpdate}
          onYearStatusChange={handleYearStatusChange}
          onYearDelete={handleYearDelete}
          onAddFiscalYear={handleAddFiscalYear}
        />
      </Dialog>
    </div>
  );
}