import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Eye,
  PenBox,
  Key,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/popover';
import type { 
  PerApiListDto,
  PerApiModDto 
} from '../../../../types/core/Settings/api-permission';

interface ApiPermissionTableProps {
  permissions: PerApiListDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEditPermission: (permission: PerApiModDto) => void;
  onPermissionDelete: (id: string) => void;
}

const ApiPermissionTable: React.FC<ApiPermissionTableProps> = ({
  permissions,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEditPermission,
  onPermissionDelete,
}) => {
  const [selectedPermission, setSelectedPermission] = useState<PerApiListDto | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | 'delete' | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const handleViewDetails = (permission: PerApiListDto) => {
    setSelectedPermission(permission);
    setActiveModal('view');
    setPopoverOpen(null);
  };

  const handleEdit = (permission: PerApiListDto) => {
    // Call the parent's edit handler
    const editData: PerApiModDto = {
      perMenuId: permission.perMenuId,
      id: permission.id,
      key: permission.key,
      desc: permission.name // Assuming name is the description
    };
    onEditPermission(editData);
    setPopoverOpen(null);
  };

  const handleDelete = (permission: PerApiListDto) => {
    setSelectedPermission(permission);
    setActiveModal('delete');
    setPopoverOpen(null);
  };

  const handleConfirmDelete = (permissionId: string) => {
    onPermissionDelete(permissionId);
    setActiveModal(null);
    setSelectedPermission(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedPermission(null);
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

  // View Modal Component
  const ViewPermissionModal: React.FC<{
    selectedPermission: PerApiListDto | null;
    onClose: () => void;
  }> = ({ selectedPermission, onClose }) => {
    if (!selectedPermission) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
          </div>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Key className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    API Permission Details
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Key</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {selectedPermission.key}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {selectedPermission.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Menu</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {selectedPermission.perMenu}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Menu ID</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded truncate">
                        {selectedPermission.perMenuId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Modal Component
  const DeletePermissionModal: React.FC<{
    permission: PerApiListDto | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string) => void;
  }> = ({ permission, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !permission) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete API Permission
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the API permission <span className="font-semibold">{permission.name}</span>?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => onConfirm(permission.id)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate showing range for pagination
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  API Key
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Menu
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No API permissions found
                  </td>
                </tr>
              ) : (
                permissions.map((permission, index) => (
                  <motion.tr 
                    key={permission.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <motion.div 
                          whileHover={{ rotate: 10 }}
                          className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                        >
                          <Key className="h-5 w-5 text-emerald-600" />
                        </motion.div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {permission.key}
                          </div>
                          <div className="text-xs text-gray-500">
                            {/* UUID hidden - no ID displayed */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span>{permission.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          {permission.perMenu}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Popover open={popoverOpen === permission.id} onOpenChange={(open) => setPopoverOpen(open ? permission.id : null)}>
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
                              onClick={() => handleViewDetails(permission)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button 
                              onClick={() => handleEdit(permission)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                            >
                              <PenBox size={16} />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(permission)}
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

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
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
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> API permissions
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

      {/* View Details Modal */}
      {activeModal === 'view' && (
        <ViewPermissionModal
          selectedPermission={selectedPermission}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Modal */}
      {activeModal === 'delete' && (
        <DeletePermissionModal
          permission={selectedPermission}
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ApiPermissionTable;