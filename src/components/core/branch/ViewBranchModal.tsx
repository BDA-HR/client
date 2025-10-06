import React from "react";
import { motion } from "framer-motion";
import { X, Eye } from "lucide-react";
import type { BranchListDto } from "../../../types/core/branch";

interface ViewBranchModalProps {
  selectedBranch: BranchListDto | null;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getBranchTypeText: (branchType: string) => string;
}

const ViewBranchModal: React.FC<ViewBranchModalProps> = ({
  selectedBranch,
  onClose,
  getStatusColor,
  getStatusText,
  getBranchTypeText,
}) => {
  if (!selectedBranch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Name Section - Combined English and Amharic */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Name</p>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedBranch.name}
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedBranch.nameAm}
                  </p>
                </div>
              </div>

              {/* Company Section - Combined English and Amharic */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Company</p>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedBranch.comp}
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedBranch.compAm}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Branch Code</p>
                <p className="font-medium">{selectedBranch.code}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedBranch.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    selectedBranch.branchStat
                  )}`}
                >
                  {getStatusText(selectedBranch.branchStat)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-900">
                  {getBranchTypeText(selectedBranch.branchType)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date Opened</p>
                <p className="font-medium">{selectedBranch.openDateStr}</p>
                <p className="font-medium">{selectedBranch.openDateStrAm}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Created At:<span> {selectedBranch.createdAt} / <span>{selectedBranch.createdAtAm}</span></span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Modified At: <span>{selectedBranch.modifiedAt} / <span>{selectedBranch.modifiedAtAm}</span></span>
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="border-t p-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewBranchModal;
