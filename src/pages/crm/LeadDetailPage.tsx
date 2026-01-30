import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Phone, Mail, Building, User, Calendar, DollarSign, Target, CheckSquare, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { showToast } from '../../layout/layout';
import { mockLeads } from '../../data/crmMockData';
import LeadActivities from '../../components/crm/leadManagement/components/LeadActivities';
import LeadNotes from '../../components/crm/leadManagement/components/LeadNotes';
import LeadHistory from '../../components/crm/leadManagement/components/LeadHistory';
import LeadCommunication from '../../components/crm/leadManagement/components/LeadCommunication';
import LeadScoring from '../../components/crm/leadManagement/components/LeadScoring';
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
            variant="outline"
            onClick={() => navigate(`/crm/leads/${lead.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate(`/crm/leads/${lead.id}/convert`)}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Convert Lead
          </Button>
        </div>
      </div>

      {/* Lead Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>Lead Summary</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Badge className={statusColors[lead.status]}>
                {lead.status}
              </Badge>
              <Badge className={sourceColors[lead.source]}>
                {lead.source}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{lead.company}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Lead Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Score: {lead.score}/100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Assigned to: {lead.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Industry: {lead.industry}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Opportunity</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Budget: ${lead.budget?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Timeline: {lead.timeline}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Dates</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Created:</span><br />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Updated:</span><br />
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Initial Notes</h4>
              <p className="text-sm text-gray-700">{lead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {lead.firstName}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
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