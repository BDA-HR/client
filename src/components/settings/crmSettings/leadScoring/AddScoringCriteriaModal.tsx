import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { LeadScoringCriteria } from "./LeadScoringSection";

interface AddScoringCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<LeadScoringCriteria, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => void;
  currentTotalPercentage: number;
}

const AddScoringCriteriaModal: React.FC<AddScoringCriteriaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentTotalPercentage
}) => {
  const [formData, setFormData] = useState({
    name: "",
    maxPoints: 0,
    percentage: 0,
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      maxPoints: 0,
      percentage: 0,
      is_active: true
    });
    setError(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a criteria name");
      return;
    }

    if (formData.maxPoints <= 0) {
      setError("Max points must be greater than 0");
      return;
    }

    if (formData.percentage <= 0 || formData.percentage > 100) {
      setError("Percentage must be between 1 and 100");
      return;
    }

    const totalPercentage = currentTotalPercentage + formData.percentage;
    if (totalPercentage > 100) {
      setError(`Total percentage would be ${totalPercentage}%. Cannot exceed 100%`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      onSubmit(formData);
      resetForm();
    } catch (error) {
      setError("Failed to add criteria. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Scoring Criteria</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="h-auto p-0 text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-500">
              Criteria Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Interest Level, Budget, Authority"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPoints" className="text-sm text-gray-500">
                Max Points <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxPoints"
                type="number"
                value={formData.maxPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: Number(e.target.value) }))}
                placeholder="e.g., 20"
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage" className="text-sm text-gray-500">
                Weight (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                placeholder="e.g., 25"
                min="0.01"
                max="100"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600">
              Current total: <span className="font-semibold">{currentTotalPercentage}%</span>
              {formData.percentage > 0 && (
                <> → New total: <span className="font-semibold">{currentTotalPercentage + formData.percentage}%</span></>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
              disabled={isSubmitting}
            />
            <Label htmlFor="is_active" className="text-sm text-gray-500">Active</Label>
          </div>

          <div className="flex justify-center items-center gap-1.5 pt-4">
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScoringCriteriaModal;
