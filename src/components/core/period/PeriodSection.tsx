import { useState, useEffect } from "react";
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
import { periodService } from "../../../services/core/periodservice";
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodListDto | null>(
    null
  );
  const [periods, setPeriods] = useState<PeriodListDto[]>([]);
  const [filteredPeriods, setFilteredPeriods] = useState<PeriodListDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: "",
    dateStart: new Date().toISOString().split("T")[0],
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    quarter: "" as Quarter,
    fiscalYearId: "" as UUID,
  });

  // Fetch periods on component mount
  useEffect(() => {
    fetchPeriods();
  }, []);

  // Filter periods based on search term - only showing active periods by default
  useEffect(() => {
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

    setFilteredPeriods(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / 10));
    setCurrentPage(1);
  }, [searchTerm, periods]);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      setError(null);

      const periodsData = await periodService.getAllPeriods();
      setPeriods(periodsData);
    } catch (err) {
      console.error("Error fetching periods:", err);
      setError("Failed to load periods. Please try again later.");
      setPeriods([]); // Ensure periods is empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async () => {
    try {
      toast.loading("Adding period...");
      setError(null);

      const createdPeriod = await periodService.createPeriod(newPeriod);
      setPeriods((prev) => [createdPeriod, ...prev]);
      setNewPeriod({
        name: "",
        dateStart: new Date().toISOString().split("T")[0],
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        quarter: "" as Quarter,
        fiscalYearId: "" as UUID,
      });
      setIsModalOpen(false);
      toast.dismiss();
      toast.success("Period added successfully!");
    } catch (err) {
      console.error("Error adding period:", err);
      toast.dismiss();
      setError("Failed to add period");
      toast.error("Failed to add period");
      throw err;
    }
  };

  const handleEditPeriod = async (periodData: EditPeriodDto) => {
    try {
      toast.loading("Updating period...");
      setError(null);

      const updatedPeriod = await periodService.updatePeriod(periodData);
      setPeriods((prev) =>
        prev.map((p) => (p.id === updatedPeriod.id ? updatedPeriod : p))
      );
      setIsEditModalOpen(false);
      toast.dismiss();
      toast.success("Period updated successfully!");
    } catch (err) {
      console.error("Error updating period:", err);
      toast.dismiss();
      setError("Failed to update period");
      toast.error("Failed to update period");
      throw err;
    }
  };

  const handleDeletePeriod = async (periodId: UUID) => {
    try {
      toast.loading("Deleting period...");
      setError(null);

      await periodService.deletePeriod(periodId);
      setPeriods((prev) => prev.filter((p) => p.id !== periodId));
      setIsDeleteModalOpen(false);
      toast.dismiss();
      toast.success("Period deleted successfully!");
    } catch (err) {
      console.error("Error deleting period:", err);
      toast.dismiss();
      setError("Failed to delete period");
      toast.error("Failed to delete period");
    }
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
  };

  // Get current items for display
  const currentItems = filteredPeriods.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

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
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {error.includes("load") ? (
                <>
                  Failed to load periods.{" "}
                  <button
                    onClick={fetchPeriods}
                    className="underline hover:text-red-800 font-semibold focus:outline-none"
                  >
                    Try again
                  </button>{" "}
                  later.
                </>
              ) : error.includes("add") ? (
                "Failed to add period. Please try again."
              ) : error.includes("update") ? (
                "Failed to update period. Please try again."
              ) : error.includes("delete") ? (
                "Failed to delete period. Please try again."
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

      {/* Search Filters */}
      <PeriodSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClearFilters={handleClearFilters}
        onAddPeriod={handleAddPeriodClick}
        onViewHistory={handleViewHistory}
        totalItems={periods.length}
        filteredItems={filteredPeriods.length}
        isHistoryView={false}
      />

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Active Periods Table */}
      {!loading && (
        <PeriodTable
          periods={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
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
        onConfirm={handleDeletePeriod}
      />
    </div>
  );
}

export default PeriodSection;
