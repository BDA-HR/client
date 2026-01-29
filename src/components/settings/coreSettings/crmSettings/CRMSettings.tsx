import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Settings, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Checkbox } from '../../../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../ui/collapsible';
import { showToast } from '../../../../layout/layout';
import type { DropdownOption, CustomFieldDefinition, CRMSettings as CRMSettingsType } from '../../../../types/crm';

// Simple CRM settings with basic dropdown options
const mockCRMSettings: CRMSettingsType = {
  leadSources: [
    { id: '1', label: 'Website', value: 'website', isActive: true, sortOrder: 1, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '2', label: 'Email Campaign', value: 'email', isActive: true, sortOrder: 2, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '3', label: 'Social Media', value: 'social', isActive: true, sortOrder: 3, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '4', label: 'Referral', value: 'referral', isActive: true, sortOrder: 4, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' }
  ],
  leadStatuses: [
    { id: '1', label: 'New', value: 'new', color: '#3B82F6', isActive: true, sortOrder: 1, isDefault: true, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '2', label: 'Contacted', value: 'contacted', color: '#F59E0B', isActive: true, sortOrder: 2, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '3', label: 'Qualified', value: 'qualified', color: '#10B981', isActive: true, sortOrder: 3, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '4', label: 'Closed Won', value: 'won', color: '#059669', isActive: true, sortOrder: 4, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' }
  ],
  industries: [
    { id: '1', label: 'Technology', value: 'technology', isActive: true, sortOrder: 1, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '2', label: 'Healthcare', value: 'healthcare', isActive: true, sortOrder: 2, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '3', label: 'Finance', value: 'finance', isActive: true, sortOrder: 3, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' }
  ],
  companySizes: [
    { id: '1', label: '1-10 employees', value: '1-10', isActive: true, sortOrder: 1, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '2', label: '11-50 employees', value: '11-50', isActive: true, sortOrder: 2, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '3', label: '51-200 employees', value: '51-200', isActive: true, sortOrder: 3, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' }
  ],
  leadQualityOptions: [
    { id: '1', label: 'Hot', value: 'hot', color: '#EF4444', isActive: true, sortOrder: 1, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '2', label: 'Warm', value: 'warm', color: '#F59E0B', isActive: true, sortOrder: 2, isDefault: true, createdAt: '2024-01-01', createdBy: 'Admin' },
    { id: '3', label: 'Cold', value: 'cold', color: '#3B82F6', isActive: true, sortOrder: 3, isDefault: false, createdAt: '2024-01-01', createdBy: 'Admin' }
  ],
  // Add other required fields with empty arrays for now
  authorityLevels: [],
  needLevels: [],
  urgencyLevels: [],
  contactMethods: [],
  lifecycleStages: [],
  buyingRoles: [],
  buyingStages: [],
  leadGrades: [],
  timezones: [],
  languages: [],
  currencies: [],
  countries: [],
  salesReps: [],
  teams: [],
  territories: [],
  products: [],
  services: [],
  competitors: [],
  painPoints: [],
  interests: [],
  tags: [],
  leadMagnets: [],
  leadRatings: [],
  leadTypes: [],
  disqualificationReasons: [],
  customFields: [],
  scoringRules: [],
  routingRules: [],
  automationRules: [],
  emailTemplates: [],
  notificationTemplates: [],
  integrations: [],
  dataRetentionPolicies: [],
  complianceSettings: {
    gdprEnabled: false,
    ccpaEnabled: false,
    canSpamEnabled: false,
    dataRetentionEnabled: false,
    consentRequired: false,
    doubleOptIn: false,
    unsubscribeLink: false,
    complianceOfficer: '',
    auditFrequency: 'Quarterly',
    complianceScore: 0,
    violations: []
  },
  validationRules: [],
  enrichmentSettings: {
    autoEnrichment: false,
    enrichmentProviders: [],
    enrichmentFields: [],
    enrichmentFrequency: 'Daily',
    costLimit: 0,
    qualityThreshold: 0,
    fallbackProviders: [],
    enrichmentRules: []
  },
  reportingSettings: {
    defaultReports: [],
    customReports: [],
    dashboards: [],
    scheduledReports: [],
    reportingFrequency: 'Daily',
    dataRetention: 365,
    exportFormats: [],
    sharingPermissions: {
      canView: [],
      canEdit: [],
      canShare: [],
      canExport: [],
      publicAccess: false,
      externalSharing: false
    }
  }
};

interface DropdownOptionFormProps {
  option?: DropdownOption | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (optionData: Partial<DropdownOption>) => void;
  mode: 'add' | 'edit';
  title: string;
}

function DropdownOptionForm({ option, isOpen, onClose, onSubmit, mode, title }: DropdownOptionFormProps) {
  const [formData, setFormData] = useState<Partial<DropdownOption>>({
    label: option?.label || '',
    value: option?.value || '',
    description: option?.description || '',
    color: option?.color || '#3B82F6',
    icon: option?.icon || '',
    isActive: option?.isActive ?? true,
    sortOrder: option?.sortOrder || 1,
    isDefault: option?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.value) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? `Add ${title}` : `Edit ${title}`}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Display name"
            />
          </div>

          <div>
            <Label htmlFor="value">Value *</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
              placeholder="Internal value (auto-generated)"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked as boolean }))}
              />
              <Label htmlFor="isDefault">Default</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              {mode === 'add' ? 'Add' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DropdownSectionProps {
  title: string;
  options: DropdownOption[];
  onAdd: () => void;
  onEdit: (option: DropdownOption) => void;
  onDelete: (optionId: string) => void;
  onToggleActive: (optionId: string, isActive: boolean) => void;
}

function DropdownSection({ title, options, onAdd, onEdit, onDelete, onToggleActive }: DropdownSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                <span>{title}</span>
                <Badge variant="secondary">{options.length}</Badge>
              </CardTitle>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            {options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No {title.toLowerCase()} configured</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAdd}
                  className="mt-2"
                >
                  Add First {title.slice(0, -1)}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((option) => (
                      <TableRow key={option.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {option.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: option.color }}
                              />
                            )}
                            <span className="font-medium">{option.label}</span>
                            {option.isDefault && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {option.value}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={option.isActive}
                              onCheckedChange={(checked) => onToggleActive(option.id, checked as boolean)}
                            />
                            <span className={option.isActive ? 'text-green-600' : 'text-gray-400'}>
                              {option.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{option.sortOrder}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(option)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete(option.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
export default function CRMSettings() {
  const [settings, setSettings] = useState<CRMSettingsType>(mockCRMSettings);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentSection, setCurrentSection] = useState<keyof CRMSettingsType>('leadSources');
  const [currentSectionTitle, setCurrentSectionTitle] = useState('');

  const handleAddOption = (section: keyof CRMSettingsType, title: string) => {
    setCurrentSection(section);
    setCurrentSectionTitle(title);
    setSelectedOption(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditOption = (section: keyof CRMSettingsType, option: DropdownOption, title: string) => {
    setCurrentSection(section);
    setCurrentSectionTitle(title);
    setSelectedOption(option);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteOption = (section: keyof CRMSettingsType, optionId: string) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      setSettings(prev => ({
        ...prev,
        [section]: (prev[section] as DropdownOption[]).filter(opt => opt.id !== optionId)
      }));
      showToast('Option deleted successfully', 'success');
    }
  };

  const handleToggleActive = (section: keyof CRMSettingsType, optionId: string, isActive: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: (prev[section] as DropdownOption[]).map(opt =>
        opt.id === optionId ? { ...opt, isActive } : opt
      )
    }));
    showToast(`Option ${isActive ? 'activated' : 'deactivated'}`, 'success');
  };

  const handleSubmitOption = (optionData: Partial<DropdownOption>) => {
    if (formMode === 'add') {
      const newOption: DropdownOption = {
        id: Date.now().toString(),
        label: optionData.label!,
        value: optionData.value!,
        description: optionData.description,
        color: optionData.color,
        icon: optionData.icon,
        isActive: optionData.isActive ?? true,
        sortOrder: optionData.sortOrder || 1,
        isDefault: optionData.isDefault || false,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User'
      };

      setSettings(prev => ({
        ...prev,
        [currentSection]: [...(prev[currentSection] as DropdownOption[]), newOption]
      }));
      showToast('Option added successfully', 'success');
    } else {
      setSettings(prev => ({
        ...prev,
        [currentSection]: (prev[currentSection] as DropdownOption[]).map(opt =>
          opt.id === selectedOption?.id
            ? { ...opt, ...optionData, updatedAt: new Date().toISOString(), updatedBy: 'Current User' }
            : opt
        )
      }));
      showToast('Option updated successfully', 'success');
    }
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    showToast('CRM settings saved successfully', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM Settings</h2>
          <p className="text-gray-600">Configure dropdown options and settings for your CRM system</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-orange-600 hover:bg-orange-700">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="dropdowns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dropdowns">Dropdown Options</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="dropdowns" className="space-y-4">
          <div className="grid gap-4">
            <DropdownSection
              title="Lead Sources"
              options={settings.leadSources}
              onAdd={() => handleAddOption('leadSources', 'Lead Source')}
              onEdit={(option) => handleEditOption('leadSources', option, 'Lead Source')}
              onDelete={(id) => handleDeleteOption('leadSources', id)}
              onToggleActive={(id, isActive) => handleToggleActive('leadSources', id, isActive)}
            />

            <DropdownSection
              title="Lead Statuses"
              options={settings.leadStatuses}
              onAdd={() => handleAddOption('leadStatuses', 'Lead Status')}
              onEdit={(option) => handleEditOption('leadStatuses', option, 'Lead Status')}
              onDelete={(id) => handleDeleteOption('leadStatuses', id)}
              onToggleActive={(id, isActive) => handleToggleActive('leadStatuses', id, isActive)}
            />

            <DropdownSection
              title="Industries"
              options={settings.industries}
              onAdd={() => handleAddOption('industries', 'Industry')}
              onEdit={(option) => handleEditOption('industries', option, 'Industry')}
              onDelete={(id) => handleDeleteOption('industries', id)}
              onToggleActive={(id, isActive) => handleToggleActive('industries', id, isActive)}
            />

            <DropdownSection
              title="Company Sizes"
              options={settings.companySizes}
              onAdd={() => handleAddOption('companySizes', 'Company Size')}
              onEdit={(option) => handleEditOption('companySizes', option, 'Company Size')}
              onDelete={(id) => handleDeleteOption('companySizes', id)}
              onToggleActive={(id, isActive) => handleToggleActive('companySizes', id, isActive)}
            />

            <DropdownSection
              title="Lead Quality Options"
              options={settings.leadQualityOptions}
              onAdd={() => handleAddOption('leadQualityOptions', 'Lead Quality')}
              onEdit={(option) => handleEditOption('leadQualityOptions', option, 'Lead Quality')}
              onDelete={(id) => handleDeleteOption('leadQualityOptions', id)}
              onToggleActive={(id, isActive) => handleToggleActive('leadQualityOptions', id, isActive)}
            />
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
              <p className="text-sm text-gray-600">
                Create custom fields to capture additional lead information specific to your business needs.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Custom fields configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <p className="text-sm text-gray-600">
                Configure automated workflows for lead assignment, scoring, and nurturing.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Automation rules configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Settings</CardTitle>
              <p className="text-sm text-gray-600">
                Configure GDPR, CCPA, and other compliance requirements for lead data handling.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Compliance settings configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DropdownOptionForm
        option={selectedOption}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitOption}
        mode={formMode}
        title={currentSectionTitle}
      />
    </motion.div>
  );
}