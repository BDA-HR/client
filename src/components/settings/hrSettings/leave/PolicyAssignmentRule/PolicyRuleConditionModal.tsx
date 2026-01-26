import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Plus, Edit, Trash2 } from "lucide-react";
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
  const [editingCondition, setEditingCondition] =
    useState<PolicyRuleCondListDto | null>(null);
  const [deletingCondition, setDeletingCondition] =
    useState<PolicyRuleCondListDto | null>(null);
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
        return Object.entries(EmpNature).map(([key, value]) => ({
          key,
          value,
        }));
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

    if (formData.field === "3") {
      // Service Year - input field
      return (
        <Input
          name="value"
          type="number"
          value={formData.value}
          onChange={handleInputChange}
          placeholder="Enter service years"
          className="w-full h-9 text-sm"
          min="0"
        />
      );
    }

    if (valueOptions.length > 0) {
      // Dropdown for other fields
      return (
        <Select
          value={formData.value}
          onValueChange={(value) => handleSelectChange("value", value)}
        >
          <SelectTrigger className="w-full h-9 text-sm">
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
        className="w-full h-9 text-sm"
      />
    );
  };

  const fieldOptions = Object.entries(ConditionField).map(([key, value]) => ({
    key,
    value,
  }));

  const operatorOptions = Object.entries(ConditionOperator).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

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
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Rule Conditions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure conditions for "{ruleName}"
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - 25% Form / 75% Table Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Form (25%) */}
          <div className="w-2/5 border-r border-gray-200 p-4 bg-white">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Plus size={16} className="text-green-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  {editingCondition ? "Edit" : "Add"} Condition
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                {/* Field */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Field <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.field}
                    onValueChange={(value) =>
                      handleSelectChange("field", value)
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
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
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Operator <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.operator}
                    onValueChange={(value) =>
                      handleSelectChange("operator", value)
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
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
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Value <span className="text-red-500">*</span>
                  </Label>
                  {renderValueInput()}
                </div>
              </div>

              {/* Form Actions */}
              <div className="space-y-2 ">
                <Button
                  onClick={handleSaveCondition}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-sm"
                  disabled={
                    !formData.field || !formData.operator || !formData.value
                  }
                >
                  {editingCondition ? "Update" : "Add"}
                </Button>
                {editingCondition && (
                  <Button
                    onClick={handleCancelCondition}
                    variant="outline"
                    className="w-full h-9 text-sm"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Table (75%) */}
          <div className="w-3/5 flex flex-col bg-white">
            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              <div className="rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Operator
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {conditions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Plus size={20} className="text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium mb-1">
                                No conditions configured
                              </p>
                              <p className="text-gray-400 text-sm">
                                Add your first condition using the form
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        conditions.map((condition, index) => (
                          <motion.tr
                            key={condition.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* Index */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {index + 1}
                              </div>
                            </td>

                            {/* Field */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {condition.fieldStr}
                              </div>
                            </td>

                            {/* Operator */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {condition.operatorStr}
                              </div>
                            </td>

                            {/* Value */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {getDisplayValue(
                                  condition.field,
                                  condition.value,
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleEditCondition(condition)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit condition"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCondition(condition)
                                  }
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete condition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-white">
          <div className="flex justify-end">
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-6 py-2"
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
