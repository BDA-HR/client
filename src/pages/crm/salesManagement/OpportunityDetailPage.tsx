import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, DollarSign, Calendar, User, Building, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import OpportunityDocuments from '../../../components/crm/salesManagement/components/opportunities/OpportunityDocuments';
import OpportunityCommunications from '../../../components/crm/salesManagement/components/opportunities/OpportunityCommunications';
import { mockOpportunities } from '../../../data/crmMockData';
import type { Opportunity } from '../../../types/crm';

const stageColors = {
  'Qualification': 'bg-blue-100 text-blue-800',
  'Needs Analysis': 'bg-yellow-100 text-yellow-800',
  'Proposal': 'bg-orange-100 text-orange-800',
  'Negotiation': 'bg-purple-100 text-purple-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800'
};

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('activities');

  // Mock data for documents and communications
  const [documents] = useState([
    {
      id: '1',
      name: 'Proposal_TechCorp_v2.pdf',
      type: 'application/pdf',
      size: 2048576,
      category: 'proposal' as const,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-15T10:30:00Z',
      description: 'Updated proposal with revised pricing',
      url: '/documents/proposal_techcorp_v2.pdf',
      version: 2
    },
    {
      id: '2',
      name: 'Technical_Specifications.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1024000,
      category: 'technical' as const,
      uploadedBy: 'Mike Wilson',
      uploadedAt: '2024-01-20T14:15:00Z',
      description: 'Detailed technical requirements and specifications',
      url: '/documents/technical_specs.docx',
      version: 1
    }
  ]);

  const [communications] = useState([
    {
      id: '1',
      type: 'call' as const,
      subject: 'Initial Discovery Call',
      content: 'Discussed client requirements and current pain points. They are looking for a comprehensive solution that can scale with their business.',
      direction: 'outbound' as const,
      contactPerson: 'Alice Johnson',
      contactEmail: 'alice@techcorp.com',
      contactPhone: '+1 (555) 123-4567',
      duration: 45,
      completedAt: '2024-01-10T15:30:00Z',
      createdBy: 'Sarah Johnson',
      outcome: 'Positive response, agreed to send proposal',
      followUpRequired: true,
      followUpDate: '2024-01-17T10:00:00Z'
    },
    {
      id: '2',
      type: 'email' as const,
      subject: 'Proposal Follow-up',
      content: 'Sent the updated proposal with revised pricing. Highlighted key benefits and ROI calculations.',
      direction: 'outbound' as const,
      contactPerson: 'Alice Johnson',
      contactEmail: 'alice@techcorp.com',
      completedAt: '2024-01-15T11:00:00Z',
      createdBy: 'Sarah Johnson',
      outcome: 'Proposal delivered successfully',
      followUpRequired: true,
      followUpDate: '2024-01-22T14:00:00Z'
    }
  ]);

  useEffect(() => {
    if (id) {
      const foundOpportunity = mockOpportunities.find(opp => opp.id === id);
      setOpportunity(foundOpportunity || null);
    }
  }, [id]);

  // Mock handlers for documents and communications
  const handleDocumentUpload = (file: File, category: string, description: string) => {
    console.log('Upload document:', file.name, category, description);
    // In real app, this would upload to backend
  };

  const handleDocumentDelete = (documentId: string) => {
    console.log('Delete document:', documentId);
    // In real app, this would delete from backend
  };

  const handleDocumentDownload = (document: any) => {
    console.log('Download document:', document.name);
    // In real app, this would trigger download
  };

  const handleDocumentView = (document: any) => {
    console.log('View document:', document.name);
    // In real app, this would open document viewer
  };

  const handleCommunicationAdd = (communication: any) => {
    console.log('Add communication:', communication);
    // In real app, this would save to backend
  };

  const handleCommunicationEdit = (communication: any) => {
    console.log('Edit communication:', communication);
    // In real app, this would update in backend
  };

  const handleCommunicationDelete = (communicationId: string) => {
    console.log('Delete communication:', communicationId);
    // In real app, this would delete from backend
  };

  const handleEdit = () => {
    // Navigate to edit form or open edit modal
    console.log('Edit opportunity:', opportunity?.id);
  };

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-4">The opportunity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/crm/sales-management')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales Management
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilClose = (dateString: string) => {
    const closeDate = new Date(dateString);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose(opportunity.expectedCloseDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/crm/sales-management')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Pipeline</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{opportunity.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={stageColors[opportunity.stage]}>
                    {opportunity.stage}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">ID: {opportunity.id}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">Created {formatDate(opportunity.createdAt)}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Opportunity
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(opportunity.amount)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weighted Value</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency((opportunity.amount * opportunity.probability) / 100)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Probability</p>
                  <p className="text-2xl font-bold text-purple-600">{opportunity.probability}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days to Close</p>
                  <p className={`text-2xl font-bold ${
                    daysUntilClose < 0 ? 'text-red-600' : 
                    daysUntilClose < 7 ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {daysUntilClose < 0 ? `${Math.abs(daysUntilClose)} overdue` : daysUntilClose}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeWorkflowTab} onValueChange={setActiveWorkflowTab} className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="activities" 
                  className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-600 data-[state=active]:border-b-2 data-[state=active]:border-yellow-600 rounded-none py-4"
                >
                  Activity Log
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none py-4"
                >
                  Document Management
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Activities Tab */}
              <TabsContent value="activities" className="mt-0">
                <OpportunityCommunications
                  opportunityId={opportunity.id}
                  communications={communications}
                  onAdd={handleCommunicationAdd}
                  onEdit={handleCommunicationEdit}
                  onDelete={handleCommunicationDelete}
                />
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-0">
                <OpportunityDocuments
                  opportunityId={opportunity.id}
                  documents={documents}
                  onUpload={handleDocumentUpload}
                  onDelete={handleDocumentDelete}
                  onDownload={handleDocumentDownload}
                  onView={handleDocumentView}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
