import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GuarantorProfileUpload } from './GuarantorProfileUpload';
import { Input } from '../../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Gender, AddressType } from '../../../../../types/hr/enum';
import type { Step4Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';
import { amharicRegex } from '../../../../../utils/amharic-regex'; // Import the Amharic regex

interface GuarantorStepProps {
  data: Partial<Step4Dto>;
  onNext: (data: Step4Dto) => void;
  onBack: () => void;
}

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  firstNameAm: yup.string().required('First name (Amharic) is required'),
  middleName: yup.string().required('Middle name is required'),
  middleNameAm: yup.string().required('Middle name (Amharic) is required'),
  lastName: yup.string().required('Last name is required'),
  lastNameAm: yup.string().required('Last name (Amharic) is required'),
  nationality: yup.string().required('Nationality is required'),
  gender: yup.string().required('Gender is required'),
  relationId: yup.string().required('Relation is required'),
  addressType: yup.string().required('Address type is required'),
  country: yup.string().required('Country is required'),
  region: yup.string().required('Region is required'),
  telephone: yup.string().required('Telephone is required'),
});

export const GuarantorStep: React.FC<GuarantorStepProps> = ({ data, onNext, onBack }) => {
  const formik = useFormik<Step4Dto>({
    initialValues: {
      firstName: data.firstName || '',
      firstNameAm: data.firstNameAm || '',
      middleName: data.middleName || '',
      middleNameAm: data.middleNameAm || '',
      lastName: data.lastName || '',
      lastNameAm: data.lastNameAm || '',
      nationality: data.nationality || '',
      gender: data.gender || '' as Gender,
      relationId: data.relationId || '' as UUID,
      employeeId: data.employeeId || '' as UUID,
      addressType: data.addressType || '' as AddressType,
      addressTypeStr: data.addressTypeStr || '',
      country: data.country || '',
      region: data.region || '',
      subcity: data.subcity || '',
      zone: data.zone || '',
      woreda: data.woreda || '',
      kebele: data.kebele || '',
      houseNo: data.houseNo || '',
      telephone: data.telephone || '',
      poBox: data.poBox || '',
      fax: data.fax || '',
      email: data.email || '',
      website: data.website || '',
      File: data.File || null,
    },
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  // Amharic input handlers
  const handleAmharicInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      formik.setFieldValue(fieldName, value);
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    formik.setFieldValue('telephone', value);
  };

  const handleGuarantorFileSelect = (file: File) => {
    formik.setFieldValue('File', file);
  };

  const handleGuarantorFileRemove = () => {
    formik.setFieldValue('File', null);
  };

  // Smart form validation that works with pre-filled data
  const isFormValid = React.useMemo(() => {
    if (!formik.isValid) return false;
    
    // Check if all required fields have values (for pre-filled forms)
    const hasAllRequiredFields = 
      formik.values.firstName &&
      formik.values.firstNameAm &&
      formik.values.middleName &&
      formik.values.middleNameAm &&
      formik.values.lastName &&
      formik.values.lastNameAm &&
      formik.values.nationality &&
      formik.values.gender &&
      formik.values.relationId &&
      formik.values.addressType &&
      formik.values.country &&
      formik.values.region &&
      formik.values.telephone;

    return formik.dirty || hasAllRequiredFields;
  }, [formik.isValid, formik.dirty, formik.values]);

  // Helper function to safely get error messages
  const getErrorMessage = (fieldName: string): string => {
    const error = formik.errors[fieldName as keyof typeof formik.errors];
    const touched = formik.touched[fieldName as keyof typeof formik.touched];
    
    if (touched && error) {
      return typeof error === 'string' ? error : 'Invalid value';
    }
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Guarantor Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Guarantor Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* English Names Column */}
            <div className="space-y-4">              
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('firstName') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {getErrorMessage('firstName') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name *
                </label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('middleName') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Michael"
                />
                {getErrorMessage('middleName') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('middleName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('lastName') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
                {getErrorMessage('lastName') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</div>
                )}
              </div>
            </div>

            {/* Amharic Names Column */}
            <div className="space-y-4">              
              <div className="space-y-2">
                <label htmlFor="firstNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name (Amharic) *
                </label>
                <Input
                  id="firstNameAm"
                  name="firstNameAm"
                  value={formik.values.firstNameAm}
                  onChange={(e) => handleAmharicInputChange(e, 'firstNameAm')}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('firstNameAm') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="አየለ"
                />
                {getErrorMessage('firstNameAm') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('firstNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name (Amharic) *
                </label>
                <Input
                  id="middleNameAm"
                  name="middleNameAm"
                  value={formik.values.middleNameAm}
                  onChange={(e) => handleAmharicInputChange(e, 'middleNameAm')}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('middleNameAm') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="በቀለ"
                />
                {getErrorMessage('middleNameAm') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('middleNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name (Amharic) *
                </label>
                <Input
                  id="lastNameAm"
                  name="lastNameAm"
                  value={formik.values.lastNameAm}
                  onChange={(e) => handleAmharicInputChange(e, 'lastNameAm')}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                    getErrorMessage('lastNameAm') ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ዮሐንስ"
                />
                {getErrorMessage('lastNameAm') && (
                  <div className="text-red-500 text-xs mt-1">{getErrorMessage('lastNameAm')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Guarantor Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="space-y-2">
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <Input
                id="nationality"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('nationality') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ethiopian"
              />
              {getErrorMessage('nationality') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('nationality')}</div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <Select
                value={formik.values.gender}
                onValueChange={(value: Gender) => formik.setFieldValue('gender', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('gender') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(Gender).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('gender') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('gender')}</div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="relationId" className="block text-sm font-medium text-gray-700 mb-1">
                Relation *
              </label>
              <Input
                id="relationId"
                name="relationId"
                value={formik.values.relationId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('relationId') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Family, Friend, Colleague, etc."
              />
              {getErrorMessage('relationId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('relationId')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Guarantor Address Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Address Type - Required */}
            <div className="space-y-2">
              <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">
                Address Type *
              </label>
              <Select
                value={formik.values.addressType}
                onValueChange={(value: AddressType) => formik.setFieldValue('addressType', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('addressType') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AddressType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('addressType') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('addressType')}</div>
              )}
            </div>

            {/* Country - Required */}
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <Input
                id="country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('country') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ethiopia"
              />
              {getErrorMessage('country') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('country')}</div>
              )}
            </div>

            {/* Region - Required */}
            <div className="space-y-2">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <Input
                id="region"
                name="region"
                value={formik.values.region}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('region') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Addis Ababa"
              />
              {getErrorMessage('region') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('region')}</div>
              )}
            </div>

            {/* Telephone - Required with PhoneInput */}
            <div className="space-y-2">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Telephone *
              </label>
              <div className={`w-full border rounded-md transition-colors duration-200 ${
                getErrorMessage('telephone') ? "border-red-500" : "border-gray-300"
              }`}>
                <PhoneInput
                  country={'et'} // Default to Ethiopia
                  value={formik.values.telephone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "telephone",
                    required: true,
                    onBlur: formik.handleBlur
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    paddingLeft: '48px',
                    outline: 'none',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: 'none'
                  }}
                  buttonStyle={{
                    border: 'none',
                    borderRight: '1px solid #ccc',
                    borderRadius: '6px 0 0 6px',
                    backgroundColor: '#f8f9fa'
                  }}
                  containerStyle={{
                    width: '100%'
                  }}
                  dropdownStyle={{
                    borderRadius: '6px'
                  }}
                />
              </div>
              {getErrorMessage('telephone') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('telephone')}</div>
              )}
            </div>

            {/* Email - Optional */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="example@email.com"
              />
            </div>

            {/* Subcity - Optional */}
            <div className="space-y-2">
              <label htmlFor="subcity" className="block text-sm font-medium text-gray-700 mb-1">
                Subcity
              </label>
              <Input
                id="subcity"
                name="subcity"
                value={formik.values.subcity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="Kirkos"
              />
            </div>

            {/* Zone - Optional */}
            <div className="space-y-2">
              <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">
                Zone
              </label>
              <Input
                id="zone"
                name="zone"
                value={formik.values.zone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="Zone 3"
              />
            </div>

            {/* Woreda - Optional */}
            <div className="space-y-2">
              <label htmlFor="woreda" className="block text-sm font-medium text-gray-700 mb-1">
                Woreda
              </label>
              <Input
                id="woreda"
                name="woreda"
                value={formik.values.woreda}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="08"
              />
            </div>

            {/* Kebele - Optional */}
            <div className="space-y-2">
              <label htmlFor="kebele" className="block text-sm font-medium text-gray-700 mb-1">
                Kebele
              </label>
              <Input
                id="kebele"
                name="kebele"
                value={formik.values.kebele}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="09"
              />
            </div>

            {/* House Number - Optional */}
            <div className="space-y-2">
              <label htmlFor="houseNo" className="block text-sm font-medium text-gray-700 mb-1">
                House Number
              </label>
              <Input
                id="houseNo"
                name="houseNo"
                value={formik.values.houseNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="H-123"
              />
            </div>

            {/* P.O. Box - Optional */}
            <div className="space-y-2">
              <label htmlFor="poBox" className="block text-sm font-medium text-gray-700 mb-1">
                P.O. Box
              </label>
              <Input
                id="poBox"
                name="poBox"
                value={formik.values.poBox}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="1234"
              />
            </div>

            {/* Fax - Optional */}
            <div className="space-y-2">
              <label htmlFor="fax" className="block text-sm font-medium text-gray-700 mb-1">
                Fax
              </label>
              <Input
                id="fax"
                name="fax"
                value={formik.values.fax}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="+251111223344"
              />
            </div>

            {/* Website - Optional */}
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                id="website"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Guarantor Document Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <GuarantorProfileUpload
            guarantorFile={formik.values.File}
            onGuarantorFileSelect={handleGuarantorFileSelect}
            onGuarantorFileRemove={handleGuarantorFileRemove}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};