import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Switch } from '../../../ui/switch';
import { Badge } from '../../../ui/badge';
import { User, Building, MapPin, Tag, Share2, FileText } from 'lucide-react';
import type { Contact } from '../../../../types/crm';

interface ContactFormProps {
  contact?: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: Partial<Contact>) => void;
  mode: 'add' | 'edit';
  isSubmitting?: boolean;
  isPage?: boolean;
}

const owners = [
  'Sarah Johnson',
  'Mike Wilson',
  'Emily Davis',
  'Robert Chen',
  'Lisa Anderson'
];

const availableTags = [
  'VIP',
  'Decision Maker',
  'Technical',
  'Influencer',
  'Champion',
  'Blocker',
  'Budget Holder'
];

export default function ContactForm({ 
  contact, 
  isOpen, 
  onClose, 
  onSubmit, 
  mode, 
  isSubmitting = false,
  isPage = false 
}: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    jobTitle: contact?.jobTitle || '',
    address: contact?.address || '',
    city: contact?.city || '',
    state: contact?.state || '',
    zipCode: contact?.zipCode || '',
    country: contact?.country || 'USA',
    stage: contact?.stage || 'Lead',
    owner: contact?.owner || '',
    teamVisibility: contact?.teamVisibility || 'team',
    consentStatus: contact?.consentStatus || 'pending',
    notes: contact?.notes || '',
    isActive: contact?.isActive ?? true,
    tags: contact?.tags || [],
    socialMedia: contact?.socialMedia || {},
    customFields: contact?.customFields || {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!isPage) {
        onClose();
      }
    }
  };

  const handleChange = (field: keyof Contact, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Company & Address</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>CRM & Tags</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Additional</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 min-h-[400px]">
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Select value={formData.owner} onValueChange={(value) => handleChange('owner', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="consentStatus">Consent Status</Label>
              <Select value={formData.consentStatus} onValueChange={(value) => handleChange('consentStatus', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Company & Address Tab */}
          <TabsContent value="company" className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Company Information
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className={`mt-1 ${errors.company ? 'border-red-500' : ''}`}
                  />
                  {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address Information
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* CRM & Tags Tab */}
          <TabsContent value="crm" className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Select value={newTag} onValueChange={setNewTag}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.filter(tag => !formData.tags?.includes(tag)).map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddTag} disabled={!newTag} variant="outline">
                  Add Tag
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Social Media
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialMedia?.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="@username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional" className="space-y-6">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={8}
                placeholder="Additional notes about this contact..."
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active Contact</Label>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (mode === 'add' ? 'Add Contact' : 'Save Changes')}
        </Button>
      </div>
    </form>
  );

  if (isPage) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <FormContent />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Contact' : 'Edit Contact'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Company & Address</span>
                </TabsTrigger>
                <TabsTrigger value="crm" className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>CRM & Tags</span>
                </TabsTrigger>
                <TabsTrigger value="additional" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Additional</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="stage">Stage</Label>
                      <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lead">Lead</SelectItem>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="owner">Owner</Label>
                      <Select value={formData.owner} onValueChange={(value) => handleChange('owner', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.map((owner) => (
                            <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="consentStatus">Consent Status</Label>
                    <Select value={formData.consentStatus} onValueChange={(value) => handleChange('consentStatus', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="granted">Granted</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Company & Address Tab */}
                <TabsContent value="company" className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Company Information
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          className={`mt-1 ${errors.company ? 'border-red-500' : ''}`}
                        />
                        {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => handleChange('jobTitle', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* CRM & Tags Tab */}
                <TabsContent value="crm" className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Select value={newTag} onValueChange={setNewTag}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.filter(tag => !formData.tags?.includes(tag)).map((tag) => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={handleAddTag} disabled={!newTag} variant="outline">
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Social Media
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.socialMedia?.linkedin || ''}
                          onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={formData.socialMedia?.twitter || ''}
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                          placeholder="@username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={formData.socialMedia?.facebook || ''}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/username"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Tab */}
                <TabsContent value="additional" className="space-y-6">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={8}
                      placeholder="Additional notes about this contact..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Active Contact</Label>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </form>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t bg-white">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (mode === 'add' ? 'Add Contact' : 'Save Changes')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}