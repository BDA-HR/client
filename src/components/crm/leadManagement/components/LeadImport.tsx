import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Eye, Settings, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Checkbox } from '../../../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Progress } from '../../../ui/progress';
import { Alert, AlertDescription } from '../../../ui/alert';
import { showToast } from '../../../../layout/layout';
import type { LeadImportMapping, LeadImportResult, ImportSettings } from '../../../../types/crm';

interface LeadImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: LeadImportResult) => void;
}

const leadFields = [
  { key: 'firstName', label: 'First Name', required: true, type: 'string' },
  { key: 'lastName', label: 'Last Name', required: true, type: 'string' },
  { key: 'email', label: 'Email', required: false, type: 'email' },
  { key: 'phone', label: 'Phone', required: false, type: 'phone' },
  { key: 'company', label: 'Company', required: true, type: 'string' },
  { key: 'jobTitle', label: 'Job Title', required: false, type: 'string' },
  { key: 'industry', label: 'Industry', required: false, type: 'string' },
  { key: 'source', label: 'Lead Source', required: false, type: 'string' },
  { key: 'status', label: 'Status', required: false, type: 'string' },
  { key: 'budget', label: 'Budget', required: false, type: 'number' },
  { key: 'timeline', label: 'Timeline', required: false, type: 'string' },
  { key: 'notes', label: 'Notes', required: false, type: 'string' },
  { key: 'address', label: 'Address', required: false, type: 'string' },
  { key: 'city', label: 'City', required: false, type: 'string' },
  { key: 'state', label: 'State', required: false, type: 'string' },
  { key: 'zipCode', label: 'Zip Code', required: false, type: 'string' },
  { key: 'country', label: 'Country', required: false, type: 'string' },
  { key: 'website', label: 'Website', required: false, type: 'string' },
  { key: 'companySize', label: 'Company Size', required: false, type: 'string' },
  { key: 'annualRevenue', label: 'Annual Revenue', required: false, type: 'number' },
  { key: 'assignedTo', label: 'Assigned To', required: false, type: 'string' }
];

const sampleData = [
  ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Industry', 'Source'],
  ['John', 'Smith', 'john.smith@techcorp.com', '+1-555-0123', 'TechCorp Solutions', 'IT Director', 'Technology', 'Website'],
  ['Emily', 'Davis', 'emily.davis@retailplus.com', '+1-555-0124', 'RetailPlus Inc', 'Operations Manager', 'Retail', 'Email'],
  ['Robert', 'Chen', 'robert.chen@manufacturing.com', '+1-555-0125', 'Global Manufacturing', 'Plant Manager', 'Manufacturing', 'Referral']
];

