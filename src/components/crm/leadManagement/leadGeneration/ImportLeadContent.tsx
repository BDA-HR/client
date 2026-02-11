import React, { useState, useCallback, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Alert, AlertDescription } from "../../../ui/alert";
import { Progress } from "../../../ui/progress";
import { Badge } from "../../../ui/badge";
import { RoutingService } from "../../../../services/routingService";

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
}

interface ImportLeadContentProps {
  onImport?: (file: File) => Promise<ImportResult>;
  onClose?: () => void;
  onImportComplete?: (result: any) => void;
}

export default function ImportLeadContent({
  onImport,
  onClose,
  onImportComplete,
}: ImportLeadContentProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setResult(null);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      let importResult;
      if (onImport) {
        importResult = await onImport(file);
      } else {
        // Process CSV file and apply routing rules
        importResult = await processCSVFile(file);
      }

      setResult(importResult);
      setProgress(100);

      if (onImportComplete && importResult.success) {
        onImportComplete({
          successfulImports: importResult.imported,
          errors: importResult.errors,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Import failed due to an unexpected error",
        imported: 0,
        errors: ["Unexpected error occurred during import"],
      });
      setProgress(100);
    } finally {
      setImporting(false);
      clearInterval(progressInterval);
    }
  };

  const processCSVFile = async (file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          const leads = [];
          const errors = [];

          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              try {
                const values = lines[i]
                  .split(",")
                  .map((v) => v.trim().replace(/"/g, ""));
                const leadData: any = {};

                headers.forEach((header, index) => {
                  const value = values[index] || "";
                  switch (header.toLowerCase()) {
                    case "first name":
                      leadData.firstName = value;
                      break;
                    case "last name":
                      leadData.lastName = value;
                      break;
                    case "email":
                      leadData.email = value;
                      break;
                    case "phone":
                      leadData.phone = value;
                      break;
                    case "company":
                      leadData.company = value;
                      break;
                    case "job title":
                      leadData.jobTitle = value;
                      break;
                    case "source":
                      leadData.source = value || "Website";
                      break;
                    case "status":
                      leadData.status = value || "New";
                      break;
                    case "industry":
                      leadData.industry = value;
                      break;
                    case "budget":
                      leadData.budget = value ? Number(value) : 0;
                      break;
                    case "notes":
                      leadData.notes = value;
                      break;
                  }
                });

                // Apply routing rules for automatic assignment
                if (!leadData.assignedTo) {
                  const assignedRep =
                    RoutingService.assignLeadToSalesRep(leadData);
                  if (assignedRep) {
                    leadData.assignedTo = assignedRep;
                  }
                }

                // Add required fields
                leadData.id = Date.now().toString() + i;
                leadData.createdAt = new Date().toISOString();
                leadData.updatedAt = new Date().toISOString();
                leadData.score = leadData.score || 0;

                leads.push(leadData);
              } catch (error) {
                errors.push(`Row ${i + 1}: Invalid data format`);
              }
            }
          }

          // Save leads to localStorage
          const existingLeads = JSON.parse(
            localStorage.getItem("leads") || "[]",
          );
          const updatedLeads = [...leads, ...existingLeads];
          localStorage.setItem("leads", JSON.stringify(updatedLeads));

          resolve({
            success: true,
            message: `Successfully imported ${leads.length} leads`,
            imported: leads.length,
            errors,
          });
        } catch (error) {
          resolve({
            success: false,
            message: "Failed to parse CSV file",
            imported: 0,
            errors: ["Invalid CSV format"],
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const resetImport = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {importing ? "Importing..." : "Import Leads"}
                  </Button>
                  <Button variant="outline" onClick={resetImport}>
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your CSV file here</p>
                  <p className="text-gray-500">or click to browse</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {importing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Importing leads...</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span>Import Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              className={
                result.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>

            {result.success && (
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  {result.imported} leads imported successfully
                </Badge>
              </div>
            )}

            {result.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <ul className="space-y-1">
                  {result.errors.map((error, index) => (
                    <li
                      key={index}
                      className="text-sm text-red-600 flex items-start space-x-2"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Required columns:</strong> First Name, Last Name, Company</p>
            <p><strong>Optional columns:</strong> Email, Phone, Job Title, Source, Status, Industry, Budget, Notes</p>
            <p><strong>File format:</strong> CSV (Comma Separated Values)</p>
            <p><strong>Maximum file size:</strong> 10 MB</p>
            <p><strong>Maximum records:</strong> 1,000 leads per import</p>
          </div> */}

          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Make sure your CSV file includes headers in the first row.
              Download the template above for the correct format.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
