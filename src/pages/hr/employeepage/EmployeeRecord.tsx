import { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeManagementHeader from '../../../components/hr/EmployeeManagementHeader';
import EmployeeStatsCards from '../../../components/hr/EmployeeStatsCards';
import EmployeeSearchFilters from '../../../components/hr/EmployeeSearchFilters';
import EmployeeTable from '../../../components/hr/EmployeeTable';
import { generateEmployees } from '../../../components/hr/EmployeeData';

const EmployeeManagementPage = () => {
  const [employees] = useState<Employee[]>(generateEmployees(50));
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contractType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filters.department ? employee.department === filters.department : true;
    const matchesStatus = filters.status ? employee.status === filters.status : true;
    const matchesContract = filters.contractType ? employee.contractType === filters.contractType : true;

    return matchesSearch && matchesDepartment && matchesStatus && matchesContract;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <EmployeeManagementHeader />
          
          <EmployeeStatsCards 
            totalEmployees={employees.length}
            activeEmployees={employees.filter(e => e.status === "active").length}
            onLeaveEmployees={employees.filter(e => e.status === "on-leave").length}
          />

          <EmployeeSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            employees={employees}
          />

          <EmployeeTable 
            employees={paginatedEmployees}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEmployees.length}
            onPageChange={setCurrentPage}
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

// Types
type Employee = {
  id: string;
  name: string;
  email: string;
  payroll: string;
  department: string;
  role: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  status: "active" | "on-leave";
};

export default EmployeeManagementPage;