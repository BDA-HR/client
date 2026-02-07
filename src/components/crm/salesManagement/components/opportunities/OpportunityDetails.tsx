import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Calendar, User, Building, Target, Tag, FileText, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog';
import { Button } from '../../../../ui/button';
import { Badge } from '../../../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../ui/card';
import { Progress } from '../../../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs';
import OpportunityDocuments from './OpportunityDocuments';
import OpportunityCommunications from './OpportunityCommunications';
import type { Opportunity } from '../../../../../types/crm';

interface OpportunityDetailsProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (opportunity: Opportunity) => void;
}

const stageColors = {
  'Qualification': 'bg-blue-100 text-blue-800',
  'Needs Analysis': 'bg-yellow-100 text-yellow-800',
  'Proposal': 'bg-orange-100 text-orange-800',
  'Negotiation': 'bg-purple-100 text-purple-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800'
};

export default function OpportunityDetails({
  opportunity,
  isOpen,
  onClose,
  onEdit
}: OpportunityDetailsProps) {
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

  if (!opportunity) return null;

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
  const weightedValue = (opportunity.amount * opportunity.probability) / 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>{opportunity.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(opportunity)}
              >
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Amount</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(opportunity.amount)}</p>
                    </div>
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Weighted Value</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(weightedValue)}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Probability</p>
                      <p className="text-lg font-bold text-purple-600">{opportunity.probability}%</p>
                    </div>
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Days to Close</p>
                      <p className={`text-lg font-bold ${
                        daysUntilClose < 0 ? 'text-red-600' : 
                        daysUntilClose < 7 ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {daysUntilClose < 0 ? `${Math.abs(daysUntilClose)} overdue` : daysUntilClose}
                      </p>
                    </div>
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Basic Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Stage</label>
                        <div className="mt-1">
                          <Badge className={stageColors[opportunity.stage]}>
                            {opportunity.stage}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500">Source</label>
                        <p className="text-sm text-gray-900">{opportunity.source}</p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500">Assigned To</label>
                        <div className="flex items-center space-x-1 mt-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{opportunity.assignedTo}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500">Account</label>
                        <div className="flex items-center space-x-1 mt-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{opportunity.accountId || 'No Account'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500">Primary Contact</label>
                        <p className="text-sm text-gray-900">{opportunity.contactId || 'No Contact'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Financial Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Expected Close Date</label>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(opportunity.expectedCloseDate)}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500">Probability Progress</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={opportunity.probability} className="flex-1" />
                          <span className="text-sm font-medium">{opportunity.probability}%</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          <Badge variant={opportunity.isActive ? "default" : "secondary"}>
                            {opportunity.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                {opportunity.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Next Step */}
                {opportunity.nextStep && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Next Step</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{opportunity.nextStep}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Products & Services</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {opportunity.products && opportunity.products.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {opportunity.products.map((product, index) => (
                          <Badge key={index} variant="secondary">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No products specified</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competition" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Competitors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {opportunity.competitors && opportunity.competitors.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {opportunity.competitors.map((competitor, index) => (
                          <Badge key={index} variant="outline">
                            {competitor}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No competitors identified</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                <OpportunityCommunications
                  opportunityId={opportunity.id}
                  communications={communications}
                  onAdd={handleCommunicationAdd}
                  onEdit={handleCommunicationEdit}
                  onDelete={handleCommunicationDelete}
                />
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <OpportunityDocuments
                  opportunityId={opportunity.id}
                  documents={documents}
                  onUpload={handleDocumentUpload}
                  onDelete={handleDocumentDelete}
                  onDownload={handleDocumentDownload}
                  onView={handleDocumentView}
                />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Created</p>
                        <p className="text-xs text-gray-500">{formatDate(opportunity.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(opportunity.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        daysUntilClose < 0 ? 'bg-red-500' : 
                        daysUntilClose < 7 ? 'bg-orange-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium">Expected Close</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(opportunity.expectedCloseDate)}
                          {daysUntilClose < 0 && (
                            <span className="text-red-600 ml-1">(Overdue)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}