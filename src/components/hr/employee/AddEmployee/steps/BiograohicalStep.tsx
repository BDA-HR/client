import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Input } from '../../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { YesNo, MaritalStat, AddressType } from '../../../../../types/hr/enum';
import type { Step2Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';

interface BiographicalStepProps {
  data: Partial<Step2Dto>;
  onNext: (data: Step2Dto) => void;
  onBack: () => void;
}

const validationSchema = yup.object({
  birthDate: yup.string().required('Birth date is required'),
  birthLocation: yup.string().required('Birth location is required'),
  motherFullName: yup.string().required("Mother's full name is required"),
  hasBirthCert: yup.string().required('Birth certificate information is required'),
  hasMarriageCert: yup.string().required('Marriage certificate information is required'),
  maritalStatus: yup.string().required('Marital status is required'),
  tin: yup.string().required('TIN is required'),
  bankAccountNo: yup.string().required('Bank account number is required'),
  pensionNumber: yup.string().required('Pension number is required'),
  addressType: yup.string().required('Address type is required'),
  country: yup.string().required('Country is required'),
  region: yup.string().required('Region is required'),
  telephone: yup.string().required('Telephone is required'),
});

export const BiographicalStep: React.FC<BiographicalStepProps> = ({ data, onNext, onBack }) => {
  const formik = useFormik<Step2Dto>({
    initialValues: {
      birthDate: data.birthDate || '',
      birthLocation: data.birthLocation || '',
      motherFullName: data.motherFullName || '',
      hasBirthCert: data.hasBirthCert || '' as YesNo,
      hasMarriageCert: data.hasMarriageCert || '' as YesNo,
      maritalStatus: data.maritalStatus || '' as MaritalStat,
      employeeId: data.employeeId || '' as UUID,
      tin: data.tin || '',
      bankAccountNo: data.bankAccountNo || '',
      pensionNumber: data.pensionNumber || '',
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
    },
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    formik.setFieldValue('telephone', value);
  };

  // Smart form validation that works with pre-filled data
  const isFormValid = React.useMemo(() => {
    if (!formik.isValid) return false;
    
    // Check if all required fields have values (for pre-filled forms)
    const hasAllRequiredFields = 
      formik.values.birthDate &&
      formik.values.birthLocation &&
      formik.values.motherFullName &&
      formik.values.hasBirthCert &&
      formik.values.hasMarriageCert &&
      formik.values.maritalStatus &&
      formik.values.tin &&
      formik.values.bankAccountNo &&
      formik.values.pensionNumber &&
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
        {/* Biographical Details Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Biographical Details</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Birth Date */}
            <div className="space-y-2">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date *
              </label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('birthDate') ? "border-red-500" : "border-gray-300"
                }`}
              />
              {getErrorMessage('birthDate') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('birthDate')}</div>
              )}
            </div>

            {/* Birth Location */}
            <div className="space-y-2">
              <label htmlFor="birthLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Location *
              </label>
              <Input
                id="birthLocation"
                name="birthLocation"
                value={formik.values.birthLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('birthLocation') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Addis Ababa"
              />
              {getErrorMessage('birthLocation') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('birthLocation')}</div>
              )}
            </div>

            {/* Mother's Full Name */}
            <div className="space-y-2">
              <label htmlFor="motherFullName" className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Full Name *
              </label>
              <Input
                id="motherFullName"
                name="motherFullName"
                value={formik.values.motherFullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('motherFullName') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Aster Kebede"
              />
              {getErrorMessage('motherFullName') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('motherFullName')}</div>
              )}
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status *
              </label>
              <Select
                value={formik.values.maritalStatus}
                onValueChange={(value: MaritalStat) => formik.setFieldValue('maritalStatus', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('maritalStatus') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MaritalStat).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('maritalStatus') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('maritalStatus')}</div>
              )}
            </div>

            {/* Has Birth Certificate */}
            <div className="space-y-2">
              <label htmlFor="hasBirthCert" className="block text-sm font-medium text-gray-700 mb-1">
                Has Birth Certificate? *
              </label>
              <Select
                value={formik.values.hasBirthCert}
                onValueChange={(value: YesNo) => formik.setFieldValue('hasBirthCert', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('hasBirthCert') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YesNo).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('hasBirthCert') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('hasBirthCert')}</div>
              )}
            </div>

            {/* Has Marriage Certificate */}
            <div className="space-y-2">
              <label htmlFor="hasMarriageCert" className="block text-sm font-medium text-gray-700 mb-1">
                Has Marriage Certificate? *
              </label>
              <Select
                value={formik.values.hasMarriageCert}
                onValueChange={(value: YesNo) => formik.setFieldValue('hasMarriageCert', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('hasMarriageCert') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(YesNo).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('hasMarriageCert') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('hasMarriageCert')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Financial Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TIN */}
            <div className="space-y-2">
              <label htmlFor="tin" className="block text-sm font-medium text-gray-700 mb-1">
                TIN (Tax Identification Number) *
              </label>
              <Input
                id="tin"
                name="tin"
                value={formik.values.tin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('tin') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="000123456789"
              />
              {getErrorMessage('tin') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('tin')}</div>
              )}
            </div>

            {/* Bank Account Number */}
            <div className="space-y-2">
              <label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Number *
              </label>
              <Input
                id="bankAccountNo"
                name="bankAccountNo"
                value={formik.values.bankAccountNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('bankAccountNo') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="100023456789"
              />
              {getErrorMessage('bankAccountNo') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('bankAccountNo')}</div>
              )}
            </div>

            {/* Pension Number */}
            <div className="space-y-2">
              <label htmlFor="pensionNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Pension Number *
              </label>
              <Input
                id="pensionNumber"
                name="pensionNumber"
                value={formik.values.pensionNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('pensionNumber') ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="PEN123456789"
              />
              {getErrorMessage('pensionNumber') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('pensionNumber')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Address Information</h3>
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