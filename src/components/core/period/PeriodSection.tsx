import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PeriodSearchFilters from "./PeriodSearchFilters";
import { PeriodTable } from "./PeriodTable";
import { ViewPeriodModal } from "./ViewPeriodModal";
import EditPeriodModal from "./EditPeriodModal";
import { DeletePeriodModal } from "./DeletePeriodModal";
import { AddPeriodModal } from "./AddPeriodModal";
import type {
  AddPeriodDto,
  PeriodListDto,
  EditPeriodDto,
  UUID,
} from "../../../types/core/period";
import { 
  usePeriods, 
  useCreatePeriod, 
  useUpdatePeriod, 
  useDeletePeriod,
  usePeriodValidation
} from "../../../services/core/period/period.queries";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import type { Quarter } from "../../../types/core/enum";

function PeriodSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: "",
    dateStart: new Date().toISOString().split("T")[0],
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    quarter: "" as Quarter,
    fiscalYearId: "" as UUID,
  });

  const itemsPerPage = 10;

  // React Query hooks
  const {
    data: periods = [],
    isLoading,
    error: queryError,
    refetch,
  } = usePeriods();

  const createPeriodMutation = useCreatePeriod({
    onSuccess: () => {
      setFormError(null);
      setIsModalOpen(false);
      setNewPeriod({
        name: "",
        dateStart: new Date().toISOString().split("T")[0],
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        quarter: "" as Quarter,
        fiscalYearId: "" as UUID,
      });
      toast.success("Period added successfully!");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to add period");
      toast.error("Failed to add period");
    },
  });

  const updatePeriodMutation = useUpdatePeriod({
    onSuccess: () => {
      setFormError(null);
      setIsEditModalOpen(false);
      setSelectedPeriod(null);
      toast.success("Period updated successfully!");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to update period");
      toast.error("Failed to update period");
    },
  });

  const deletePeriodMutation = useDeletePeriod({
    onSuccess: () => {
      setFormError(null);
      setIsDeleteModalOpen(false);
      setSelectedPeriod(null);
      toast.success("Period deleted successfully!");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to delete period");
      toast.error("Failed to delete period");
    },
  });

  const { validateDates } = usePeriodValidation();

  // Filter periods based on search term - only showing active periods by default
  const filteredPeriods = useMemo(() => {
    let filtered = [...periods];

    // Filter to show only active periods in the main view
    filtered = filtered.filter((period) => period.isActive === "0");

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (period) =>
          period.name?.toLowerCase().includes(term) ||
          period.quarter?.toLowerCase().includes(term) ||
          period.fiscYear?.toLowerCase().includes(term) ||
          period.isActiveStr?.toLowerCase().includes(term) ||
          (term === "active" && period.isActive === "0") ||
          (term === "inactive" && period.isActive === "1")
      );
    }

    return filtered;
  }, [periods, searchTerm]);

  // Pagination calculations
  const totalItems = filteredPeriods.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPeriods.slice(startIndex, endIndex);
  }, [filteredPeriods, currentPage, itemsPerPage]);

  const handleAddPeriod = async () => {
    setFormError(null);
    
    // Validate dates
    const dateError = validateDates(newPeriod.dateStart, newPeriod.dateEnd);
    if (dateError) {
      setFormError(dateError);
      toast.error(dateError);
      return;
    }

    // No try/catch needed - error is handled by mutation's onError
    await createPeriodMutation.mutateAsync(newPeriod);
  };

  const handleEditPeriod = async (periodData: EditPeriodDto) => {
    setFormError(null);
    
    // Validate dates
    const dateError = validateDates(periodData.dateStart, periodData.dateEnd);
    if (dateError) {
      setFormError(dateError);
      toast.error(dateError);
      return;
    }

    // No try/catch needed - error is handled by mutation's onError
    await updatePeriodMutation.mutateAsync(periodData);
  };

  const handleDeletePeriod = async (periodId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deletePeriodMutation.mutateAsync(periodId);
  };

  const handleViewDetails = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setIsViewModalOpen(true);
  };

  const handleEdit = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setIsEditModalOpen(true);
  };

  const handleDelete = (period: PeriodListDto) => {
    setSelectedPeriod(period);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddPeriodClick = () => {
    setIsModalOpen(true);
  };

  const handleViewHistory = () => {
    navigate("/core/fiscal-year/period-history");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    if (selectedPeriod) {
      await handleDeletePeriod(selectedPeriod.id);
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
    <div className="w-full -mt-6 -mx-1 py-4 space-y-6">
      {/* Header - Active Period */}
      <div className="p-2">
        <div className="w-full mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col space-y-2"
          >
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent mr-2">
                Active
              </span>
              Periods
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Error Message */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {displayError.includes("load") ? (
                <>
                  Failed to load periods.{" "}
                  <button
                    onClick={() => refetch()}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                    disabled={isLoading}
                  >
                    Try again
                  </button>
                </>
              ) : displayError.includes("add") ? (
                "Failed to add period. Please try again."
              ) : displayError.includes("update") ? (
                "Failed to update period. Please try again."
              ) : displayError.includes("delete") ? (
                "Failed to delete period. Please try again."
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

      {/* Search Filters */}
      <PeriodSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        onClearFilters={handleClearFilters}
        onAddPeriod={handleAddPeriodClick}
        onViewHistory={handleViewHistory}
        totalItems={periods.length}
        filteredItems={filteredPeriods.length}
        isHistoryView={false}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Active Periods Table */}
      {!isLoading && (
        <PeriodTable
          periods={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      )}

      {/* Add Period Modal */}
      <AddPeriodModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        newPeriod={newPeriod}
        setNewPeriod={setNewPeriod}
        onAddPeriod={handleAddPeriod}
      />

      {/* View Period Modal */}
      <ViewPeriodModal
        period={selectedPeriod}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Edit Period Modal */}
      {selectedPeriod && (
        <EditPeriodModal
          period={selectedPeriod}
          onEditPeriod={handleEditPeriod}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Period Modal */}
      <DeletePeriodModal
        period={selectedPeriod}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmation}
      />
    </div>
  );
}

export default PeriodSection;