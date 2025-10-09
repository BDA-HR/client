import React from "react";
import { motion } from "framer-motion";
import { X, Eye } from "lucide-react";
import type { DeptListDto } from "../../../types/core/dept";

interface ViewDeptModalProps {
  selectedDepartment: DeptListDto | null;
  onClose: () => void;
  getStatusColor: (status: string) => string;
}

const ViewDeptModal: React.FC<ViewDeptModalProps> = ({
  selectedDepartment,
  onClose,
  getStatusColor,
}) => {
  if (!selectedDepartment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Eye size={20} />
            <h2 className="text-lg font-bold text-gray-800">Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Department Name Section */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Department Name</p>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {selectedDepartment.name}
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedDepartment.nameAm}
                  </p>
                </div>
              </div>

              {/* Branch Information */}
              <div>
                <p className="text-sm text-gray-500 mb-2 flex gap-1 items-center">  Branch</p>
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {selectedDepartment.branch}
                    </p>
                    {selectedDepartment.branchAm && (
                      <p className="font-medium text-gray-900">
                        {selectedDepartment.branchAm}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    selectedDepartment.deptStat
                  )}`}
                >
                  {selectedDepartment.deptStatStr}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
        </div>

        {/* Footer with Timestamps (if available in your DeptListDto) */}
        <div className="border-t px-6 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Created At: <span>{selectedDepartment.createdAt} / <span>{selectedDepartment.createdAtAm}</span></span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Modified At: <span>{selectedDepartment.modifiedAt} / <span>{selectedDepartment.modifiedAtAm}</span></span>
              </p>
            </div>
          </div>
        </div>
       

        {/* Close Button */}
        <div className="border-t p-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDeptModal;