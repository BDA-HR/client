import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MenuPermissionHeader from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsHeader";
import MenuPermissionSearchFilters from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsSearchFilters";
import MenuPermissionTable from "../../../components/settings/coreSettings/menuPermissions/MenuPermissionsTable";
import EditMenuPermissionModal from "../../../components/settings/coreSettings/menuPermissions/EditMenuPermissionModal";
import DeleteMenuPermissionModal from "../../../components/settings/coreSettings/menuPermissions/DeleteMenuPermissionModal";
import type { 
  PerMenuListDto, 
  PerMenuModDto,
  PerMenuAddDto,
  ModPerMenuListDto,
  UUID
} from '../../../types/core/Settings/menu-permissions';

// Mock data for demonstration
const mockMenuPermissions: PerMenuListDto[] = [
  {
    id: 'menu-perm-001' as UUID,
    perModuleId: 'module-hr' as UUID,
    key: 'menu.hr.dashboard',
    name: 'HR Dashboard',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-002' as UUID,
    perModuleId: 'module-hr' as UUID,
    key: 'menu.hr.employees',
    name: 'Employees Management',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-003' as UUID,
    perModuleId: 'module-hr' as UUID,
    key: 'menu.hr.attendance',
    name: 'Attendance Tracking',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-004' as UUID,
    perModuleId: 'module-hr' as UUID,
    key: 'menu.hr.payroll',
    name: 'Payroll Management',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-005' as UUID,
    perModuleId: 'module-finance' as UUID,
    key: 'menu.finance.dashboard',
    name: 'Finance Dashboard',
    module: 'Finance'
  },
  {
    id: 'menu-perm-006' as UUID,
    perModuleId: 'module-finance' as UUID,
    key: 'menu.finance.invoices',
    name: 'Invoice Management',
    module: 'Finance'
  },
  {
    id: 'menu-perm-007' as UUID,
    perModuleId: 'module-finance' as UUID,
    key: 'menu.finance.reports',
    name: 'Financial Reports',
    module: 'Finance'
  },
  {
    id: 'menu-perm-008' as UUID,
    perModuleId: 'module-crm' as UUID,
    key: 'menu.crm.dashboard',
    name: 'CRM Dashboard',
    module: 'CRM'
  },
  {
    id: 'menu-perm-009' as UUID,
    perModuleId: 'module-crm' as UUID,
    key: 'menu.crm.leads',
    name: 'Leads Management',
    module: 'CRM'
  },
  {
    id: 'menu-perm-010' as UUID,
    perModuleId: 'module-crm' as UUID,
    key: 'menu.crm.customers',
    name: 'Customer Management',
    module: 'CRM'
  },
  {
    id: 'menu-perm-011' as UUID,
    perModuleId: 'module-inventory' as UUID,
    key: 'menu.inventory.dashboard',
    name: 'Inventory Dashboard',
    module: 'Inventory'
  },
  {
    id: 'menu-perm-012' as UUID,
    perModuleId: 'module-inventory' as UUID,
    key: 'menu.inventory.products',
    name: 'Product Management',
    module: 'Inventory'
  },
  {
    id: 'menu-perm-013' as UUID,
    perModuleId: 'module-procurement' as UUID,
    key: 'menu.procurement.dashboard',
    name: 'Procurement Dashboard',
    module: 'Procurement'
  },
  {
    id: 'menu-perm-014' as UUID,
    perModuleId: 'module-procurement' as UUID,
    key: 'menu.procurement.orders',
    name: 'Order Management',
    module: 'Procurement'
  },
  {
    id: 'menu-perm-015' as UUID,
    perModuleId: 'module-settings' as UUID,
    key: 'menu.settings.dashboard',
    name: 'Settings Dashboard',
    module: 'Settings'
  },
  {
    id: 'menu-perm-016' as UUID,
    perModuleId: 'module-settings' as UUID,
    key: 'menu.settings.users',
    name: 'User Management',
    module: 'Settings'
  },
  {
    id: 'menu-perm-017' as UUID,
    perModuleId: 'module-settings' as UUID,
    key: 'menu.settings.permissions',
    name: 'Permission Management',
    module: 'Settings'
  },
  {
    id: 'menu-perm-018' as UUID,
    perModuleId: 'module-hr' as UUID,
    key: 'menu.hr.recruitment',
    name: 'Recruitment',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-019' as UUID,
    perModuleId: 'module-finance' as UUID,
    key: 'menu.finance.budget',
    name: 'Budget Planning',
    module: 'Finance'
  },
  {
    id: 'menu-perm-020' as UUID,
    perModuleId: 'module-crm' as UUID,
    key: 'menu.crm.marketing',
    name: 'Marketing Automation',
    module: 'CRM'
  }
];

