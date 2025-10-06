import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiscalYearTable } from '../../components/core/fiscalyear/FiscYearTable';
import { FiscYearSearch } from '../../components/core/fiscalyear/FiscYearSearch';
import { ViewFiscModal } from '../../components/core/fiscalyear/ViewFiscModal';
import { EditFiscModal } from '../../components/core/fiscalyear/EditFiscModal';
import { DeleteFiscModal } from '../../components/core/fiscalyear/DeleteFiscModal';
import { fiscalYearService } from '../../services/core/fiscservice';
import type { FiscYearListDto, EditFiscYearDto, UUID } from '../../types/core/fisc';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FiscalYearHistoryProps {
  onBack?: () => void;
}

export default function FiscalYearHistory({ onBack }: FiscalYearHistoryProps) {
  const navigate = useNavigate();
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

  const handleBackToOverview = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          onClick={handleBackToOverview}
          variant="outline"
          className="cursor-pointer flex items-center gap-2 mb-3"
        >
          <ArrowLeft size={16} />
          Back to Overview
        </Button>
        
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

        {/* Content */}
        {!loading && !error && (
          <>
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
          </>
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