export default function LeadImport({ isOpen, onClose, onImportComplete }: LeadImportProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<LeadImportMapping[]>([]);
  const [settings, setSettings] = useState<ImportSettings>({
    skipDuplicates: true,
    mergeDuplicates: false,
    updateExisting: false,
    validateEmails: true,
    validatePhones: true,
    autoAssign: false,
    defaultOwner: '',
    defaultSource: 'Import',
    defaultStatus: 'New',
    customFieldMappings: {}
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<LeadImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      showToast('Please select a CSV or Excel file', 'error');
      return;
    }

    setSelectedFile(file);
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const data = lines.map(line => {
        // Simple CSV parsing - in production, use a proper CSV parser
        return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      });
      
      setCsvData(data);
      
      // Auto-generate mappings based on header row
      if (data.length > 0) {
        const headers = data[0];
        const autoMappings: LeadImportMapping[] = headers.map((header, index) => {
          const matchedField = leadFields.find(field => 
            field.label.toLowerCase() === header.toLowerCase() ||
            field.key.toLowerCase() === header.toLowerCase()
          );
          
          return {
            csvField: header,
            crmField: matchedField?.key || '',
            required: matchedField?.required || false,
            dataType: matchedField?.type as any || 'string'
          };
        });
        
        setMappings(autoMappings);
      }
      
      setCurrentStep(2);
    } catch (error) {
      showToast('Error parsing file. Please check the format.', 'error');
    }
  };

  const handleMappingChange = (index: number, crmField: string) => {
    const newMappings = [...mappings];
    
    // Handle skip option
    if (crmField === 'skip') {
      newMappings[index] = {
        ...newMappings[index],
        crmField: '',
        required: false,
        dataType: 'string'
      };
    } else {
      const field = leadFields.find(f => f.key === crmField);
      newMappings[index] = {
        ...newMappings[index],
        crmField,
        required: field?.required || false,
        dataType: field?.type as any || 'string'
      };
    }
    
    setMappings(newMappings);
  };

  const validateMappings = () => {
    const requiredFields = leadFields.filter(f => f.required);
    const mappedRequiredFields = mappings.filter(m => 
      m.crmField && requiredFields.some(rf => rf.key === m.crmField)
    );
    
    if (mappedRequiredFields.length < requiredFields.length) {
      const missingFields = requiredFields.filter(rf => 
        !mappings.some(m => m.crmField === rf.key)
      );
      showToast(`Please map required fields: ${missingFields.map(f => f.label).join(', ')}`, 'error');
      return false;
    }
    
    return true;
  };

  const handleImport = async () => {
    if (!validateMappings()) return;
    
    setIsImporting(true);
    setImportProgress(0);
    setCurrentStep(4);
    
    // Simulate import process
    const totalRecords = csvData.length - 1; // Exclude header
    let processed = 0;
    
    const interval = setInterval(() => {
      processed += Math.random() * 10;
      const progress = Math.min((processed / totalRecords) * 100, 100);
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock import result
        const result: LeadImportResult = {
          totalRecords,
          successfulImports: Math.floor(totalRecords * 0.85),
          failedImports: Math.floor(totalRecords * 0.1),
          duplicatesFound: Math.floor(totalRecords * 0.05),
          duplicatesSkipped: settings.skipDuplicates ? Math.floor(totalRecords * 0.05) : 0,
          duplicatesMerged: settings.mergeDuplicates ? Math.floor(totalRecords * 0.05) : 0,
          validationErrors: [
            { row: 5, field: 'email', value: 'invalid-email', error: 'Invalid email format', severity: 'Error' },
            { row: 12, field: 'phone', value: '123', error: 'Invalid phone number', severity: 'Warning' }
          ],
          importedLeadIds: Array.from({ length: Math.floor(totalRecords * 0.85) }, (_, i) => `lead_${i + 1}`),
          skippedRecords: [
            { row: 8, data: { firstName: 'John', lastName: 'Doe' }, reason: 'Duplicate email address' }
          ],
          importSummary: {
            importId: `import_${Date.now()}`,
            fileName: selectedFile?.name || '',
            importedBy: 'Current User',
            importedAt: new Date().toISOString(),
            source: 'CSV',
            mappingUsed: mappings,
            settings
          }
        };
        
        setImportResult(result);
        setIsImporting(false);
        setCurrentStep(5);
        
        setTimeout(() => {
          onImportComplete(result);
          showToast(`Successfully imported ${result.successfulImports} leads`, 'success');
        }, 1000);
      }
    }, 100);
  };

  const downloadTemplate = () => {
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setCsvData([]);
    setMappings([]);
    setImportResult(null);
    setImportProgress(0);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Import Leads</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Upload File' },
              { step: 2, label: 'Map Fields' },
              { step: 3, label: 'Configure Settings' },
              { step: 4, label: 'Import' },
              { step: 5, label: 'Complete' }
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {step < 5 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload File */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Lead Data</CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload a CSV or Excel file containing your lead data. Make sure the first row contains column headers.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Drop your file here or click to browse</p>
                      <p className="text-sm text-gray-500">Supports CSV, XLS, and XLSX files up to 10MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 bg-orange-600 hover:bg-orange-700"
                    >
                      Select File
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">Need a template?</p>
                      <p className="text-xs text-gray-500">Download our sample CSV file to get started</p>
                    </div>
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Map Fields */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Map Fields</CardTitle>
                  <p className="text-sm text-gray-600">
                    Map your CSV columns to CRM fields. Required fields are marked with an asterisk (*).
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-700 border-b pb-2">
                      <div>CSV Column</div>
                      <div>CRM Field</div>
                      <div>Sample Data</div>
                    </div>
                    
                    {mappings.map((mapping, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-center">
                        <div className="font-medium">{mapping.csvField}</div>
                        <div>
                          <Select
                            value={mapping.crmField || 'skip'}
                            onValueChange={(value) => handleMappingChange(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skip">-- Skip this column --</SelectItem>
                              {leadFields.map((field) => (
                                <SelectItem key={field.key} value={field.key}>
                                  {field.label} {field.required && '*'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-sm text-gray-600">
                          {csvData[1] && csvData[1][index] ? csvData[1][index] : 'No data'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Next: Configure Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Configure Settings */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Import Settings</CardTitle>
                  <p className="text-sm text-gray-600">
                    Configure how the import should handle duplicates and validation.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Duplicate Handling</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="skipDuplicates"
                            checked={settings.skipDuplicates}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, skipDuplicates: checked as boolean }))
                            }
                          />
                          <Label htmlFor="skipDuplicates">Skip duplicate records</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mergeDuplicates"
                            checked={settings.mergeDuplicates}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, mergeDuplicates: checked as boolean }))
                            }
                          />
                          <Label htmlFor="mergeDuplicates">Merge with existing records</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="updateExisting"
                            checked={settings.updateExisting}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, updateExisting: checked as boolean }))
                            }
                          />
                          <Label htmlFor="updateExisting">Update existing records</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Validation</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="validateEmails"
                            checked={settings.validateEmails}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, validateEmails: checked as boolean }))
                            }
                          />
                          <Label htmlFor="validateEmails">Validate email addresses</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="validatePhones"
                            checked={settings.validatePhones}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, validatePhones: checked as boolean }))
                            }
                          />
                          <Label htmlFor="validatePhones">Validate phone numbers</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="autoAssign"
                            checked={settings.autoAssign}
                            onCheckedChange={(checked) => 
                              setSettings(prev => ({ ...prev, autoAssign: checked as boolean }))
                            }
                          />
                          <Label htmlFor="autoAssign">Auto-assign to sales reps</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="defaultSource">Default Source</Label>
                      <Input
                        id="defaultSource"
                        value={settings.defaultSource}
                        onChange={(e) => setSettings(prev => ({ ...prev, defaultSource: e.target.value }))}
                        placeholder="Import"
                      />
                    </div>
                    <div>
                      <Label htmlFor="defaultStatus">Default Status</Label>
                      <Select
                        value={settings.defaultStatus}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, defaultStatus: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="defaultOwner">Default Owner</Label>
                      <Select
                        value={settings.defaultOwner || 'none'}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, defaultOwner: value === 'none' ? '' : value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No default owner</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                          <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleImport}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Start Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Import Progress */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className={`w-5 h-5 ${isImporting ? 'animate-spin' : ''}`} />
                    <span>Importing Leads</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Please wait while we process your lead data...
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(importProgress)}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="text-lg font-medium">
                      Processing {selectedFile?.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Validating data, checking for duplicates, and creating lead records...
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Import Complete */}
          {currentStep === 5 && importResult && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Import Complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Records:</span>
                        <span className="font-medium">{importResult.totalRecords}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Successfully Imported:</span>
                        <span className="font-medium">{importResult.successfulImports}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Failed:</span>
                        <span className="font-medium">{importResult.failedImports}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Duplicates Found:</span>
                        <span className="font-medium">{importResult.duplicatesFound}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duplicates Skipped:</span>
                        <span className="font-medium">{importResult.duplicatesSkipped}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validation Errors:</span>
                        <span className="font-medium">{importResult.validationErrors.length}</span>
                      </div>
                    </div>
                  </div>

                  {importResult.validationErrors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Validation Issues</h4>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {importResult.validationErrors.map((error, index) => (
                          <Alert key={index} className="py-2">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription className="text-sm">
                              Row {error.row}: {error.error} ({error.field}: {error.value})
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" onClick={resetImport}>
                      Import More Leads
                    </Button>
                    <Button
                      onClick={onClose}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Done
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}