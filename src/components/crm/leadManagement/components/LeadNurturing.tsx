import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, Calendar, Play, Pause, Edit, Trash2, Plus, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Progress } from '../../../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Textarea } from '../../../ui/textarea';
import { showToast } from '../../../../layout/layout';
import { mockNurturingCampaigns, mockCommunicationTemplates } from '../../../../data/crmMockData';

interface LeadNurturingProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
}

interface NurturingStep {
  id: string;
  name: string;
  type: 'email' | 'call' | 'task' | 'sms';
  delay: number; // hours
  templateId?: string;
  subject?: string;
  description?: string;
  assignedTo?: string;
  isActive: boolean;
}

interface NurturingCampaign {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Paused' | 'Draft';
  triggerConditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  steps: NurturingStep[];
  metrics: {
    enrolled: number;
    completed: number;
    optedOut: number;
    converted: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function LeadNurturing({ isOpen, onClose, leadId }: LeadNurturingProps) {
  const [campaigns, setCampaigns] = useState<NurturingCampaign[]>(mockNurturingCampaigns as NurturingCampaign[]);
  const [selectedCampaign, setSelectedCampaign] = useState<NurturingCampaign | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<NurturingCampaign>>({
    name: '',
    description: '',
    status: 'Draft',
    triggerConditions: [],
    steps: [],
    metrics: { enrolled: 0, completed: 0, optedOut: 0, converted: 0 }
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const campaign: NurturingCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name!,
      description: newCampaign.description!,
      status: 'Draft',
      triggerConditions: newCampaign.triggerConditions || [],
      steps: newCampaign.steps || [],
      metrics: { enrolled: 0, completed: 0, optedOut: 0, converted: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: '',
      description: '',
      status: 'Draft',
      triggerConditions: [],
      steps: [],
      metrics: { enrolled: 0, completed: 0, optedOut: 0, converted: 0 }
    });
    setIsCreateDialogOpen(false);
    showToast('Nurturing campaign created successfully', 'success');
  };

  const handleToggleCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: campaign.status === 'Active' ? 'Paused' : 'Active',
            updatedAt: new Date().toISOString()
          }
        : campaign
    ));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    showToast('Campaign deleted successfully', 'success');
  };

  const addStep = (campaign: Partial<NurturingCampaign>) => {
    const newStep: NurturingStep = {
      id: Date.now().toString(),
      name: '',
      type: 'email',
      delay: 0,
      isActive: true
    };
    
    return {
      ...campaign,
      steps: [...(campaign.steps || []), newStep]
    };
  };

  const removeStep = (campaign: Partial<NurturingCampaign>, stepId: string) => {
    return {
      ...campaign,
      steps: campaign.steps?.filter(step => step.id !== stepId) || []
    };
  };

  const updateStep = (campaign: Partial<NurturingCampaign>, stepId: string, updates: Partial<NurturingStep>) => {
    return {
      ...campaign,
      steps: campaign.steps?.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ) || []
    };
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'task': return <Calendar className="w-4 h-4" />;
      case 'sms': return <Users className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDelay = (hours: number) => {
    if (hours === 0) return 'Immediately';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const CampaignForm = ({ 
    campaign, 
    onChange 
  }: { 
    campaign: Partial<NurturingCampaign>, 
    onChange: (campaign: Partial<NurturingCampaign>) => void 
  }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaignName">Campaign Name *</Label>
          <Input
            id="campaignName"
            value={campaign.name || ''}
            onChange={(e) => onChange({ ...campaign, name: e.target.value })}
            placeholder="Enter campaign name"
          />
        </div>
        <div>
          <Label htmlFor="campaignStatus">Status</Label>
          <Select
            value={campaign.status || 'Draft'}
            onValueChange={(value) => onChange({ ...campaign, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="campaignDescription">Description *</Label>
        <Textarea
          id="campaignDescription"
          value={campaign.description || ''}
          onChange={(e) => onChange({ ...campaign, description: e.target.value })}
          placeholder="Describe the purpose and goals of this campaign"
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Campaign Steps</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(addStep(campaign))}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {campaign.steps?.map((step, index) => (
            <Card key={step.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Step {index + 1}</Badge>
                  {getStepIcon(step.type)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(removeStep(campaign, step.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Step Name</Label>
                  <Input
                    value={step.name}
                    onChange={(e) => onChange(updateStep(campaign, step.id, { name: e.target.value }))}
                    placeholder="Enter step name"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={step.type}
                    onValueChange={(value) => onChange(updateStep(campaign, step.id, { type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Delay (hours)</Label>
                  <Input
                    type="number"
                    value={step.delay}
                    onChange={(e) => onChange(updateStep(campaign, step.id, { delay: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDelay(step.delay)}
                  </p>
                </div>
                {step.type === 'email' && (
                  <div>
                    <Label>Email Template</Label>
                    <Select
                      value={step.templateId || ''}
                      onValueChange={(value) => onChange(updateStep(campaign, step.id, { templateId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCommunicationTemplates
                          .filter(t => t.type === 'email')
                          .map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {step.type === 'email' && (
                <div className="mt-4">
                  <Label>Subject Line</Label>
                  <Input
                    value={step.subject || ''}
                    onChange={(e) => onChange(updateStep(campaign, step.id, { subject: e.target.value }))}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              <div className="mt-4">
                <Label>Description</Label>
                <Textarea
                  value={step.description || ''}
                  onChange={(e) => onChange(updateStep(campaign, step.id, { description: e.target.value }))}
                  placeholder="Describe this step"
                  rows={2}
                />
              </div>
            </Card>
          ))}

          {(!campaign.steps || campaign.steps.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No steps added yet. Click "Add Step" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Heart className="w-5 h-5 text-orange-600" />
        <h2 className="text-2xl font-bold">Lead Nurturing Campaigns</h2>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Nurturing Campaigns</h3>
                <p className="text-sm text-gray-600">
                  Automated sequences to engage and nurture leads
                </p>
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCampaign(campaign.id)}
                        >
                          {campaign.status === 'Active' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setNewCampaign(campaign);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.metrics.enrolled}</div>
                        <div className="text-sm text-gray-600">Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{campaign.metrics.completed}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{campaign.metrics.converted}</div>
                        <div className="text-sm text-gray-600">Converted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{campaign.metrics.optedOut}</div>
                        <div className="text-sm text-gray-600">Opted Out</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{((campaign.metrics.completed / campaign.metrics.enrolled) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={(campaign.metrics.completed / campaign.metrics.enrolled) * 100} 
                        className="w-full h-2" 
                      />
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Campaign Steps ({campaign.steps.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {campaign.steps.map((step, index) => (
                          <Badge key={step.id} variant="outline" className="flex items-center space-x-1">
                            {getStepIcon(step.type)}
                            <span>{step.name || `Step ${index + 1}`}</span>
                            <span className="text-xs">({formatDelay(step.delay)})</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Campaign Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Opt-out Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const completionRate = (campaign.metrics.completed / campaign.metrics.enrolled) * 100;
                      const conversionRate = (campaign.metrics.converted / campaign.metrics.enrolled) * 100;
                      const optOutRate = (campaign.metrics.optedOut / campaign.metrics.enrolled) * 100;
                      
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.metrics.enrolled}</TableCell>
                          <TableCell>{completionRate.toFixed(1)}%</TableCell>
                          <TableCell>{conversionRate.toFixed(1)}%</TableCell>
                          <TableCell>{optOutRate.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Campaign Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Nurturing Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <CampaignForm campaign={newCampaign} onChange={setNewCampaign} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} className="bg-orange-600 hover:bg-orange-700">
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Campaign Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Nurturing Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <CampaignForm campaign={newCampaign} onChange={setNewCampaign} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Update campaign logic here
                    setIsEditDialogOpen(false);
                    showToast('Campaign updated successfully', 'success');
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Update Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}