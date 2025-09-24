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
  Trash2,
  Repeat,
  Pencil,
  Eye,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import EditDeptModal from './EditDeptForm';
import DeleteDeptModal from './DeleteDeptModal';
import type { Department } from '../../../types/department';
import type { EditDeptDto, DeptListDto } from '../../../types/core/dept';
import { companies } from '../../../data/company-branches';

// Convert your Department type to match DeptListDto structure
const convertToDeptListDto = (dept: Department): DeptListDto => ({
  id: dept.id,
  name: dept.name,
  nameAm: dept.nameAm || `አማርኛ-${dept.name}`,
  deptStat: dept.status === 'active' ? 'Active' : 'Inactive',
  branchId: dept.branchId || '1',
  branch: dept.location || 'Main Branch',
  branchAm: dept.location || 'ዋና ቅርንጫፍ',
  rowVersion: '1'
});

interface DepartmentTableProps {
  departments: Department[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEditDepartment: (department: EditDeptDto) => void;
  onDepartmentStatusChange: (id: string, status: "active" | "inactive") => void;
  onDepartmentDelete: (id: string) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEditDepartment,
  onDepartmentStatusChange,
  onDepartmentDelete,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'delete' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock branches data for testing
  const branches = [
    { id: '1', name: 'Main Branch', nameAm: 'ዋና ቅርንጫፍ' },
    { id: '2', name: 'Regional Office', nameAm: 'ክልላዊ ቢሮ' },
    { id: '3', name: 'Local Branch', nameAm: 'አገር አቀፍ ቅርንጫፍ' },
  ];

  const getCompanyName = (companyId: number): string => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const getCompanyBranches = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.branches : [];
  };

  const handleStatusToggle = (department: Department) => {
    const newStatus = department.status === "active" ? "inactive" : "active";
    onDepartmentStatusChange(department.id, newStatus);
    setPopoverOpen(null);
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    setModalType('view');
    setPopoverOpen(null);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
    setPopoverOpen(null);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
    setPopoverOpen(null);
  };

  const handleConfirmDelete = (departmentId: string) => {
    onDepartmentDelete(departmentId);
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSaveChanges = (updatedDepartment: EditDeptDto) => {
    onEditDepartment(updatedDepartment);
    setIsEditModalOpen(false);
    setSelectedDepartment(null);
  };

  const getStatusColor = (status: "active" | "inactive"): string => {
    return status === "active" 
      ? "bg-emerald-100 text-emerald-800" 
      : "bg-gray-100 text-gray-800";
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl shadow-sm overflow-hidden bg-white"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              </tr>
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
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                    variants={rowVariants}
                    className="transition-colors duration-200"
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
                            {department.description || `${department.name} Department`}
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
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button 
                              onClick={() => handleEdit(department)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleStatusToggle(department)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <Repeat size={16} />
                              Toggle Status
                            </button>
                            <button 
                              onClick={() => handleDelete(department)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                            >
                              <Trash2 size={16} />
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

        {/* Pagination - unchanged */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 8 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 8, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> departments
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals remain unchanged */}
      {selectedDepartment && (
        <EditDeptModal
          department={convertToDeptListDto(selectedDepartment)}
          branches={branches}
          onEditDepartment={handleSaveChanges}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
          }}
        />
      )}

      <DeleteDeptModal
        department={selectedDepartment ? convertToDeptListDto(selectedDepartment) : null}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {selectedDepartment && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedDepartment.name}</h2>
                <p className="text-gray-600">{getCompanyName(selectedDepartment.companyId)} • {selectedDepartment.location}</p>
              </div>
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedDepartment(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Department Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="text-gray-500 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p>{selectedDepartment.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="text-gray-500 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-gray-500">Manager</p>
                      <p>{selectedDepartment.manager}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="text-gray-500 mr-3" size={16} />
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Details</h3>
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
                          <span className="text-sm">{branch.name} - {branch.city}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedDepartment(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DepartmentTable;