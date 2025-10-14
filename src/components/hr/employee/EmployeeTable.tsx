import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  MoreVertical,
  User,
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  BarChart2,
  DollarSign,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';

// Enhanced Employee Type with all ERP fields
type Employee = {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Employment Details
  department: string;
  jobTitle: string;
  jobGrade: string;
  employeeCategory: string;
  reportingTo: string;
  manager: string;
  team: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  employmentStatus: "Active" | "On Leave" | "Terminated" | "Probation";
  status: "active" | "on-leave";
  workLocation: string;
  workSchedule: string;

  // Compensation
  salary: number;
  currency: string;
  paymentMethod: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
  };
  taxInformation: string;

  // Time & Attendance
  lastCheckIn?: string;
  lastCheckOut?: string;
  totalLeavesTaken: number;
  leaveBalance: number;
  attendancePercentage: number;

  // Performance
  performanceRating: number;
  lastAppraisalDate: string;
  nextAppraisalDate: string;
  keyPerformanceIndicators: {
    name: string;
    target: string;
    actual: string;
    weight: number;
  }[];
  skills: string[];
  competencies: string[];

  // Training & Development
  trainings: {
    name: string;
    date: string;
    duration: string;
    status: "Completed" | "In Progress" | "Pending";
    certification?: string;
  }[];

  // Career History
  previousRoles: {
    jobTitle: string;
    department: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }[];

  // Documents
  documents: {
    type: string;
    name: string;
    issueDate: string;
    expiryDate?: string;
    status: string;
  }[];

  // System
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

interface EmployeeTableProps {
  employees: Employee[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEmployeeUpdate: (updatedEmployee: Employee) => void;
  onEmployeeStatusChange: (employeeId: string, newStatus: "active" | "on-leave") => void;
  onEmployeeTerminate: (employeeId: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEmployeeUpdate,
  onEmployeeStatusChange,
  onEmployeeTerminate
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'terminate' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const sortedEmployees = [...employees].sort((a, b) => {
    return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
  });

const handleViewDetails = (employee: Employee) => {
  sessionStorage.setItem('selectedEmployee', JSON.stringify(employee));
  sessionStorage.setItem('currentModule', 'HR');
  
  // Use window.open with the same origin to maintain session
  const newWindow = window.open(`/hr/employees/${employee.id}`, '_blank');
  if (newWindow) {
    newWindow.focus();
  }
};

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('edit');
    setPopoverOpen(null);
  };

  const handleStatusChange = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('status');
    setPopoverOpen(null);
  };

