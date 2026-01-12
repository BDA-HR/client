import { useState, useMemo } from 'react';
import { FiscalYearTable } from '../../components/core/fiscalyear/FiscYearTable';
import { FiscYearSearch } from '../../components/core/fiscalyear/FiscYearSearch';
import { ViewFiscModal } from '../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../components/core/fiscalyear/DeleteFiscModal';
import { 
  useFiscalYears, 
  useUpdateFiscalYear, 
  useDeleteFiscalYear 
} from '../../services/core/fiscalyear/fisc.queries';
import type { FiscYearListDto, EditFiscYearDto, UUID } from '../../types/core/fisc';
import { motion } from 'framer-motion';


export default function FiscalYearHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to delete fiscal year');
    },
  });

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
      (year.dateStartStrAm && year.dateStartStrAm.toLowerCase().includes(term)) ||
      (year.dateEndStrAm && year.dateEndStrAm.toLowerCase().includes(term))
    );
  }, [years, searchTerm]);

  const totalItems = filteredYears.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedYears = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredYears.slice(startIndex, endIndex);
  }, [filteredYears, currentPage, itemsPerPage]);

  const handleYearUpdate = async (updatedYear: EditFiscYearDto) => {
    setFormError(null);
    
    // Validate dates
    const startDate = new Date(updatedYear.dateStart);
    const endDate = new Date(updatedYear.dateEnd);
    
    if (endDate <= startDate) {
      setFormError('End date must be after start date');
      return;
    }

    // No try/catch needed - error is handled by mutation's onError
    await updateFiscalYearMutation.mutateAsync(updatedYear);
  };

  const handleYearStatusChange = async (yearId: UUID, newStatus: '0' | '1') => {
    setFormError(null);
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
    
    // No try/catch needed - error is handled by mutation's onError
    await updateFiscalYearMutation.mutateAsync(editData);
  };

  const handleYearDelete = async (yearId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deleteFiscalYearMutation.mutateAsync(yearId);
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    if (selectedYear) {
      await handleYearDelete(selectedYear.id);
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
                ) : displayError.includes("update") ? (
                  "Failed to update fiscal year. Please try again."
                ) : displayError.includes("delete") ? (
                  "Failed to delete fiscal year. Please try again."
                ) : displayError.includes("status") ? (
                  "Failed to update status. Please try again."
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
        {!isLoading && !displayError && (
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
          onConfirm={handleDeleteConfirmation}
        />
      </div>
    </div>
  );
}