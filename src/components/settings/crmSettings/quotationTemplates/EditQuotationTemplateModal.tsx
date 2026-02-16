import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Textarea } from "../../../ui/textarea";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { QuotationTemplate } from "./QuotationTemplatesSection";

interface EditQuotationTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<QuotationTemplate, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => void;
  template: QuotationTemplate | null;
}

const EditQuotationTemplateModal: React.FC<EditQuotationTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  template
}) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    termsAndConditions: "",
    validityDays: 30,
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        title: template.title,
        description: template.description,
        termsAndConditions: template.termsAndConditions,
        validityDays: template.validityDays,
        is_active: template.is_active
      });
      setError(null);
    }
  }, [template]);

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a template name");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a quotation title");
      return;
    }

    if (!formData.termsAndConditions.trim()) {
      setError("Please enter terms and conditions");
      return;
    }

    if (formData.validityDays <= 0) {
      setError("Validity days must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError("Failed to update quotation template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quotation Template</DialogTitle>
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
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Standard Quotation, Premium Package"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-500">
              Quotation Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Professional Services Quotation"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-500">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this quotation template"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termsAndConditions" className="text-sm text-gray-500">
              Terms and Conditions <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={(e) => setFormData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
              placeholder="Enter standard terms and conditions for this quotation"
              rows={6}
              required
              disabled={isSubmitting}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validityDays" className="text-sm text-gray-500">
              Validity Period (Days) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="validityDays"
              type="number"
              value={formData.validityDays}
              onChange={(e) => setFormData(prev => ({ ...prev, validityDays: Number(e.target.value) }))}
              placeholder="e.g., 30"
              min="1"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Number of days this quotation remains valid
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
                  Updating...
                </>
              ) : (
                "Update"
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

export default EditQuotationTemplateModal;
