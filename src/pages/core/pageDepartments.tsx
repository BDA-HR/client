import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DepartmentManagementHeader from "../../components/core/department/DeptHeader";
import DepartmentSearchFilters from "../../components/core/department/DeptSearchFilters";
import DepartmentTable from "../../components/core/department/DeptTable";
import EditDeptModal from "../../components/core/department/EditDeptModal";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useDepartmentStatus,
} from "../../services/core/department/dept.queries";
import type {
  AddDeptDto,
  EditDeptDto,
  DeptListDto,
  UUID,
} from "../../types/core/dept";

const DepartmentOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDepartment, setEditingDepartment] = useState<DeptListDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const itemsPerPage = 8;

  // React Query hooks
  const {
    data: departments = [],
    isLoading,
    error: queryError,
    refetch,
  } = useDepartments();

  const createDepartmentMutation = useCreateDepartment({
    onSuccess: () => {
      setFormError(null);
      setCurrentPage(1);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to create department. Please try again.');
    },
  });

  const updateDepartmentMutation = useUpdateDepartment({
    onSuccess: () => {
      setFormError(null);
      setIsEditModalOpen(false);
      setEditingDepartment(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update department. Please try again.');
    },
  });

  const deleteDepartmentMutation = useDeleteDepartment({
    onSuccess: () => {
      setFormError(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to delete department. Please try again.');
    },
  });

  const { getStatusText } = useDepartmentStatus();

  const handleAddDepartment = async (newDepartment: AddDeptDto) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await createDepartmentMutation.mutateAsync(newDepartment);
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
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await updateDepartmentMutation.mutateAsync(updatedDepartment);
  };

  const handleDepartmentStatusChange = async (
    departmentId: UUID,
    newStatus: "active" | "inactive"
  ) => {
    setFormError(null);
    const department = departments.find((dept) => dept.id === departmentId);
    if (department) {
      // Create properly typed update object
      const updateData: EditDeptDto = {
        id: department.id,
        name: department.name,
        nameAm: department.nameAm,
        deptStat: newStatus === "active" ? "0" : "1",
        branchId: department.branchId,
        rowVersion: department.rowVersion,
      };
      
      // No try/catch needed - error is handled by mutation's onError
      await updateDepartmentMutation.mutateAsync(updateData);
    }
  };

  const handleDepartmentDelete = async (departmentId: UUID) => {
    setFormError(null);
    // No try/catch needed - error is handled by mutation's onError
    await deleteDepartmentMutation.mutateAsync(departmentId);
  };

  // Enhanced filter function to include status search
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) {
      return departments;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    return departments.filter((department) => {
      // Basic text search
      const basicMatch = 
        department.name.toLowerCase().includes(searchLower) ||
        department.nameAm.toLowerCase().includes(searchLower) ||
        (department.branch && department.branch.toLowerCase().includes(searchLower));
      
      // Status search
      const statusText = getStatusText(department.deptStat).toLowerCase();
      const statusMatch = statusText.includes(searchLower);
      
      // Numeric status search
      const numericStatusMatch = 
        (searchLower.includes('0') && department.deptStat === "0") ||
        (searchLower.includes('1') && department.deptStat === "1");
      
      // deptStatStr search (if available)
      const statStrMatch = department.deptStatStr 
        ? department.deptStatStr.toLowerCase().includes(searchLower)
        : false;
      
      return basicMatch || statusMatch || numericStatusMatch || statStrMatch;
    });
  }, [departments, searchTerm, getStatusText]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDepartments.slice(startIndex, endIndex);
  }, [filteredDepartments, currentPage, itemsPerPage]);

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
          {isLoading && (
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

          {!isLoading && (
            <div className="space-y-6">
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
                          Failed to load departments.{" "}
                          <button
                            onClick={() => refetch()}
                            className="underline hover:text-red-800 font-semibold focus:outline-none"
                            disabled={isLoading}
                          >
                            Try again
                          </button>
                        </>
                      ) : displayError.includes("create") ? (
                        "Failed to create department. Please try again."
                      ) : displayError.includes("update") ? (
                        "Failed to update department. Please try again."
                      ) : displayError.includes("delete") ? (
                        "Failed to delete department. Please try again."
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