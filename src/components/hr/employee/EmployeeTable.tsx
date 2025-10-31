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
  MapPin,
  Loader2,
  
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import type { EmployeeListDto } from '../../../types/hr/employee';

// Extended Employee type based on EmployeeListDto with optional fields
type Employee = EmployeeListDto & {
  status?: "active" | "on-leave";
  // Add optional fields that might not exist in the base type
  employmentDate?: string;
  nationality?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
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
  loading?: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEmployeeUpdate,
  onEmployeeStatusChange,
  onEmployeeTerminate,
  loading = false
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'terminate' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [terminating, setTerminating] = useState<string | null>(null);

  const sortedEmployees = [...employees].sort((a, b) => {
    // Use createdAt as fallback for sorting if employmentDate doesn't exist
    const dateA = a.employmentDate || a.createdAt || '';
    const dateB = b.employmentDate || b.createdAt || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const handleViewDetails = (employee: Employee) => {
    sessionStorage.setItem('selectedEmployee', JSON.stringify(employee));
    sessionStorage.setItem('currentModule', 'HR');
    
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

  const confirmTermination = async () => {
    if (selectedEmployee) {
      setTerminating(selectedEmployee.id);
      try {
        await onEmployeeTerminate(selectedEmployee.id);
        setModalType(null);
      } catch (error) {
        console.error('Error terminating employee:', error);
      } finally {
        setTerminating(null);
      }
    }
  };

  const handleSaveChanges = (updatedEmployee: Employee) => {
    onEmployeeUpdate(updatedEmployee);
    setModalType(null);
  };


  // Helper function to get display value for gender
  const getGenderDisplay = (gender: string | undefined): string => {
    const genderStr = gender?.toString() || '';
    switch (genderStr.toLowerCase()) {
      case "0":
      case "male": return "Male";
      case "1":
      case "female": return "Female";
      case "m": return "Male";
      case "f": return "Female";
      default: return genderStr || "Not specified";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

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
                  Employee
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Gender
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Branch
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Position
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Job Grade
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Employment Nature
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </motion.tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {loading ? 'Loading employees...' : 'No employees found'}
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((employee, index) => (
                  <motion.tr 
                    key={employee.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <motion.div 
                          whileHover={{ rotate: 10 }}
                          className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                        >
                          {employee.photo ? (
                            <img 
                              src={employee.photo} 
                              alt={employee.empFullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="text-green-600 h-5 w-5" />
                          )}
                        </motion.div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                            {employee.empFullName || "No Name"}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-none">
                            {employee.empFullNameAm || employee.empFullName || "No Name"}
                          </div>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {employee.code || "N/A"}
                          </code>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {getGenderDisplay(employee.gender)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      <div className="flex items-center">
                          {employee.branch || "Not specified"}
                      </div>
                    </td>
                    <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium hidden lg:table-cell`}>
                      {employee.department || "Not specified"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                      <div className="flex items-center">
                        <span className="truncate max-w-[120px]">{employee.position || "Not specified"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {employee.jobGrade || "Not specified"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full $`}
                      >
                        {employee.empType || "Not specified"}
                      </motion.span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {employee.empNature || "Not specified"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
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
                              {employee.status === 'on-leave' ? 'Mark as Active' : 'Mark as On Leave'}
                            </button>
                            <button 
                              onClick={() => handleTerminate(employee)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center justify-between"
                              disabled={terminating === employee.id}
                            >
                              Terminate
                              {terminating === employee.id && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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

      {/* Simplified Employee Details Modal */}
      {selectedEmployee && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white/90 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedEmployee.empFullName || "Employee"}</h2>
                <p className="text-gray-600">{selectedEmployee.position} • {selectedEmployee.department}</p>
                <p className="text-sm text-gray-500">{selectedEmployee.empFullNameAm || selectedEmployee.empFullName || "No Name"}</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="mr-2 text-blue-500" size={20} />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee Code</p>
                      <p className="font-medium">{selectedEmployee.code || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{getGenderDisplay(selectedEmployee.gender)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="font-medium">{selectedEmployee.nationality || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Nature</p>
                      <p className="font-medium">{selectedEmployee.empNature || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="mr-2 text-green-500" size={20} />
                    Employment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-medium">{selectedEmployee.branch || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{selectedEmployee.department || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium">{selectedEmployee.position || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Job Grade</p>
                      <p className="font-medium">{selectedEmployee.jobGrade || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full $`}>
                        {selectedEmployee.empType || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates & System Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="mr-2 text-purple-500" size={20} />
                    Employment Dates
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Employment Date</p>
                      <p className="font-medium">{formatDate(selectedEmployee.employmentDate || selectedEmployee.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 text-amber-500" size={20} />
                    System Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(selectedEmployee.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(selectedEmployee.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Updated By</p>
                      <p className="font-medium">{selectedEmployee.updatedBy || "System"}</p>
                    </div>
                  </div>
                </div>
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
              <p className="text-gray-600">Edit form implementation would go here...</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  This would contain a form to edit the employee's basic information.
                  The form would include fields for position, department, employment type, etc.
                </p>
              </div>
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
                Are you sure you want to change {selectedEmployee.empFullName}'s status to{' '}
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
                Are you sure you want to terminate {selectedEmployee.empFullName}'s employment? This action cannot be undone.
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
                  disabled={terminating === selectedEmployee.id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white disabled:bg-red-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {terminating === selectedEmployee.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>{terminating === selectedEmployee.id ? 'Terminating...' : 'Terminate'}</span>
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