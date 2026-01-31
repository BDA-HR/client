import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Send, Calendar, Clock, User, FileText, History } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Textarea } from '../../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { showToast } from '../../../../layout/layout';
import { mockCommunicationTemplates } from '../../../../data/crmMockData';
import type { Lead } from '../../../../types/crm';

interface LeadCommunicationProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onCommunicationSent: (communication: any) => void;
}

interface CommunicationRecord {
  id: string;
  type: 'email' | 'call' | 'sms' | 'meeting';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  timestamp: string;
  duration?: number;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
  attachments?: string[];
}

export default function LeadCommunication({ lead, isOpen, onClose, onCommunicationSent }: LeadCommunicationProps) {
  const [activeTab, setActiveTab] = useState('compose');
  const [communicationType, setCommunicationType] = useState<'email' | 'call' | 'sms'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');

  // Mock communication history
  const [communicationHistory] = useState<CommunicationRecord[]>([
    {
      id: '1',
      type: 'email',
      direction: 'outbound',
      subject: 'Welcome to Our Community',
      content: 'Thank you for your interest in our enterprise solutions...',
      timestamp: '2024-01-15T11:00:00Z',
      followUpRequired: true,
      followUpDate: '2024-01-18T10:00:00Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'call',
      direction: 'outbound',
      content: 'Discovery call to understand requirements',
      timestamp: '2024-01-18T14:00:00Z',
      duration: 25,
      outcome: 'Positive - interested in demo',
      followUpRequired: true,
      followUpDate: '2024-01-22T10:00:00Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'email',
      direction: 'inbound',
      subject: 'Re: Welcome to Our Community',
      content: 'Thanks for reaching out. I\'d like to learn more about your solutions.',
      timestamp: '2024-01-15T15:30:00Z',
      followUpRequired: false,
      createdBy: 'John Smith'
    }
  ]);

  const handleTemplateSelect = (templateId: string) => {
    const template = mockCommunicationTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(replaceVariables(template.body));
    }
  };

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, lead.firstName)
      .replace(/\{\{lastName\}\}/g, lead.lastName)
      .replace(/\{\{company\}\}/g, lead.company)
      .replace(/\{\{industry\}\}/g, lead.industry)
      .replace(/\{\{senderName\}\}/g, 'Sarah Johnson') // Current user
      .replace(/\{\{companyName\}\}/g, 'Your Company');
  };

  const handleSendCommunication = () => {
    if (!content.trim()) {
      showToast('Please enter a message', 'error');
      return;
    }

    if (communicationType === 'email' && !subject.trim()) {
      showToast('Please enter a subject line', 'error');
      return;
    }

    const communication: CommunicationRecord = {
      id: Date.now().toString(),
      type: communicationType,
      direction: 'outbound',
      subject: communicationType === 'email' ? subject : undefined,
      content,
      timestamp: scheduledDate || new Date().toISOString(),
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : undefined,
      createdBy: 'Current User'
    };

    onCommunicationSent(communication);
    
    // Reset form
    setSubject('');
    setContent('');
    setSelectedTemplate('');
    setScheduledDate('');
    setFollowUpRequired(false);
    setFollowUpDate('');

    showToast(
      scheduledDate 
        ? `${communicationType} scheduled successfully` 
        : `${communicationType} sent successfully`, 
      'success'
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'inbound' ? 'text-green-600' : 'text-blue-600';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Communication - {lead.firstName} {lead.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Compose Communication */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Communication</CardTitle>
                <p className="text-sm text-gray-600">
                  Send an email, schedule a call, or send an SMS to {lead.firstName}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="communicationType">Communication Type</Label>
                    <Select value={communicationType} onValueChange={(value: any) => setCommunicationType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="call">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Call</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sms">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>SMS</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCommunicationTemplates
                          .filter(t => t.type === communicationType)
                          .map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {communicationType === 'email' && (
                  <div>
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter email subject"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="content">
                    {communicationType === 'email' ? 'Email Content' : 
                     communicationType === 'call' ? 'Call Notes/Script' : 'SMS Message'}
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      communicationType === 'email' ? 'Enter your email message...' :
                      communicationType === 'call' ? 'Enter call notes or script...' :
                      'Enter SMS message...'
                    }
                    rows={8}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Available variables: {`{firstName}, {lastName}, {company}, {industry}`}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Schedule for Later (Optional)</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="followUpRequired">Requires follow-up</Label>
                  </div>
                </div>

                {followUpRequired && (
                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="datetime-local"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendCommunication}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {scheduledDate ? 'Schedule' : 'Send'} {communicationType}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Communication History</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  All communications with {lead.firstName} {lead.lastName}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communicationHistory.map((comm) => (
                    <div key={comm.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={getDirectionColor(comm.direction)}>
                            {getTypeIcon(comm.type)}
                          </div>
                          <Badge variant="outline" className={getDirectionColor(comm.direction)}>
                            {comm.direction}
                          </Badge>
                          <Badge variant="secondary">
                            {comm.type}
                          </Badge>
                          {comm.subject && (
                            <span className="font-medium">{comm.subject}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimestamp(comm.timestamp)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-2">
                        {comm.content}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{comm.createdBy}</span>
                          </div>
                          {comm.duration && (
                            <div>Duration: {comm.duration} minutes</div>
                          )}
                          {comm.outcome && (
                            <div>Outcome: {comm.outcome}</div>
                          )}
                        </div>
                        
                        {comm.followUpRequired && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Follow-up: {comm.followUpDate ? new Date(comm.followUpDate).toLocaleDateString() : 'Required'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {communicationHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No communication history available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Communication Templates</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Pre-built templates for common communications
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockCommunicationTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(template.type)}
                            <span className="font-medium">{template.name}</span>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCommunicationType(template.type as any);
                              handleTemplateSelect(template.id);
                              setActiveTab('compose');
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                        
                        {template.subject && (
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            Subject: {template.subject}
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600 mb-2 line-clamp-3">
                          {template.body.substring(0, 200)}...
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div>Used {template.usage} times</div>
                          <div className="flex space-x-4">
                            {template.openRate && (
                              <span>Open Rate: {template.openRate}%</span>
                            )}
                            {template.responseRate && (
                              <span>Response Rate: {template.responseRate}%</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}