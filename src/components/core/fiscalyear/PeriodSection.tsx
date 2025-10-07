import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgePlus } from "lucide-react";
import { Button } from "../../ui/button";
import { AddPeriodModal } from "./AddPeriodModal";
import { PeriodTable } from "./PeriodTable";
import { ViewPeriodModal } from "./ViewPeriodModal";
import EditPeriodModal from "./EditPeriodModal";
import { DeletePeriodModal } from "./DeletePeriodModal";
import type {
  AddPeriodDto,
  PeriodListDto,
  EditPeriodDto,
  UUID,
} from "../../../types/core/period";
import { periodService } from "../../../services/core/periodservice";
import toast from "react-hot-toast";

function PeriodSection() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPeriod, setNewPeriod] = useState<AddPeriodDto>({
    name: "",
    dateStart: new Date().toISOString().split("T")[0],
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isActive: "true",
    quarterId: "" as UUID,
    fiscalYearId: "" as UUID,
  });

  // Fetch periods on component mount
  useEffect(() => {
    fetchPeriods();
  }, [currentPage]);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      setError(null);
      const periodsData = await periodService.getAllPeriods();
      setPeriods(periodsData);
      setTotalItems(periodsData.length);
      setTotalPages(Math.ceil(periodsData.length / 10));
    } catch (err) {
      console.error("Error fetching periods:", err);
      setError("Failed to load periods. Please try again later.");
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
        isActive: "true",
        quarterId: "" as UUID,
        fiscalYearId: "" as UUID,
      });
      setIsModalOpen(false);
      toast.dismiss();
      toast.success("Period added successfully!");
    } catch (err) {
      console.error("Error adding period:", err);
      toast.dismiss();
      toast.error("Failed to add period");
      setError("Failed to add period. Please try again.");
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
      toast.error("Failed to update period");
      setError("Failed to update period. Please try again.");
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
      toast.error("Failed to delete period");
      setError("Failed to delete period. Please try again.");
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
          >
            Active Periods
          </motion.h2>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer"
        >
          <BadgePlus size={20} />
          Add New Period
        </Button>
      </div>

      {/* Error message for API errors */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
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

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Periods Table */}
      {!loading && (
        <PeriodTable
          periods={periods.slice((currentPage - 1) * 10, currentPage * 10)}
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
