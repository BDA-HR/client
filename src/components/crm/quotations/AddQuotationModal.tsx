import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';

interface AddQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quotationData: any) => void;
  prefilledOpportunity?: {
    id: string;
    name: string;
    accountName: string;
    contactName: string;
    amount: number;
  } | null;
  editingQuotation?: any;
}

const statusOptions = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected'
];

const productOptions = [
  'Enterprise Software License',
  'Professional Services Package',
  'Training Package',
  'Custom Development',
  'Support Contract',
  'Cloud Hosting Service',
  'Data Analytics Platform',
  'Security Audit Service',
  'Consulting Services',
  'Maintenance Package'
];

export default function AddQuotationModal({
  isOpen,
  onClose,
  onSubmit,
  prefilledOpportunity,
  editingQuotation
}: AddQuotationModalProps) {
  const [formData, setFormData] = useState({
    product: '',
    amount: prefilledOpportunity?.amount?.toString() || '',
    status: 'Draft',
    validUntil: '',
    description: '',
    createdBy: 'Current User'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when prefilledOpportunity or editingQuotation changes
  useEffect(() => {
    if (editingQuotation) {
      setFormData({
        product: editingQuotation.product || '',
        amount: editingQuotation.amount?.toString() || '',
        status: editingQuotation.status || 'Draft',
        validUntil: editingQuotation.validUntil || '',
        description: editingQuotation.description || '',
        createdBy: editingQuotation.createdBy || 'Current User'
      });
    } else if (prefilledOpportunity) {
      setFormData({
        product: '',
        amount: prefilledOpportunity.amount.toString(),
        status: 'Draft',
        validUntil: '',
        description: '',
        createdBy: 'Current User'
      });
    } else {
      // Reset form for new quotation
      setFormData({
        product: '',
        amount: '',
        status: 'Draft',
        validUntil: '',
        description: '',
        createdBy: 'Current User'
      });
    }
  }, [prefilledOpportunity, editingQuotation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.product.trim()) {
      newErrors.product = 'Product is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount)
      });
      
      // Reset form only if not editing
      if (!editingQuotation) {
        setFormData({
          product: '',
          amount: '',
          status: 'Draft',
          validUntil: '',
          description: '',
          createdBy: 'Current User'
        });
      }
      setErrors({});
    } catch (error) {
      console.error('Error creating quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>{editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="product">Product *</Label>
              <Select value={formData.product} onValueChange={(value) => handleChange('product', value)}>
                <SelectTrigger className={`mt-1 ${errors.product ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map(product => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product && <p className="text-sm text-red-500 mt-1">{errors.product}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`mt-1 ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => handleChange('validUntil', e.target.value)}
                  className={`mt-1 ${errors.validUntil ? 'border-red-500' : ''}`}
                />
                {errors.validUntil && <p className="text-sm text-red-500 mt-1">{errors.validUntil}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Describe the quotation..."
              />
            </div>
          </motion.form>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t bg-white">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingQuotation ? 'Update Quotation' : 'Create Quotation'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}