import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, MapPin } from 'lucide-react';
import { Gender, EmpType, EmpNature, YesNo, MaritalStat, AddressType } from '../../../../../types/hr/enum';
import type { Step1Dto, Step2Dto, Step3Dto, Step4Dto } from '../../../../../types/hr/employee/empAddDto';

interface ReviewStepProps {
  step1Data: Partial<Step1Dto & { companyId: string; branchId: string }>;
  step2Data: Partial<Step2Dto>;
  step3Data: Partial<Step3Dto>;
  step4Data: Partial<Step4Dto>;
  onSubmit: () => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  step1Data,
  step2Data,
  step3Data,
  step4Data,
  onSubmit,
  onBack,
}) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Employee Information</h2>
          <p className="text-gray-600">Please review all the information before submitting</p>
        </div>

        {/* Step 1: Basic Information */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
              <p className="text-gray-900">
                {step1Data.firstName || step1Data.middleName || step1Data.lastName 
                  ? `${step1Data.firstName || ''} ${step1Data.middleName || ''} ${step1Data.lastName || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">
                {step1Data.firstNameAm || step1Data.middleNameAm || step1Data.lastNameAm
                  ? `${step1Data.firstNameAm || ''} ${step1Data.middleNameAm || ''} ${step1Data.lastNameAm || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step1Data.nationality || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">
                {step1Data.gender ? getEnumValue(Gender, step1Data.gender) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Date</label>
              <p className="text-gray-900">{formatDate(step1Data.employmentDate || '')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Type</label>
              <p className="text-gray-900">
                {step1Data.employmentType ? getEnumValue(EmpType, step1Data.employmentType) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Nature</label>
              <p className="text-gray-900">
                {step1Data.employmentNature ? getEnumValue(EmpNature, step1Data.employmentNature) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Profile Picture</label>
              <p className="text-gray-900">{step1Data.File ? 'Uploaded' : 'Not uploaded'}</p>
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
              <p className="text-gray-900">{formatDate(step2Data.birthDate || '')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Birth Location</label>
              <p className="text-gray-900">{step2Data.birthLocation || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mother's Full Name</label>
              <p className="text-gray-900">{step2Data.motherFullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-gray-900">
                {step2Data.maritalStatus ? getEnumValue(MaritalStat, step2Data.maritalStatus) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Birth Certificate</label>
              <p className="text-gray-900">
                {step2Data.hasBirthCert ? getEnumValue(YesNo, step2Data.hasBirthCert) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Marriage Certificate</label>
              <p className="text-gray-900">
                {step2Data.hasMarriageCert ? getEnumValue(YesNo, step2Data.hasMarriageCert) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">TIN</label>
              <p className="text-gray-900">{step2Data.tin || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bank Account</label>
              <p className="text-gray-900">{step2Data.bankAccountNo || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pension Number</label>
              <p className="text-gray-900">{step2Data.pensionNumber || 'Not provided'}</p>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Address Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Address Type</label>
                <p className="text-gray-900">
                  {step2Data.addressType ? getEnumValue(AddressType, step2Data.addressType) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-gray-900">{step2Data.country || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Region</label>
                <p className="text-gray-900">{step2Data.region || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900">{step2Data.telephone || 'Not provided'}</p>
              </div>
              {step2Data.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{step2Data.email}</p>
                </div>
              )}
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
              <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
              <p className="text-gray-900">
                {step3Data.firstName || step3Data.middleName || step3Data.lastName
                  ? `${step3Data.firstName || ''} ${step3Data.middleName || ''} ${step3Data.lastName || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">
                {step3Data.firstNameAm || step3Data.middleNameAm || step3Data.lastNameAm
                  ? `${step3Data.firstNameAm || ''} ${step3Data.middleNameAm || ''} ${step3Data.lastNameAm || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step3Data.nationality || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">
                {step3Data.gender ? getEnumValue(Gender, step3Data.gender) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900">{step3Data.relationId || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telephone</label>
              <p className="text-gray-900">{step3Data.telephone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Step 4: Guarantor Information */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Guarantor Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (English)</label>
              <p className="text-gray-900">
                {step4Data.firstName || step4Data.middleName || step4Data.lastName
                  ? `${step4Data.firstName || ''} ${step4Data.middleName || ''} ${step4Data.lastName || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">
                {step4Data.firstNameAm || step4Data.middleNameAm || step4Data.lastNameAm
                  ? `${step4Data.firstNameAm || ''} ${step4Data.middleNameAm || ''} ${step4Data.lastNameAm || ''}`.trim()
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step4Data.nationality || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">
                {step4Data.gender ? getEnumValue(Gender, step4Data.gender) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900">{step4Data.relationId || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Guarantor Document</label>
              <p className="text-gray-900">{step4Data.File ? 'Uploaded' : 'Not uploaded'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Employee
          </button>
        </div>
      </div>
    </motion.div>
  );
};