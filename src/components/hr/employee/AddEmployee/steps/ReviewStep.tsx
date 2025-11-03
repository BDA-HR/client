import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, MapPin, Image } from 'lucide-react';
import { Gender, EmpType, EmpNature, YesNo, MaritalStat} from '../../../../../types/hr/enum';
import type { Step1Dto, Step2Dto, Step3Dto, Step4Dto, Step5Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';

interface ReviewStepProps {
  step1Data: Partial<Step1Dto & { companyId: string; branchId: string }>;
  step2Data: Partial<Step2Dto>;
  step3Data: Partial<Step3Dto>;
  step4Data: Partial<Step4Dto>;
  employeeId?: UUID;
  employeeCode?: string;
  onSubmit: (step5Data: Step5Dto) => void;
  onBack: () => void;
  loading?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  step1Data,
  step2Data,
  step3Data,
  step4Data,
  employeeId,
  employeeCode,
  onSubmit,
  onBack,
  loading = false
}) => {
  // Function to format telephone numbers to start with +
  const formatTelephone = (phone: string): string => {
    if (!phone) return 'Not provided';
    
    // Remove any existing + and non-digit characters
    const cleaned = phone.replace(/[^\d]/g, '');
    
    // If it starts with 251 (Ethiopia country code), add +
    if (cleaned.startsWith('251')) {
      return `+${cleaned}`;
    }
    
    // If it's already in international format without +, add it
    if (cleaned.length >= 10 && !cleaned.startsWith('0')) {
      return `+${cleaned}`;
    }
    
    // For local numbers, assume Ethiopia and format as +251...
    if (cleaned.startsWith('0')) {
      return `+251${cleaned.substring(1)}`;
    }
    
    // If we can't determine the format, return as is with +
    return `+${cleaned}`;
  };

  // Transform the data to match Step5Dto structure
  const reviewData: Step5Dto = {
    // Basic Info
    employeeId: employeeId || '00000000-0000-0000-0000-000000000000' as UUID,
    photo: step1Data.File ? 'Uploaded' : '',
    pfullName: `${step1Data.firstName || ''} ${step1Data.middleName || ''} ${step1Data.lastName || ''}`.trim(),
    fullNameAm: `${step1Data.firstNameAm || ''} ${step1Data.middleNameAm || ''} ${step1Data.lastNameAm || ''}`.trim(),
    code: employeeCode || '',
    gender: step1Data.gender || '',
    nationality: step1Data.nationality || '',
    employmentDate: step1Data.employmentDate || '',
    employmentDateAm: '',
    jobGrade: step1Data.jobGradeId || '',
    position: step1Data.positionId || '',
    department: step1Data.departmentId || '',
    pbranch: step1Data.branchId || '',
    employmentType: step1Data.employmentType || '',
    employmentNature: step1Data.employmentNature || '',

    // Biographical
    birthDate: step2Data.birthDate || '',
    birthDateAm: '',
    birthLocation: step2Data.birthLocation || '',
    motherFullName: step2Data.motherFullName || '',
    hasBirthCert: step2Data.hasBirthCert || '',
    hasMarriageCert: step2Data.hasMarriageCert || '',
    maritalStatus: step2Data.maritalStatus || '',
    tin: step2Data.tin || '',
    bankAccountNo: step2Data.bankAccountNo || '',
    pensionNumber: step2Data.pensionNumber || '',
    address: [
      step2Data.country,
      step2Data.region,
      step2Data.subcity,
      step2Data.zone,
      step2Data.woreda,
      step2Data.kebele,
      step2Data.houseNo
    ].filter(Boolean).join(', '),
    telephone: formatTelephone(step2Data.telephone || ''),

    // Emergency Contact
    conFullName: `${step3Data.firstName || ''} ${step3Data.middleName || ''} ${step3Data.lastName || ''}`.trim(),
    conFullNameAm: `${step3Data.firstNameAm || ''} ${step3Data.middleNameAm || ''} ${step3Data.lastNameAm || ''}`.trim(),
    conNationality: step3Data.nationality || '',
    conGender: step3Data.gender || '',
    conRelation: step3Data.relationId || '',
    conAddress: [
      step3Data.country,
      step3Data.region,
      step3Data.subcity,
      step3Data.zone,
      step3Data.woreda,
      step3Data.kebele,
      step3Data.houseNo
    ].filter(Boolean).join(', '),
    conTelephone: formatTelephone(step3Data.telephone || ''),

    // Guarantor
    guaFullName: `${step4Data.firstName || ''} ${step4Data.middleName || ''} ${step4Data.lastName || ''}`.trim(),
    guaFullNameAm: `${step4Data.firstNameAm || ''} ${step4Data.middleNameAm || ''} ${step4Data.lastNameAm || ''}`.trim(),
    guaNationality: step4Data.nationality || '',
    guaGender: step4Data.gender || '',
    guaRelation: step4Data.relationId || '',
    guaAddress: [
      step4Data.country,
      step4Data.region,
      step4Data.subcity,
      step4Data.zone,
      step4Data.woreda,
      step4Data.kebele,
      step4Data.houseNo
    ].filter(Boolean).join(', '),
    guaTelephone: formatTelephone(step4Data.telephone || ''),
    guaFileName: step4Data.File?.name || '',
    guaFileSize: step4Data.File ? `${(step4Data.File.size / 1024 / 1024).toFixed(2)} MB` : '',
    guaFileType: step4Data.File?.type || ''
  };

  const getEnumValue = <T extends Record<string, string | number>>(
    enumObj: T, 
    value: string
  ): string => {
    return enumObj[value as keyof T] as string || value;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Create object URL for profile picture preview
  const getProfilePictureUrl = () => {
    if (step1Data.File && step1Data.File instanceof File) {
      return URL.createObjectURL(step1Data.File);
    }
    return null;
  };

  // Create object URL for guarantor document preview
  const getGuarantorDocumentUrl = () => {
    if (step4Data.File && step4Data.File instanceof File) {
      return URL.createObjectURL(step4Data.File);
    }
    return null;
  };

  const handleSubmit = () => {
    onSubmit(reviewData);
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      const profileUrl = getProfilePictureUrl();
      const guarantorUrl = getGuarantorDocumentUrl();
      
      if (profileUrl) {
        URL.revokeObjectURL(profileUrl);
      }
      if (guarantorUrl) {
        URL.revokeObjectURL(guarantorUrl);
      }
    };
  }, []);

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
          {employeeCode && (
            <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-green-600">Employee Code: </span>
              <span className="text-sm font-bold text-green-800">{employeeCode}</span>
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
            {employeeCode && (
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">Employee Code:</span>
                <span className="text-sm font-bold text-gray-900 ml-2">{employeeCode}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Preview */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <label className="text-sm font-medium text-gray-500 mb-3">Profile Picture</label>
              {step1Data.File ? (
                <div className="relative group">
                  <img
                    src={getProfilePictureUrl() || ''}
                    alt="Employee Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center">
                    <Image className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {step1Data.File ? 'Photo uploaded' : 'No photo uploaded'}
              </p>
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
                <p className="text-gray-900 font-medium">{reviewData.pfullName || 'Not provided'}</p>
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
                <p className="text-gray-900">{reviewData.telephone}</p>
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
              <p className="text-gray-900">{reviewData.conTelephone}</p>
            </div>
          </div>
        </div>

        {/* Step 4: Guarantor Information */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Guarantor Information</h3>
            {step4Data.File && (
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
              {step4Data.File ? (
                <div className="relative group">
                  {step4Data.File.type.startsWith('image/') ? (
                    <img
                      src={getGuarantorDocumentUrl() || ''}
                      alt="Guarantor Document"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-blue-200 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-blue-50 border-2 border-blue-200 flex flex-col items-center justify-center p-4">
                      <FileText className="w-8 h-8 text-blue-500 mb-2" />
                      <span className="text-xs text-blue-700 text-center font-medium">
                        {step4Data.File.name.split('.').pop()?.toUpperCase()} Document
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2 text-center">
                {step4Data.File ? step4Data.File.name : 'No document uploaded'}
              </p>
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
                <p className="text-gray-900">{reviewData.guaTelephone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={onBack}
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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