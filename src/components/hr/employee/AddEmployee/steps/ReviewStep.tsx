import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, MapPin, Printer } from 'lucide-react';
import { Gender, EmpType, EmpNature, YesNo, MaritalStat } from '../../../../../types/hr/enum';
import type { Step5Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';
import { empService } from '../../../../../services/hr/employee/empService';
import { useNavigate } from 'react-router-dom';

interface ReviewStepProps {
  employeeId?: UUID;
  employeeCode?: string;
  onBack: () => void;
  loading?: boolean;
  onClearTempData?: () => void;
  isReviewComplete?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  employeeId,
  onBack,
  loading = false,
  onClearTempData,
}) => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState<Step5Dto | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting'>('idle');

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }

    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  useEffect(() => {
    const fetchStep5Data = async () => {
      if (!employeeId) {
        // No employee ID available
        console.log('No employee ID found');
        setFetchError('No employee ID provided. Please go back and complete the previous steps.');
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        setFetchError(null);
        const data = await empService.getStep5Data(employeeId);
        setReviewData(data);
      } catch (error) {
        console.error('Failed to fetch review data:', error);
        setFetchError('Failed to load employee data. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStep5Data();
  }, [employeeId]);

  const getEnumValue = <T extends Record<string, string | number>>(
    enumObj: T,
    value: string
  ): string => {
    return enumObj[value as keyof T] as string || value;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Clear temporary data function
  const clearTemporaryData = () => {
    // Clear local storage
    localStorage.removeItem('employeeFormData');
    localStorage.removeItem('employeeId');

    // Call parent callback if provided
    if (onClearTempData) {
      onClearTempData();
    }

    console.log('Temporary employee data cleared');
  };

  const handleConfirm = async () => {
    if (!reviewData) {
      setFetchError('No review data available');
      return;
    }

    scrollToTop();
    setSubmissionStatus('submitting');

    try {
      // Redirect immediately after calling onConfirm
      navigate('/hr/employees/record');

    } catch (error) {
      console.error('Confirmation failed:', error);
      setFetchError('Failed to confirm. Please try again.');
      setSubmissionStatus('idle');
    }
  };

  // Handle back button click with scroll to top
  const handleBackClick = () => {
    scrollToTop();
    onBack();
  };

  const handleCancelAndClear = () => {
    if (window.confirm('Are you sure you want to cancel and clear all temporary data? This action cannot be undone.')) {
      clearTemporaryData();
      navigate('/hr/employees/record');
    }
  };

  // Print functionality - Basic Information in 2-column layout
  const handlePrint = () => {
    scrollToTop();

    setTimeout(() => {
      const basicInfoElement = document.getElementById("basic-info-section");

      if (!basicInfoElement) {
        alert("Basic Information section not found.");
        return;
      }

      // Clone the Basic Info section exactly as rendered
      const clone = basicInfoElement.cloneNode(true) as HTMLElement;

      // Open print window
      const printWindow = window.open("", "_blank");

      if (!printWindow) return;

      // Extract all style sheets from the main document
      const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map((node) => node.outerHTML)
        .join("\n");

      // Print-friendly CSS for 2-column layout
      const printCSS = `
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            margin: 0;
            padding: 0;
            font-size: 14px;
          }

          /* Force everything into one page */
          #print-root {
            page-break-inside: avoid;
          }

          .print-section * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* 2-column layout */
          .print-layout {
            display: flex !important;
            flex-direction: row !important;
            gap: 20px !important;
            width: 100% !important;
          }

          .left-column {
            flex: 1 !important;
            max-width: 35% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }

          .right-column {
            flex: 2 !important;
            max-width: 65% !important;
          }

          /* Profile section styling */
          .photo-section {
            width: 100% !important;
            max-width: 180px !important;
            margin-bottom: 20px !important;
          }

          .employee-photo {
            width: 100% !important;
            height: auto !important;
            max-height: 180px !important;
            object-fit: contain !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
          }

          .placeholder-photo {
            width: 180px !important;
            height: 180px !important;
            border: 2px dashed #ddd !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #f9fafb !important;
          }

          .employee-code {
            margin-top: 10px !important;
            text-align: center !important;
            width: 100% !important;
          }

          .employee-code div {
            background-color: #f0f9ff !important;
            border: 1px solid #bae6fd !important;
            border-radius: 6px !important;
            padding: 10px !important;
            width: 100% !important;
          }

          /* Field grid layout */
          .field-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            width: 100% !important;
          }

          .field {
            margin-bottom: 12px !important;
            page-break-inside: avoid !important;
          }

          .field label {
            display: block !important;
            font-size: 12px !important;
            color: #6b7280 !important;
            margin-bottom: 4px !important;
            font-weight: 500 !important;
          }

          .field p {
            margin: 0 !important;
            font-size: 14px !important;
            color: #111827 !important;
            font-weight: 500 !important;
            word-break: break-word !important;
          }

          /* Remove any interactive-only UI like buttons */
          button, .no-print, .print-button, .flex.items-center.justify-between {
            display: none !important;
          }

          /* Header styling */
          .print-header {
            margin-bottom: 20px !important;
            padding-bottom: 15px !important;
            border-bottom: 2px solid #e5e7eb !important;
          }

          .print-header h3 {
            margin: 0 !important;
            font-size: 18px !important;
            color: #111827 !important;
            font-weight: 600 !important;
          }

          /* Section title styling */
          .section-title {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 20px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
          }

          /* Ensure proper spacing */
          .border-gray-200 {
            border: 1px solid #e5e7eb !important;
          }

          .rounded-xl {
            border-radius: 12px !important;
          }

          .p-6 {
            padding: 24px !important;
          }

          .mb-4 {
            margin-bottom: 16px !important;
          }

          .mt-2 {
            margin-top: 8px !important;
          }
        </style>
      `;

      // Build print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Employee Basic Information</title>
          ${styles}
          ${printCSS}
        </head>
        <body>
          <div id="print-root">
            <div class="print-header">
              <h3>Employee Basic Information</h3>
            </div>
            <div class="print-section">
              ${clone.outerHTML}
            </div>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Trigger print after a short delay to ensure CSS is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }, 50);
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  if (fetchLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Employee Data</h2>
          <p className="text-gray-600">Please wait while we load the employee information...</p>
        </div>
      </motion.div>
    );
  }

  if (fetchError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackClick}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelAndClear}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Cancel & Clear Data
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!reviewData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-4">Unable to load employee information.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackClick}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelAndClear}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Cancel & Clear Data
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div id="employee-review-content">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Employee Information</h2>
          <p className="text-gray-600">Please review all the information before confirming</p>
        </div>

        {/* Step 1: Basic Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6 print-section" id='basic-info-section'>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
          </div>

          <div className="print-layout">
            {/* Left Column - Profile Photo and Employee Code */}
            <div className="left-column">
              {/* Profile Picture Preview */}
              <div className="border-dashed border-2 rounded-lg px-4 py-2 flex flex-col items-center justify-center mb-4">
                <div className="photo-section">
                  {reviewData.photo ? (
                    <img
                      src={`data:image/png;base64,${reviewData.photo}`}
                      alt="Employee Profile"
                      className="employee-photo"
                    />
                  ) : (
                    <div className="placeholder-photo">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Profile Photo
                </p>
              </div>

              {reviewData.code && (
                <div className="employee-code text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-green-600">Employee Code: </span>
                    <span className="text-sm font-bold text-green-800">{reviewData.code}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Personal Information */}
            <div className="right-column">
              <div className="field-grid">
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{reviewData.fullName || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">ሙሉ ስም</label>
                  <p className="text-gray-900 font-medium">{reviewData.fullNameAm || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <p className="text-gray-900 font-medium">{reviewData.nationality || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900 font-medium">
                    {reviewData.gender ? getEnumValue(Gender, reviewData.gender) : 'Not provided'}
                  </p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Date</label>
                  <p className="text-gray-900 font-medium">{formatDate(reviewData.employmentDate)}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-gray-900 font-medium">
                    {reviewData.employmentType ? getEnumValue(EmpType, reviewData.employmentType) : 'Not provided'}
                  </p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Employment Nature</label>
                  <p className="text-gray-900 font-medium">
                    {reviewData.employmentNature ? getEnumValue(EmpNature, reviewData.employmentNature) : 'Not provided'}
                  </p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Job Grade</label>
                  <p className="text-gray-900 font-medium">{reviewData.jobGrade || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="text-gray-900 font-medium">{reviewData.position || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900 font-medium">{reviewData.department || 'Not provided'}</p>
                </div>
                <div className="field">
                  <label className="text-sm font-medium text-gray-500">Branch</label>
                  <p className="text-gray-900 font-medium">{reviewData.branch || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Biographical Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6 print-section">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Biographical Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Birth Date</label>
              <p className="text-gray-900 font-medium">{formatDate(reviewData.birthDate)}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Birth Location</label>
              <p className="text-gray-900 font-medium">{reviewData.birthLocation || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Mother's Full Name</label>
              <p className="text-gray-900 font-medium">{reviewData.motherFullName || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-gray-900 font-medium">
                {reviewData.maritalStatus ? getEnumValue(MaritalStat, reviewData.maritalStatus) : 'Not provided'}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Has Birth Certificate</label>
              <p className="text-gray-900 font-medium">
                {reviewData.hasBirthCert ? getEnumValue(YesNo, reviewData.hasBirthCert) : 'Not provided'}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Has Marriage Certificate</label>
              <p className="text-gray-900 font-medium">
                {reviewData.hasMarriageCert ? getEnumValue(YesNo, reviewData.hasMarriageCert) : 'Not provided'}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">TIN</label>
              <p className="text-gray-900 font-medium">{reviewData.tin || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Bank Account</label>
              <p className="text-gray-900 font-medium">{reviewData.bankAccountNo || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Pension Number</label>
              <p className="text-gray-900 font-medium">{reviewData.pensionNumber || 'Not provided'}</p>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Address</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <p className="text-gray-900 font-medium">{reviewData.address || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.telephone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Emergency Contact */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6 print-section">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Full Name </label>
              <p className="text-gray-900 font-medium">{reviewData.conFullName || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
              <p className="text-gray-900 font-medium">{reviewData.conFullNameAm || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900 font-medium">{reviewData.conNationality || 'Not provided'}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900 font-medium">
                {reviewData.conGender ? getEnumValue(Gender, reviewData.conGender) : 'Not provided'}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900 font-medium">{reviewData.conRelation || 'Not provided'}</p>
            </div>
          </div>

          {/* Emergency Contact Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900"> Address</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <p className="text-gray-900 font-medium">{reviewData.conAddress || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.conTelephone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Guarantor Information */}
        <div className="border border-gray-200 rounded-xl p-6 print-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Guarantor Information</h3>
            {reviewData.guaFileName && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <FileText className="w-4 h-4" />
                <span>Document uploaded</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guarantor Document Preview */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <label className="text-sm font-medium text-gray-500 mb-3">Guarantor Document</label>
              {reviewData.guaFileName ? (
                <div className="document-section">
                  <div className="document-placeholder">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {reviewData.guaFileName}
                  </p>
                  {reviewData.guaFileSize && (
                    <p className="text-xs text-gray-400 mt-1">{reviewData.guaFileSize}</p>
                  )}
                </div>
              ) : (
                <div className="document-section">
                  <div className="document-placeholder">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">No document uploaded</p>
                </div>
              )}
            </div>

            {/* Guarantor Details */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Full Name </label>
                <p className="text-gray-900 font-medium">{reviewData.guaFullName || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
                <p className="text-gray-900 font-medium">{reviewData.guaFullNameAm || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900 font-medium">{reviewData.guaNationality || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900 font-medium">
                  {reviewData.guaGender ? getEnumValue(Gender, reviewData.guaGender) : 'Not provided'}
                </p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Relation</label>
                <p className="text-gray-900 font-medium">{reviewData.guaRelation || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Guarantor Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900"> Address</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <p className="text-gray-900 font-medium">{reviewData.guaAddress || 'Not provided'}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.guaTelephone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBackClick}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Back
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePrint}
            disabled={loading}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Basic Info
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || submissionStatus === 'submitting'}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            {submissionStatus === 'submitting' || loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm & Finish
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};