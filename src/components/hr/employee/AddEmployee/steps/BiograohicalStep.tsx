import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { YesNo, MaritalStat, AddressType } from '../../../../../types/hr/enum';

interface BiographicalStepProps {
  data: any;
  onNext: (data: any) => void;
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
  const formik = useFormik({
    initialValues: {
      birthDate: data.birthDate || '',
      birthLocation: data.birthLocation || '',
      motherFullName: data.motherFullName || '',
      hasBirthCert: data.hasBirthCert || '',
      hasMarriageCert: data.hasMarriageCert || '',
      maritalStatus: data.maritalStatus || '',
      employeeId: data.employeeId || '',
      tin: data.tin || '',
      bankAccountNo: data.bankAccountNo || '',
      pensionNumber: data.pensionNumber || '',
      addressType: data.addressType || '',
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
    onSubmit: (values) => {
      onNext(values);
    },
  });

  const isFormValid = formik.isValid && formik.dirty;

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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('birthDate') ? 'border-red-500' : ''}
              />
              {getErrorMessage('birthDate') && (
                <div className="text-red-500 text-sm">{getErrorMessage('birthDate')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthLocation">Birth Location *</Label>
              <Input
                id="birthLocation"
                name="birthLocation"
                value={formik.values.birthLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('birthLocation') ? 'border-red-500' : ''}
              />
              {getErrorMessage('birthLocation') && (
                <div className="text-red-500 text-sm">{getErrorMessage('birthLocation')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherFullName">Mother's Full Name *</Label>
              <Input
                id="motherFullName"
                name="motherFullName"
                value={formik.values.motherFullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('motherFullName') ? 'border-red-500' : ''}
              />
              {getErrorMessage('motherFullName') && (
                <div className="text-red-500 text-sm">{getErrorMessage('motherFullName')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status *</Label>
              <Select
                value={formik.values.maritalStatus}
                onValueChange={(value) => formik.setFieldValue('maritalStatus', value)}
              >
                <SelectTrigger className={getErrorMessage('maritalStatus') ? 'border-red-500' : ''}>
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
                <div className="text-red-500 text-sm">{getErrorMessage('maritalStatus')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasBirthCert">Has Birth Certificate? *</Label>
              <Select
                value={formik.values.hasBirthCert}
                onValueChange={(value) => formik.setFieldValue('hasBirthCert', value)}
              >
                <SelectTrigger className={getErrorMessage('hasBirthCert') ? 'border-red-500' : ''}>
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
                <div className="text-red-500 text-sm">{getErrorMessage('hasBirthCert')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasMarriageCert">Has Marriage Certificate? *</Label>
              <Select
                value={formik.values.hasMarriageCert}
                onValueChange={(value) => formik.setFieldValue('hasMarriageCert', value)}
              >
                <SelectTrigger className={getErrorMessage('hasMarriageCert') ? 'border-red-500' : ''}>
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
                <div className="text-red-500 text-sm">{getErrorMessage('hasMarriageCert')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tin">TIN (Tax Identification Number) *</Label>
              <Input
                id="tin"
                name="tin"
                value={formik.values.tin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('tin') ? 'border-red-500' : ''}
              />
              {getErrorMessage('tin') && (
                <div className="text-red-500 text-sm">{getErrorMessage('tin')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNo">Bank Account Number *</Label>
              <Input
                id="bankAccountNo"
                name="bankAccountNo"
                value={formik.values.bankAccountNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('bankAccountNo') ? 'border-red-500' : ''}
              />
              {getErrorMessage('bankAccountNo') && (
                <div className="text-red-500 text-sm">{getErrorMessage('bankAccountNo')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pensionNumber">Pension Number *</Label>
              <Input
                id="pensionNumber"
                name="pensionNumber"
                value={formik.values.pensionNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('pensionNumber') ? 'border-red-500' : ''}
              />
              {getErrorMessage('pensionNumber') && (
                <div className="text-red-500 text-sm">{getErrorMessage('pensionNumber')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="addressType">Address Type *</Label>
              <Select
                value={formik.values.addressType}
                onValueChange={(value) => formik.setFieldValue('addressType', value)}
              >
                <SelectTrigger className={getErrorMessage('addressType') ? 'border-red-500' : ''}>
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
                <div className="text-red-500 text-sm">{getErrorMessage('addressType')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('country') ? 'border-red-500' : ''}
              />
              {getErrorMessage('country') && (
                <div className="text-red-500 text-sm">{getErrorMessage('country')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Input
                id="region"
                name="region"
                value={formik.values.region}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('region') ? 'border-red-500' : ''}
              />
              {getErrorMessage('region') && (
                <div className="text-red-500 text-sm">{getErrorMessage('region')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcity">Subcity</Label>
              <Input
                id="subcity"
                name="subcity"
                value={formik.values.subcity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Input
                id="zone"
                name="zone"
                value={formik.values.zone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="woreda">Woreda</Label>
              <Input
                id="woreda"
                name="woreda"
                value={formik.values.woreda}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kebele">Kebele</Label>
              <Input
                id="kebele"
                name="kebele"
                value={formik.values.kebele}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseNo">House Number</Label>
              <Input
                id="houseNo"
                name="houseNo"
                value={formik.values.houseNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone *</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formik.values.telephone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('telephone') ? 'border-red-500' : ''}
              />
              {getErrorMessage('telephone') && (
                <div className="text-red-500 text-sm">{getErrorMessage('telephone')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="poBox">P.O. Box</Label>
              <Input
                id="poBox"
                name="poBox"
                value={formik.values.poBox}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                name="fax"
                value={formik.values.fax}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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