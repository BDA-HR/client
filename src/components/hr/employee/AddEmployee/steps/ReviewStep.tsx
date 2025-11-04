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
  onSubmit: (step5Data: Step5Dto) => void;
  onBack: () => void;
  loading?: boolean;
  onClearTempData?: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  employeeId,
  onSubmit,
  onBack,
  loading = false,
  onClearTempData
}) => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState<Step5Dto | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
        setFetchError('Employee ID is required to fetch review data');
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
        setFetchError(
          error instanceof Error
            ? error.message
            : 'Failed to load employee data. Please try again.'
        );
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

  const handleSubmit = async () => {
    if (reviewData) {
      scrollToTop();

      try {
        await onSubmit(reviewData);

        clearTemporaryData();

        navigate('/hr/employees/record');
      } catch (error) {
        console.error('Submission failed:', error);
      }
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

  // Print functionality
  const handlePrint = () => {
    scrollToTop();

    setTimeout(() => {
      const printContent = document.getElementById('employee-review-content');

      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Employee Record - ${reviewData?.fullName || 'Employee'}</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.4; 
                    color: #333; 
                    margin: 20px;
                    max-width: 1000px;
                  }
                  .print-header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #333; 
                    padding-bottom: 20px;
                  }
                  .print-section { 
                    margin-bottom: 25px; 
                    page-break-inside: avoid;
                  }
                  .print-section h3 { 
                    background-color: #f3f4f6; 
                    padding: 10px; 
                    margin: 0 0 15px 0; 
                    border-left: 4px solid #10b981;
                  }
                  .grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 15px; 
                  }
                  .field { 
                    margin-bottom: 12px; 
                  }
                  .field label { 
                    font-weight: bold; 
                    display: block; 
                    margin-bottom: 4px;
                    font-size: 14px;
                    color: #666;
                  }
                  .field p { 
                    margin: 0; 
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                  }
                  .photo-section { 
                    text-align: center; 
                    margin-bottom: 20px;
                  }
                  .employee-photo {
                    width: 120px;
                    height: 120px;
                    border: 2px solid #333;
                    border-radius: 4px;
                    object-fit: cover;
                  }
                  .placeholder-photo {
                    width: 120px;
                    height: 120px;
                    border: 2px dashed #ccc;
                    border-radius: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f9fafb;
                  }
                  .document-section {
                    text-align: center;
                    margin: 15px 0;
                  }
                  .document-placeholder {
                    width: 100px;
                    height: 100px;
                    border: 2px dashed #ccc;
                    border-radius: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f9fafb;
                  }
                  @media print {
                    body { margin: 0.5in; }
                    .print-section { break-inside: avoid; }
                  }
                </style>
              </head>
              <body>
                <div class="print-header">
                  <h1>Employee Record</h1>
                  ${reviewData?.code ? `<p><strong>Employee Code:</strong> ${reviewData.code}</p>` : ''}
                  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                ${printContent.innerHTML}
              </body>
            </html>
          `);

          printWindow.document.close();
          printWindow.focus();

          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      } else {
        window.print();
      }
    }, 100);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Print Employee Information</h2>
          <p className="text-gray-600">Please review all the information before submitting</p>
        </div>

        {/* Step 1: Basic Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6 print-section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Preview */}
            <div className="lg:col-span-1">
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
              </div>
              {reviewData.code && (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 inline-block">
                    <span className="text-xs font-medium text-green-600">Employee Code: </span>
                    <span className="text-sm font-bold text-green-800">{reviewData.code}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="field">
                <label className="text-sm font-medium text-gray-500"> Full Name </label>
                <p className="text-gray-900 font-medium">{reviewData.fullName || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500"> ሙሉ ስም </label>
                <p className="text-gray-900 font-medium">{reviewData.fullNameAm || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900 font-medium">{reviewData.nationality || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900 font-medium">
                  {reviewData.gender ? getEnumValue(Gender, reviewData.gender) : ''}
                </p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Employment Date</label>
                <p className="text-gray-900 font-medium">{formatDate(reviewData.employmentDate)}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Employment Type</label>
                <p className="text-gray-900 font-medium">
                  {reviewData.employmentType ? getEnumValue(EmpType, reviewData.employmentType) : ''}
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
                <p className="text-gray-900 font-medium">{reviewData.jobGrade || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900 font-medium">{reviewData.position || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900 font-medium">{reviewData.department || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="text-gray-900 font-medium">{reviewData.pbranch || ''}</p>
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
              <p className="text-gray-900 font-medium">{reviewData.birthLocation || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Mother's Full Name</label>
              <p className="text-gray-900 font-medium">{reviewData.motherFullName || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-gray-900 font-medium">
                {reviewData.maritalStatus ? getEnumValue(MaritalStat, reviewData.maritalStatus) : ''}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Has Birth Certificate</label>
              <p className="text-gray-900 font-medium">
                {reviewData.hasBirthCert ? getEnumValue(YesNo, reviewData.hasBirthCert) : ''}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Has Marriage Certificate</label>
              <p className="text-gray-900 font-medium">
                {reviewData.hasMarriageCert ? getEnumValue(YesNo, reviewData.hasMarriageCert) : ''}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">TIN</label>
              <p className="text-gray-900 font-medium">{reviewData.tin || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Bank Account</label>
              <p className="text-gray-900 font-medium">{reviewData.bankAccountNo || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Pension Number</label>
              <p className="text-gray-900 font-medium">{reviewData.pensionNumber || ''}</p>
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
                <p className="text-gray-900 font-medium">{reviewData.address || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.telephone || ''}</p>
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
              <p className="text-gray-900 font-medium">{reviewData.conFullName || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
              <p className="text-gray-900 font-medium">{reviewData.conFullNameAm || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900 font-medium">{reviewData.conNationality || ''}</p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900 font-medium">
                {reviewData.conGender ? getEnumValue(Gender, reviewData.conGender) : ''}
              </p>
            </div>
            <div className="field">
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900 font-medium">{reviewData.conRelation || ''}</p>
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
                <p className="text-gray-900 font-medium">{reviewData.conAddress || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.conTelephone || ''}</p>
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
                <p className="text-gray-900 font-medium">{reviewData.guaFullName || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
                <p className="text-gray-900 font-medium">{reviewData.guaFullNameAm || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900 font-medium">{reviewData.guaNationality || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900 font-medium">
                  {reviewData.guaGender ? getEnumValue(Gender, reviewData.guaGender) : ''}
                </p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Relation</label>
                <p className="text-gray-900 font-medium">{reviewData.guaRelation || ''}</p>
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
                <p className="text-gray-900 font-medium">{reviewData.guaAddress || ''}</p>
              </div>
              <div className="field">
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900 font-medium">{reviewData.guaTelephone || ''}</p>
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
            Print
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};