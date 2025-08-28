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
  Calendar
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import type { Branch, BranchTableProps } from '../../../types/branches';
import { companies } from '../../../data/company-branches';

const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onBranchUpdate,
  onBranchStatusChange,
  onBranchDelete,
  companyId
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'delete' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  // Get branches for the specific company if companyId is provided
  const companyBranches = companyId 
    ? companies.find(c => c.id === companyId)?.branches || []
    : branches;

  const sortedBranches = [...companyBranches].sort((a, b) => {
    return new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime();
  });

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranch(branch);
    setModalType('view');
    setPopoverOpen(null);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setModalType('edit');
    setPopoverOpen(null);
  };

  const handleStatusChange = (branch: Branch) => {
    setSelectedBranch(branch);
    setModalType('status');
    setPopoverOpen(null);
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setModalType('delete');
    setPopoverOpen(null);
  };

  const confirmStatusChange = () => {
    if (selectedBranch) {
      let newStatus: "active" | "inactive" | "under-construction";
      if (selectedBranch.status === 'active') {
        newStatus = 'inactive';
      } else if (selectedBranch.status === 'inactive') {
        newStatus = 'under-construction';
      } else {
        newStatus = 'active';
      }
      onBranchStatusChange(selectedBranch.id, newStatus);
      setModalType(null);
    }
  };

  const confirmDeletion = () => {
    if (selectedBranch) {
      onBranchDelete(selectedBranch.id);
      setModalType(null);
    }
  };

  const handleSaveChanges = (updatedBranch: Branch) => {
    onBranchUpdate(updatedBranch);
    setModalType(null);
  };

  const getStatusColor = (status: Branch["status"]): string => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'under-construction': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryColor = (country: string): string => {
    switch (country) {
      case "USA": return "text-red-600";
      case "UK": return "text-blue-600";
      case "Canada": return "text-emerald-600";
      case "Australia": return "text-amber-600";
      case "Germany": return "text-indigo-600";
      default: return "text-gray-600";
    }
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
            <thead className="bg-gray-50">
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Branch
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Opened
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </motion.tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBranches.map((branch, index) => (
                <motion.tr 
                  key={branch.id}
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
                        <Building className="text-emerald-600 h-5 w-5" />
                      </motion.div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                          {branch.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">
                          ID: {branch.branchId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                      {branch.status === "active" ? "Active" : 
                       branch.status === "inactive" ? "Inactive" : "Under Construction"}
                    </span>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${getCountryColor(branch.country)}`}>
                    <div className="flex items-center">
                      <MapPin className="text-gray-400 mr-2 h-4 w-4" />
                      <span className="truncate max-w-[120px]">{branch.city}, {branch.country}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2 h-4 w-4" />
                      <span>{branch.openingDate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popover open={popoverOpen === branch.id} onOpenChange={(open) => setPopoverOpen(open ? branch.id : null)}>
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
                            onClick={() => handleViewDetails(branch)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleEdit(branch)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleStatusChange(branch)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                          >
                            Change Status
                          </button>
                          <button 
                            onClick={() => handleDelete(branch)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Delete
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
                <span className="font-medium">{totalItems}</span> branches
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

      {/* Enhanced Branch Details Modal */}
      {selectedBranch && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white/90 z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedBranch.name}</h2>
                <p className="text-gray-600">{selectedBranch.type} • {selectedBranch.city}, {selectedBranch.country}</p>
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
                    Branch Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>{selectedBranch.address}, {selectedBranch.city}, {selectedBranch.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{selectedBranch.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{selectedBranch.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="text-gray-500 mr-3 mt-1" size={16} />
                      <div>
                        <p className="text-sm text-gray-500">Manager</p>
                        <p>{selectedBranch.manager}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Branch ID</p>
                      <p className="font-medium">{selectedBranch.branchId}</p>
                    </div>
                  </div>
                </div>

                {/* Operating Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 text-blue-500" size={20} />
                    Operating Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Opening Date</p>
                      <p>{selectedBranch.openingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Operating Hours</p>
                      <p>{selectedBranch.operatingHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Employees</p>
                      <p>{selectedBranch.totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Facilities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedBranch.facilities.map((facility, index) => (
                          <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="mr-2 text-green-500" size={20} />
                    Financial Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Annual Revenue</p>
                      <p className="text-lg font-medium">
                        {selectedBranch.currency} {selectedBranch.annualRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tax ID</p>
                      <p>{selectedBranch.taxId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Accounts</p>
                      <div className="mt-2 space-y-2">
                        {selectedBranch.bankAccounts.map((account, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                            <p className="font-medium">{account.bankName}</p>
                            <p className="text-gray-500">••••{account.accountNumber.slice(-4)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Layers className="mr-2 text-purple-500" size={20} />
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranch.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart2 className="mr-2 text-amber-500" size={20} />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer Satisfaction</p>
                      <div className="flex items-center">
                        <span className="px-2 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          {selectedBranch.customerSatisfaction}/10
                        </span>
                        <div className="ml-2 flex">
                          {[...Array(10)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={`${i < Math.floor(selectedBranch.customerSatisfaction) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Audit Date</p>
                      <p>{selectedBranch.lastAuditDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Audit Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div 
                          className="h-2.5 rounded-full bg-emerald-500" 
                          style={{ width: `${selectedBranch.auditScore}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm mt-1">{selectedBranch.auditScore}%</p>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="mr-2 text-blue-500" size={20} />
                    Key Performance Indicators
                  </h3>
                  <div className="space-y-3">
                    {selectedBranch.keyPerformanceIndicators.slice(0, 3).map((kpi, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{kpi.name}</span>
                          <span className="text-emerald-600">{kpi.actual}/{kpi.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="h-1.5 rounded-full bg-emerald-500" 
                            style={{ width: `${(parseFloat(kpi.actual) / parseFloat(kpi.target)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
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
      {selectedBranch && modalType === 'edit' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Edit Branch Details</h2>
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
                onClick={() => handleSaveChanges(selectedBranch)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {selectedBranch && modalType === 'status' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Status Change</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change {selectedBranch.name}'s status to{' '}
                {selectedBranch.status === 'active' ? 'Inactive' : 
                 selectedBranch.status === 'inactive' ? 'Under Construction' : 'Active'}?
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedBranch && modalType === 'delete' && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedBranch.name} branch? This action cannot be undone.
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

export default BranchTable;