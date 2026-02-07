import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, ShoppingCart } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  prefilledOpportunity?: {
    id: string;
    name: string;
    accountName: string;
    contactName: string;
    amount: number;
  } | null;
}

const statusOptions = [
  'Draft',
  'Confirmed',
  'In Production',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const priorityOptions = [
  'Low',
  'Medium',
  'High'
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

const teamOptions = [
  'Production Team',
  'Logistics Team',
  'Training Team',
  'Development Team',
  'Support Team'
];

export default function AddOrderModal({
  isOpen,
  onClose,
  onSubmit,
  prefilledOpportunity
}: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    product: '',
    amount: prefilledOpportunity?.amount?.toString() || '',
    status: 'Draft',
    priority: 'Medium',
    expectedDelivery: '',
    assignedTo: '',
    items: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when prefilledOpportunity changes
  useEffect(() => {
    if (prefilledOpportunity) {
      setFormData({
        product: '',
        amount: prefilledOpportunity.amount.toString(),
        status: 'Draft',
        priority: 'Medium',
        expectedDelivery: '',
        assignedTo: '',
        items: '',
        description: ''
      });
    }
  }, [prefilledOpportunity]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.product.trim()) {
      newErrors.product = 'Product is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.expectedDelivery) {
      newErrors.expectedDelivery = 'Expected delivery date is required';
    }
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Assigned team is required';
    }
    if (!formData.items || Number(formData.items) <= 0) {
      newErrors.items = 'Number of items must be greater than 0';
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
        amount: Number(formData.amount),
        items: Number(formData.items),
        progress: 0
      });
      
      // Reset form
      setFormData({
        product: '',
        amount: '',
        status: 'Draft',
        priority: 'Medium',
        expectedDelivery: '',
        assignedTo: '',
        items: '',
        description: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating order:', error);
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
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span>Create New Order</span>
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
              <Label htmlFor="items">Number of Items *</Label>
              <Input
                id="items"
                type="number"
                min="1"
                value={formData.items}
                onChange={(e) => handleChange('items', e.target.value)}
                className={`mt-1 ${errors.items ? 'border-red-500' : ''}`}
                placeholder="1"
              />
              {errors.items && <p className="text-sm text-red-500 mt-1">{errors.items}</p>}
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
                <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => handleChange('expectedDelivery', e.target.value)}
                  className={`mt-1 ${errors.expectedDelivery ? 'border-red-500' : ''}`}
                />
                {errors.expectedDelivery && <p className="text-sm text-red-500 mt-1">{errors.expectedDelivery}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleChange('assignedTo', value)}>
                <SelectTrigger className={`mt-1 ${errors.assignedTo ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teamOptions.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && <p className="text-sm text-red-500 mt-1">{errors.assignedTo}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Describe the order..."
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
            className="bg-green-600 hover:bg-green-700"
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
                Create Order
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}