import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Calendar } from '../../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import { CalendarIcon, User, Building, DollarSign, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../../../../layout/layout';
import type { Lead, Contact, Account, Opportunity } from '../../../../types/crm';

interface LeadConversionDialogProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (conversionData: ConversionData) => void;
}

interface ConversionData {
  createContact: boolean;
  createAccount: boolean;
  createOpportunity: boolean;
  contactData?: Partial<Contact>;
  accountData?: Partial<Account>;
  opportunityData?: Partial<Opportunity>;
}

export default function LeadConversionDialog({ lead, isOpen, onClose, onConvert }: LeadConversionDialogProps) {
  const [conversionOptions, setConversionOptions] = useState({
    createContact: true,
    createAccount: false,
    createOpportunity: false
  });

  const [contactData, setContactData] = useState<Partial<Contact>>({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    jobTitle: lead.jobTitle,
    stage: 'Prospect',
    owner: lead.assignedTo,
    notes: lead.notes,
    isActive: true,
    consentStatus: 'pending',
    teamVisibility: 'team',
    relationshipScore: Math.min(lead.score, 100),
    tags: []
  });

  const [accountData, setAccountData] = useState<Partial<Account>>({
    name: lead.company,
    industry: lead.industry,
    phone: lead.phone,
    owner: lead.assignedTo,
    accountType: 'Prospect',
    isActive: true,
    contactIds: [],
    opportunityIds: []
  });

  const [opportunityData, setOpportunityData] = useState<Partial<Opportunity>>({
    name: `${lead.company} - ${lead.firstName} ${lead.lastName}`,
    stage: 'Qualification',
    amount: lead.budget || 0,
    probability: 25,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    assignedTo: lead.assignedTo,
    source: lead.source,
    description: `Converted from lead: ${lead.firstName} ${lead.lastName}`,
    products: [],
    competitors: [],
    nextStep: 'Initial qualification call'
  });

  const handleConvert = () => {
    if (!conversionOptions.createContact) {
      showToast.error('Contact creation is required for conversion');
      return;
    }

    const conversionData: ConversionData = {
      createContact: conversionOptions.createContact,
      createAccount: conversionOptions.createAccount,
      createOpportunity: conversionOptions.createOpportunity,
      contactData: conversionOptions.createContact ? contactData : undefined,
      accountData: conversionOptions.createAccount ? accountData : undefined,
      opportunityData: conversionOptions.createOpportunity ? opportunityData : undefined
    };

    onConvert(conversionData);
    onClose();
  };

  const updateContactData = (field: string, value: any) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccountData = (field: string, value: any) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const updateOpportunityData = (field: string, value: any) => {
    setOpportunityData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-600" />
            <span>Convert Lead: {lead.firstName} {lead.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conversion Options */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg">Conversion Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createContact"
                  checked={conversionOptions.createContact}
                  onCheckedChange={(checked) => 
                    setConversionOptions(prev => ({ ...prev, createContact: checked as boolean }))
                  }
                  disabled // Always required
                />
                <Label htmlFor="createContact" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Create Contact (Required)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createAccount"
                  checked={conversionOptions.createAccount}
                  onCheckedChange={(checked) => 
                    setConversionOptions(prev => ({ ...prev, createAccount: checked as boolean }))
                  }
                />
                <Label htmlFor="createAccount" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Create Account</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createOpportunity"
                  checked={conversionOptions.createOpportunity}
                  onCheckedChange={(checked) => 
                    setConversionOptions(prev => ({ ...prev, createOpportunity: checked as boolean }))
                  }
                />
                <Label htmlFor="createOpportunity" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Create Opportunity</span>
                </Label>
              </div>

              {/* Conversion Flow Visualization */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">Lead</span>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      conversionOptions.createContact ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <User className={`w-6 h-6 ${
                        conversionOptions.createContact ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <span className="text-sm font-medium">Contact</span>
                  </div>

                  {conversionOptions.createAccount && (
                    <>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Account</span>
                      </div>
                    </>
                  )}

                  {conversionOptions.createOpportunity && (
                    <>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                          <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">Opportunity</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          {conversionOptions.createContact && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Contact Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={contactData.firstName}
                      onChange={(e) => updateContactData('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={contactData.lastName}
                      onChange={(e) => updateContactData('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={contactData.email}
                      onChange={(e) => updateContactData('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={contactData.phone}
                      onChange={(e) => updateContactData('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={contactData.jobTitle}
                      onChange={(e) => updateContactData('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Stage</Label>
                    <Select value={contactData.stage} onValueChange={(value) => updateContactData('stage', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Details */}
          {conversionOptions.createAccount && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Account Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Account Name</Label>
                    <Input
                      value={accountData.name}
                      onChange={(e) => updateAccountData('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Input
                      value={accountData.industry}
                      onChange={(e) => updateAccountData('industry', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={accountData.website}
                      onChange={(e) => updateAccountData('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <Select value={accountData.accountType} onValueChange={(value) => updateAccountData('accountType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opportunity Details */}
          {conversionOptions.createOpportunity && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span>Opportunity Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Opportunity Name</Label>
                  <Input
                    value={opportunityData.name}
                    onChange={(e) => updateOpportunityData('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={opportunityData.amount}
                      onChange={(e) => updateOpportunityData('amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Stage</Label>
                    <Select value={opportunityData.stage} onValueChange={(value) => updateOpportunityData('stage', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Qualification">Qualification</SelectItem>
                        <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Probability (%)</Label>
                    <Input
                      type="number"
                      value={opportunityData.probability}
                      onChange={(e) => updateOpportunityData('probability', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {opportunityData.expectedCloseDate 
                          ? format(new Date(opportunityData.expectedCloseDate), "PPP")
                          : "Select date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={opportunityData.expectedCloseDate ? new Date(opportunityData.expectedCloseDate) : undefined}
                        onSelect={(date) => date && updateOpportunityData('expectedCloseDate', date.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={opportunityData.description}
                    onChange={(e) => updateOpportunityData('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConvert} className="bg-orange-600 hover:bg-orange-700">
              Convert Lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}