// Mock modules data for the dropdown
const mockModules: ModPerMenuListDto[] = [
  {
    perModuleId: 'module-hr',
    perModule: 'Human Resources',
    perMenuList: []
  },
  {
    perModuleId: 'module-finance',
    perModule: 'Finance',
    perMenuList: []
  },
  {
    perModuleId: 'module-crm',
    perModule: 'CRM',
    perMenuList: []
  },
  {
    perModuleId: 'module-inventory',
    perModule: 'Inventory',
    perMenuList: []
  },
  {
    perModuleId: 'module-procurement',
    perModule: 'Procurement',
    perMenuList: []
  },
  {
    perModuleId: 'module-settings',
    perModule: 'Settings',
    perMenuList: []
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

function PageMenuSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPermission, setEditingPermission] = useState<PerMenuListDto | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<PerMenuListDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<PerMenuListDto[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<PerMenuListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = mockMenuPermissions;
      
      setPermissions(data);
      setFilteredPermissions(data);
    } catch (err) {
      console.error("Error loading menu permissions:", err);
      setError("Failed to load menu permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPermission = async (newPermission: PerMenuAddDto) => {
    try {
      setError(null);
      
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const newId = generateUUID() as UUID;
      
      const permissionToAdd: PerMenuListDto = {
        id: newId,
        perModuleId: newPermission.perModuleId,
        key: newPermission.key,
        name: newPermission.desc,
        module: mockModules.find(m => m.perModuleId === newPermission.perModuleId)?.perModule || 'New Module'
      };
      
      const updatedPermissions = [...permissions, permissionToAdd];
      const updatedFiltered = [...filteredPermissions, permissionToAdd];
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      setCurrentPage(1);
      
      console.log('Menu permission added successfully!');
      return { success: true, data: permissionToAdd };
      
    } catch (err) {
      console.error("Error creating menu permission:", err);
      setError("Failed to create menu permission. Please try again.");
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
      
      const updatedPerm: PerMenuListDto = {
        id: updatedPermission.id,
        perModuleId: updatedPermission.perModuleId,
        key: updatedPermission.key,
        name: updatedPermission.desc,
        module: mockModules.find(m => m.perModuleId === updatedPermission.perModuleId)?.perModule || 'Updated Module'
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
      
      console.log('Menu permission updated successfully!');
      return { success: true, data: updatedPerm };
      
    } catch (err) {
      console.error("Error updating menu permission:", err);
      setError("Failed to update menu permission. Please try again.");
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
      
      const updatedPermissions = permissions.filter((perm) => perm.id !== permissionId);
      const updatedFiltered = filteredPermissions.filter((perm) => perm.id !== permissionId);
      
      setPermissions(updatedPermissions);
      setFilteredPermissions(updatedFiltered);
      
      console.log('Menu permission deleted successfully!');
      return { success: true, message: 'Menu permission deleted successfully!' };
      
    } catch (err) {
      console.error("Error deleting menu permission:", err);
      setError("Failed to delete menu permission. Please try again.");
      throw err;
    }
  };

  const handleDeleteConfirm = async (permissionId: UUID) => {
    await handleDeletePermission(permissionId);
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
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


  useEffect(() => {
    if (searchTerm) {
      const filtered = filterPermissions(mockMenuPermissions, searchTerm);
      setFilteredPermissions(filtered);
      setCurrentPage(1);
    } else {
      setFilteredPermissions(mockMenuPermissions);
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
          <MenuPermissionHeader menuPermissions={permissions} />
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
                      {error.includes("load") ? (
                        <>
                          Failed to load menu permissions.{" "}
                          <button
                            onClick={loadPermissions}
                            className="underline hover:text-red-800 font-semibold focus:outline-none"
                          >
                            Try again
                          </button>{" "}
                          later.
                        </>
                      ) : error.includes("create") ? (
                        "Failed to create menu permission. Please try again."
                      ) : error.includes("update") ? (
                        "Failed to update menu permission. Please try again."
                      ) : error.includes("delete") ? (
                        "Failed to delete menu permission. Please try again."
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
                onAddPermission={handleAddPermission}
              />

              {/* Menu Permissions Table */}
              <MenuPermissionTable
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

      {/* Edit Menu Permission Modal */}
      {isEditModalOpen && editingPermission && (
        <EditMenuPermissionModal
          permission={editingPermission}
          modules={mockModules}
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