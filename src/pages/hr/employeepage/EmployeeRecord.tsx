import { useState } from 'react';
import { motion } from 'framer-motion';
import EmployeeManagementHeader from '../../../components/hr/EmployeeManagementHeader';
import EmployeeStatsCards from '../../../components/hr/EmployeeStatsCards';
import EmployeeSearchFilters from '../../../components/hr/EmployeeSearchFilters';
import EmployeeTable from '../../../components/hr/EmployeeTable';

const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Jane',
    lastName: 'Cooper',
    email: 'janecoop@gmail.com',
    payroll: '1219484SH3',
    department: 'Finance',
    role: 'Sr. Accountant',
    joiningDate: 'Feb 23, 2025',
    contractType: 'Full-time',
    status: 'active'
  },
  {
    id: 'emp-2',
    firstName: 'Brooklyn',
    lastName: 'Simmons',
    email: 'brookjynsmms@gmail.com',
    payroll: 'BHABHD127',
    department: 'Engineer',
    role: 'Lead Back End Dev',
    joiningDate: 'Feb 18, 2025',
    contractType: 'Freelance',
    status: 'on-leave'
  },
];

const EmployeeManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contractType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employeeWithId = {
      ...newEmployee,
      id: `emp-${Date.now()}` // Generate a unique ID
    };
    setEmployees(prev => [...prev, employeeWithId]);
    setCurrentPage(1); // Reset to first page to show the new employee
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    // Combine first and last name for search
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
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
            onAddEmployee={handleAddEmployee}
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
  firstName: string;
  lastName: string;
  email: string;
  payroll: string;
  department: string;
  role: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  status: "active" | "on-leave";
};

export default EmployeeManagementPage;