  const handleTerminate = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('terminate');
    setPopoverOpen(null);
  };

  const confirmStatusChange = () => {
    if (selectedEmployee) {
      const newStatus = selectedEmployee.status === 'active' ? 'on-leave' : 'active';
      onEmployeeStatusChange(selectedEmployee.id, newStatus);
      setModalType(null);
    }
  };

  const confirmTermination = () => {
    if (selectedEmployee) {
      onEmployeeTerminate(selectedEmployee.id);
      setModalType(null);
    }
  };

  const handleSaveChanges = (updatedEmployee: Employee) => {
    onEmployeeUpdate(updatedEmployee);
    setModalType(null);
  };

  const getContractTypeColor = (type: Employee["contractType"]): string => {
    switch (type) {
      case "Full-time": return "bg-green-100 text-green-800";
      case "Part-time": return "bg-blue-100 text-blue-800";
      case "Freelance": return "bg-purple-100 text-purple-800";
      case "Internship": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentColor = (dept: string): string => {
    switch (dept) {
      case "Finance": return "text-red-600";
      case "Engineering": return "text-green-600";
      case "Product": return "text-amber-600";
      case "Marketing": return "text-emerald-600";
      case "HR": return "text-indigo-600";
      case "Operations": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getStatusColor = (status: "active" | "on-leave"): string => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0, 
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 100,
              damping: 15,
              duration: 0.5
            }
          }
        }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Job Title
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Joining Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </motion.tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.map((employee, index) => (
                <motion.tr 
                  key={employee.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div 
                        whileHover={{ rotate: 10 }}
                        className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <User className="text-green-600 h-5 w-5" />
                      </motion.div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status === "active" ? "Active" : "On Leave"}
                    </span>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div className="flex items-center">
                      <Briefcase className="text-gray-400 mr-2 h-4 w-4" />
                      <span className="truncate max-w-[120px]">{employee.jobTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2 h-4 w-4" />
                      <span>{employee.joiningDate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractTypeColor(employee.contractType)}`}
                    >
                      {employee.contractType}
                    </motion.span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover open={popoverOpen === employee.id} onOpenChange={(open) => setPopoverOpen(open ? employee.id : null)}>
                      <PopoverTrigger asChild>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 cursor-pointer" />
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0" align="end">
                        <div className="py-1">
                          <button 
                            onClick={() => handleViewDetails(employee)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleEdit(employee)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleStatusChange(employee)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            {employee.status === 'active' ? 'Mark as On Leave' : 'Mark as Active'}
                          </button>
                          <button 
                            onClick={() => handleTerminate(employee)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Terminate
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-whi"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-green-500 text-green-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Employee Details Modal */}
      {selectedEmployee && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white/90 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                <p className="text-gray-600">{selectedEmployee.jobTitle} • {selectedEmployee.department}</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="mr-2 text-blue-500" size={20} />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{selectedEmployee.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{selectedEmployee.address}, {selectedEmployee.city}, {selectedEmployee.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p>{selectedEmployee.dateOfBirth}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">{selectedEmployee.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 text-red-500" size={20} />
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{selectedEmployee.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p>{selectedEmployee.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{selectedEmployee.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="mr-2 text-green-500" size={20} />
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p>{selectedEmployee.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Job Grade</p>
                      <p>{selectedEmployee.jobGrade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p>{selectedEmployee.employeeCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reporting To</p>
                      <p>{selectedEmployee.reportingTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Manager</p>
                      <p>{selectedEmployee.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team</p>
                      <p>{selectedEmployee.team}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p>{selectedEmployee.joiningDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contract Type</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContractTypeColor(selectedEmployee.contractType)}`}>
                        {selectedEmployee.contractType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time & Attendance */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 text-purple-500" size={20} />
                    Time & Attendance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Check-In</p>
                      <p>{selectedEmployee.lastCheckIn || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Check-Out</p>
                      <p>{selectedEmployee.lastCheckOut || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leaves Taken</p>
                      <p>{selectedEmployee.totalLeavesTaken} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leave Balance</p>
                      <p>{selectedEmployee.leaveBalance} days</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Attendance Percentage</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div 
                          className="h-2.5 rounded-full bg-green-500" 
                          style={{ width: `${selectedEmployee.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm mt-1">{selectedEmployee.attendancePercentage}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance & Compensation */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart2 className="mr-2 text-amber-500" size={20} />
                    Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Rating</p>
                      <div className="flex items-center">
                        <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {selectedEmployee.performanceRating}/5
                        </span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < Math.floor(selectedEmployee.performanceRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Appraisal</p>
                      <p>{selectedEmployee.lastAppraisalDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Appraisal</p>
                      <p>{selectedEmployee.nextAppraisalDate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="mr-2 text-emerald-500" size={20} />
                    Compensation
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-lg font-medium">
                        {selectedEmployee.currency} {selectedEmployee.salary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p>{selectedEmployee.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Details</p>
                      <p className="text-sm">
                        {selectedEmployee.bankDetails.bankName} ••••{selectedEmployee.bankDetails.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="mr-2 text-indigo-500" size={20} />
                    Training & Development
                  </h3>
                  <div className="space-y-3">
                    {selectedEmployee.trainings.slice(0, 2).map((training, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{training.name}</p>
                        <div className="flex justify-between text-gray-500">
                          <span>{training.date}</span>
                          <span className={
                            training.status === "Completed" ? "text-green-500" :
                            training.status === "In Progress" ? "text-blue-500" : "text-gray-500"
                          }>
                            {training.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Career History */}
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-purple-500" size={20} />
                Career History
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEmployee.previousRoles.map((role, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{role.jobTitle}</td>
                        <td className="px-4 py-2 text-sm">{role.department}</td>
                        <td className="px-4 py-2 text-sm">
                          {role.startDate} - {role.endDate || 'Present'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">{role.responsibilities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end sticky bottom-0 bg-white/90">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedEmployee && modalType === 'edit' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Edit Employee Details</h2>
              <button
                onClick={() => setModalType(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Edit form would go here */}
              <p className="text-gray-600">Edit form implementation would go here...</p>
            </div>
            <div className="border-t p-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveChanges(selectedEmployee)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {selectedEmployee && modalType === 'status' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Status Change</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change {selectedEmployee.firstName}'s status to{' '}
                {selectedEmployee.status === 'active' ? 'On Leave' : 'Active'}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Termination Confirmation Modal */}
      {selectedEmployee && modalType === 'terminate' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Termination</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to terminate {selectedEmployee.firstName}'s employment? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTermination}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                  Terminate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTable;