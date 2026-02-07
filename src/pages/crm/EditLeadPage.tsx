import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Building, Target, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useCRMSettings } from '../../hooks/useCRMSettings';
import { showToast } from '../../layout/layout';
import type { Lead } from '../../types/crm';

const salesReps = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

const steps = [
  { id: 1, title: 'Contact & Company Info', icon: User },
  { id: 2, title: 'Lead Details', icon: Target },
];

export default function EditLeadPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const {
    leadSourceNames,
    leadStatusNames,
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
    leadQuality: 'Warm',
    preferredContactMethod: 'Any',
  });

  // Load lead data on component mount
  useEffect(() => {
    if (id) {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const lead = leads.find((l: Lead) => l.id === id);
      
      if (lead) {
        setFormData(lead);
        setLoading(false);
      } else {
        showToast.error('Lead not found');
        navigate('/crm/leads');
      }
    }
  }, [id, navigate]);

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Contact validation
      if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email?.trim() && !formData.phone?.trim()) {
        newErrors.contact = 'Either email or phone is required';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      // Company validation
      if (!formData.company?.trim()) newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const updatedLead: Lead = {
        ...formData,
        id: id!,
        updatedAt: new Date().toISOString()
      } as Lead;

      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const updatedLeads = existingLeads.map((lead: Lead) => 
        lead.id === id ? updatedLead : lead
      );
      
      localStorage.setItem('leads', JSON.stringify(updatedLeads));

      showToast.success('Lead updated successfully');
      navigate('/crm/leads');
    } catch (error) {
      showToast.error('Failed to update lead');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Header */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/crm/leads')}
              className="cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-gray-700">Back to Leads</span>
            </Button>
            
            <div className=" flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-700 to-orange-800 bg-clip-text text-transparent mb-2 tracking-tight">
                Edit Lead
              </h1>
            </div>
            
            <div className="w-40"></div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const stepNumber = index + 1;
                const isCompleted = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-1 relative">
                      <div className="relative">
                        <div
                          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                            isCompleted
                              ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200'
                              : isCurrent
                              ? 'border-orange-500 bg-white text-orange-600 shadow-lg shadow-orange-100'
                              : 'border-gray-200 bg-gray-50 text-gray-400'
                          } ${isCurrent ? 'scale-110 ring-4 ring-orange-50' : 'scale-100'}`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <IconComponent className="w-5 h-5" />
                          )}
                          <div
                            className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border-2 ${
                              isCompleted
                                ? 'bg-white text-orange-600 border-orange-500'
                                : isCurrent
                                ? 'bg-orange-500 text-white border-white'
                                : 'bg-gray-200 text-gray-500 border-gray-300'
                            }`}
                          >
                            {stepNumber}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-4">
                        <span
                          className={`block text-sm font-semibold transition-colors ${
                            isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`text-xs mt-1 font-medium transition-colors ${
                            isCompleted
                              ? 'text-orange-600'
                              : isCurrent
                              ? 'text-orange-500'
                              : 'text-gray-400'
                          }`}
                        >
                          {isCompleted ? 'Complete' : isCurrent ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4 relative">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${
                              isCompleted ? 'bg-orange-500 w-full' : isCurrent ? 'bg-orange-500 w-1/2' : 'bg-transparent w-0'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 py-4 px-8"
        >

          {/* Step 1: Contact & Company Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact & Company Information</h2>
              
              {/* Contact Information */}
              <div className="border-b pb-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm text-gray-500">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={`w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm text-gray-500">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={`w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-500">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm text-gray-500">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      pattern="[0-9+\-\s\(\)]+"
                      placeholder="+1-555-0123"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {errors.contact && <p className="text-sm text-red-500 mt-2">{errors.contact}</p>}

                <div className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-sm text-gray-500">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm text-gray-500">
                      Company <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className={`w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent ${errors.company ? 'border-red-500' : ''}`}
                    />
                    {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm text-gray-500">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                      <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
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
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm text-gray-500">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => handleChange('budget', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-sm text-gray-500">Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => handleChange('timeline', e.target.value)}
                      placeholder="e.g., Q2 2024, Immediate"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Lead Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lead Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-sm text-gray-500">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
                      <SelectValue placeholder="Select source" />
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

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm text-gray-500">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="leadQuality" className="text-sm text-gray-500">Lead Quality</Label>
                  <Select value={formData.leadQuality} onValueChange={(value) => handleChange('leadQuality', value)}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
                      <SelectValue placeholder="Select quality" />
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

                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod" className="text-sm text-gray-500">Preferred Contact Method</Label>
                  <Select value={formData.preferredContactMethod} onValueChange={(value) => handleChange('preferredContactMethod', value)}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
                      <SelectValue placeholder="Select method" />
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-sm text-gray-500">Assigned To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleChange('assignedTo', value)}>
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent">
                      <SelectValue placeholder="Select sales rep" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesReps.map((rep) => (
                        <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score" className="text-sm text-gray-500">Lead Score (0-100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score || ''}
                    onChange={(e) => handleChange('score', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm text-gray-500">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Additional notes about this lead..."
                  className="w-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t mt-5">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="px-6"
              >
                Previous
              </Button>
            )}
            
            <div className="ml-auto flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/crm/leads')}
                className="px-6"
              >
                Cancel
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-orange-600 hover:bg-orange-700 px-6"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 px-6"
                >
                  Update Lead
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}