import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Textarea } from "../../../ui/textarea";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { SMSTemplate } from "./SMSTemplatesSection";

interface EditSMSTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SMSTemplate, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => void;
  template: SMSTemplate | null;
}

const EditSMSTemplateModal: React.FC<EditSMSTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  template
}) => {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        text: template.text,
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

    if (!formData.text.trim()) {
      setError("Please enter message text");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError("Failed to update SMS template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit SMS Template</DialogTitle>
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
              placeholder="e.g., Welcome SMS, Follow-up"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm text-gray-500">
              Message Text <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter SMS message text..."
              rows={4}
              required
              disabled={isSubmitting}
              maxLength={160}
            />
            <p className="text-xs text-gray-500">
              {formData.text.length}/160 characters
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

export default EditSMSTemplateModal;
