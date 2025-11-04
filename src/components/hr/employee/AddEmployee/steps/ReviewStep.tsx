import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, MapPin, Image } from 'lucide-react';
import { Gender, EmpType, EmpNature, YesNo, MaritalStat } from '../../../../../types/hr/enum';
import type { Step5Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';
import { empService } from '../../../../../services/hr/employee/empService';

interface ReviewStepProps {
  employeeId?: UUID;
  employeeCode?: string;
  onSubmit: (step5Data: Step5Dto) => void;
  onBack: () => void;
  loading?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  employeeId,
  employeeCode,
  onSubmit,
  onBack,
  loading = false
}) => {
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

  // Fetch Step5 data from API when component mounts
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

  // Handle submit with scroll to top
  const handleSubmit = () => {
    if (reviewData) {
      // Scroll to top before submitting
      scrollToTop();
      onSubmit(reviewData);
    }
  };

  // Handle back button click with scroll to top
  const handleBackClick = () => {
    scrollToTop();
    onBack();
  };

  // Scroll to top when component mounts
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
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
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
          <p className="text-gray-600">Unable to load employee information.</p>
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
      <div>
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Employee Information</h2>
          <p className="text-gray-600">Please review all the information before submitting</p>

          {/* Employee Code Display */}
          {reviewData.code && (
            <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-green-600">Employee Code: </span>
              <span className="text-sm font-bold text-green-800">{reviewData.code}</span>
            </div>
          )}
        </div>

        {/* Step 1: Basic Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Preview */}
            <div className="lg:col-span-1 flex flex-col items-center">
              {/* <label className="text-sm font-medium text-gray-500 mb-3">Profile Picture</label> */}
              {reviewData.photo ? (
                <div className="relative group">
                  <img
                    src={`data:image/png;base64,${reviewData.photo}`}
                    alt="Employee Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
                <p className="text-gray-900 font-medium">{reviewData.fullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
                <p className="text-gray-900 font-medium">{reviewData.fullNameAm || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900">{reviewData.nationality || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">
                  {reviewData.gender ? getEnumValue(Gender, reviewData.gender) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Date</label>
                <p className="text-gray-900">{formatDate(reviewData.employmentDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Type</label>
                <p className="text-gray-900">
                  {reviewData.employmentType ? getEnumValue(EmpType, reviewData.employmentType) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Nature</label>
                <p className="text-gray-900">
                  {reviewData.employmentNature ? getEnumValue(EmpNature, reviewData.employmentNature) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Grade</label>
                <p className="text-gray-900">{reviewData.jobGrade || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900">{reviewData.position || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{reviewData.department || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="text-gray-900">{reviewData.pbranch || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Biographical Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Biographical Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Birth Date</label>
              <p className="text-gray-900">{formatDate(reviewData.birthDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Birth Location</label>
              <p className="text-gray-900">{reviewData.birthLocation || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mother's Full Name</label>
              <p className="text-gray-900">{reviewData.motherFullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-gray-900">
                {reviewData.maritalStatus ? getEnumValue(MaritalStat, reviewData.maritalStatus) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Birth Certificate</label>
              <p className="text-gray-900">
                {reviewData.hasBirthCert ? getEnumValue(YesNo, reviewData.hasBirthCert) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Marriage Certificate</label>
              <p className="text-gray-900">
                {reviewData.hasMarriageCert ? getEnumValue(YesNo, reviewData.hasMarriageCert) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">TIN</label>
              <p className="text-gray-900">{reviewData.tin || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bank Account</label>
              <p className="text-gray-900">{reviewData.bankAccountNo || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pension Number</label>
              <p className="text-gray-900">{reviewData.pensionNumber || 'Not provided'}</p>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Address</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Address</label>
                <p className="text-gray-900">{reviewData.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900">{reviewData.telephone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Emergency Contact */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name </label>
              <p className="text-gray-900">{reviewData.conFullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
              <p className="text-gray-900">{reviewData.conFullNameAm || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{reviewData.conNationality || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">
                {reviewData.conGender ? getEnumValue(Gender, reviewData.conGender) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900">{reviewData.conRelation || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{reviewData.conAddress || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telephone</label>
              <p className="text-gray-900">{reviewData.conTelephone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Step 4: Guarantor Information */}
        <div className="border border-gray-200 rounded-xl p-6">
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
                <div className="relative group">
                  <div className="w-32 h-32 rounded-lg bg-blue-50 border-2 border-blue-200 flex flex-col items-center justify-center p-4">
                    <FileText className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs text-blue-700 text-center font-medium">
                      {reviewData.guaFileType || 'Document'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2 text-center">
                {reviewData.guaFileName || 'No document uploaded'}
              </p>
              {reviewData.guaFileSize && (
                <p className="text-xs text-gray-400 mt-1">{reviewData.guaFileSize}</p>
              )}
            </div>

            {/* Guarantor Details */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name </label>
                <p className="text-gray-900">{reviewData.guaFullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ሙሉ ስም </label>
                <p className="text-gray-900">{reviewData.guaFullNameAm || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="text-gray-900">{reviewData.guaNationality || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900">
                  {reviewData.guaGender ? getEnumValue(Gender, reviewData.guaGender) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Relation</label>
                <p className="text-gray-900">{reviewData.guaRelation || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">{reviewData.guaAddress || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900">{reviewData.guaTelephone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={handleBackClick}
            disabled={loading}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Back
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
                Submit Employee
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};