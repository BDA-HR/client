import React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import type { RelationDto, AddressDto } from "../../../../../types/hr/employee";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
import { amharicRegex } from "../../../../../utils/amharic-regex";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import type { AddressType } from "../../../../../types/hr/enum";
import { GuarantorProfileUpload } from "./GuarantorProfileUpload";

interface GuarantorStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockRelations: RelationDto[];
  mockAddresses: AddressDto[];
}

export const GuarantorStep: React.FC<GuarantorStepProps> = ({
  formikProps,
  mockRelations,
  mockAddresses,
}) => {
  const { errors, touched, values, handleChange, handleBlur, setFieldValue } = formikProps;

  const inputClassName = (fieldName: string) =>
    `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
      getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName)
        ? "border-red-500"
        : "border-gray-300"
    }`;

  const selectTriggerClassName = (fieldName: string) =>
    `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
      getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName)
        ? "border-red-500"
        : "border-gray-300"
    }`;

  const getNestedError = (errorObj: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], errorObj);
  };

  const getNestedTouched = (touchedObj: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], touchedObj);
  };

  const handleAmharicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === "" || amharicRegex.test(value)) {
      setFieldValue(fieldName, value);
    }
  };

  const handlePhoneChange = (value: string, fieldName: string) => {
    setFieldValue(fieldName, value);
    // Clear error when user starts typing
    if (getNestedError(errors, fieldName)) {
      const errorPath = fieldName.replace(/\[(\d+)\]/g, '.$1');
      const newErrors = { ...errors };
      delete newErrors[errorPath];
      formikProps.setErrors(newErrors);
    }
  };

  const handleGuarantorFileSelect = (file: File) => {
    setFieldValue("guarantorFiles[0]", file);
  };

  const handleGuarantorFileRemove = () => {
    setFieldValue("guarantorFiles[0]", null);
  };

  // Initialize guarantor address if empty
  React.useEffect(() => {
    if (!values.guarantors[0]?.address) {
      setFieldValue("guarantors[0].address", {
        addressType: "0" as AddressType,
        country: "",
        region: "",
        subcity: "",
        zone: "",
        woreda: "",
        kebele: "",
        houseNo: "",
        telephone: "",
        poBox: "",
        fax: "",
        email: "",
        website: ""
      });
    }
  }, [values.guarantors, setFieldValue]);

  // Get guarantor full name for the upload component
  const getGuarantorFullName = () => {
    const guarantor = values.guarantors[0];
    if (!guarantor) return "Guarantor";
    
    const firstName = guarantor.firstName || "";
    const lastName = guarantor.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Guarantor";
  };

  const getGuarantorFullNameAm = () => {
    const guarantor = values.guarantors[0];
    if (!guarantor) return "ዋሚ";
    
    const firstNameAm = guarantor.firstNameAm || "";
    const lastNameAm = guarantor.lastNameAm || "";
    return `${firstNameAm} ${lastNameAm}`.trim() || "ዋሚ";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Guarantors Section */}
      <div className="mt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">
            Guarantors
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              value={values.guarantors[0]?.firstName || ""}
              onChange={(e) =>
                setFieldValue(`guarantors[0].firstName`, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ስም
            </label>
            <Input
              value={values.guarantors[0]?.firstNameAm || ""}
              onChange={(e) =>
                handleAmharicChange(e, `guarantors[0].firstNameAm`)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="አየለ"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <Input
              value={values.guarantors[0]?.middleName || ""}
              onChange={(e) =>
                setFieldValue(`guarantors[0].middleName`, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Middle name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              የአባት ስም
            </label>
            <Input
              value={values.guarantors[0]?.middleNameAm || ""}
              onChange={(e) =>
                handleAmharicChange(e, `guarantors[0].middleNameAm`)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="በቀለ"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              value={values.guarantors[0]?.lastName || ""}
              onChange={(e) =>
                setFieldValue(`guarantors[0].lastName`, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Last name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              የአያት ስም
            </label>
            <Input
              value={values.guarantors[0]?.lastNameAm || ""}
              onChange={(e) =>
                handleAmharicChange(e, `guarantors[0].lastNameAm`)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="ዮሐንስ"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <Select
              value={values.guarantors[0]?.gender || ""}
              onValueChange={(value) =>
                setFieldValue(`guarantors[0].gender`, value)
              }
            >
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Male</SelectItem>
                <SelectItem value="1">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <Input
              value={values.guarantors[0]?.nationality || ""}
              onChange={(e) =>
                setFieldValue(`guarantors[0].nationality`, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Ethiopian"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relation
            </label>
            <Select
              value={values.guarantors[0]?.relationId || ""}
              onValueChange={(value) =>
                setFieldValue(`guarantors[0].relationId`, value)
              }
            >
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md">
                <SelectValue placeholder="Select Relation" />
              </SelectTrigger>
              <SelectContent>
                {mockRelations.map((relation) => (
                  <SelectItem key={relation.id} value={relation.id}>
                    {relation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Guarantor Address Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">
            Guarantor Address Information
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Address Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <Select
              value={values.guarantors[0]?.address?.addressType || ""}
              onValueChange={(value) =>
                setFieldValue("guarantors[0].address.addressType", value)
              }
            >
              <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                getNestedError(errors, "guarantors[0].address.addressType") && 
                getNestedTouched(touched, "guarantors[0].address.addressType") 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}>
                <SelectValue placeholder="Select Address Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Residence</SelectItem>
                <SelectItem value="1">Work Place</SelectItem>
              </SelectContent>
            </Select>
            {getNestedError(errors, "guarantors[0].address.addressType") &&
              getNestedTouched(touched, "guarantors[0].address.addressType") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "guarantors[0].address.addressType")}
                </div>
              )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <Input
              value={values.guarantors[0]?.address?.country || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.country", e.target.value)
              }
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                getNestedError(errors, "guarantors[0].address.country") && 
                getNestedTouched(touched, "guarantors[0].address.country") 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}
              placeholder="Country"
            />
            {getNestedError(errors, "guarantors[0].address.country") &&
              getNestedTouched(touched, "guarantors[0].address.country") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "guarantors[0].address.country")}
                </div>
              )}
          </div>

          {/* Telephone with PhoneInput */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telephone
            </label>
            <div className={`w-full ${
              getNestedError(errors, "guarantors[0].address.telephone") && 
              getNestedTouched(touched, "guarantors[0].address.telephone") 
                ? 'border border-red-500 rounded-md' 
                : ''
            }`}>
              <PhoneInput
                country={'et'} // Default to Ethiopia
                value={values.guarantors[0]?.address?.telephone || ""}
                onChange={(value) => handlePhoneChange(value, "guarantors[0].address.telephone")}
                inputProps={{
                  name: "guarantors[0].address.telephone",
                  onBlur: handleBlur
                }}
                inputStyle={{
                  width: '100%',
                  height: '42px',
                  paddingLeft: '48px',
                  outline: 'none',
                  fontSize: '14px',
                  borderRadius: '6px'
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
            {getNestedError(errors, "guarantors[0].address.telephone") &&
              getNestedTouched(touched, "guarantors[0].address.telephone") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "guarantors[0].address.telephone")}
                </div>
              )}
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <Input
              value={values.guarantors[0]?.address?.region || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.region", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Region"
            />
          </div>

          {/* Subcity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcity
            </label>
            <Input
              value={values.guarantors[0]?.address?.subcity || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.subcity", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Subcity"
            />
          </div>

          {/* Zone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone
            </label>
            <Input
              value={values.guarantors[0]?.address?.zone || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.zone", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Zone"
            />
          </div>

          {/* Woreda */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Woreda
            </label>
            <Input
              value={values.guarantors[0]?.address?.woreda || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.woreda", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Woreda"
            />
          </div>

          {/* Kebele */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kebele
            </label>
            <Input
              value={values.guarantors[0]?.address?.kebele || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.kebele", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Kebele"
            />
          </div>

          {/* House Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House Number
            </label>
            <Input
              value={values.guarantors[0]?.address?.houseNo || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.houseNo", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="House Number"
            />
          </div>

          {/* P.O. Box */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              P.O. Box
            </label>
            <Input
              value={values.guarantors[0]?.address?.poBox || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.poBox", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="P.O. Box"
            />
          </div>

          {/* Fax */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fax
            </label>
            <Input
              value={values.guarantors[0]?.address?.fax || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.fax", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Fax"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              value={values.guarantors[0]?.address?.email || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.email", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Email"
              type="email"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <Input
              value={values.guarantors[0]?.address?.website || ""}
              onChange={(e) =>
                setFieldValue("guarantors[0].address.website", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Website"
            />
          </div>
        </div>
      </div>

      {/* Guarantor File Upload Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">
            Guarantor Document Upload
          </h3>
        </div>

        <div className="flex justify-center">
          <GuarantorProfileUpload
            guarantorFile={values.guarantorFiles[0] || null}
            onGuarantorFileSelect={handleGuarantorFileSelect}
            onGuarantorFileRemove={handleGuarantorFileRemove}
            guarantorName={getGuarantorFullName()}
            guarantorNameAm={getGuarantorFullNameAm()}
          />
        </div>

        {/* File upload validation error */}
        {getNestedError(errors, "guarantorFiles[0]") && (
          <div className="text-red-500 text-xs mt-2 text-center">
            {getNestedError(errors, "guarantorFiles[0]")}
          </div>
        )}


      </div>
    </motion.div>
  );
};