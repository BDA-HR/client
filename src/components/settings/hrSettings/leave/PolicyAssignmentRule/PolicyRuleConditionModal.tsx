import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Settings, Edit, Trash2 } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import type {
  PolicyRuleCondListDto,
  PolicyRuleCondAddDto,
  PolicyRuleCondModDto,
  UUID,
} from "../../../../../types/core/Settings/PolicyRuleCondtion";
import {
  ConditionField,
  ConditionOperator,
} from "../../../../../types/core/enum";
import {
  EmpType,
  EmpNature,
  Gender,
  YesNo,
} from "../../../../../types/hr/enum";
import {
  useAllPolicyRuleConditions,
  useCreatePolicyRuleCondition,
  useUpdatePolicyRuleCondition,
  useDeletePolicyRuleCondition,
} from "../../../../../services/core/settings/ModHrm/PolicyRuleCondition/policyRuleCondition.queries";
import DeletePolicyRuleConditionModal from "./DeletePolicyRuleConditionModal";

interface PolicyRuleConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: UUID;
  ruleName: string;
}

interface ConditionFormData {
  field: string;
  operator: string;
  value: string;
}

const PolicyRuleConditionModal: React.FC<PolicyRuleConditionModalProps> = ({
  isOpen,
  onClose,
  ruleId,
  ruleName,
}) => {
  const [editingCondition, setEditingCondition] = useState<PolicyRuleCondListDto | null>(null);
  const [deletingCondition, setDeletingCondition] = useState<PolicyRuleCondListDto | null>(null);
  const [formData, setFormData] = useState<ConditionFormData>({
    field: "",
    operator: "",
    value: "",
  });

  // React Query hooks
  const { data: conditions = [], refetch } = useAllPolicyRuleConditions(ruleId);
  const createMutation = useCreatePolicyRuleCondition();
  const updateMutation = useUpdatePolicyRuleCondition();
  const deleteMutation = useDeletePolicyRuleCondition();

  const handleClose = useCallback(() => {
    setEditingCondition(null);
    setDeletingCondition(null);
    setFormData({ field: "", operator: "", value: "" });
    onClose();
  }, [onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      refetch();
    } else {
      setEditingCondition(null);
      setDeletingCondition(null);
      setFormData({ field: "", operator: "", value: "" });
    }
  }, [isOpen, refetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset value when field changes
      ...(name === "field" && { value: "" }),
    }));
  };

  const handleAddCondition = () => {
    setEditingCondition(null);
    setFormData({ field: "", operator: "", value: "" });
  };

  const handleEditCondition = (condition: PolicyRuleCondListDto) => {
    setEditingCondition(condition);
    setFormData({
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
    });
  };

  const handleDeleteCondition = (condition: PolicyRuleCondListDto) => {
    setDeletingCondition(condition);
  };

  const handleConfirmDelete = async (conditionId: UUID) => {
    try {
      await deleteMutation.mutateAsync(conditionId);
      refetch();
      setDeletingCondition(null);
    } catch (error) {
      console.error("Failed to delete condition:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeletingCondition(null);
  };

  const handleSaveCondition = async () => {
    if (!formData.field || !formData.operator || !formData.value) {
      return;
    }

    try {
      if (editingCondition) {
        const modData: PolicyRuleCondModDto = {
          id: editingCondition.id,
          field: formData.field,
          operator: formData.operator,
          value: formData.value,
          rowVersion: editingCondition.rowVersion,
        };
        await updateMutation.mutateAsync(modData);
      } else {
        const addData: PolicyRuleCondAddDto = {
          field: formData.field,
          operator: formData.operator,
          value: formData.value,
          policyAssRuleId: ruleId,
        };
        await createMutation.mutateAsync(addData);
      }

      setEditingCondition(null);
      setFormData({ field: "", operator: "", value: "" });
      refetch();
    } catch (error) {
      console.error("Failed to save condition:", error);
    }
  };

  const handleCancelCondition = () => {
    setEditingCondition(null);
    setFormData({ field: "", operator: "", value: "" });
  };

  const getValueOptions = (field: string) => {
    switch (field) {
      case "0": // Employment Type
        return Object.entries(EmpType).map(([key, value]) => ({ key, value }));
      case "1": // Employment Nature
        return Object.entries(EmpNature).map(([key, value]) => ({ key, value }));
      case "2": // Gender
        return Object.entries(Gender).map(([key, value]) => ({ key, value }));
      case "4": // Disability Status
        return Object.entries(YesNo).map(([key, value]) => ({ key, value }));
      default:
        return [];
    }
  };

  const getDisplayValue = (field: string, value: string) => {
    switch (field) {
      case "0": // Employment Type
        return EmpType[value as keyof typeof EmpType] || value;
      case "1": // Employment Nature
        return EmpNature[value as keyof typeof EmpNature] || value;
      case "2": // Gender
        return Gender[value as keyof typeof Gender] || value;
      case "4": // Disability Status
        return YesNo[value as keyof typeof YesNo] || value;
      case "3": // Service Year
        return `${value} years`;
      default:
        return value;
    }
  };

  const renderValueInput = () => {
    const valueOptions = getValueOptions(formData.field);
    
    if (formData.field === "3") { // Service Year - input field
      return (
        <Input
          name="value"
          type="number"
          value={formData.value}
          onChange={handleInputChange}
          placeholder="Enter service years"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 transition-colors"
          min="0"
        />
      );
    }

    if (valueOptions.length > 0) { // Dropdown for other fields
      return (
        <Select
          value={formData.value}
          onValueChange={(value) => handleSelectChange("value", value)}
        >
          <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900 hover:border-gray-400 transition-colors">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {valueOptions.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        name="value"
        value={formData.value}
        onChange={handleInputChange}
        placeholder="Enter value"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-gray-400 transition-colors"
      />
    );
  };

  const fieldOptions = Object.entries(ConditionField).map(([key, value]) => ({
    key,
    value,
  }));

  const operatorOptions = Object.entries(ConditionOperator).map(([key, value]) => ({
    key,
    value,
  }));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[90vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Rule Conditions
              </h2>
              <p className="text-sm text-gray-600">
                Configure conditions for "{ruleName}"
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Add/Edit Condition Form - Always Visible */}
            <div className="mb-6 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingCondition ? "Edit Condition" : "Add New Condition"}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Field */}
                <div className="space-y-2">
                  <Label className="block text-sm font-semibold text-gray-700">
                    Field <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.field}
                    onValueChange={(value) => handleSelectChange("field", value)}
                  >
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900 hover:border-gray-400 transition-colors">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((option) => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator */}
                <div className="space-y-2">
                  <Label className="block text-sm font-semibold text-gray-700">
                    Operator <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.operator}
                    onValueChange={(value) => handleSelectChange("operator", value)}
                  >
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white text-gray-900 hover:border-gray-400 transition-colors">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorOptions.map((option) => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <Label className="block text-sm font-semibold text-gray-700">
                    Value <span className="text-red-500">*</span>
                  </Label>
                  {renderValueInput()}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveCondition}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                  disabled={!formData.field || !formData.operator || !formData.value}
                >
                  {editingCondition ? "Update Condition" : "Add Condition"}
                </Button>
                {editingCondition && (
                  <Button
                    onClick={handleCancelCondition}
                    variant="outline"
                    className="px-6 py-2 rounded-lg font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                )}
                {!editingCondition && (formData.field || formData.operator || formData.value) && (
                  <Button
                    onClick={handleAddCondition}
                    variant="outline"
                    className="px-6 py-2 rounded-lg font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </Button>
                )}
              </div>
            </div>

            {/* Conditions List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Configured Conditions
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {conditions.length}
                    </span>
                  </div>
                </div>
              </div>
              
              {conditions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-2">No conditions configured</p>
                  <p className="text-gray-400 text-sm">Add your first condition using the form above</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={condition.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-900">
                                {condition.fieldStr}
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                {condition.operatorStr}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                {getDisplayValue(condition.field, condition.value)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCondition(condition)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-150"
                            title="Edit condition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCondition(condition)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete condition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {conditions.length > 0 && (
                <span>
                  Total conditions: <span className="font-semibold text-gray-800">{conditions.length}</span>
                </span>
              )}
            </div>
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-6 py-2 rounded-lg font-medium border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Delete Condition Modal */}
        <DeletePolicyRuleConditionModal
          condition={deletingCondition}
          isOpen={!!deletingCondition}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </motion.div>
    </div>
  );
};

export default PolicyRuleConditionModal;