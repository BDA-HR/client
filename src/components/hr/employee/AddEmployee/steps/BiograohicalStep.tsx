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
import type { MaritalStat, RelationDto } from "../../../../../types/hr/enum";
import type { UUID } from "crypto";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
import { amharicRegex } from "../../../../../utils/amharic-regex";
import type { AddressType, YesNo } from "../../../../../types/hr/enum";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface BiographicalStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockMaritalStatus: Array<{ id: UUID; name: string }>;
  mockRelations: RelationDto[];
}

export const BiographicalStep: React.FC<BiographicalStepProps> = ({
  formikProps,
  mockMaritalStatus,
  mockRelations,
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

  // Initialize addresses array if empty
  React.useEffect(() => {
    if (!values.addresses || values.addresses.length === 0) {
      setFieldValue("addresses", [{
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
      }]);
    }
  }, [values.addresses, setFieldValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Biographical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Biographical Information
            </h3>
          </div>
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.birthDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            id="biographicalData.birthDate"
            name="biographicalData.birthDate"
            type="date"
            value={values.biographicalData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-1.5 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
              getNestedError(errors, "biographicalData.birthDate") &&
              getNestedTouched(touched, "biographicalData.birthDate")
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
          {getNestedError(errors, "biographicalData.birthDate") &&
            getNestedTouched(touched, "biographicalData.birthDate") && (
              <p className="text-red-500 text-sm mt-1">
                {getNestedError(errors, "biographicalData.birthDate")}
              </p>
            )}
        </div>

        {/* Birth Location */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.birthLocation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Birth Location *
          </label>
          <Input
            id="biographicalData.birthLocation"
            name="biographicalData.birthLocation"
            type="text"
            value={values.biographicalData.birthLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName("biographicalData.birthLocation")}
            placeholder="Addis Ababa"
          />
          {getNestedError(errors, "biographicalData.birthLocation") &&
            getNestedTouched(touched, "biographicalData.birthLocation") && (
              <div className="text-red-500 text-xs mt-1">
                {getNestedError(errors, "biographicalData.birthLocation")}
              </div>
            )}
        </div>

        {/* Mother's Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.motherFullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mother's Full Name *
          </label>
          <Input
            id="biographicalData.motherFullName"
            name="biographicalData.motherFullName"
            type="text"
            value={values.biographicalData.motherFullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName("biographicalData.motherFullName")}
            placeholder="Mother's full name"
          />
          {getNestedError(errors, "biographicalData.motherFullName") &&
            getNestedTouched(touched, "biographicalData.motherFullName") && (
              <div className="text-red-500 text-xs mt-1">
                {getNestedError(errors, "biographicalData.motherFullName")}
              </div>
            )}
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.maritalStatusId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Marital Status *
          </label>
          <Select
            value={values.biographicalData.maritalStatusId}
            onValueChange={(value) =>
              setFieldValue("biographicalData.maritalStatusId", value)
            }
          >
            <SelectTrigger
              className={selectTriggerClassName("biographicalData.maritalStatusId")}
            >
              <SelectValue placeholder="Select Marital Status" />
            </SelectTrigger>
            <SelectContent>
              {mockMaritalStatus.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getNestedError(errors, "biographicalData.maritalStatusId") &&
            getNestedTouched(touched, "biographicalData.maritalStatusId") && (
              <div className="text-red-500 text-xs mt-1">
                {getNestedError(errors, "biographicalData.maritalStatusId")}
              </div>
            )}
        </div>

        {/* Has Birth Certificate */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.hasBirthCert"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Has Birth Certificate? *
          </label>
          <Select
            value={values.biographicalData.hasBirthCert}
            onValueChange={(value) =>
              setFieldValue("biographicalData.hasBirthCert", value)
            }
          >
            <SelectTrigger
              className={selectTriggerClassName("biographicalData.hasBirthCert")}
            >
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Yes</SelectItem>
              <SelectItem value="1">No</SelectItem>
            </SelectContent>
          </Select>
          {getNestedError(errors, "biographicalData.hasBirthCert") &&
            getNestedTouched(touched, "biographicalData.hasBirthCert") && (
              <div className="text-red-500 text-xs mt-1">
                {getNestedError(errors, "biographicalData.hasBirthCert")}
              </div>
            )}
        </div>

        {/* Has Marriage Certificate */}
        <div className="space-y-2">
          <label
            htmlFor="biographicalData.hasMarriageCert"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Has Marriage Certificate? *
          </label>
          <Select
            value={values.biographicalData.hasMarriageCert}
            onValueChange={(value) =>
              setFieldValue("biographicalData.hasMarriageCert", value)
            }
          >
            <SelectTrigger
              className={selectTriggerClassName("biographicalData.hasMarriageCert")}
            >
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Yes</SelectItem>
              <SelectItem value="1">No</SelectItem>
            </SelectContent>
          </Select>
          {getNestedError(errors, "biographicalData.hasMarriageCert") &&
            getNestedTouched(touched, "biographicalData.hasMarriageCert") && (
              <div className="text-red-500 text-xs mt-1">
                {getNestedError(errors, "biographicalData.hasMarriageCert")}
              </div>
            )}
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">Financial Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* TIN Number */}
          <div className="space-y-2">
            <label
              htmlFor="financialData.tin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              TIN Number
            </label>
            <Input
              id="financialData.tin"
              name="financialData.tin"
              type="text"
              value={values.financialData.tin}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClassName("financialData.tin")}
              placeholder="1234567890"
            />
            {getNestedError(errors, "financialData.tin") &&
              getNestedTouched(touched, "financialData.tin") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "financialData.tin")}
                </div>
              )}
          </div>

          {/* Bank Account Number */}
          <div className="space-y-2">
            <label
              htmlFor="financialData.bankAccountNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Account Number
            </label>
            <Input
              id="financialData.bankAccountNo"
              name="financialData.bankAccountNo"
              type="text"
              value={values.financialData.bankAccountNo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClassName("financialData.bankAccountNo")}
              placeholder="Account number"
            />
          </div>

          {/* Pension Number */}
          <div className="space-y-2">
            <label
              htmlFor="financialData.pensionNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pension Number
            </label>
            <Input
              id="financialData.pensionNumber"
              name="financialData.pensionNumber"
              type="text"
              value={values.financialData.pensionNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClassName("financialData.pensionNumber")}
              placeholder="Pension number"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">
            Address Information <span className="text-red-500">*</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Address Type - REQUIRED */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={values.addresses[0]?.addressType || ""}
              onValueChange={(value) =>
                setFieldValue("addresses[0].addressType", value)
              }
            >
              <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                getNestedError(errors, "addresses[0].addressType") && 
                getNestedTouched(touched, "addresses[0].addressType") 
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
            {getNestedError(errors, "addresses[0].addressType") &&
              getNestedTouched(touched, "addresses[0].addressType") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "addresses[0].addressType")}
                </div>
              )}
          </div>

          {/* Country - REQUIRED */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <Input
              value={values.addresses[0]?.country || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].country", e.target.value)
              }
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                getNestedError(errors, "addresses[0].country") && 
                getNestedTouched(touched, "addresses[0].country") 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}
              placeholder="Country"
            />
            {getNestedError(errors, "addresses[0].country") &&
              getNestedTouched(touched, "addresses[0].country") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "addresses[0].country")}
                </div>
              )}
          </div>

          {/* Telephone - REQUIRED with PhoneInput */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telephone <span className="text-red-500">*</span>
            </label>
            <div className={`w-full ${
              getNestedError(errors, "addresses[0].telephone") && 
              getNestedTouched(touched, "addresses[0].telephone") 
                ? 'border border-red-500 rounded-md' 
                : ''
            }`}>
              <PhoneInput
                country={'et'} // Default to Ethiopia
                value={values.addresses[0]?.telephone || ""}
                onChange={(value) => handlePhoneChange(value, "addresses[0].telephone")}
                inputProps={{
                  name: "addresses[0].telephone",
                  required: true,
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
            {getNestedError(errors, "addresses[0].telephone") &&
              getNestedTouched(touched, "addresses[0].telephone") && (
                <div className="text-red-500 text-xs mt-1">
                  {getNestedError(errors, "addresses[0].telephone")}
                </div>
              )}
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <Input
              value={values.addresses[0]?.region || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].region", e.target.value)
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
              value={values.addresses[0]?.subcity || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].subcity", e.target.value)
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
              value={values.addresses[0]?.zone || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].zone", e.target.value)
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
              value={values.addresses[0]?.woreda || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].woreda", e.target.value)
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
              value={values.addresses[0]?.kebele || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].kebele", e.target.value)
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
              value={values.addresses[0]?.houseNo || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].houseNo", e.target.value)
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
              value={values.addresses[0]?.poBox || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].poBox", e.target.value)
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
              value={values.addresses[0]?.fax || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].fax", e.target.value)
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
              value={values.addresses[0]?.email || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].email", e.target.value)
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
              value={values.addresses[0]?.website || ""}
              onChange={(e) =>
                setFieldValue("addresses[0].website", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
              placeholder="Website"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};