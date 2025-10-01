import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Building,
  MoreVertical,
  X,
  Eye,
  Trash2,
  PenBox,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import type { BranchListDto, UUID } from '../../../types/core/branch';
import type { EditBranchDto } from '../../../types/core/branch';
import { EditBranchModal } from './EditBranchModal';
import DeleteBranchModal from './DeleteBranchModal';
import StatBranchModal from './StatBranchModal';

interface BranchTableProps {
  branches: BranchListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onBranchUpdate: (branch: BranchListDto) => void;
  onBranchStatusChange: (id: UUID, status: string) => void;
  onBranchDelete: (id: string) => void;
}

const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onBranchUpdate,
  onBranchStatusChange,
  onBranchDelete
}) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchListDto | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);

  const sortedBranches = [...branches].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleViewDetails = (branch: BranchListDto) => {
    setSelectedBranch(branch);
    setModalType('view');
    setPopoverOpen(null);
  };

  const handleEdit = (branch: BranchListDto) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
    setPopoverOpen(null);
  };

  const handleDelete = (branch: BranchListDto) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
    setPopoverOpen(null);
  };

  const confirmStatusChange = (branchId: UUID, newStatus: string) => {
    onBranchStatusChange(branchId, newStatus);
    setIsStatModalOpen(false);
  };

  const confirmDeletion = (branchId: UUID) => {
    onBranchDelete(branchId);
    setIsDeleteModalOpen(false);
  };

  const handleSaveChanges = (updatedData: EditBranchDto) => {
    const updatedBranch: BranchListDto = {
      ...selectedBranch!,
      ...updatedData,
      comp: selectedBranch!.comp,
      compAm: selectedBranch!.compAm,
      dateOpenedAm: selectedBranch!.dateOpenedAm,
      isDeleted: selectedBranch!.isDeleted,
      createdAt: selectedBranch!.createdAt,
    };

    onBranchUpdate(updatedBranch);
    setIsEditModalOpen(false);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'UNDER_CONSTRUCTION': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case '0': return 'Active';
      case '1': return 'Inactive';
      case '2': return 'Under Construction';
      default: return status;
    }
  };

  const getBranchTypeText = (branchType: string): string => {
    // Convert the key to the display value
    switch (branchType) {
      case '0': return 'Head Office';
      case '1': return 'Regional';
      case '2': return 'Local';
      case '3': return 'Virtual';
      default: return branchType;
    }
  };

  const getBranchTypeColor = (branchType: string): string => {
    switch (branchType) {
      case '0': return 'bg-purple-100 text-purple-800'; // Head Office
      case '1': return 'bg-blue-100 text-blue-800';    // Regional
      case '2': return 'bg-green-100 text-green-800';  // Local
      case '3': return 'bg-orange-100 text-orange-800'; // Virtual
      default: return 'bg-gray-100 text-gray-800';
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
            <thead className="bg-white">
              <motion.tr 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Branch
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Code
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
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
                          {branch.nameAm}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    <span className='truncate max-w-[120px]'>
                      {branch.code}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBranchTypeColor(branch.branchType)}`}>
                      {getBranchTypeText(branch.branchType)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(branch.branchStat)}`}>
                      {getStatusText(branch.branchStat)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell text-gray-600">
                    <div className="flex items-center">
                      <span className="truncate max-w-[120px]">{branch.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div className="flex items-center">
                      <span>{branch.dateOpened}</span>
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
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button 
                            onClick={() => handleEdit(branch)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit
                          </button>

                          <button 
                            onClick={() => handleDelete(branch)}
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

      {/* Edit Modal */}
      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveChanges}
        branch={selectedBranch}
      />

      {/* Status Change Modal */}
      <StatBranchModal
        branch={selectedBranch}
        isOpen={isStatModalOpen}
        onClose={() => setIsStatModalOpen(false)}
        onConfirm={confirmStatusChange}
      />

      {/* Delete Modal */}
      <DeleteBranchModal
        branch={selectedBranch}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletion}
      />

      {/* View Details Modal */}
      {selectedBranch && modalType === 'view' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
              <div className='flex gap-2'>
                <Eye size={18} />
                <h2 className="text-2xl font-bold">Details</h2>
              </div>
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedBranch(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Branch Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">English Name</p>
                    <p className="font-medium">{selectedBranch.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amharic Name</p>
                    <p className="font-medium">{selectedBranch.nameAm}</p>
                  </div>
                                    <div>
                    <p className="text-sm text-gray-500">Branch Code</p>
                    <p className="font-medium">{selectedBranch.code}</p>
                  </div>
                                                      <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedBranch.location}</p>
                  </div>
                                      <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{selectedBranch.comp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company (Amharic)</p>
                      <p className="font-medium">{selectedBranch.compAm}</p>
                    </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedBranch.branchStat)}`}>
                      {selectedBranch.branchStat}
                    </span>
                  </div>
                                    <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedBranch.branchType)}`}>
                      {selectedBranch.branchType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full flex justify-between flex-wrap'>
              <div>
                <h2>Created at:</h2>
                <p>{selectedBranch.createdAt}</p>
              </div>
              <div>
                <h2>Modified at:</h2>
                <p>{selectedBranch.modifiedAt}</p>
              </div>
            </div>

            <div className="border-t p-4 flex justify-center">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedBranch(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 w-full"
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

export default BranchTable;