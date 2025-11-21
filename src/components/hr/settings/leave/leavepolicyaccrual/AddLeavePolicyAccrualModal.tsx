import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';

interface AddLeavePolicyAccrualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accrualData: any) => void;
  policyId: string;
  policyName: string;
}

const AddLeavePolicyAccrualModal: React.FC<AddLeavePolicyAccrualModalProps> = ({
  isOpen,
  onClose,
  onSave,
  policyId,
  policyName
}) => {
  const [formData, setFormData] = useState({
    entitlement: '',
    frequency: '',
    accrualRate: '',
    minServiceMonths: '',
    maxCarryoverDays: '',
    carryoverExpiryDays: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      leavePolicyId: policyId
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Accrual Rule
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Policy: <span className="font-medium">{policyName}</span></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="entitlement">Annual Entitlement (days)</Label>
                  <Input
                    id="entitlement"
                    type="number"
                    step="0.5"
                    value={formData.entitlement}
                    onChange={(e) => handleChange('entitlement', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Accrual Frequency</Label>
                  <Select onValueChange={(value) => handleChange('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accrualRate">Accrual Rate (days per period)</Label>
                  <Input
                    id="accrualRate"
                    type="number"
                    step="0.01"
                    value={formData.accrualRate}
                    onChange={(e) => handleChange('accrualRate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minServiceMonths">Minimum Service Months</Label>
                  <Input
                    id="minServiceMonths"
                    type="number"
                    value={formData.minServiceMonths}
                    onChange={(e) => handleChange('minServiceMonths', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxCarryoverDays">Maximum Carryover Days</Label>
                  <Input
                    id="maxCarryoverDays"
                    type="number"
                    step="0.5"
                    value={formData.maxCarryoverDays}
                    onChange={(e) => handleChange('maxCarryoverDays', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="carryoverExpiryDays">Carryover Expiry (days)</Label>
                  <Input
                    id="carryoverExpiryDays"
                    type="number"
                    value={formData.carryoverExpiryDays}
                    onChange={(e) => handleChange('carryoverExpiryDays', e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Accrual Rule
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddLeavePolicyAccrualModal;