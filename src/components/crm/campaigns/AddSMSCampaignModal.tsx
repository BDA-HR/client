import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Checkbox } from '../../ui/checkbox';

interface AddSMSCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: any) => void;
  editingCampaign?: any;
}

const statusOptions = ['Draft', 'Scheduled', 'Sent', 'Cancelled'];
const targetTypeOptions = ['Leads', 'Customers', 'Contacts'];

// SMS templates
const smsTemplates = [
  {
    id: 'welcome',
    name: 'Welcome SMS',
    message: 'Hi {{first_name}}! Welcome to {{company_name}}. We\'re excited to have you!'
  },
  {
    id: 'promotion',
    name: 'Promotional SMS',
    message: 'Hi {{first_name}}! Special offer: Get {{discount}}% off. Use code {{promo_code}}. Shop now!'
  },
  {
    id: 'reminder',
    name: 'Reminder SMS',
    message: 'Hi {{first_name}}, this is a reminder about {{event}} on {{date}}. See you there!'
  },
  {
    id: 'followup',
    name: 'Follow-up SMS',
    message: 'Hi {{first_name}}, following up on {{topic}}. Let us know if you have questions!'
  },
  {
    id: 'thankyou',
    name: 'Thank You SMS',
    message: 'Thank you {{first_name}} for your purchase! We appreciate your business.'
  }
];

export default function AddSMSCampaignModal({
  isOpen,
  onClose,
  onSubmit,
  editingCampaign
}: AddSMSCampaignModalProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    campaignId: '',
    templateId: '',
    message: '',
    sendToAll: true,
    targetType: 'Leads',
    selectedRecipients: [] as string[],
    scheduledDate: '',
    status: 'Draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 160;

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
        message: editingCampaign.message || '',
        sendToAll: editingCampaign.sendToAll !== undefined ? editingCampaign.sendToAll : true,
        targetType: editingCampaign.targetType || 'Leads',
        selectedRecipients: editingCampaign.selectedRecipients || [],
        scheduledDate: editingCampaign.scheduledDate || '',
        status: editingCampaign.status || 'Draft'
      });
      setCharacterCount(editingCampaign.message?.length || 0);
    } else {
      setFormData({
        campaignId: '',
        templateId: '',
        message: '',
        sendToAll: true,
        targetType: 'Leads',
        selectedRecipients: [],
        scheduledDate: '',
        status: 'Draft'
      });
      setCharacterCount(0);
    }
  }, [editingCampaign, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaignId) {
      newErrors.campaignId = 'Campaign is required';
    }
    if (!formData.templateId) {
      newErrors.templateId = 'SMS template is required';
    }
    if (formData.message.length > maxCharacters) {
      newErrors.message = `Message exceeds ${maxCharacters} characters`;
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
          message: '',
          sendToAll: true,
          targetType: 'Leads',
          selectedRecipients: [],
          scheduledDate: '',
          status: 'Draft'
        });
        setCharacterCount(0);
      }
      setErrors({});
    } catch (error) {
      console.error('Error creating SMS campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // When template changes, auto-fill message
    if (field === 'templateId') {
      const template = smsTemplates.find(t => t.id === value);
      if (template) {
        setFormData(prev => ({
          ...prev,
          templateId: value,
          message: template.message
        }));
        setCharacterCount(template.message.length);
      }
    }
    
    if (field === 'message') {
      setCharacterCount(value.length);
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
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span>{editingCampaign ? 'Edit SMS Campaign' : 'Create New SMS Campaign'}</span>
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
                <Label htmlFor="templateId">SMS Template *</Label>
                <Select value={formData.templateId} onValueChange={(value) => handleChange('templateId', value)}>
                  <SelectTrigger className={`mt-1 ${errors.templateId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select SMS template" />
                  </SelectTrigger>
                  <SelectContent>
                    {smsTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.templateId && <p className="text-sm text-red-500 mt-1">{errors.templateId}</p>}
              </div>

              {formData.templateId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium">Message Preview:</Label>
                  <p className="text-sm text-gray-700 mt-2">{formData.message}</p>
                  <p className={`text-sm mt-2 ${characterCount > maxCharacters ? 'text-red-500' : 'text-gray-500'}`}>
                    {characterCount}/{maxCharacters} characters
                  </p>
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
                                {recipient.firstName} {recipient.lastName} - {recipient.phone || recipient.email}
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
            className="bg-green-600 hover:bg-green-700"
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
