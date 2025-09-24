import { useState } from 'react';
import { motion } from 'framer-motion';
import DepartmentManagementHeader from '../../../components/core/department/DeptHeader';
import DepartmentStatsCards from '../../../components/core/department/DeptStatusCards';
import DepartmentSearchFilters from '../../../components/core/department/DeptSearchFilters';
import DepartmentTable from '../../../components/core/department/DeptTable';
import EditDeptModal from '../../../components/core/department/EditDeptForm';
import type { Department } from '../../../types/department';
import type { AddDeptDto, EditDeptDto, UUID } from '../../../types/core/dept';
import { initialDepartments } from '../../../data/department';

const DepartmentOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    companyId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 8;
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const handleAddDepartment = (newDepartment: AddDeptDto) => {
    const departmentWithId: Department = {
      id: `dept-${Date.now()}`,
      name: newDepartment.name,
      nameAm: newDepartment.nameAm,
      manager: 'To be assigned',
      location: 'Main Branch',
      employeeCount: 0,
      status: newDepartment.deptStat === 'Active' ? 'active' : 'inactive',
      branchId: newDepartment.branchId,
      companyId: 1, // Default company ID
      description: `${newDepartment.name} Department` // Added missing description
    };
    setDepartments(prev => [...prev, departmentWithId]);
    setCurrentPage(1);
  };

  const handleEditClick = (department: EditDeptDto) => {
    // Convert EditDeptDto back to Department for editing
    const departmentToEdit: Department = {
      id: department.id,
      name: department.name,
      nameAm: department.nameAm,
      manager: 'To be assigned', // You might want to preserve the actual manager
      location: department.branch,
      employeeCount: 0, // You might want to preserve the actual count
      status: department.deptStat.toLowerCase() as 'active' | 'inactive',
      branchId: department.branchId,
      companyId: 1, // Default company ID
      description: `${department.name} Department` // Added missing description
    };
    setEditingDepartment(departmentToEdit);
    setIsEditModalOpen(true);
  };

  const handleUpdateDepartment = (updatedDepartment: EditDeptDto) => {
    setDepartments(prev =>
      prev.map(dept =>
        dept.id === updatedDepartment.id ? {
          ...dept,
          name: updatedDepartment.name,
          nameAm: updatedDepartment.nameAm,
          location: updatedDepartment.branch,
          status: updatedDepartment.deptStat.toLowerCase() as 'active' | 'inactive',
          branchId: updatedDepartment.branchId
        } : dept
      )
    );
    setIsEditModalOpen(false);
    setEditingDepartment(null);
  };

  const handleDepartmentStatusChange = (departmentId: string, newStatus: "active" | "inactive") => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.id === departmentId ? { ...dept, status: newStatus } : dept
      )
    );
  };

  const handleDepartmentDelete = (departmentId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
  };

  // Filter departments based on search and filters
  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? department.status === filters.status : true;
    const matchesLocation = filters.location ? department.location === filters.location : true;
    const matchesCompany = filters.companyId ? department.branchId === filters.companyId : true;

    return matchesSearch && matchesStatus && matchesLocation && matchesCompany;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique locations for filter dropdown
  const locations = [...new Set(departments.map(dept => dept.location))];

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`p-4 md:p-6 bg-gray-50 min-h-screen transition-all duration-300 ${isEditModalOpen ? 'blur-sm' : ''}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <DepartmentManagementHeader />
            
            <DepartmentStatsCards 
              totalDepartments={departments.length}
              activeDepartments={departments.filter(d => d.status === "active").length}
              employeeCount={departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            />

            <DepartmentSearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              locations={locations}
              onAddDepartment={handleAddDepartment}
              selectedBranchId={filters.companyId || ''}
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
          </div>
        </div>
      </motion.div>

      {/* Edit Department Modal */}
      {isEditModalOpen && editingDepartment && (
        <EditDeptModal
          department={{
            id: editingDepartment.id as UUID,
            name: editingDepartment.name,
            nameAm: editingDepartment.nameAm || `አማርኛ-${editingDepartment.name}`,
            deptStat: editingDepartment.status === 'active' ? 'Active' : 'Inactive',
            branchId: editingDepartment.branchId,
            branch: editingDepartment.location,
            branchAm: editingDepartment.location,
            rowVersion: '1'
          }}
          branches={[
            { id: '1', name: 'Main Branch', nameAm: 'ዋና ቅርንጫፍ' },
            { id: '2', name: 'Regional Office', nameAm: 'ክልላዊ ቢሮ' },
            { id: '3', name: 'Local Branch', nameAm: 'አገር አቀፍ ቅርንጫፍ' },
          ]}
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
      when: "beforeChildren"
    } 
  }
};

export default DepartmentOverview;