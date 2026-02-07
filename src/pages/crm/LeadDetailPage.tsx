import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Phone, Mail, Building, User, Calendar, DollarSign, Target, CheckSquare, MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import LeadActivities from '../../components/crm/leadManagement/leads/detail/LeadActivities';
import LeadNotes from '../../components/crm/leadManagement/leads/detail/LeadNotes';
import LeadHistory from '../../components/crm/leadManagement/leads/detail/LeadHistory';
import LeadCommunication from '../../components/crm/leadManagement/leads/detail/LeadCommunication';
import LeadScoring from '../../components/crm/leadManagement/leads/detail/LeadScoring';
import type { Lead } from '../../types/crm';

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Qualified': 'bg-green-100 text-green-800',
  'Proposal Sent': 'bg-purple-100 text-purple-800',
  'Closed Won': 'bg-emerald-100 text-emerald-800',
  'Closed Lost': 'bg-red-100 text-red-800'
};

const sourceColors: Record<string, string> = {
  'Website': 'bg-orange-100 text-orange-800',
  'Email': 'bg-blue-100 text-blue-800',
  'Phone': 'bg-green-100 text-green-800',
  'Social Media': 'bg-purple-100 text-purple-800',
  'Referral': 'bg-pink-100 text-pink-800',
  'Event': 'bg-indigo-100 text-indigo-800'
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCommunicationDialogOpen, setIsCommunicationDialogOpen] = useState(false);
  const [isScoringDialogOpen, setIsScoringDialogOpen] = useState(false);
  const [leadData, setLeadData] = useState<Lead | null>(null);

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

  const lead = leadData || loadLead();

  // Update lead data when component mounts
  useState(() => {
    setLeadData(loadLead());
  });

  const handleCommunicationSent = (_communication: any) => {
    // In a real app, this would log the communication
    showToast.success('Communication sent successfully');
  };

  const handleScoreUpdate = (leadId: string, newScore: number, _breakdown: any[]) => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      try {
        const leads = JSON.parse(storedLeads);
        const updatedLeads = leads.map((l: Lead) => 
          l.id === leadId 
            ? { ...l, score: newScore, updatedAt: new Date().toISOString() }
            : l
        );
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
        setLeadData(updatedLeads.find((l: Lead) => l.id === leadId));
        showToast.success('Lead score updated successfully');
      } catch (error) {
        console.error('Error updating lead score:', error);
        showToast.error('Failed to update lead score');
      }
    }
  };

  const handleConversion = (conversionData: any) => {
    if (!leadData) return;
    
    console.log('Converting lead with data:', conversionData);
    
    let createdContactId: string | undefined;
    let createdAccountId: string | undefined;
    let createdOpportunityId: string | undefined;
    
    try {
      // 1. Create Contact if requested
      if (conversionData.createContact && conversionData.contactData) {
        createdContactId = Date.now().toString();
        const newContact = {
          id: createdContactId,
          firstName: conversionData.contactData.firstName || leadData.firstName,
          lastName: conversionData.contactData.lastName || leadData.lastName,
          email: conversionData.contactData.email || leadData.email,
          phone: conversionData.contactData.phone || leadData.phone,
          company: conversionData.contactData.company || leadData.company,
          jobTitle: conversionData.contactData.jobTitle || leadData.jobTitle,
          address: conversionData.contactData.address || '',
          city: conversionData.contactData.city || '',
          state: conversionData.contactData.state || '',
          zipCode: conversionData.contactData.zipCode || '',
          country: conversionData.contactData.country || 'USA',
          tags: conversionData.contactData.tags || [],
          socialMedia: conversionData.contactData.socialMedia || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastContactDate: new Date().toISOString(),
          notes: conversionData.contactData.notes || leadData.notes || '',
          isActive: true,
          stage: conversionData.contactData.stage || 'Prospect',
          owner: conversionData.contactData.owner || leadData.assignedTo,
          teamVisibility: conversionData.contactData.teamVisibility || 'team',
          consentStatus: conversionData.contactData.consentStatus || 'pending',
          customFields: conversionData.contactData.customFields || {},
          relationshipScore: conversionData.contactData.relationshipScore || Math.min(leadData.score, 100),
          lastInteractionType: 'conversion',
          segmentIds: conversionData.contactData.segmentIds || [],
          convertedFromLeadId: leadData.id,
          accountId: undefined // Will be set if account is created
        };
        
        // Save to localStorage
        const storedContacts = localStorage.getItem('contacts');
        const contacts = storedContacts ? JSON.parse(storedContacts) : [];
        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('contactsUpdated'));
        
        console.log('Created contact:', newContact);
        console.log('Total contacts in storage:', contacts.length);
      }
      
      // 2. Create Account if requested
      if (conversionData.createAccount && conversionData.accountData) {
        createdAccountId = (Date.now() + 1).toString();
        const newAccount = {
          ...conversionData.accountData,
          id: createdAccountId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          primaryContactId: createdContactId,
          contactIds: createdContactId ? [createdContactId] : [],
          opportunityIds: []
        };
        
        // Save to localStorage
        const storedAccounts = localStorage.getItem('accounts');
        const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Update contact with account ID if contact was created
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
        
        console.log('Created account:', newAccount);
      }
      
      // 3. Create Opportunity if requested
      if (conversionData.createOpportunity && conversionData.opportunityData) {
        if (!createdAccountId || !createdContactId) {
          showToast.error('Account and Contact are required to create an Opportunity');
          return;
        }
        
        createdOpportunityId = (Date.now() + 2).toString();
        const newOpportunity = {
          ...conversionData.opportunityData,
          id: createdOpportunityId,
          accountId: createdAccountId,
          contactId: createdContactId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          products: [],
          competitors: [],
          nextStep: 'Initial qualification call'
        };
        
        // Save to localStorage
        const storedOpportunities = localStorage.getItem('opportunities');
        const opportunities = storedOpportunities ? JSON.parse(storedOpportunities) : [];
        opportunities.push(newOpportunity);
        localStorage.setItem('opportunities', JSON.stringify(opportunities));
        
        // Update account with opportunity ID
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
        
        console.log('Created opportunity:', newOpportunity);
      }
      
      // 4. Update lead status
      const updatedLead = {
        ...leadData,
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
      
      // Update lead in localStorage
      const storedLeads = localStorage.getItem('leads');
      if (storedLeads) {
        const leads = JSON.parse(storedLeads);
        const updatedLeads = leads.map((l: Lead) => 
          l.id === leadData.id ? updatedLead : l
        );
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
      }
      
      setLeadData(updatedLead);
      
      // Show success message with next steps
      let message = 'Lead converted successfully!';
      if (conversionData.createContact) {
        message += ' Contact created.';
      }
      if (conversionData.createAccount) {
        message += ' Account created.';
      }
      if (conversionData.createOpportunity) {
        message += ' Opportunity created.';
      }
      
      showToast.success(message);
      
      // Navigate to the appropriate page
      if (conversionData.createContact) {
        setTimeout(() => {
          navigate('/crm/contacts');
        }, 2000);
      }
      
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
          <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist.</p>
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
            onClick={() => navigate('/crm/leads')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-gray-600">{lead.jobTitle} at {lead.company}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsCommunicationDialogOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Communicate
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsScoringDialogOpen(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            Update Score
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate(`/crm/leads/${lead.id}/convert`)}
            disabled={lead.isConverted}
          >
            {lead.isConverted ? (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                Converted
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert Lead
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Lead Score</span>
                      <span>{lead.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Next Steps</h4>
                    <p className="text-sm text-gray-600">
                      Based on the current status "{lead.status}", consider:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {lead.status === 'New' && (
                        <>
                          <li>• Schedule initial contact call</li>
                          <li>• Research company background</li>
                          <li>• Prepare qualification questions</li>
                        </>
                      )}
                      {lead.status === 'Contacted' && (
                        <>
                          <li>• Follow up on initial conversation</li>
                          <li>• Qualify budget and timeline</li>
                          <li>• Schedule product demo</li>
                        </>
                      )}
                      {lead.status === 'Qualified' && (
                        <>
                          <li>• Prepare customized proposal</li>
                          <li>• Schedule stakeholder meeting</li>
                          <li>• Gather technical requirements</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = `tel:${lead.phone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {lead.firstName}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = `mailto:${lead.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsCommunicationDialogOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/crm/leads/${lead.id}/convert`)}
                    disabled={lead.isConverted}
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Convert to Opportunity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <LeadActivities leadId={lead.id} />
        </TabsContent>

        <TabsContent value="notes">
          <LeadNotes leadId={lead.id} />
        </TabsContent>

        <TabsContent value="history">
          <LeadHistory leadId={lead.id} />
        </TabsContent>
      </Tabs>

      {/* Lead Communication Dialog */}
      {lead && (
        <LeadCommunication
          lead={lead}
          isOpen={isCommunicationDialogOpen}
          onClose={() => setIsCommunicationDialogOpen(false)}
          onCommunicationSent={handleCommunicationSent}
        />
      )}

      {/* Lead Scoring Dialog */}
      {lead && (
        <LeadScoring
          lead={lead}
          isOpen={isScoringDialogOpen}
          onClose={() => setIsScoringDialogOpen(false)}
          onScoreUpdate={handleScoreUpdate}
        />
      )}
    </motion.div>
  );
}