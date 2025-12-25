import { useState, useEffect } from 'react';
import MenuPermissionHeader from '../../../components/settings/coreSettings/menuPermissions/MenuPermissionsHeader';
import MenuPermissionTable from '../../../components/settings/coreSettings/menuPermissions/MenuPermissionsTable';
import MenuPermissionSearchFilters from '../../../components/settings/coreSettings/menuPermissions/MenuPermissionsSearchFilters';
import type { 
  PerMenuListDto, 
  PerMenuModDto, 
  UUID
} from '../../../types/core/Settings/menu-permissions';

// Mock data for demonstration
const mockMenuPermissions: PerMenuListDto[] = [
  {
    id: 'menu-perm-001' as UUID,
    perModuleId: 'module-hr',
    key: 'menu.hr.dashboard',
    name: 'HR Dashboard',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-002'  as UUID,
    perModuleId: 'module-hr',
    key: 'menu.hr.employees',
    name: 'Employees Management',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-003' as UUID,
    perModuleId: 'module-hr',
    key: 'menu.hr.attendance',
    name: 'Attendance Tracking',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-004' as UUID,
    perModuleId: 'module-hr',
    key: 'menu.hr.payroll',
    name: 'Payroll Management',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-005' as UUID,
    perModuleId: 'module-finance',
    key: 'menu.finance.dashboard',
    name: 'Finance Dashboard',
    module: 'Finance'
  },
  {
    id: 'menu-perm-006' as UUID,
    perModuleId: 'module-finance',
    key: 'menu.finance.invoices',
    name: 'Invoice Management',
    module: 'Finance'
  },
  {
    id: 'menu-perm-007' as UUID,
    perModuleId: 'module-finance',
    key: 'menu.finance.reports',
    name: 'Financial Reports',
    module: 'Finance'
  },
  {
    id: 'menu-perm-008' as UUID,
    perModuleId: 'module-crm',
    key: 'menu.crm.dashboard',
    name: 'CRM Dashboard',
    module: 'CRM'
  },
  {
    id: 'menu-perm-009' as UUID,
    perModuleId: 'module-crm',
    key: 'menu.crm.leads',
    name: 'Leads Management',
    module: 'CRM'
  },
  {
    id: 'menu-perm-010' as UUID,
    perModuleId: 'module-crm',
    key: 'menu.crm.customers',
    name: 'Customer Management',
    module: 'CRM'
  },
  {
    id: 'menu-perm-011' as UUID,
    perModuleId: 'module-inventory',
    key: 'menu.inventory.dashboard',
    name: 'Inventory Dashboard',
    module: 'Inventory'
  },
  {
    id: 'menu-perm-012' as UUID,
    perModuleId: 'module-inventory',
    key: 'menu.inventory.products',
    name: 'Product Management',
    module: 'Inventory'
  },
  {
    id: 'menu-perm-013' as UUID,
    perModuleId: 'module-procurement',
    key: 'menu.procurement.dashboard',
    name: 'Procurement Dashboard',
    module: 'Procurement'
  },
  {
    id: 'menu-perm-014' as UUID,
    perModuleId: 'module-procurement',
    key: 'menu.procurement.orders',
    name: 'Order Management',
    module: 'Procurement'
  },
  {
    id: 'menu-perm-015' as UUID,
    perModuleId: 'module-settings',
    key: 'menu.settings.dashboard',
    name: 'Settings Dashboard',
    module: 'Settings'
  },
  {
    id: 'menu-perm-016' as UUID,
    perModuleId: 'module-settings',
    key: 'menu.settings.users',
    name: 'User Management',
    module: 'Settings'
  },
  {
    id: 'menu-perm-017' as UUID,
    perModuleId: 'module-settings',
    key: 'menu.settings.permissions',
    name: 'Permission Management',
    module: 'Settings'
  },
  {
    id: 'menu-perm-018' as UUID,
    perModuleId: 'module-hr',
    key: 'menu.hr.recruitment',
    name: 'Recruitment',
    module: 'Human Resources'
  },
  {
    id: 'menu-perm-019' as UUID,
    perModuleId: 'module-finance',
    key: 'menu.finance.budget',
    name: 'Budget Planning',
    module: 'Finance'
  },
  {
    id: 'menu-perm-020' as UUID,
    perModuleId: 'module-crm',
    key: 'menu.crm.marketing',
    name: 'Marketing Automation',
    module: 'CRM'
  }
];

function PageMenuSettings() {
  const [permissions, setPermissions] = useState<PerMenuListDto[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<PerMenuListDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter permissions based on search term
  const filterPermissions = (permissions: PerMenuListDto[], term: string) => {
    if (!term.trim()) return permissions;
    
    const lowerTerm = term.toLowerCase();
    return permissions.filter(permission => 
      permission.key.toLowerCase().includes(lowerTerm) ||
      permission.name.toLowerCase().includes(lowerTerm) ||
      permission.module.toLowerCase().includes(lowerTerm)
    );
  };

  // Load mock data on mount
  useEffect(() => {
    const itemsPerPage = 8;
    
    // Simulate API loading delay
    const timer = setTimeout(() => {
      const filtered = searchTerm ? filterPermissions(mockMenuPermissions, searchTerm) : mockMenuPermissions;
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
      const filtered = filterPermissions(mockMenuPermissions, searchTerm);
      setFilteredPermissions(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 8));
      
      // Reset to first page when searching
      setCurrentPage(1);
      const startIndex = 0;
      const endIndex = 8;
      setPermissions(filtered.slice(startIndex, endIndex));
    } else {
      setFilteredPermissions(mockMenuPermissions);
      setTotalItems(mockMenuPermissions.length);
      setTotalPages(Math.ceil(mockMenuPermissions.length / 8));
      
      const startIndex = (currentPage - 1) * 8;
      const endIndex = startIndex + 8;
      setPermissions(mockMenuPermissions.slice(startIndex, endIndex));
    }
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simulate API loading
    setTimeout(() => {
      const itemsPerPage = 8;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      setPermissions(filteredPermissions.slice(startIndex, endIndex));
      setIsLoading(false);
    }, 300);
  };

  // Handle edit permission
  const handleEditPermission = async (permission: PerMenuModDto) => {
    console.log('Editing menu permission:', permission);
    
    // Mock update
    const updatedPermissions = permissions.map(p => 
      p.id === permission.id 
        ? { ...p, key: permission.key, name: permission.desc }
        : p
    );
    setPermissions(updatedPermissions);
    
    // Show success message in console
    console.log('Menu permission updated successfully!');
  };

  // Handle delete permission
  const handleDeletePermission = async (id: string) => {
    console.log('Deleting menu permission with ID:', id);
    
    // Mock delete
    const filteredPermissions = permissions.filter(p => p.id !== id);
    setPermissions(filteredPermissions);
    setTotalItems(totalItems - 1);
    setTotalPages(Math.ceil((totalItems - 1) / 8));
    
    // Show success message in console
    console.log('Menu permission deleted successfully!');
  };

  return (
    <div>
      <MenuPermissionHeader />
      
      {/* Search Filters */}
      <MenuPermissionSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu permissions...</p>
          </div>
        </div>
      ) : (
        <MenuPermissionTable
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

export default PageMenuSettings;