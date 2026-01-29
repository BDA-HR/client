import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar, User, Building, Target, Percent } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Badge } from '../../../ui/badge';
import { showToast } from '../../../../layout/layout';
import type { Opportunity } from '../../../../types/crm';

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunityData: Partial<Opportunity>) => void;
  mode: 'add' | 'edit';
}

export default function OpportunityForm({ opportunity, isOpen, onClose, onSubmit, mode }: OpportunityFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    stage: 'Qualification' as Opportunity['stage'],
    amount: '',
    probability: '',
    expectedCloseDate: '',
    assignedTo: '',
    accountId: '',
    contactId: '',
    source: '',
    description: '',
    nextStep: '',
    products: [] as string[],
    competitors: [] as string[],
    newProduct: '',
    newCompetitor: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (opportunity && mode === 'edit') {
      setFormData({
        name: opportunity.name,
        stage: opportunity.stage,
        amount: opportunity.amount.toString(),
        probability: opportunity.probability.toString(),
        expectedCloseDate: opportunity.expectedCloseDate,
        assignedTo: opportunity.assignedTo,
        accountId: opportunity.accountId,
        contactId: opportunity.contactId,
        source: opportunity.source,
        description: opportunity.description,
        nextStep: opportunity.nextStep,
        products: opportunity.products || [],
        competitors: opportunity.competitors || [],
        newProduct: '',
        newCompetitor: ''
      });
    } else {
      // Reset form for add mode
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setFormData({
        name: '',
        stage: 'Qualification',
        amount: '',
        probability: '50',
        expectedCloseDate: nextMonth.toISOString().split('T')[0],
        assignedTo: '',
        accountId: '',
        contactId: '',
        source: '',
        description: '',
        nextStep: '',
        products: [],
        competitors: [],
        newProduct: '',
        newCompetitor: ''
      });
    }
    setErrors({});
  }, [opportunity, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this opportunity to someone';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast.error('Please fix the errors before submitting');
      return;
    }

    const opportunityData: Partial<Opportunity> = {
      name: formData.name.trim(),
      stage: formData.stage,
      amount: parseFloat(formData.amount),
      probability: parseFloat(formData.probability),
      expectedCloseDate: formData.expectedCloseDate,
      assignedTo: formData.assignedTo,
      accountId: formData.accountId || Date.now().toString(),
      contactId: formData.contactId || Date.now().toString(),
      source: formData.source || 'Direct',
      description: formData.description.trim(),
      nextStep: formData.nextStep.trim(),
      products: formData.products,
      competitors: formData.competitors,
      // Enhanced fields with calculated values
      weightedAmount: parseFloat(formData.amount) * (parseFloat(formData.probability) / 100),
      salesVelocity: 8.5, // Mock value
      daysInStage: 0,
      lastActivityDate: new Date().toISOString(),
      winProbabilityAI: parseFloat(formData.probability) + Math.random() * 10 - 5, // AI-adjusted probability
      approvalStatus: 'pending',
      discountApproved: false,
      commissionRate: 0.05,
      forecastCategory: parseFloat(formData.probability) >= 70 ? 'commit' : 
                       parseFloat(formData.probability) >= 40 ? 'best-case' : 'pipeline',
      crossSellOpportunities: [],
      upsellPotential: parseFloat(formData.amount) * 0.2 // 20% upsell potential
    };

    onSubmit(opportunityData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addProduct = () => {
    if (formData.newProduct.trim() && !formData.products.includes(formData.newProduct.trim())) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, prev.newProduct.trim()],
        newProduct: ''
      }));
    }
  };

  const removeProduct = (productToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(product => product !== productToRemove)
    }));
  };

  const addCompetitor = () => {
    if (formData.newCompetitor.trim() && !formData.competitors.includes(formData.newCompetitor.trim())) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, prev.newCompetitor.trim()],
        newCompetitor: ''
      }));
    }
  };

  const removeCompetitor = (competitorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter(competitor => competitor !== competitorToRemove)
    }));
  };

  const salesReps = [
    'Sarah Johnson',
    'Mike Wilson',
    'Emily Davis',
    'John Smith',
    'Lisa Chen',
    'David Brown'
  ];

  const opportunitySources = [
    'Inbound Lead',
    'Outbound Prospecting',
    'Referral',
    'Website',
    'Trade Show',
    'Cold Call',
    'Email Campaign',
    'Social Media',
    'Partner',
    'Existing Customer'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>{mode === 'add' ? 'Create New Opportunity' : 'Edit Opportunity'}</span>
            {mode === 'edit' && opportunity && (
              <Badge variant="outline">#{opportunity.id}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Opportunity Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter opportunity name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="stage">Sales Stage *</Label>
                <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qualification">Qualification</SelectItem>
                    <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="source">Lead Source</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunitySources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the opportunity, customer needs, and solution"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount" className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount *</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
              </div>

              <div>
                <Label htmlFor="probability" className="flex items-center space-x-1">
                  <Percent className="w-4 h-4" />
                  <span>Win Probability *</span>
                </Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => handleInputChange('probability', e.target.value)}
                  placeholder="50"
                  className={errors.probability ? 'border-red-500' : ''}
                />
                {errors.probability && <p className="text-sm text-red-600 mt-1">{errors.probability}</p>}
              </div>

              <div>
                <Label htmlFor="expectedCloseDate" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expected Close Date *</span>
                </Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
                  className={errors.expectedCloseDate ? 'border-red-500' : ''}
                />
                {errors.expectedCloseDate && <p className="text-sm text-red-600 mt-1">{errors.expectedCloseDate}</p>}
              </div>
            </div>

            {/* Calculated Values Display */}
            {formData.amount && formData.probability && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Calculated Values</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Weighted Amount:</span>
                    <div className="font-bold text-blue-900">
                      ${(parseFloat(formData.amount || '0') * (parseFloat(formData.probability || '0') / 100)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Forecast Category:</span>
                    <div className="font-bold text-blue-900">
                      {parseFloat(formData.probability || '0') >= 70 ? 'Commit' : 
                       parseFloat(formData.probability || '0') >= 40 ? 'Best Case' : 'Pipeline'}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Upsell Potential:</span>
                    <div className="font-bold text-blue-900">
                      ${(parseFloat(formData.amount || '0') * 0.2).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assignment & Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Assignment & Next Steps</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignedTo" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Assigned To *</span>
                </Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                  <SelectTrigger className={errors.assignedTo ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep} value={rep}>
                        {rep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedTo && <p className="text-sm text-red-600 mt-1">{errors.assignedTo}</p>}
              </div>

              <div>
                <Label htmlFor="nextStep">Next Step</Label>
                <Input
                  id="nextStep"
                  value={formData.nextStep}
                  onChange={(e) => handleInputChange('nextStep', e.target.value)}
                  placeholder="e.g., Schedule demo, Send proposal"
                />
              </div>
            </div>
          </div>

          {/* Products & Competition */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Products & Competition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Products */}
              <div className="space-y-3">
                <Label>Products/Services</Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.newProduct}
                    onChange={(e) => setFormData(prev => ({ ...prev, newProduct: e.target.value }))}
                    placeholder="Add product/service"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addProduct} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.products.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.products.map((product, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{product}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-600" 
                          onClick={() => removeProduct(product)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Competitors */}
              <div className="space-y-3">
                <Label>Competitors</Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.newCompetitor}
                    onChange={(e) => setFormData(prev => ({ ...prev, newCompetitor: e.target.value }))}
                    placeholder="Add competitor"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addCompetitor} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.competitors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.competitors.map((competitor, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <span>{competitor}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-600" 
                          onClick={() => removeCompetitor(competitor)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === 'add' ? 'Create Opportunity' : 'Update Opportunity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}