import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApiPermissionHeader from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsHeader";
import ApiPermissionSearchFilters from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsSerachFilters";
import ApiPermissionTable from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsTable";
import EditApiPermissionModal from "../../../components/settings/coreSettings/apiPermissions/EditApiPermissionsModal";
import DeleteApiPermissionModal from "../../../components/settings/coreSettings/apiPermissions/DeleteApiPermissionsModal";
import type {
  PerApiListDto,
  PerApiModDto,
  PerApiAddDto,
  UUID
} from '../../../types/core/Settings/api-permission';
import { apiPermissionService } from '../../../services/core/settings/api-permissionservice';

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

function PageApiSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPermission, setEditingPermission] = useState<PerApiListDto | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<PerApiListDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PerApiListDto[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<PerApiListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Load permissions on component mount
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the service to fetch data
      const data = await apiPermissionService.getAllApiPermissions();

      setPermissions(data);
      setFilteredPermissions(data);
    } catch (err: any) {
      console.error("Error loading API permissions:", err);
      setError(err.message || "Failed to load API permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPermission = async (newPermission: PerApiAddDto) => {
    try {
      setError(null);

      // Use the service to create new permission
      const createdPermission = await apiPermissionService.createApiPermission(newPermission);

      const updatedPermissions = [...permissions, createdPermission];
      const updatedFiltered = [...filteredPermissions, createdPermission];

      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      setCurrentPage(1);

      return { success: true, data: createdPermission };

    } catch (err: any) {
      console.error("Error creating API permission:", err);
      setError(err.message || "Failed to create API permission. Please try again.");
      throw err;
    }
  };

  const handleEditClick = (permission: PerApiListDto) => {
    setEditingPermission(permission);
    setIsEditModalOpen(true);
  };

  const handleUpdatePermission = async (updatedPermission: PerApiModDto) => {
    try {
      setError(null);

      // Use the service to update permission
      const updatedPerm = await apiPermissionService.updateApiPermission(updatedPermission);

      const updatedPermissions = permissions.map((perm) =>
        perm.id === updatedPerm.id ? updatedPerm : perm
      );

      const updatedFiltered = filteredPermissions.map((perm) =>
        perm.id === updatedPerm.id ? updatedPerm : perm
      );

      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      setIsEditModalOpen(false);
      setEditingPermission(null);

      return { success: true, data: updatedPerm };

    } catch (err: any) {
      console.error("Error updating API permission:", err);
      setError(err.message || "Failed to update API permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteClick = (permission: PerApiListDto) => {
    setDeletingPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePermission = async (permissionId: UUID) => {
    try {
      setError(null);

      // Use the service to delete permission
      await apiPermissionService.deleteApiPermission(permissionId);

      const updatedPermissions = permissions.filter((perm) => perm.id !== permissionId);
      const updatedFiltered = filteredPermissions.filter((perm) => perm.id !== permissionId);

      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);

      // If we're on a page that's now empty, go back one page
      if (paginatedPermissions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      return { success: true, message: 'API permission deleted successfully!' };

    } catch (err: any) {
      console.error("Error deleting API permission:", err);
      setError(err.message || "Failed to delete API permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteConfirm = async (permissionId: UUID) => {
    await handleDeletePermission(permissionId);
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
  };

  // Filter function
  const filterPermissions = (permissionsList: PerApiListDto[], term: string) => {
    if (!term.trim()) return permissionsList;

    const searchLower = term.toLowerCase();

    return permissionsList.filter(permission =>
      permission.key.toLowerCase().includes(searchLower) ||
      permission.name.toLowerCase().includes(searchLower) ||
      permission.perMenu.toLowerCase().includes(searchLower) ||
      (permission.perMenuKey && permission.perMenuKey.toLowerCase().includes(searchLower))
    );
  };

  // Handle search term change
  useEffect(() => {
    if (searchTerm) {
      const filtered = filterPermissions(permissions, searchTerm);
      setFilteredPermissions(filtered);
      setCurrentPage(1);
    } else {
      setFilteredPermissions(permissions);
    }
  }, [searchTerm, permissions]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full h-full flex flex-col space-y-6 ${isEditModalOpen || isDeleteModalOpen ? "blur-sm" : ""
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <ApiPermissionHeader apiPermissions={permissions} />
        </div>

        {/* Main content area */}
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
                <p className="text-gray-600">Loading ACCESS permissions...</p>
              </div>
            </motion.div>
          )}

          {!isLoading && (
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
                          Failed to load Access permissions.{" "}
                          <button
                            onClick={loadPermissions}
                            className="underline hover:text-red-800 font-semibold focus:outline-none"
                          >
                            Try again
                          </button>
                        </>
                      ) : error.includes("create") ? (
                        "Failed to create API permission. Please try again."
                      ) : error.includes("update") ? (
                        "Failed to update API permission. Please try again."
                      ) : error.includes("delete") ? (
                        "Failed to delete API permission. Please try again."
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
              <ApiPermissionSearchFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddPermission={handleAddPermission}
              />

              {/* API Permissions Table */}
              <ApiPermissionTable
                permissions={paginatedPermissions}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPermissions.length}
                onPageChange={setCurrentPage}
                onEditPermission={handleEditClick}
                onDeletePermission={handleDeleteClick}
              />
            </div>
          )}
        </div>
      </motion.section>

      {/* Edit API Permission Modal */}
      {isEditModalOpen && editingPermission && (
        <EditApiPermissionModal
          permission={editingPermission}
          onEditPermission={handleUpdatePermission}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPermission(null);
          }}
        />
      )}

      {/* Delete API Permission Modal */}
      {isDeleteModalOpen && deletingPermission && (
        <DeleteApiPermissionModal
          permission={deletingPermission}
          onConfirm={handleDeleteConfirm}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingPermission(null);
          }}
        />
      )}
    </>
  );
}

export default PageApiSettings;