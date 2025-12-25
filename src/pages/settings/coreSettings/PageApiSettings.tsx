import { useState, useEffect } from 'react';
import ApiPermissionHeader from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsHeader";
import ApiPermissionTable from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsTable";
import ApiPermissionSearchFilters from "../../../components/settings/coreSettings/apiPermissions/ApiPermissionsSerachFilters";
import type { 
  PerApiListDto, 
  PerApiModDto 
, UUID} from '../../../types/core/Settings/api-permission';


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

function PageApiSettings() {
  const [permissions, setPermissions] = useState<PerApiListDto[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<PerApiListDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter permissions based on search term
  const filterPermissions = (permissions: PerApiListDto[], term: string) => {
    if (!term.trim()) return permissions;
    
    const lowerTerm = term.toLowerCase();
    return permissions.filter(permission => 
      permission.key.toLowerCase().includes(lowerTerm) ||
      permission.name.toLowerCase().includes(lowerTerm) ||
      permission.perMenu.toLowerCase().includes(lowerTerm)
    );
  };

  // Load mock data on mount
  useEffect(() => {
    const itemsPerPage = 10;
    
    // Simulate API loading delay
    const timer = setTimeout(() => {
      const filtered = searchTerm ? filterPermissions(mockApiPermissions, searchTerm) : mockApiPermissions;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      setPermissions(filtered.slice(startIndex, endIndex));
      setFilteredPermissions(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  // Handle search term change
  useEffect(() => {
    if (searchTerm) {
      const filtered = filterPermissions(mockApiPermissions, searchTerm);
      setFilteredPermissions(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 10));
      
      // Reset to first page when searching
      setCurrentPage(1);
      const startIndex = 0;
      const endIndex = 10;
      setPermissions(filtered.slice(startIndex, endIndex));
    } else {
      setFilteredPermissions(mockApiPermissions);
      setTotalItems(mockApiPermissions.length);
      setTotalPages(Math.ceil(mockApiPermissions.length / 10));
      
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      setPermissions(mockApiPermissions.slice(startIndex, endIndex));
    }
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simulate API loading
    setTimeout(() => {
      const itemsPerPage = 10;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      setPermissions(filteredPermissions.slice(startIndex, endIndex));
      setIsLoading(false);
    }, 300);
  };

  // Handle edit permission
  const handleEditPermission = async (permission: PerApiModDto) => {
    console.log('Editing permission:', permission);
    
    // Mock update
    const updatedPermissions = permissions.map(p => 
      p.id === permission.id 
        ? { ...p, key: permission.key, name: permission.desc }
        : p
    );
    setPermissions(updatedPermissions);
    
    // Show success message in console
    console.log('API permission updated successfully!');
  };

  // Handle delete permission
  const handleDeletePermission = async (id: string) => {
    console.log('Deleting permission with ID:', id);
    
    // Mock delete
    const filteredPermissions = permissions.filter(p => p.id !== id);
    setPermissions(filteredPermissions);
    setTotalItems(totalItems - 1);
    setTotalPages(Math.ceil((totalItems - 1) / 10));
    
    // Show success message in console
    console.log('API permission deleted successfully!');
  };

  return (
    <div>
      <ApiPermissionHeader />
      
      {/* Search Filters */}
      <ApiPermissionSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading API permissions...</p>
          </div>
        </div>
      ) : (
        <ApiPermissionTable
          permissions={permissions}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onEditPermission={handleEditPermission}
          onPermissionDelete={handleDeletePermission}
        />
      )}
    </div>
  );
}

export default PageApiSettings;