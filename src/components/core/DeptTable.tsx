import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  MoreVertical,
  User,
  X,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Layers,
  BarChart2,
  Calendar,
  PencilIcon,
  TrashIcon
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import EditDepartmentForm from './EditDeptForm';
import type { Department } from '../../types/department';
import { companies } from '../../data/company-branches';

interface DepartmentTableProps {
  departments: Department[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onDepartmentUpdate: (department: Department) => void;
  onDepartmentStatusChange: (id: string, status: "active" | "inactive") => void;
  onDepartmentDelete: (id: string) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onDepartmentUpdate,
  onDepartmentStatusChange,
  onDepartmentDelete,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'delete' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const getCompanyName = (companyId: number): string => {
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      console.error(`Company with ID ${companyId} not found`);
      return '';
    }
    return company.name;
  };

  const getCompanyBranches = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.branches : [];
  };

  const handleEditSubmit = (values: Department) => {
    onDepartmentUpdate(values);
    setEditingDepartment(null);
  };

  const handleStatusToggle = (department: Department) => {
    const newStatus = department.status === "active" ? "inactive" : "active";
    onDepartmentStatusChange(department.id, newStatus);
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    setModalType('view');
    setPopoverOpen(null);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setModalType('edit');
    setPopoverOpen(null);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setModalType('delete');
    setPopoverOpen(null);
  };

  const confirmDeletion = () => {
    if (selectedDepartment) {
      onDepartmentDelete(selectedDepartment.id);
      setModalType(null);
    }
  };

  const getStatusColor = (status: "active" | "inactive"): string => {
    return status === "active" 
      ? "bg-emerald-100 text-emerald-800" 
      : "bg-gray-100 text-gray-800";
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
        {editingDepartment && (
          <EditDepartmentForm
            department={editingDepartment}
            companies={companies}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingDepartment(null)}
          />
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Company
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Employees
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </motion.tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No departments found
                  </td>
                </tr>
              ) : (
                departments.map((department, index) => (
                  <motion.tr 
                    key={department.id}
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
                          className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                        >
                          <span className="text-emerald-600 font-medium">
                            {department.name.charAt(0).toUpperCase()}
                          </span>
                        </motion.div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                            {department.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                            {department.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      <div className="flex items-center">
                        <Building className="text-gray-400 mr-2 h-4 w-4" />
                        <span>{getCompanyName(department.companyId)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      <div className="flex items-center">
                        <MapPin className="text-gray-400 mr-2 h-4 w-4" />
                        <span>{department.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2 h-4 w-4" />
                        <span>{department.employeeCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Popover open={popoverOpen === department.id} onOpenChange={(open) => setPopoverOpen(open ? department.id : null)}>
                        <PopoverTrigger asChild>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </motion.button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-0" align="end">
                          <div className="py-1">
                            <button 
                              onClick={() => handleViewDetails(department)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => setEditingDepartment(department)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleStatusToggle(department)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                            >
                              Toggle Status
                            </button>
                            <button 
                              onClick={() => handleDelete(department)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                              Delete
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
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
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
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> departments
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                        ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Department Details Modal */}
      {selectedDepartment && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white/90 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                <p className="text-gray-600">{getCompanyName(selectedDepartment.companyId)} • {selectedDepartment.location}</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="mr-2 text-emerald-500" size={20} />
                    Department Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p>{selectedDepartment.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Manager</p>
                        <p>{selectedDepartment.manager}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Employees</p>
                        <p>{selectedDepartment.employeeCount}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDepartment.status)}`}>
                        {selectedDepartment.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="mr-2 text-blue-500" size={20} />
                    Description
                  </h3>
                  <p className="text-gray-700">
                    {selectedDepartment.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="mr-2 text-purple-500" size={20} />
                    Company Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{getCompanyName(selectedDepartment.companyId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Branches</p>
                      <div className="mt-1 space-y-1">
                        {getCompanyBranches(selectedDepartment.companyId).map(branch => (
                          <div key={branch.id} className="flex items-center">
                            <MapPin className="text-gray-400 mr-2 h-3 w-3" />
                            <span className="text-sm">{branch.city} - {branch.name}</span>
                          </div>
                        ))}
                      </div>
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

      {/* Delete Confirmation Modal */}
      {selectedDepartment && modalType === 'delete' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedDepartment.name} department? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletion}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentTable;