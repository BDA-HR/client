import React, { useState } from 'react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Checkbox } from '../../../ui/checkbox';
import { Badge } from '../../../ui/badge';
import { useCRMSettings } from '../../../../hooks/useCRMSettings';
import type { Lead } from '../../../../types/crm';

interface LeadFormProps {
  lead?: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<Lead>) => void;
  mode: 'add' | 'edit';
}

const salesReps = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

export default function LeadForm({ lead, isOpen, onClose, onSubmit, mode }: LeadFormProps) {
  const [activeTab, setActiveTab] = useState('contact');
  
  // Get CRM settings for dropdown options
  const {
    leadSourceNames,
    leadStatusNames,
    leadQualificationStatusNames,
    leadCategoryNames,
    industryNames,
    contactMethodNames,
    activityTypeNames,
    assignmentModeNames,
    conversionTargetNames,
    loading: settingsLoading
  } = useCRMSettings();
  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    mobileNumber: lead?.mobileNumber || '',
    workPhone: lead?.workPhone || '',
    company: lead?.company || '',
    jobTitle: lead?.jobTitle || '',
    source: lead?.source || 'Website',
    status: lead?.status || 'New',
    assignedTo: lead?.assignedTo || '',
    notes: lead?.notes || '',
    budget: lead?.budget || 0,
    timeline: lead?.timeline || '',
    industry: lead?.industry || '',
    score: lead?.score || 0,
    address: lead?.address || '',
    city: lead?.city || '',
    state: lead?.state || '',
    zipCode: lead?.zipCode || '',
    country: lead?.country || '',
    website: lead?.website || '',
    companySize: lead?.companySize || '',
    annualRevenue: lead?.annualRevenue || 0,
    leadQuality: lead?.leadQuality || 'Warm',
    authority: lead?.authority || 'Unknown',
    need: lead?.need || 'Unknown',
    urgency: lead?.urgency || 'Unknown',
    preferredContactMethod: lead?.preferredContactMethod || 'Any',
    lifecycleStage: lead?.lifecycleStage || 'Lead',
    buyingRole: lead?.buyingRole || 'Unknown',
    buyingStage: lead?.buyingStage || 'Unaware',
    leadGrade: lead?.leadGrade || 'C',
    timezone: lead?.timezone || '',
    language: lead?.language || '',
    currency: lead?.currency || '',
    socialMedia: lead?.socialMedia || {},
    tags: lead?.tags || [],
    painPoints: lead?.painPoints || [],
    interests: lead?.interests || [],
    productInterest: lead?.productInterest || [],
    unsubscribed: lead?.unsubscribed || false,
    doNotCall: lead?.doNotCall || false,
    doNotEmail: lead?.doNotEmail || false,
    gdprConsent: lead?.gdprConsent || false,
    budget_authority: lead?.budget_authority || false,
    marketingQualified: lead?.marketingQualified || false,
    salesQualified: lead?.salesQualified || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email?.trim() && !formData.phone?.trim()) {
      newErrors.contact = 'Either email or phone is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Lead' : 'Edit Lead'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          {errors.contact && (
            <p className="text-sm text-red-500">{errors.contact}</p>
          )}

          {/* Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className={errors.company ? 'border-red-500' : ''}
              />
              {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    industryNames.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadSourceNames.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadStatusNames.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadQuality">Lead Quality</Label>
              <Select value={formData.leadQuality} onValueChange={(value) => handleChange('leadQuality', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lead quality" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadCategoryNames.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
              <Select value={formData.preferredContactMethod} onValueChange={(value) => handleChange('preferredContactMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    contactMethodNames.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleChange('assignedTo', value)}>
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
            <div>
              <Label htmlFor="score">Lead Score (0-100)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => handleChange('score', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
                placeholder="e.g., Q2 2024, Immediate"
              />
            </div>
            <div>
              <Label htmlFor="lifecycleStage">Lifecycle Stage</Label>
              <Select value={formData.lifecycleStage} onValueChange={(value) => handleChange('lifecycleStage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lifecycle stage" />
                </SelectTrigger>
                <SelectContent>
                  {settingsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    leadQualificationStatusNames.map((stage) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes about this lead..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {mode === 'add' ? 'Add Lead' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}