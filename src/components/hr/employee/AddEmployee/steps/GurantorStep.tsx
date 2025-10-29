import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { GuarantorProfileUpload } from './GuarantorProfileUpload';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Gender, AddressType } from '../../../../../types/hr/enum';

interface GuarantorStepProps {
  data: any;
  onNext: (data: any) => void;
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
  const formik = useFormik({
    initialValues: {
      firstName: data.firstName || '',
      firstNameAm: data.firstNameAm || '',
      middleName: data.middleName || '',
      middleNameAm: data.middleNameAm || '',
      lastName: data.lastName || '',
      lastNameAm: data.lastNameAm || '',
      nationality: data.nationality || '',
      gender: data.gender || '',
      relationId: data.relationId || '',
      employeeId: data.employeeId || '',
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
      File: data.File || null,
    },
    validationSchema,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  const handleGuarantorFileSelect = (file: File) => {
    formik.setFieldValue('File', file);
  };

  const handleGuarantorFileRemove = () => {
    formik.setFieldValue('File', null);
  };

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
        {/* Guarantor Document Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Document</h3>
          <GuarantorProfileUpload
            guarantorFile={formik.values.File}
            onGuarantorFileSelect={handleGuarantorFileSelect}
            onGuarantorFileRemove={handleGuarantorFileRemove}
          />
        </div>

        {/* Guarantor Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Guarantor Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Names */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">English Names</h4>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('firstName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('firstName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('firstName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name *</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('middleName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('middleName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('middleName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('lastName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('lastName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('lastName')}</div>
                )}
              </div>
            </div>

            {/* Amharic Names */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Amharic Names</h4>
              
              <div className="space-y-2">
                <Label htmlFor="firstNameAm">First Name (Amharic) *</Label>
                <Input
                  id="firstNameAm"
                  name="firstNameAm"
                  value={formik.values.firstNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('firstNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('firstNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('firstNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleNameAm">Middle Name (Amharic) *</Label>
                <Input
                  id="middleNameAm"
                  name="middleNameAm"
                  value={formik.values.middleNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('middleNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('middleNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('middleNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastNameAm">Last Name (Amharic) *</Label>
                <Input
                  id="lastNameAm"
                  name="lastNameAm"
                  value={formik.values.lastNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('lastNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('lastNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('lastNameAm')}</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('nationality') ? 'border-red-500' : ''}
              />
              {getErrorMessage('nationality') && (
                <div className="text-red-500 text-sm">{getErrorMessage('nationality')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formik.values.gender}
                onValueChange={(value) => formik.setFieldValue('gender', value)}
              >
                <SelectTrigger className={getErrorMessage('gender') ? 'border-red-500' : ''}>
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
                <div className="text-red-500 text-sm">{getErrorMessage('gender')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationId">Relation *</Label>
              <Input
                id="relationId"
                name="relationId"
                value={formik.values.relationId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('relationId') ? 'border-red-500' : ''}
              />
              {getErrorMessage('relationId') && (
                <div className="text-red-500 text-sm">{getErrorMessage('relationId')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Guarantor Address Information</h3>
          
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