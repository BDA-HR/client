import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Checkbox } from "../../../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Alert, AlertDescription } from "../../../ui/alert";
import type { RoutingRule } from "./LeadRoutingSection";

interface EditRoutingRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  rule: RoutingRule | null;
}

interface FormData {
  name: string;
  description: string;
  assignTo: string;
  priority: number;
  isActive: boolean;
}

const salesReps = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

const EditRoutingRuleModal: React.FC<EditRoutingRuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rule
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    assignTo: "",
    priority: 1,
    isActive: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        assignTo: rule.assignTo,
        priority: rule.priority,
        isActive: rule.isActive
      });
    }
  }, [rule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter a rule name");
      return;
    }

    if (!formData.assignTo) {
      setError("Please select a sales rep to assign to");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      onSubmit(formData);
      handleClose();
    } catch (error) {
      setError("Failed to update routing rule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Routing Rule</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Rule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Enterprise Leads"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm text-gray-500">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                min="1"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-500">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when this rule should be applied"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignTo" className="text-sm text-gray-500">
              Assign To <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.assignTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignTo: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select sales rep" />
              </SelectTrigger>
              <SelectContent>
                {salesReps.map((rep) => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
              disabled={isSubmitting}
            />
            <Label htmlFor="isActive" className="text-sm text-gray-500">Active</Label>
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
                "Update Rule"
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

export default EditRoutingRuleModal;
