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
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import type { Lead } from '../../types/crm';

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
    createAccount: true,
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

  const handleConvert = async () => {
    if (!validateForm()) {
      return;
    }

    if (!lead) return;

    try {
      let createdContactId: string | undefined;
      let createdAccountId: string | undefined;
      let createdOpportunityId: string | undefined;

      // 1. Create Contact
      if (conversionData.createContact) {
        createdContactId = Date.now().toString();
        const newContact = {
          id: createdContactId,
          firstName: conversionData.contactData.firstName,
          lastName: conversionData.contactData.lastName,
          email: conversionData.contactData.email,
          phone: conversionData.contactData.phone,
          company: conversionData.contactData.company,
          jobTitle: conversionData.contactData.jobTitle,
          address: conversionData.contactData.address,
          city: conversionData.contactData.city,
          state: conversionData.contactData.state,
          zipCode: conversionData.contactData.zipCode,
          country: conversionData.contactData.country,
          tags: [],
          socialMedia: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastContactDate: new Date().toISOString(),
          notes: conversionData.conversionNotes,
          isActive: true,
          stage: 'Prospect',
          owner: lead.assignedTo,
          teamVisibility: 'team',
          consentStatus: 'pending',
          customFields: {},
          relationshipScore: Math.min(lead.score, 100),
          lastInteractionType: 'conversion',
          segmentIds: [],
          convertedFromLeadId: lead.id,
          accountId: undefined
        };

        const storedContacts = localStorage.getItem('contacts');
        const contacts = storedContacts ? JSON.parse(storedContacts) : [];
        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        window.dispatchEvent(new CustomEvent('contactsUpdated'));
      }

      // 2. Create Account if requested
      if (conversionData.createAccount) {
        createdAccountId = (Date.now() + 1).toString();
        const newAccount = {
          id: createdAccountId,
          name: conversionData.accountData.name,
          industry: conversionData.accountData.industry,
          website: conversionData.accountData.website,
          phone: conversionData.accountData.phone,
          email: lead.email,
          address: conversionData.accountData.billingAddress,
          city: conversionData.accountData.billingCity,
          state: conversionData.accountData.billingState,
          zipCode: conversionData.accountData.billingZipCode,
          country: conversionData.accountData.billingCountry,
          tags: [],
          owner: lead.assignedTo,
          accountType: 'Prospect',
          isActive: true,
          notes: conversionData.accountData.description,
          customFields: {
            annualRevenue: conversionData.accountData.annualRevenue,
            numberOfEmployees: conversionData.accountData.numberOfEmployees
          },
          primaryContactId: createdContactId,
          contactIds: createdContactId ? [createdContactId] : [],
          opportunityIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const storedAccounts = localStorage.getItem('accounts');
        const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));

        // Update contact with account ID
        if (createdContactId) {
          const storedContacts = localStorage.getItem('contacts');
          if (storedContacts) {
            const contacts = JSON.parse(storedContacts);
            const updatedContacts = contacts.map((c: any) => 
              c.id === createdContactId ? { ...c, accountId: createdAccountId } : c
            );
            localStorage.setItem('contacts', JSON.stringify(updatedContacts));
          }
        }
      }

      // 3. Create Opportunity if requested
      if (conversionData.createOpportunity) {
        if (!createdAccountId && !createdContactId) {
          showToast.error('Contact or Account is required to create an Opportunity');
          return;
        }

        createdOpportunityId = (Date.now() + 2).toString();
        const newOpportunity = {
          id: createdOpportunityId,
          name: conversionData.opportunityData.name,
          accountId: createdAccountId || '',
          contactId: createdContactId || '',
          stage: conversionData.opportunityData.stage,
          amount: conversionData.opportunityData.amount,
          probability: conversionData.opportunityData.probability,
          expectedCloseDate: conversionData.opportunityData.expectedCloseDate,
          assignedTo: lead.assignedTo,
          source: lead.source,
          description: conversionData.opportunityData.description,
          products: conversionData.opportunityData.products,
          competitors: [],
          nextStep: conversionData.opportunityData.nextStep,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const storedOpportunities = localStorage.getItem('opportunities');
        const opportunities = storedOpportunities ? JSON.parse(storedOpportunities) : [];
        opportunities.push(newOpportunity);
        localStorage.setItem('opportunities', JSON.stringify(opportunities));

        // Update account with opportunity ID
        if (createdAccountId) {
          const storedAccounts = localStorage.getItem('accounts');
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            const updatedAccounts = accounts.map((a: any) => 
              a.id === createdAccountId 
                ? { ...a, opportunityIds: [...a.opportunityIds, createdOpportunityId] }
                : a
            );
            localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
          }
        }
      }

      // 4. Update lead status
      const updatedLead = {
        ...lead,
        status: 'Converted' as const,
        isConverted: true,
        convertedAt: new Date().toISOString(),
        convertedToContactId: createdContactId,
        convertedToAccountId: createdAccountId,
        convertedToOpportunityId: createdOpportunityId,
        conversionType: [
          conversionData.createContact && 'Contact',
          conversionData.createAccount && 'Account', 
          conversionData.createOpportunity && 'Opportunity'
        ].filter(Boolean).join('+') as any
      };

      const storedLeads = localStorage.getItem('leads');
      if (storedLeads) {
        const leads = JSON.parse(storedLeads);
        const updatedLeads = leads.map((l: Lead) => 
          l.id === lead.id ? updatedLead : l
        );
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
      }

      // Show success message
      let message = 'Lead converted successfully!';
      if (conversionData.createContact) message += ' Contact created.';
      if (conversionData.createAccount) message += ' Account created.';
      if (conversionData.createOpportunity) message += ' Opportunity created.';
      
      showToast.success(message);
      
      // Navigate to contacts
      navigate('/crm/contacts');

    } catch (error) {
      console.error('Error during conversion:', error);
      showToast.error('Failed to convert lead. Please try again.');
    }
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead not found</h2>
          <p className="text-gray-600 mb-4">The lead you're trying to convert doesn't exist.</p>
          <Button onClick={() => navigate('/crm/leads')}>Back to Leads</Button>
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
            <p className="text-gray-600">Convert {lead.firstName} {lead.lastName} from {lead.company}</p>
          </div>
        </div>
      </div>


      {/* Conversion Options */}
      <div className="space-y-3">
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
                  onCheckedChange={(checked) => setConversionData({
                    ...conversionData, 
                    createContact: checked as boolean
                  })}
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
                  onCheckedChange={(checked) => setConversionData({
                    ...conversionData, 
                    createAccount: checked as boolean
                  })}
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
                  onCheckedChange={(checked) => setConversionData({
                    ...conversionData, 
                    createOpportunity: checked as boolean
                  })}
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
            onChange={(e) => setConversionData({
              ...conversionData, 
              conversionNotes: e.target.value
            })}
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
                Converting this lead will change its status to "Converted" and create the selected records. 
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