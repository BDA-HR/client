import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Alert, AlertDescription } from '../../../ui/alert';
import { showToast } from '../../../../layout/layout';
import type { Lead } from '../../../../types/crm';

interface LeadImportContentProps {
  onClose: () => void;
  onImportComplete: (result: any) => void;
}

// Required fields for lead import
const REQUIRED_FIELDS = ['firstName', 'lastName', 'company'];

// Field mapping (case-insensitive)
const FIELD_MAPPING: Record<string, string> = {
  'first name': 'firstName',
  'firstname': 'firstName',
  'last name': 'lastName',
  'lastname': 'lastName',
  'company': 'company',
  'company name': 'company',
  'email': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'job title': 'jobTitle',
  'jobtitle': 'jobTitle',
  'title': 'jobTitle',
  'industry': 'industry',
  'source': 'source',
  'lead source': 'source',
  'status': 'status',
  'budget': 'budget',
  'timeline': 'timeline',
  'notes': 'notes',
  'address': 'address',
  'city': 'city',
  'state': 'state',
  'zip': 'zipCode',
  'zipcode': 'zipCode',
  'zip code': 'zipCode',
  'country': 'country',
  'website': 'website',
  'assigned to': 'assignedTo',
  'assignedto': 'assignedTo',
  'owner': 'assignedTo'
};

const sampleData = [
  ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Industry', 'Source', 'Status'],
  ['John', 'Smith', 'john.smith@techcorp.com', '+1-555-0123', 'TechCorp Solutions', 'IT Director', 'Technology', 'Website', 'New'],
  ['Emily', 'Davis', 'emily.davis@retailplus.com', '+1-555-0124', 'RetailPlus Inc', 'Operations Manager', 'Retail', 'Email', 'New'],
  ['Robert', 'Chen', 'robert.chen@manufacturing.com', '+1-555-0125', 'Global Manufacturing', 'Plant Manager', 'Manufacturing', 'Referral', 'New']
];

export default function LeadImportContent({ onClose, onImportComplete }: LeadImportContentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      showToast.error('Please select a CSV or Excel file');
      return;
    }

    setSelectedFile(file);
    await parseAndImportFile(file);
  };

  const parseAndImportFile = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        showToast.error('File must contain at least a header row and one data row');
        setIsImporting(false);
        return;
      }

      // Parse CSV data
      const data = lines.map(line => {
        return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      });

      const headers = data[0].map(h => h.toLowerCase().trim());
      const rows = data.slice(1);

      // Map headers to field names
      const fieldMap: Record<number, string> = {};
      headers.forEach((header, index) => {
        const mappedField = FIELD_MAPPING[header];
        if (mappedField) {
          fieldMap[index] = mappedField;
        }
      });

      // Validate required fields exist
      const missingFields = REQUIRED_FIELDS.filter(
        field => !Object.values(fieldMap).includes(field)
      );

      if (missingFields.length > 0) {
        showToast.error(
          `Missing required columns: ${missingFields.map(f => 
            f === 'firstName' ? 'First Name' : 
            f === 'lastName' ? 'Last Name' : 
            'Company'
          ).join(', ')}`
        );
        setIsImporting(false);
        return;
      }

      // Import leads
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const importedLeads: Lead[] = [];
      const errors: string[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setImportProgress(((i + 1) / rows.length) * 100);

        // Skip empty rows
        if (row.every(cell => !cell.trim())) continue;

        try {
          const leadData: any = {
            id: `lead_${Date.now()}_${i}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: 'Import',
            status: 'New',
            score: 0,
            leadQuality: 'Warm',
            preferredContactMethod: 'Any'
          };

          // Map row data to lead fields
          Object.entries(fieldMap).forEach(([colIndex, fieldName]) => {
            const value = row[parseInt(colIndex)]?.trim();
            if (value) {
              // Convert budget to number if present
              if (fieldName === 'budget' && value) {
                leadData[fieldName] = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
              } else {
                leadData[fieldName] = value;
              }
            }
          });

          // Validate required fields have values
          const missingValues = REQUIRED_FIELDS.filter(field => !leadData[field]);
          if (missingValues.length > 0) {
            errors.push(`Row ${i + 2}: Missing ${missingValues.join(', ')}`);
            errorCount++;
            continue;
          }

          importedLeads.push(leadData as Lead);
          successCount++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          errorCount++;
        }
      }

      // Save imported leads
      if (importedLeads.length > 0) {
        localStorage.setItem('leads', JSON.stringify([...importedLeads, ...existingLeads]));
      }

      // Show result
      const result = {
        totalRecords: rows.length,
        successfulImports: successCount,
        failedImports: errorCount,
        errors: errors.slice(0, 10), // Show first 10 errors
        fileName: file.name
      };

      setImportResult(result);
      setIsImporting(false);

      if (successCount > 0) {
        showToast.success(`Successfully imported ${successCount} leads`);
        setTimeout(() => {
          onImportComplete(result);
        }, 2000);
      } else {
        showToast.error('No leads were imported. Please check the file format.');
      }

    } catch (error) {
      console.error('Import error:', error);
      showToast.error('Error importing file. Please check the format.');
      setIsImporting(false);
    }
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
    setSelectedFile(null);
    setImportResult(null);
    setImportProgress(0);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Upload or Result View */}
      {!isImporting && !importResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Lead Data</CardTitle>
              <p className="text-sm text-gray-600">
                Upload a CSV or Excel file with lead data.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
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
                  <Upload className="w-4 h-4 mr-2" />
                  Select File
                </Button>
              </div>

              {/* <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="text-sm">
                    <p className="font-medium mb-1">File Format Requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>First row must contain column headers</li>
                      <li>Required columns: First Name, Last Name, Company</li>
                      <li>Optional columns: Email, Phone, Job Title, Industry, Source, Status, Budget, etc.</li>
                      <li>Column names are case-insensitive</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert> */}

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

      {/* Import Progress */}
      {isImporting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />
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
                  Reading file, validating data, and creating lead records...
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Import Complete */}
      {!isImporting && importResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                    <span>File Name:</span>
                    <span className="font-medium">{importResult.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="font-medium">{importResult.totalRecords}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Successfully Imported:</span>
                    <span className="font-medium">{importResult.successfulImports}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-red-600">
                    <span>Failed:</span>
                    <span className="font-medium">{importResult.failedImports}</span>
                  </div>
                  {importResult.failedImports > 0 && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Common issues:</p>
                      <ul className="list-disc list-inside text-xs">
                        <li>Missing required fields</li>
                        <li>Invalid data format</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Import Errors</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 bg-red-50 rounded-lg p-3">
                    {importResult.errors.map((error: string, index: number) => (
                      <div key={index} className="text-sm text-red-700">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={resetImport}>
                  <Upload className="w-4 h-4 mr-2" />
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
  );
}
