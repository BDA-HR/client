import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, User, Building, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { mockLeads } from '../../data/crmMockData';

export default function LeadConversion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Load lead from localStorage or mockLeads
  const loadLead = () => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      try {
        const leads = JSON.parse(storedLeads);
        return leads.find((l: any) => l.id === id);
      } catch (error) {
        console.error('Error parsing stored leads:', error);
      }
    }
    // Fallback to mockLeads
    return mockLeads.find(l => l.id === id);
  };

  const lead = loadLead();
  
  const [conversionData, setConversionData] = useState({
    createContact: true,
    createOpportunity: true,
    createAccount: false,
    contactData: {
      firstName: lead?.firstName || '',
      lastName: lead?.lastName || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      company: lead?.company || '',
      jobTitle: lead?.jobTitle || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    opportunityData: {
      name: `${lead?.company} - ${lead?.firstName} ${lead?.lastName}`,
      amount: lead?.budget || 0,
      probability: 25,
      expectedCloseDate: '',
      stage: 'Qualification' as const,
      description: lead?.notes || '',
      products: [] as string[],
      nextStep: 'Schedule needs analysis meeting'
    },
    accountData: {
      name: lead?.company || '',
      industry: lead?.industry || '',
      website: '',
      phone: lead?.phone || '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZipCode: '',
      billingCountry: 'USA',
      annualRevenue: lead?.budget || 0,
      numberOfEmployees: 0,
      description: ''
    },
    conversionNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (conversionData.createContact) {
      if (!conversionData.contactData.firstName.trim()) {
        newErrors.contactFirstName = 'First name is required';
      }
      if (!conversionData.contactData.lastName.trim()) {
        newErrors.contactLastName = 'Last name is required';
      }
      if (!conversionData.contactData.email.trim()) {
        newErrors.contactEmail = 'Email is required';
      }
    }

    if (conversionData.createOpportunity) {
      if (!conversionData.opportunityData.name.trim()) {
        newErrors.opportunityName = 'Opportunity name is required';
      }
      if (conversionData.opportunityData.amount <= 0) {
        newErrors.opportunityAmount = 'Amount must be greater than 0';
      }
      if (!conversionData.opportunityData.expectedCloseDate) {
        newErrors.expectedCloseDate = 'Expected close date is required';
      }
    }

    if (conversionData.createAccount) {
      if (!conversionData.accountData.name.trim()) {
        newErrors.accountName = 'Account name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConvert = () => {
    if (!validateForm()) {
      return;
    }

    // In a real app, this would make API calls to create contact and opportunity
    console.log('Converting lead:', {
      leadId: id,
      conversionData
    });

    // Show success message and redirect
    alert('Lead converted successfully!');
    navigate('/crm/leads');
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead not found</h2>
          <p className="text-gray-600 mb-4">The lead you're trying to convert doesn't exist.</p>
          <Button onClick={() => navigate('/crm/leads')}>
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/crm/leads/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lead
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Convert Lead</h1>
            <p className="text-gray-600">
              Convert {lead.firstName} {lead.lastName} from {lead.company}
            </p>
          </div>
        </div>
      </div>

      {/* Lead Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-600" />
            <span>Lead Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{lead.firstName} {lead.lastName}</p>
                <p>{lead.jobTitle}</p>
                <p>{lead.email}</p>
                <p>{lead.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Company Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{lead.company}</p>
                <p>Industry: {lead.industry}</p>
                <p>Budget: ${lead.budget?.toLocaleString()}</p>
                <p>Timeline: {lead.timeline}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lead Status</h4>
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">{lead.status}</Badge>
                <p className="text-sm text-gray-600">Score: {lead.score}/100</p>
                <p className="text-sm text-gray-600">Source: {lead.source}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Options */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Conversion Options</h2>
        <p className="text-sm text-gray-600">Select which records to create from this lead</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Creation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Create Contact</span>
              </CardTitle>
              <Checkbox
                checked={conversionData.createContact}
                onCheckedChange={(checked) => 
                  setConversionData({...conversionData, createContact: checked as boolean})
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {conversionData.createContact ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactFirstName">First Name *</Label>
                    <Input
                      id="contactFirstName"
                      value={conversionData.contactData.firstName}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, firstName: e.target.value}
                      })}
                      className={errors.contactFirstName ? 'border-red-500' : ''}
                    />
                    {errors.contactFirstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactFirstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactLastName">Last Name *</Label>
                    <Input
                      id="contactLastName"
                      value={conversionData.contactData.lastName}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, lastName: e.target.value}
                      })}
                      className={errors.contactLastName ? 'border-red-500' : ''}
                    />
                    {errors.contactLastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactLastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={conversionData.contactData.email}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, email: e.target.value}
                      })}
                      className={errors.contactEmail ? 'border-red-500' : ''}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={conversionData.contactData.phone}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, phone: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactCompany">Company</Label>
                    <Input
                      id="contactCompany"
                      value={conversionData.contactData.company}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, company: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactJobTitle">Job Title</Label>
                    <Input
                      id="contactJobTitle"
                      value={conversionData.contactData.jobTitle}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        contactData: {...conversionData.contactData, jobTitle: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Contact creation is disabled. Check the box above to create a contact record.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Opportunity Creation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Create Opportunity</span>
              </CardTitle>
              <Checkbox
                checked={conversionData.createOpportunity}
                onCheckedChange={(checked) => 
                  setConversionData({...conversionData, createOpportunity: checked as boolean})
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {conversionData.createOpportunity ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="opportunityName">Opportunity Name *</Label>
                  <Input
                    id="opportunityName"
                    value={conversionData.opportunityData.name}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      opportunityData: {...conversionData.opportunityData, name: e.target.value}
                    })}
                    className={errors.opportunityName ? 'border-red-500' : ''}
                  />
                  {errors.opportunityName && (
                    <p className="text-sm text-red-500 mt-1">{errors.opportunityName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="opportunityAmount">Amount ($) *</Label>
                    <Input
                      id="opportunityAmount"
                      type="number"
                      value={conversionData.opportunityData.amount}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        opportunityData: {...conversionData.opportunityData, amount: Number(e.target.value)}
                      })}
                      className={errors.opportunityAmount ? 'border-red-500' : ''}
                    />
                    {errors.opportunityAmount && (
                      <p className="text-sm text-red-500 mt-1">{errors.opportunityAmount}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={conversionData.opportunityData.probability}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        opportunityData: {...conversionData.opportunityData, probability: Number(e.target.value)}
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={conversionData.opportunityData.expectedCloseDate}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      opportunityData: {...conversionData.opportunityData, expectedCloseDate: e.target.value}
                    })}
                    className={errors.expectedCloseDate ? 'border-red-500' : ''}
                  />
                  {errors.expectedCloseDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.expectedCloseDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nextStep">Next Step</Label>
                  <Input
                    id="nextStep"
                    value={conversionData.opportunityData.nextStep}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      opportunityData: {...conversionData.opportunityData, nextStep: e.target.value}
                    })}
                    placeholder="e.g., Schedule product demo"
                  />
                </div>

                <div>
                  <Label htmlFor="opportunityDescription">Description</Label>
                  <Textarea
                    id="opportunityDescription"
                    value={conversionData.opportunityData.description}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      opportunityData: {...conversionData.opportunityData, description: e.target.value}
                    })}
                    rows={3}
                    placeholder="Describe the opportunity..."
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Opportunity creation is disabled. Check the box above to create an opportunity record.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Account Creation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span>Create Account</span>
              </CardTitle>
              <Checkbox
                checked={conversionData.createAccount}
                onCheckedChange={(checked) => 
                  setConversionData({...conversionData, createAccount: checked as boolean})
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {conversionData.createAccount ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={conversionData.accountData.name}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      accountData: {...conversionData.accountData, name: e.target.value}
                    })}
                    className={errors.accountName ? 'border-red-500' : ''}
                  />
                  {errors.accountName && (
                    <p className="text-sm text-red-500 mt-1">{errors.accountName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountIndustry">Industry</Label>
                    <Input
                      id="accountIndustry"
                      value={conversionData.accountData.industry}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        accountData: {...conversionData.accountData, industry: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountPhone">Phone</Label>
                    <Input
                      id="accountPhone"
                      type="tel"
                      value={conversionData.accountData.phone}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        accountData: {...conversionData.accountData, phone: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountWebsite">Website</Label>
                    <Input
                      id="accountWebsite"
                      type="url"
                      value={conversionData.accountData.website}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        accountData: {...conversionData.accountData, website: e.target.value}
                      })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                    <Input
                      id="annualRevenue"
                      type="number"
                      value={conversionData.accountData.annualRevenue || ''}
                      onChange={(e) => setConversionData({
                        ...conversionData,
                        accountData: {...conversionData.accountData, annualRevenue: Number(e.target.value)}
                      })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                  <Input
                    id="numberOfEmployees"
                    type="number"
                    value={conversionData.accountData.numberOfEmployees || ''}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      accountData: {...conversionData.accountData, numberOfEmployees: Number(e.target.value)}
                    })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="accountDescription">Description</Label>
                  <Textarea
                    id="accountDescription"
                    value={conversionData.accountData.description}
                    onChange={(e) => setConversionData({
                      ...conversionData,
                      accountData: {...conversionData.accountData, description: e.target.value}
                    })}
                    rows={3}
                    placeholder="Describe the account..."
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Account creation is disabled. Check the box above to create an account record.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Conversion Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={conversionData.conversionNotes}
            onChange={(e) => setConversionData({...conversionData, conversionNotes: e.target.value})}
            placeholder="Add any notes about this conversion..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Important</h4>
              <p className="text-sm text-orange-800">
                Converting this lead will change its status to "Closed Won" and create the selected records. 
                This action cannot be undone. The original lead record will be preserved for audit purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/crm/leads/${id}`)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConvert}
          className="bg-orange-600 hover:bg-orange-700"
          disabled={!conversionData.createContact && !conversionData.createOpportunity && !conversionData.createAccount}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Convert Lead
        </Button>
      </div>
    </motion.div>
  );
}