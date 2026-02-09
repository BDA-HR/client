import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import type { Contact } from '../../../../types/crm';

interface ContactEmailModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (emailData: { subject: string; message: string }) => void;
}

export default function ContactEmailModal({ 
  contact, 
  isOpen, 
  onClose, 
  onEmailSent 
}: ContactEmailModalProps) {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const emailTemplates = [
    {
      name: 'Initial Contact',
      subject: 'Thank you for your interest',
      message: `Hi ${contact.firstName},\n\nThank you for your interest in our services. I'd love to learn more about your specific needs and how we can help.\n\nWould you be available for a brief call this week to discuss your requirements?\n\nBest regards,\n[Your Name]`
    },
    {
      name: 'Follow-up',
      subject: 'Following up on our conversation',
      message: `Hi ${contact.firstName},\n\nI wanted to follow up on our recent conversation about your project requirements.\n\nAs discussed, I'm attaching some additional information that might be helpful.\n\nPlease let me know if you have any questions or if you'd like to schedule a demo.\n\nBest regards,\n[Your Name]`
    },
    {
      name: 'Product Demo',
      subject: 'Product demonstration invitation',
      message: `Hi ${contact.firstName},\n\nI'd like to invite you to a personalized demonstration of our solution.\n\nBased on our conversation, I believe our platform can address your specific needs.\n\nWould you be available for a 30-minute demo this week?\n\nBest regards,\n[Your Name]`
    },
    {
      name: 'Check-in',
      subject: 'Checking in',
      message: `Hi ${contact.firstName},\n\nI hope this email finds you well. I wanted to check in and see how things are going with ${contact.company}.\n\nIs there anything we can help you with?\n\nBest regards,\n[Your Name]`
    }
  ];

  const handleTemplateSelect = (template: typeof emailTemplates[0]) => {
    setEmailData({
      subject: template.subject,
      message: template.message
    });
  };

  const handleSend = () => {
    if (emailData.message.trim() && emailData.subject.trim()) {
      onEmailSent(emailData);
      setEmailData({
        subject: '',
        message: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span>Send Email to {contact.firstName} {contact.lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emailTo">To</Label>
              <Input
                id="emailTo"
                value={contact.email}
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
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label htmlFor="emailMessage">Message</Label>
            <Textarea
              id="emailMessage"
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Type your email message here..."
              rows={12}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!emailData.message.trim() || !emailData.subject.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
