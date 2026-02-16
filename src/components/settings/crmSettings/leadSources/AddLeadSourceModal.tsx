import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { LeadSource } from "./LeadSourcesSection";

interface AddLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<LeadSource, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => void;
}

const AddLeadSourceModal: React.FC<AddLeadSourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: "",
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
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
      setError("Please enter a lead source name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      setError("Failed to add lead source. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Lead Source</DialogTitle>
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
              Source Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Website, Referral, Social Media"
              required
              disabled={isSubmitting}
            />
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

export default AddLeadSourceModal;
