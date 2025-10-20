import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import type { BenefitSetAddDto } from "../../../../types/hr/benefit";

interface AddBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBenefit: (benefit: BenefitSetAddDto) => void;
}

const AddBenefitModal: React.FC<AddBenefitModalProps> = ({
  isOpen,
  onClose,
  onAddBenefit,
}) => {
  const [formData, setFormData] = useState<BenefitSetAddDto>({
    name: "",
    benefitValue: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "benefitValue" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || formData.benefitValue <= 0) return;

    onAddBenefit(formData);

    // Reset form
    setFormData({
      name: "",
      benefitValue: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-bold text-gray-800">Add New</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Benefit Set Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Eg. Health Insurance, Transport Allowance"
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Benefit Value */}
            <div className="space-y-2">
              <Label htmlFor="benefitValue" className="text-sm text-gray-500">
                Value (Amount) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="benefitValue"
                name="benefitValue"
                type="number"
                value={formData.benefitValue || ""}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || formData.benefitValue <= 0}
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddBenefitModal;
