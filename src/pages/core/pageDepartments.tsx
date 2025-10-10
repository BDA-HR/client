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

  // Enhanced filter function to include status search
  const filteredDepartments = departments.filter((department) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Basic text search
    const basicMatch = 
      department.name.toLowerCase().includes(searchLower) ||
      department.nameAm.toLowerCase().includes(searchLower) ||
      department.branch.toLowerCase().includes(searchLower);
    
    const statusMatch = 
      (searchLower.includes('active') && department.deptStat === "0") ||
      (searchLower.includes('inactive') && department.deptStat === "1") ||
      (searchLower.includes('0') && department.deptStat === "0") ||
      (searchLower.includes('1') && department.deptStat === "1") ||
      department.deptStatStr.toLowerCase().includes(searchLower);
    
    return basicMatch || statusMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full h-full flex flex-col space-y-6 ${
          isEditModalOpen ? "blur-sm" : ""
        }`}
      >
        {/* Header with border and padding */}
        <div className="flex justify-between items-center">
          <DepartmentManagementHeader />
        </div>

        {/* Main content area with consistent padding */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
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

          {!loading && (
            <div className="space-y-6">
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

              {/* Search Filters */}
              <DepartmentSearchFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddDepartment={handleAddDepartment}
                selectedBranchId=""
              />

              {/* Department Table */}
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
            </div>
          )}
        </div>
      </motion.section>

      {/* Edit Department Modal */}
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