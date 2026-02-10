import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Edit, Trash2, List, AlertTriangle } from "lucide-react";
import { Button } from "../../../../../ui/button";
import { Badge } from "../../../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../ui/avatar";
import toast from "react-hot-toast";
import type {
  LeaveAppStepListDto,
  LeaveAppStepModDto,
  UUID,
} from "../../../../../../types/core/Settings/leaveAppStep";
import { ApprovalRole } from "../../../../../../types/core/enum";
import type { NameListDto } from "../../../../../../types/hr/NameListDto";
import EditLeaveAppStepModal from "./EditLeaveAppStepModal";

interface LeaveAppStepListModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: LeaveAppStepListDto[];
  onUpdateStep: (stepData: LeaveAppStepModDto) => Promise<any>;
  onDeleteStep: (stepId: UUID) => Promise<any>;
  employees: NameListDto[];
  loading: boolean;
}

const LeaveAppStepListModal: React.FC<LeaveAppStepListModalProps> = ({
  isOpen,
  onClose,
  steps,
  onUpdateStep,
  onDeleteStep,
  employees,
  loading,
}) => {
  const [editingStep, setEditingStep] = useState<LeaveAppStepListDto | null>(null);
  const [deletingStepId, setDeletingStepId] = useState<UUID | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getRoleColor = (role: ApprovalRole) => {
    switch (role) {
      case ApprovalRole["0"]:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case ApprovalRole["1"]:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border-purple-200 dark:border-purple-800";
      case ApprovalRole["2"]: 
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
    }
  };

  const handleEdit = (step: LeaveAppStepListDto) => {
    setEditingStep(step);
  };

  const handleDelete = (stepId: UUID) => {
    setDeletingStepId(stepId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingStepId) return;
    
    try {
      await onDeleteStep(deletingStepId);
      toast.success("Approval step deleted successfully");
      setShowDeleteConfirm(false);
      setDeletingStepId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete approval step");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingStepId(null);
  };

  const handleUpdateStep = async (stepData: LeaveAppStepModDto) => {
    try {
      await onUpdateStep(stepData);
      toast.success("Approval step updated successfully");
      setEditingStep(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update approval step");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-3">
            <div className="flex items-center gap-2">
              <List size={18} className="text-green-500" />
              <h2 className="text-lg font-semibold">Manage Steps</h2>
              <Badge variant="outline" className="ml-2 text-xs">
                {steps.length}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto max-h-[65vh]">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : steps.length === 0 ? (
              <div className="text-center py-8">
                <List className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No approval steps found</p>
                <p className="text-gray-400 text-sm">Add steps to create a workflow</p>
              </div>
            ) : (
              <div className="space-y-2">
                {steps
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((step, index) => (
                    <div
                      key={step.id}
                      className={`group relative bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 ${
                        index !== steps.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Step Order Badge - More subtle */}
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-medium text-sm border border-green-200">
                          {step.stepOrder}
                        </div>

                        {/* Employee Avatar - Smaller */}
                        <Avatar className="h-8 w-8 border border-gray-200">
                          <AvatarImage
                            src="https://i.pravatar.cc/150?u=john.manager@company.com"
                            alt={step.employee ?? "Unassigned"}
                          />
                          <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                            {step.employee
                              ? step.employee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "UN"}
                          </AvatarFallback>
                        </Avatar>

                        {/* Step Details - More compact */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {step.stepName}
                            </h3>
                            {step.isFinal && (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs px-1.5 py-0.5">
                                Final
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="truncate">
                              {step.employee || "Unassigned"}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0.5 ${getRoleColor(
                                ApprovalRole[step.role as keyof typeof ApprovalRole]
                              )}`}
                            >
                              {ApprovalRole[step.role as keyof typeof ApprovalRole]}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons - Always visible */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(step)}
                            className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-700"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(step.id)}
                            className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 text-gray-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 bg-gray-50">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 text-sm"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg"
          >
            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <div className="py-2 sm:py-4 text-center">
                <div className="flex items-center justify-center p-2 sm:p-3 rounded-full gap-2 text-red-600 mx-auto">
                  <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12" />
                </div>

                <p className="text-base sm:text-lg font-medium text-red-600 mt-3 sm:mt-4">
                  Are you sure you want to delete this approval step?
                </p>
                <p className="text-xs sm:text-sm text-red-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 sm:px-6 sm:py-4">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-1.5">
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="w-full sm:w-auto cursor-pointer px-4 sm:px-6"
                >
                  Yes, Delete!
                </Button>
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
                >
                  No, Keep It.
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStep && (
        <EditLeaveAppStepModal
          isOpen={!!editingStep}
          onClose={() => setEditingStep(null)}
          onUpdateStep={handleUpdateStep}
          step={editingStep}
          employees={employees}
        />
      )}
    </>
  );
};

export default LeaveAppStepListModal;