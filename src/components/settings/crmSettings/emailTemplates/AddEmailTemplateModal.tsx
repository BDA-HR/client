import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Checkbox } from "../../../ui/checkbox";
import { Textarea } from "../../../ui/textarea";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { EmailTemplate } from "./EmailTemplatesSection";

interface AddEmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmailTemplate, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>) => void;
}

const AddEmailTemplateModal: React.FC<AddEmailTemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      body: "",
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
      setError("Please enter a template name");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Please enter email subject");
      return;
    }

    if (!formData.body.trim()) {
      setError("Please enter email body");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      onSubmit(formData);
      resetForm();
    } catch (error) {
      setError("Failed to add template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Email Template</DialogTitle>
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
              placeholder="e.g., Welcome Email, Follow-up"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm text-gray-500">
              Email Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Welcome to {{company_name}}"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Use variables: {"{"}{"{"} contact_name {"}"}{"}"},  {"{"}{"{"} company_name {"}"}{"}"},  {"{"}{"{"} lead_source {"}"}{"}"} 
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm text-gray-500">
              Email Body <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Enter email body content..."
              rows={10}
              required
              disabled={isSubmitting}
              className="text-sm"
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

export default AddEmailTemplateModal;
