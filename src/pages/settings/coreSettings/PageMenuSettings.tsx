import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MenuPermissionHeader from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsHeader";
import MenuPermissionSearchFilters from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsSearchFilters";
import MenuPermissionTable from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsTable";
import EditMenuPermissionModal from "../../../components/settings/coreSettings/menuPermissions/EditMenuPermissionModal";
import DeleteMenuPermissionModal from "../../../components/settings/coreSettings/menuPermissions/DeleteMenuPermissionModal";
import { menuPermissionService } from "../../../services/core/settings/ModCore/menu-permissionservice";
import type { 
  PerMenuListDto, 
  PerMenuModDto,
  PerMenuAddDto,
  ModPerMenuListDto,
  UUID
} from '../../../types/core/Settings/menu-permissions';

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

function PageMenuSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPermission, setEditingPermission] = useState<PerMenuListDto | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<PerMenuListDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PerMenuListDto[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<PerMenuListDto[]>([]);
  const [modules, setModules] = useState<ModPerMenuListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all permissions and modules in parallel
      const [permissionsData, modulesData] = await Promise.all([
        menuPermissionService.getAllMenuPermissions(),
        menuPermissionService.getMenuPermissionsByModule()
      ]);
      
      setPermissions(permissionsData);
      setFilteredPermissions(permissionsData);
      setModules(modulesData);
      
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPermission = async (newPermission: PerMenuAddDto) => {
    try {
      setError(null);
      
      const createdPermission = await menuPermissionService.createMenuPermission(newPermission);
      
      const updatedPermissions = [...permissions, createdPermission];
      const updatedFiltered = [...filteredPermissions, createdPermission];
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      setCurrentPage(1);
      
      console.log('Menu permission added successfully!');
      
      // Reload modules to ensure data consistency
      await reloadModules();
      
      return { success: true, data: createdPermission };
      
    } catch (err: any) {
      console.error("Error creating menu permission:", err);
      setError(err.message || "Failed to create menu permission. Please try again.");
      throw err;
    }
  };

  const handleEditClick = (permission: PerMenuListDto) => {
    setEditingPermission(permission);
    setIsEditModalOpen(true);
  };

  const handleUpdatePermission = async (updatedPermission: PerMenuModDto) => {
    try {
      setError(null);
      
      const updatedPerm = await menuPermissionService.updateMenuPermission(updatedPermission);
      
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
      
      console.log('Menu permission updated successfully!');
      
      // Reload modules to ensure data consistency
      await reloadModules();
      
      return { success: true, data: updatedPerm };
      
    } catch (err: any) {
      console.error("Error updating menu permission:", err);
      setError(err.message || "Failed to update menu permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteClick = (permission: PerMenuListDto) => {
    setDeletingPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePermission = async (permissionId: UUID) => {
    try {
      setError(null);
      
      // Delete permission via API
      await menuPermissionService.deleteMenuPermission(permissionId);
      
      // Update local state
      const updatedPermissions = permissions.filter((perm) => perm.id !== permissionId);
      const updatedFiltered = filteredPermissions.filter((perm) => perm.id !== permissionId);
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      
      console.log('Menu permission deleted successfully!');
      
      // Reload modules to ensure data consistency
      await reloadModules();
      
      return { success: true, message: 'Menu permission deleted successfully!' };
      
    } catch (err: any) {
      console.error("Error deleting menu permission:", err);
      setError(err.message || "Failed to delete menu permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteConfirm = async (permissionId: UUID) => {
    await handleDeletePermission(permissionId);
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
  };

  const reloadModules = async () => {
    try {
      const modulesData = await menuPermissionService.getMenuPermissionsByModule();
      setModules(modulesData);
    } catch (err) {
      console.error("Error reloading modules:", err);
    }
  };

  const filterPermissions = (permissions: PerMenuListDto[], term: string) => {
    if (!term.trim()) return permissions;
    
    const searchLower = term.toLowerCase();
    
    return permissions.filter(permission => 
      permission.key.toLowerCase().includes(searchLower) ||
      permission.name.toLowerCase().includes(searchLower) ||
      permission.module.toLowerCase().includes(searchLower)
    );
  };

  // Handle search filtering
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPermissions]);

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full h-full flex flex-col space-y-6 ${
          isEditModalOpen || isDeleteModalOpen ? "blur-sm" : ""
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <MenuPermissionHeader menuPermissions={permissions} />
        </div>

        {/* Main content area */}
        <div className="flex-1">
      
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center py-12"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading menu permissions...</p>
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
                      {error.includes("Failed to load") ? (
                        <>
                          Failed to load menu permissions.{" "}
                          <button
                            onClick={loadData}
                            className="underline hover:text-red-800 font-semibold focus:outline-none"
                          >
                            Try again
                          </button>
                        </>
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
              <MenuPermissionSearchFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                modules={modules}
                onAddPermission={handleAddPermission}
              />

              {/* Menu Permissions Table */}
              <MenuPermissionTable
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

      {/* Edit Menu Permission Modal */}
      {isEditModalOpen && editingPermission && (
        <EditMenuPermissionModal
          permission={editingPermission}
          modules={modules}
          onEditPermission={handleUpdatePermission}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPermission(null);
          }}
        />
      )}

      {/* Delete Menu Permission Modal */}
      {isDeleteModalOpen && deletingPermission && (
        <DeleteMenuPermissionModal
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

export default PageMenuSettings;