import React, { useState } from 'react';
import { Button } from '../../../../ui/button';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import { Textarea } from '../../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs';
import { useCRMSettings } from '../../../../../hooks/useCRMSettings';
import { RoutingService } from '../../../../../services/routingService';
import type { Lead } from '../../../../../types/crm';

interface AddLeadFormProps {
  onSubmit: (leadData: Partial<Lead>) => void;
  onCancel: () => void;
}

const salesReps = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

export default function AddLeadForm({ onSubmit, onCancel }: AddLeadFormProps) {
  const [activeTab, setActiveTab] = useState('contact');
  
  const {
    leadSourceNames,
    leadStatusNames,
    leadQualificationStatusNames,
    leadCategoryNames,
    industryNames,
    contactMethodNames,
    loading: settingsLoading
  } = useCRMSettings();

  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    source: 'Website',
    status: 'New',
    assignedTo: '',
    notes: '',
    budget: 0,
    timeline: '',
    industry: '',
    score: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    leadQuality: 'Warm',
    preferredContactMethod: 'Any',
    lifecycleStage: 'Lead'
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
      // Auto-assign sales rep based on routing rules if not manually assigned
      let finalFormData = { ...formData };
      
      if (!finalFormData.assignedTo) {
        const assignedRep = RoutingService.assignLeadToSalesRep(finalFormData);
        if (assignedRep) {
          finalFormData.assignedTo = assignedRep;
        }
      }
      
      onSubmit(finalFormData);
    }
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact & Company Info</TabsTrigger>
          <TabsTrigger value="lead">Lead Details</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {errors.contact && (
                  <p className="text-sm text-red-500 mt-2">{errors.contact}</p>
                )}

                <div className="mt-4">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                  />
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Company Information</h3>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className={errors.company ? 'border-red-500' : ''}
                  />
                  {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ''}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lead">
          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    value={formData.score || 0}
                    onChange={(e) => handleChange('score', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget || 0}
                    onChange={(e) => handleChange('budget', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline || ''}
                    onChange={(e) => handleChange('timeline', e.target.value)}
                    placeholder="e.g., Q2 2024, Immediate"
                  />
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

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Additional notes about this lead..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
          Add Lead
        </Button>
      </div>
    </form>
  );
}