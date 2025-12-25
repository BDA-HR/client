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

// Mock data for demonstration
const mockApiPermissions: PerApiListDto[] = [
  {
    id: '8888888' as UUID,
    perMenuId: 'menu-hr' as UUID,
    key: 'api.hr.employee.create',
    name: 'Create Employee',
    perMenu: 'HR Management'
  },
  {
    id: 'api-perm-002' as UUID,
    perMenuId: 'menu-hr' as UUID,
    key: 'api.hr.employee.read',
    name: 'Read Employee',
    perMenu: 'HR Management'
  },
  {
    id: 'api-perm-003' as UUID,
    perMenuId: 'menu-hr' as UUID,
    key: 'api.hr.employee.update',
    name: 'Update Employee',
    perMenu: 'HR Management'
  },
  {
    id: 'api-perm-004' as UUID,
    perMenuId: 'menu-hr' as UUID,
    key: 'api.hr.employee.delete',
    name: 'Delete Employee',
    perMenu: 'HR Management'
  },
  {
    id: 'api-perm-005' as UUID,
    perMenuId: 'menu-finance' as UUID,
    key: 'api.finance.invoice.create',
    name: 'Create Invoice',
    perMenu: 'Finance'
  },
  {
    id: 'api-perm-006' as UUID,
    perMenuId: 'menu-finance' as UUID,
    key: 'api.finance.invoice.read',
    name: 'Read Invoice',
    perMenu: 'Finance'
  },
  {
    id: 'api-perm-007' as UUID,
    perMenuId: 'menu-crm' as UUID,
    key: 'api.crm.lead.create',
    name: 'Create Lead',
    perMenu: 'CRM'
  },
  {
    id: 'api-perm-008' as UUID,
    perMenuId: 'menu-crm' as UUID,
    key: 'api.crm.lead.update',
    name: 'Update Lead',
    perMenu: 'CRM'
  },
  {
    id: 'api-perm-009' as UUID,
    perMenuId: 'menu-inventory' as UUID,
    key: 'api.inventory.product.create',
    name: 'Create Product',
    perMenu: 'Inventory'
  },
  {
    id: 'api-perm-010' as UUID,
    perMenuId: 'menu-inventory' as UUID,
    key: 'api.inventory.product.read',
    name: 'Read Product',
    perMenu: 'Inventory'
  },
  {
    id: 'api-perm-011' as UUID,
    perMenuId: 'menu-procurement' as UUID,
    key: 'api.procurement.order.create',
    name: 'Create Order',
    perMenu: 'Procurement'
  },
  {
    id: 'api-perm-012' as UUID,
    perMenuId: 'menu-procurement' as UUID,
    key: 'api.procurement.order.approve',
    name: 'Approve Order',
    perMenu: 'Procurement'
  },
  {
    id: 'api-perm-013' as UUID,
    perMenuId: 'menu-settings' as UUID,
    key: 'api.settings.user.create',
    name: 'Create User',
    perMenu: 'Settings'
  },
  {
    id: 'api-perm-014' as UUID,
    perMenuId: 'menu-settings' as UUID,
    key: 'api.settings.user.update',
    name: 'Update User',
    perMenu: 'Settings'
  },
  {
    id: 'api-perm-015' as UUID,
    perMenuId: 'menu-settings' as UUID,
    key: 'api.settings.user.delete',
    name: 'Delete User',
    perMenu: 'Settings'
  }
];

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
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, using mock data
      const data = mockApiPermissions;
      
      setPermissions(data);
      setFilteredPermissions(data);
    } catch (err) {
      console.error("Error loading API permissions:", err);
      setError("Failed to load API permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPermission = async (newPermission: PerApiAddDto) => {
    try {
      setError(null);
      
      // Generate a new UUID for the permission
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const newId = generateUUID() as UUID;
      
      // Create new permission object
      const permissionToAdd: PerApiListDto = {
        id: newId,
        perMenuId: newPermission.perMenuId,
        key: newPermission.key,
        name: newPermission.desc,
        perMenu: 'New Menu'
      };
      
      const updatedPermissions = [...permissions, permissionToAdd];
      const updatedFiltered = [...filteredPermissions, permissionToAdd];
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      setCurrentPage(1);
      
      console.log('API permission added successfully!');
      return { success: true, data: permissionToAdd };
      
    } catch (err) {
      console.error("Error creating API permission:", err);
      setError("Failed to create API permission. Please try again.");
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
      
      const updatedPerm: PerApiListDto = {
        id: updatedPermission.id,
        perMenuId: updatedPermission.perMenuId,
        key: updatedPermission.key,
        name: updatedPermission.desc,
        perMenu: permissions.find(p => p.id === updatedPermission.id)?.perMenu || 'Updated Menu'
      };
      
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
      
      console.log('API permission updated successfully!');
      return { success: true, data: updatedPerm };
      
    } catch (err) {
      console.error("Error updating API permission:", err);
      setError("Failed to update API permission. Please try again.");
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
      
      const updatedPermissions = permissions.filter((perm) => perm.id !== permissionId);
      const updatedFiltered = filteredPermissions.filter((perm) => perm.id !== permissionId);
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      
      console.log('API permission deleted successfully!');
      return { success: true, message: 'API permission deleted successfully!' };
      
    } catch (err) {
      console.error("Error deleting API permission:", err);
      setError("Failed to delete API permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteConfirm = async (permissionId: UUID) => {
    await handleDeletePermission(permissionId);
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
  };

  // Enhanced filter function
  const filterPermissions = (permissions: PerApiListDto[], term: string) => {
    if (!term.trim()) return permissions;
    
    const searchLower = term.toLowerCase();
    
    return permissions.filter(permission => 
      permission.key.toLowerCase().includes(searchLower) ||
      permission.name.toLowerCase().includes(searchLower) ||
      permission.perMenu.toLowerCase().includes(searchLower)
    );
  };

  // Handle search term change
  useEffect(() => {
    if (searchTerm) {
      const filtered = filterPermissions(mockApiPermissions, searchTerm);
      setFilteredPermissions(filtered);
      setCurrentPage(1);
    } else {
      setFilteredPermissions(mockApiPermissions);
    }
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPermissions(filteredPermissions.slice(startIndex, endIndex));
  }, [filteredPermissions, currentPage]);

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
          <ApiPermissionHeader apiPermissions={permissions} />
        </div>

        {/* Main content area */}
        <div className="flex-1">
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
                <p className="text-gray-600">Loading API permissions...</p>
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
                          Failed to load API permissions.{" "}
                          <button
                            onClick={loadPermissions}
                            className="underline hover:text-red-800 font-semibold focus:outline-none"
                          >
                            Try again
                          </button>{" "}
                          later.
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
                permissions={permissions}
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