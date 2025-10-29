import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, MapPin } from 'lucide-react';
import { Gender, EmpType, EmpNature, YesNo, MaritalStat, AddressType } from '../../../../../types/hr/enum';

interface ReviewStepProps {
  step1Data: any;
  step2Data: any;
  step3Data: any;
  step4Data: any;
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
  const getEnumValue = (enumObj: any, value: string) => {
    return enumObj[value as keyof typeof enumObj] || value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
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
              <p className="text-gray-900">{`${step1Data.firstName} ${step1Data.middleName} ${step1Data.lastName}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">{`${step1Data.firstNameAm} ${step1Data.middleNameAm} ${step1Data.lastNameAm}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step1Data.nationality}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">{getEnumValue(Gender, step1Data.gender)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Date</label>
              <p className="text-gray-900">{step1Data.employmentDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Type</label>
              <p className="text-gray-900">{getEnumValue(EmpType, step1Data.employmentType)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Nature</label>
              <p className="text-gray-900">{getEnumValue(EmpNature, step1Data.employmentNature)}</p>
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
              <p className="text-gray-900">{step2Data.birthDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Birth Location</label>
              <p className="text-gray-900">{step2Data.birthLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mother's Full Name</label>
              <p className="text-gray-900">{step2Data.motherFullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-gray-900">{getEnumValue(MaritalStat, step2Data.maritalStatus)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Birth Certificate</label>
              <p className="text-gray-900">{getEnumValue(YesNo, step2Data.hasBirthCert)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Has Marriage Certificate</label>
              <p className="text-gray-900">{getEnumValue(YesNo, step2Data.hasMarriageCert)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">TIN</label>
              <p className="text-gray-900">{step2Data.tin}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bank Account</label>
              <p className="text-gray-900">{step2Data.bankAccountNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pension Number</label>
              <p className="text-gray-900">{step2Data.pensionNumber}</p>
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
                <p className="text-gray-900">{getEnumValue(AddressType, step2Data.addressType)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-gray-900">{step2Data.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Region</label>
                <p className="text-gray-900">{step2Data.region}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telephone</label>
                <p className="text-gray-900">{step2Data.telephone}</p>
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
              <p className="text-gray-900">{`${step3Data.firstName} ${step3Data.middleName} ${step3Data.lastName}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">{`${step3Data.firstNameAm} ${step3Data.middleNameAm} ${step3Data.lastNameAm}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step3Data.nationality}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">{getEnumValue(Gender, step3Data.gender)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900">{step3Data.relationId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telephone</label>
              <p className="text-gray-900">{step3Data.telephone}</p>
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
              <p className="text-gray-900">{`${step4Data.firstName} ${step4Data.middleName} ${step4Data.lastName}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name (Amharic)</label>
              <p className="text-gray-900">{`${step4Data.firstNameAm} ${step4Data.middleNameAm} ${step4Data.lastNameAm}`}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-gray-900">{step4Data.nationality}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">{getEnumValue(Gender, step4Data.gender)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Relation</label>
              <p className="text-gray-900">{step4Data.relationId}</p>
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