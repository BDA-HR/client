import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, Send } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import { Textarea } from '../../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
import type { Lead } from '../../../../../types/crm';

interface Communication {
  type: 'email' | 'call' | 'sms' | 'meeting';
  subject?: string;
  message: string;
  scheduledFor?: string;
  duration?: number;
}

interface LeadCommunicationProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onCommunicationSent: (communication: Communication) => void;
}

export default function LeadCommunication({ 
  lead, 
  isOpen, 
  onClose, 
  onCommunicationSent 
}: LeadCommunicationProps) {
  const [activeTab, setActiveTab] = useState('email');
  const [communication, setCommunication] = useState<Communication>({
    type: 'email',
    subject: '',
    message: '',
    scheduledFor: '',
    duration: 30
  });

  const emailTemplates = [
    {
      name: 'Initial Contact',
      subject: 'Thank you for your interest in our solution',
      message: `Hi ${lead.firstName},\n\nThank you for your interest in our solution. I'd love to learn more about your specific needs and how we can help.\n\nWould you be available for a brief call this week to discuss your requirements?\n\nBest regards,\n[Your Name]`
    },
    {
      name: 'Follow-up',
      subject: 'Following up on our conversation',
      message: `Hi ${lead.firstName},\n\nI wanted to follow up on our recent conversation about your project requirements.\n\nAs discussed, I'm attaching some additional information that might be helpful.\n\nPlease let me know if you have any questions or if you'd like to schedule a demo.\n\nBest regards,\n[Your Name]`
    },
    {
      name: 'Product Demo',
      subject: 'Product demonstration invitation',
      message: `Hi ${lead.firstName},\n\nI'd like to invite you to a personalized demonstration of our solution.\n\nBased on our conversation, I believe our platform can address your specific needs around [specific requirement].\n\nWould you be available for a 30-minute demo this week?\n\nBest regards,\n[Your Name]`
    }
  ];

  const handleTemplateSelect = (template: typeof emailTemplates[0]) => {
    setCommunication(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message
    }));
  };

  const handleSend = () => {
    if (communication.message.trim()) {
      onCommunicationSent(communication);
      setCommunication({
        type: activeTab as Communication['type'],
        subject: '',
        message: '',
        scheduledFor: '',
        duration: 30
      });
      onClose();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCommunication(prev => ({
      ...prev,
      type: tab as Communication['type']
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Communicate with {lead.firstName} {lead.lastName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="call" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Meeting</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailTo">To</Label>
                <Input
                  id="emailTo"
                  value={lead.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="emailTemplate">Template</Label>
                <Select onValueChange={(value) => {
                  const template = emailTemplates.find(t => t.name === value);
                  if (template) handleTemplateSelect(template);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                value={communication.subject}
                onChange={(e) => setCommunication(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="emailMessage">Message</Label>
              <Textarea
                id="emailMessage"
                value={communication.message}
                onChange={(e) => setCommunication(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your email message here..."
                rows={8}
              />
            </div>
          </TabsContent>

          <TabsContent value="call" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="callNumber">Phone Number</Label>
                <Input
                  id="callNumber"
                  value={lead.phone}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="callDuration">Expected Duration (minutes)</Label>
                <Input
                  id="callDuration"
                  type="number"
                  value={communication.duration}
                  onChange={(e) => setCommunication(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min="5"
                  max="120"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="callNotes">Call Notes/Agenda</Label>
              <Textarea
                id="callNotes"
                value={communication.message}
                onChange={(e) => setCommunication(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Notes about the call purpose, agenda, or talking points..."
                rows={6}
              />
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div>
              <Label htmlFor="smsNumber">Phone Number</Label>
              <Input
                id="smsNumber"
                value={lead.phone}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="smsMessage">Message</Label>
              <Textarea
                id="smsMessage"
                value={communication.message}
                onChange={(e) => setCommunication(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your SMS message here..."
                rows={4}
                maxLength={160}
              />
              <p className="text-sm text-gray-500 mt-1">
                {communication.message.length}/160 characters
              </p>
            </div>
          </TabsContent>

          <TabsContent value="meeting" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingDate">Date & Time</Label>
                <Input
                  id="meetingDate"
                  type="datetime-local"
                  value={communication.scheduledFor}
                  onChange={(e) => setCommunication(prev => ({ ...prev, scheduledFor: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="meetingDuration">Duration (minutes)</Label>
                <Input
                  id="meetingDuration"
                  type="number"
                  value={communication.duration}
                  onChange={(e) => setCommunication(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min="15"
                  max="240"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="meetingSubject">Meeting Subject</Label>
              <Input
                id="meetingSubject"
                value={communication.subject}
                onChange={(e) => setCommunication(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Meeting subject"
              />
            </div>
            <div>
              <Label htmlFor="meetingAgenda">Agenda/Notes</Label>
              <Textarea
                id="meetingAgenda"
                value={communication.message}
                onChange={(e) => setCommunication(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Meeting agenda, topics to discuss, or additional notes..."
                rows={6}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!communication.message.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {activeTab === 'email' && 'Send Email'}
            {activeTab === 'call' && 'Log Call'}
            {activeTab === 'sms' && 'Send SMS'}
            {activeTab === 'meeting' && 'Schedule Meeting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}