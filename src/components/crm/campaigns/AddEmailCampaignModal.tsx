import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Mail } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Checkbox } from '../../ui/checkbox';

interface AddEmailCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: any) => void;
  editingCampaign?: any;
}

const statusOptions = ['Draft', 'Scheduled', 'Sent', 'Cancelled'];
const targetTypeOptions = ['Leads', 'Customers', 'Contacts'];

// Email templates
const emailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}!',
    previewText: 'We\'re excited to have you on board',
    body: 'Dear {{first_name}},\n\nWelcome to {{company_name}}! We\'re thrilled to have you join our community.\n\nBest regards,\nThe Team'
  },
  {
    id: 'promotion',
    name: 'Promotional Email',
    subject: 'Special Offer Just for You!',
    previewText: 'Don\'t miss out on this exclusive deal',
    body: 'Hi {{first_name}},\n\nWe have an exclusive offer just for you! Get {{discount}}% off on your next purchase.\n\nUse code: {{promo_code}}\n\nBest regards,\nSales Team'
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    subject: '{{company_name}} Monthly Newsletter',
    previewText: 'Your monthly update is here',
    body: 'Hello {{first_name}},\n\nHere\'s what\'s new this month at {{company_name}}.\n\n{{newsletter_content}}\n\nStay connected,\nThe Team'
  },
  {
    id: 'followup',
    name: 'Follow-up Email',
    subject: 'Following up on our conversation',
    previewText: 'Let\'s continue our discussion',
    body: 'Hi {{first_name}},\n\nI wanted to follow up on our recent conversation about {{topic}}.\n\nLooking forward to hearing from you.\n\nBest regards,\n{{sender_name}}'
  }
];

