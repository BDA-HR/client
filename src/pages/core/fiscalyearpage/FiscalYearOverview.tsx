import { useState, useEffect } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { FiscalYearManagementHeader } from '../../../components/core/fiscalyear/FiscYearHeader';
import { FiscalYearTable } from '../../../components/core/fiscalyear/FiscYearTable';
import { AddFiscalYearModal } from '../../../components/core/fiscalyear/AddFiscYearModal';
import { ViewFiscModal } from '../../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../../components/core/fiscalyear/DeleteFiscModal';
import { fiscalYearService } from '../../../services/core/fiscservice';
import type { FiscYearListDto, AddFiscYearDto, EditFiscYearDto, UUID } from '../../../types/core/fisc';

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const handleYearStatusChange = async (yearId: UUID, newStatus: string) => {
    try {
      const year = years.find(y => y.id === yearId);
      if (!year) return;

      const editData: EditFiscYearDto = {
        id: yearId,
        name: year.name,
        dateStart: year.dateStart,
        dateEnd: year.dateEnd,
        isActive: newStatus,
        rowVersion: year.rowVersion || '1'
      };
      
      const result = await fiscalYearService.updateFiscalYear(editData);
      setYears(years.map(y => y.id === result.id ? result : y));
    } catch (err) {
      console.error('Error updating fiscal year status:', err);
      setError('Failed to update status');
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
  // Remove the validation from here since it's now handled in the modal
  const createdYear = await fiscalYearService.createFiscalYear(newYear);
  setYears([createdYear, ...years]);
  setNewYear({
    name: '',
    dateStart: new Date().toISOString(),
    dateEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: 'Yes'
  });
  
  setAddModalOpen(false);
  setCurrentPage(1);
};

  const handleViewDetails = (year: FiscYearListDto) => {
    setSelectedYear(year);
    setViewModalOpen(true);
  };

  const handleEdit = (year: FiscYearListDto) => {
    setSelectedYear(year);
    setEditModalOpen(true);
  };

  const handleDelete = (year: FiscYearListDto) => {
    setSelectedYear(year);
    setDeleteModalOpen(true);
  };

  const handleStatusChange = (year: FiscYearListDto) => {
    handleYearStatusChange(year.id, year.isActive === 'Yes' ? 'No' : 'Yes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog>
        <FiscalYearManagementHeader setDialogOpen={setAddModalOpen} />
        
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
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>

        {/* Add Modal */}
        <AddFiscalYearModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
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
  );
}