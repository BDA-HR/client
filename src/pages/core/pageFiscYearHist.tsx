import { useState, useEffect, useMemo } from 'react';
import { FiscalYearTable } from '../../components/core/fiscalyear/FiscYearTable';
import { FiscYearSearch } from '../../components/core/fiscalyear/FiscYearSearch';
import { ViewFiscModal } from '../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../components/core/fiscalyear/DeleteFiscModal';
import { fiscalYearService } from '../../services/core/fiscservice';
import type { FiscYearListDto, EditFiscYearDto, UUID } from '../../types/core/fisc';
import { motion } from 'framer-motion';


export default function FiscalYearHistory() {
  const [years, setYears] = useState<FiscYearListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<FiscYearListDto | null>(null);

  const itemsPerPage = 10;

  // Filter years based on search term
  const filteredYears = useMemo(() => {
    if (!searchTerm.trim()) return years;

    const term = searchTerm.toLowerCase().trim();
    return years.filter(year => 
      year.name.toLowerCase().includes(term) ||
      year.dateStartStr.toLowerCase().includes(term) ||
      year.dateEndStr.toLowerCase().includes(term) ||
      year.isActiveStr.toLowerCase().includes(term) ||
      (year.isActive === '0' && 'active'.includes(term)) ||
      (year.isActive === '1' && 'inactive'.includes(term)) ||
      year.dateStartStrAm.toLowerCase().includes(term) ||
      year.dateEndStrAm.toLowerCase().includes(term)
    );
  }, [years, searchTerm]);

  const totalItems = filteredYears.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedYears = filteredYears.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadFiscalYears();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      // Validate dates
      const startDate = new Date(updatedYear.dateStart);
      const endDate = new Date(updatedYear.dateEnd);
      
      if (endDate <= startDate) {
        setError('End date must be after start date');
        return;
      }

      const result = await fiscalYearService.updateFiscalYear(updatedYear);
      setYears(years.map(year => year.id === result.id ? result : year));
      setEditModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error updating fiscal year:', err);
      setError('Failed to update fiscal year');
    }
  };

  // FIXED: Change parameter type from string to '0' | '1'
  const handleYearStatusChange = async (yearId: UUID, newStatus: '0' | '1') => {
    try {
      const year = years.find(y => y.id === yearId);
      if (!year) return;

      const editData: EditFiscYearDto = {
        id: yearId,
        name: year.name,
        dateStart: year.dateStart,
        dateEnd: year.dateEnd,
        isActive: newStatus, // This is now the correct type
        rowVersion: year.rowVersion || '1'
      };
      
      const result = await fiscalYearService.updateFiscalYear(editData);
      setYears(years.map(y => y.id === result.id ? result : y));
      setError(null);
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
      setError(null);
    } catch (err) {
      console.error('Error deleting fiscal year:', err);
      setError('Failed to delete fiscal year');
    }
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
    const newStatus: '0' | '1' = year.isActive === '0' ? '1' : '0';
    handleYearStatusChange(year.id, newStatus);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full -mt-4 py-4 mx-auto">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            <span className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent'>
              Fiscal Year 
            </span>{" "}
            History
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
                    Failed to load fiscal years.{" "}
                    <button
                      onClick={loadFiscalYears}
                      className="underline hover:text-red-800 font-semibold focus:outline-none"
                    >
                      Try again
                    </button>{" "}
                    later.
                  </>
                ) : error.includes("update") ? (
                  "Failed to update fiscal year. Please try again."
                ) : error.includes("delete") ? (
                  "Failed to delete fiscal year. Please try again."
                ) : error.includes("status") ? (
                  "Failed to update status. Please try again."
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
          <div className="space-y-6">
            {/* Search Component */}
            <FiscYearSearch 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
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
          </div>
        )}

        {/* View Modal */}
        <ViewFiscModal
          fiscalYear={selectedYear}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />

        {/* Edit Modal */}
        <EditFiscModal
          fiscalYear={selectedYear}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleYearUpdate}
        />

        {/* Delete Modal */}
        <DeleteFiscModal
          fiscalYear={selectedYear}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleYearDelete}
        />
      </div>
    </div>
  );
}