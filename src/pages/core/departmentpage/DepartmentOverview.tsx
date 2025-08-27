import { useState } from 'react';
import { motion } from 'framer-motion';
import DepartmentManagementHeader from '../../../components/core/DeptHeader';
import DepartmentStatsCards from '../../../components/core/DeptStatusCards';
import DepartmentSearchFilters from '../../../components/core/DeptSearchFilters';
import DepartmentTable from '../../../components/core/DeptTable';
import type { Department } from '../../../types/department';
import { initialDepartments } from '../../../data/department';

const DepartmentOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const handleAddDepartment = (newDepartment: Omit<Department, 'id'>) => {
    const departmentWithId = {
      ...newDepartment,
      id: `dept-${Date.now()}`,
      employeeCount: 0
    };
    setDepartments(prev => [...prev, departmentWithId]);
    setCurrentPage(1);
  };

  const handleDepartmentUpdate = (updatedDepartment: Department) => {
    setDepartments(prev => 
      prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept)
    );
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

    return matchesSearch && matchesStatus && matchesLocation;
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 bg-gray-50 min-h-screen"
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
          />

          <DepartmentTable 
            departments={paginatedDepartments}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDepartments.length}
            onPageChange={setCurrentPage}
            onDepartmentUpdate={handleDepartmentUpdate}
            onDepartmentStatusChange={handleDepartmentStatusChange}
            onDepartmentDelete={handleDepartmentDelete}
          />
        </div>
      </div>
    </motion.div>
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