import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DepartmentManagementHeader from "../../components/core/department/DeptHeader";
import DepartmentSearchFilters from "../../components/core/department/DeptSearchFilters";
import DepartmentTable from "../../components/core/department/DeptTable";
import EditDeptModal from "../../components/core/department/EditDeptModal";
import type {
  AddDeptDto,
  EditDeptDto,
  DeptListDto,
  UUID,
} from "../../types/core/dept";
import { departmentService } from "../../services/core/deptservice";

const DepartmentOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDepartment, setEditingDepartment] = useState<DeptListDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departments, setDepartments] = useState<DeptListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Error loading departments:", err);
      setError("Failed to load departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (newDepartment: AddDeptDto) => {
    try {
      setError(null);
      const createdDept = await departmentService.createDepartment(
        newDepartment
      );
      setDepartments((prev) => [...prev, createdDept]);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error creating department:", err);
      setError("Failed to create department. Please try again.");
      throw err;
    }
  };

  const handleEditClick = (department: EditDeptDto) => {
    const departmentToEdit = departments.find(
      (dept) => dept.id === department.id
    );
    if (departmentToEdit) {
      setEditingDepartment(departmentToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateDepartment = async (updatedDepartment: EditDeptDto) => {
    try {
      setError(null);
      const updatedDept = await departmentService.updateDepartment(
        updatedDepartment
      );
      setDepartments((prev) =>
        prev.map((dept) => (dept.id === updatedDept.id ? updatedDept : dept))
      );
      setIsEditModalOpen(false);
      setEditingDepartment(null);
    } catch (err) {
      console.error("Error updating department:", err);
      setError("Failed to update department. Please try again.");
      throw err;
    }
  };

  const handleDepartmentStatusChange = async (
    departmentId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      setError(null);
      const department = departments.find((dept) => dept.id === departmentId);
      if (department) {
        const updatedDept = await departmentService.updateDepartment({
          ...department,
          deptStat: newStatus === "active" ? "Active" : "Inactive",
          rowVersion: department.rowVersion,
        });
        setDepartments((prev) =>
          prev.map((dept) => (dept.id === updatedDept.id ? updatedDept : dept))
        );
      }
    } catch (err) {
      console.error("Error updating department status:", err);
      setError("Failed to update department status. Please try again.");
    }
  };

  const handleDepartmentDelete = async (departmentId: UUID) => {
    try {
      setError(null);
      await departmentService.deleteDepartment(departmentId);
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
    } catch (err) {
      console.error("Error deleting department:", err);
      setError("Failed to delete department. Please try again.");
      throw err;
    }
  };

  // Filter departments based on search term only
  const filteredDepartments = departments.filter((department) => {
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`p-4 md:p-6 bg-gray-50 min-h-screen transition-all duration-300 ${
          isEditModalOpen ? "blur-sm" : ""
        }`}
      >
        <div className="w-full mx-auto">
          <div className="flex flex-col space-y-6">
            <DepartmentManagementHeader />

            {/* Loading State - Under Header */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center py-12"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                </div>
              </motion.div>
            )}

            {/* Error State - Under Header when no data */}
            {error && !loading && (
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

            {!loading && (
              <>
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
                            Failed to load departments.{" "}
                            <button
                              onClick={loadDepartments}
                              className="underline hover:text-red-800 font-semibold focus:outline-none"
                            >
                              Try again
                            </button>{" "}
                            later.
                          </>
                        ) : error.includes("create") ? (
                          "Failed to create department. Please try again."
                        ) : error.includes("update") ? (
                          "Failed to update department. Please try again."
                        ) : error.includes("delete") ? (
                          "Failed to delete department. Please try again."
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

                <DepartmentSearchFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onAddDepartment={handleAddDepartment}
                  selectedBranchId=""
                />

                <DepartmentTable
                  departments={paginatedDepartments}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredDepartments.length}
                  onPageChange={setCurrentPage}
                  onEditDepartment={handleEditClick}
                  onDepartmentStatusChange={handleDepartmentStatusChange}
                  onDepartmentDelete={handleDepartmentDelete}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Department Modal - Keep this in DepartmentOverview only */}
      {isEditModalOpen && editingDepartment && (
        <EditDeptModal
          department={editingDepartment}
          onEditDepartment={handleUpdateDepartment}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingDepartment(null);
          }}
        />
      )}
    </>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

export default DepartmentOverview;