export default function AddEmailCampaignModal({
  isOpen,
  onClose,
  onSubmit,
  editingCampaign
}: AddEmailCampaignModalProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    campaignId: '',
    templateId: '',
    subject: '',
    previewText: '',
    body: '',
    sendToAll: true,
    targetType: 'Leads',
    selectedRecipients: [] as string[],
    scheduledDate: '',
    status: 'Draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load campaigns from localStorage
    const storedCampaigns = localStorage.getItem('campaigns');
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }

    // Load leads
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }

    // Load customers (from contacts with type customer)
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts);
      setContacts(allContacts);
      setCustomers(allContacts.filter((c: any) => c.type === 'Customer'));
    }
  }, []);

  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        campaignId: editingCampaign.campaignId || '',
        templateId: editingCampaign.templateId || '',
        subject: editingCampaign.subject || '',
        previewText: editingCampaign.previewText || '',
        body: editingCampaign.body || '',
        sendToAll: editingCampaign.sendToAll !== undefined ? editingCampaign.sendToAll : true,
        targetType: editingCampaign.targetType || 'Leads',
        selectedRecipients: editingCampaign.selectedRecipients || [],
        scheduledDate: editingCampaign.scheduledDate || '',
        status: editingCampaign.status || 'Draft'
      });
    } else {
      setFormData({
        campaignId: '',
        templateId: '',
        subject: '',
        previewText: '',
        body: '',
        sendToAll: true,
        targetType: 'Leads',
        selectedRecipients: [],
        scheduledDate: '',
        status: 'Draft'
      });
    }
  }, [editingCampaign, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaignId) {
      newErrors.campaignId = 'Campaign is required';
    }
    if (!formData.templateId) {
      newErrors.templateId = 'Email template is required';
    }
    if (!formData.sendToAll && formData.selectedRecipients.length === 0) {
      newErrors.selectedRecipients = 'Please select at least one recipient';
    }
    if (formData.status === 'Scheduled' && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required for scheduled campaigns';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);

      if (!editingCampaign) {
        setFormData({
          campaignId: '',
          templateId: '',
          subject: '',
          previewText: '',
          body: '',
          sendToAll: true,
          targetType: 'Leads',
          selectedRecipients: [],
          scheduledDate: '',
          status: 'Draft'
        });
      }
      setErrors({});
    } catch (error) {
      console.error('Error creating email campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // When template changes, auto-fill subject, preview, and body
    if (field === 'templateId') {
      const template = emailTemplates.find(t => t.id === value);
      if (template) {
        setFormData(prev => ({
          ...prev,
          templateId: value,
          subject: template.subject,
          previewText: template.previewText,
          body: template.body
        }));
      }
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRecipientToggle = (recipientId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedRecipients.includes(recipientId);
      return {
        ...prev,
        selectedRecipients: isSelected
          ? prev.selectedRecipients.filter(id => id !== recipientId)
          : [...prev.selectedRecipients, recipientId]
      };
    });
  };

  const getRecipientList = () => {
    switch (formData.targetType) {
      case 'Leads':
        return leads;
      case 'Customers':
        return customers;
      case 'Contacts':
        return contacts;
      default:
        return [];
    }
  };

  const selectedCampaign = campaigns.find(c => c.id === formData.campaignId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>{editingCampaign ? 'Edit Email Campaign' : 'Create New Email Campaign'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-6"
          >
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignId">Campaign *</Label>
                <Select value={formData.campaignId} onValueChange={(value) => handleChange('campaignId', value)}>
                  <SelectTrigger className={`mt-1 ${errors.campaignId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.length === 0 ? (
                      <SelectItem value="none" disabled>No campaigns available</SelectItem>
                    ) : (
                      campaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.campaignId && <p className="text-sm text-red-500 mt-1">{errors.campaignId}</p>}
                {selectedCampaign && (
                  <p className="text-sm text-gray-600 mt-1">
                    Target: {selectedCampaign.targetAudience} | Budget: ${selectedCampaign.budget}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="templateId">Email Template *</Label>
                <Select value={formData.templateId} onValueChange={(value) => handleChange('templateId', value)}>
                  <SelectTrigger className={`mt-1 ${errors.templateId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.templateId && <p className="text-sm text-red-500 mt-1">{errors.templateId}</p>}
              </div>

              {formData.templateId && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Subject Preview:</Label>
                    <p className="text-sm text-gray-700">{formData.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preview Text:</Label>
                    <p className="text-sm text-gray-700">{formData.previewText}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Body Preview:</Label>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">{formData.body}</p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduledDate">Scheduled Date {formData.status === 'Scheduled' && '*'}</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                  className={`mt-1 ${errors.scheduledDate ? 'border-red-500' : ''}`}
                />
                {errors.scheduledDate && <p className="text-sm text-red-500 mt-1">{errors.scheduledDate}</p>}
              </div>
            </div>

            {/* Right Column - Target Audience */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Target Audience</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="sendToAll"
                    checked={formData.sendToAll}
                    onCheckedChange={(checked) => handleChange('sendToAll', checked)}
                  />
                  <Label htmlFor="sendToAll" className="cursor-pointer">
                    Send to All {formData.targetType}
                  </Label>
                </div>

                {!formData.sendToAll && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="targetType">Target Type</Label>
                      <Select 
                        value={formData.targetType} 
                        onValueChange={(value) => {
                          handleChange('targetType', value);
                          handleChange('selectedRecipients', []);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {targetTypeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Select Recipients *</Label>
                      <div className="mt-2 border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                        {getRecipientList().length === 0 ? (
                          <p className="text-sm text-gray-500">No {formData.targetType.toLowerCase()} available</p>
                        ) : (
                          getRecipientList().map((recipient: any) => (
                            <div key={recipient.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`recipient-${recipient.id}`}
                                checked={formData.selectedRecipients.includes(recipient.id)}
                                onCheckedChange={() => handleRecipientToggle(recipient.id)}
                              />
                              <Label htmlFor={`recipient-${recipient.id}`} className="cursor-pointer flex-1 text-sm">
                                {recipient.firstName} {recipient.lastName} - {recipient.email}
                                {recipient.company && ` (${recipient.company})`}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                      {errors.selectedRecipients && (
                        <p className="text-sm text-red-500 mt-1">{errors.selectedRecipients}</p>
                      )}
                      {!formData.sendToAll && formData.selectedRecipients.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.selectedRecipients.length} recipient(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.form>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t bg-white">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingCampaign ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
