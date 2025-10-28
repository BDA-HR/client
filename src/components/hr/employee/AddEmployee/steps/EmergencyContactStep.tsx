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
import { Button } from "../../../../../components/ui/button";
import { Plus, Trash2, Users, MapPin } from "lucide-react";
import type { RelationDto } from "../../../../../types/hr/employee";
import type { UUID } from "crypto";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
import { amharicRegex } from "../../../../../utils/amharic-regex";
import type { AddressType } from "../../../../../types/hr/enum";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface EmergencyContactStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockRelations: RelationDto[];
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  formikProps,
  mockRelations,
}) => {
  const { values, errors, touched, handleBlur, setFieldValue } = formikProps;

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

  // Ensure there's always exactly one emergency contact
  React.useEffect(() => {
    if (values.emergencyContacts.length === 0) {
      const defaultContact = {
        firstName: "",
        firstNameAm: "",
        middleName: "",
        middleNameAm: "",
        lastName: "",
        lastNameAm: "",
        gender: "" as "0" | "1",
        nationality: "Ethiopian",
        relationId: "" as UUID,
        addressId: "" as UUID,
        address: {
          addressType: "0" as AddressType,
          country: "Ethiopia",
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
          website: "",
        },
      };
      setFieldValue("emergencyContacts", [defaultContact]);
    }
  }, [values.emergencyContacts.length, setFieldValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Emergency Contacts Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Emergency Contact
            </h3>
          </div>
          {/* Removed the Add Contact button */}
        </div>

        {/* Always show exactly one emergency contact form */}
        {values.emergencyContacts.map((contact, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-6 relative"
          >
            {/* Contact Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-500" />
                <h4 className="text-lg font-medium text-gray-800">
                  Emergency Contact
                </h4>
              </div>
              {/* Removed the Remove button since only one contact is needed */}
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h5 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Personal Information
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    value={contact.firstName}
                    onChange={(e) =>
                      setFieldValue(
                        `emergencyContacts[${index}].firstName`,
                        e.target.value
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].firstName`)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ስም
                  </label>
                  <Input
                    value={contact.firstNameAm}
                    onChange={(e) =>
                      handleAmharicChange(
                        e,
                        `emergencyContacts[${index}].firstNameAm`
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].firstNameAm`)}
                    placeholder="አየለ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <Input
                    value={contact.middleName}
                    onChange={(e) =>
                      setFieldValue(
                        `emergencyContacts[${index}].middleName`,
                        e.target.value
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].middleName`)}
                    placeholder="Middle name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    የአባት ስም
                  </label>
                  <Input
                    value={contact.middleNameAm}
                    onChange={(e) =>
                      handleAmharicChange(
                        e,
                        `emergencyContacts[${index}].middleNameAm`
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].middleNameAm`)}
                    placeholder="በቀለ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    value={contact.lastName}
                    onChange={(e) =>
                      setFieldValue(
                        `emergencyContacts[${index}].lastName`,
                        e.target.value
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].lastName`)}
                    placeholder="Last name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    የአያት ስም
                  </label>
                  <Input
                    value={contact.lastNameAm}
                    onChange={(e) =>
                      handleAmharicChange(
                        e,
                        `emergencyContacts[${index}].lastNameAm`
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].lastNameAm`)}
                    placeholder="ዮሐንስ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <Select
                    value={contact.gender}
                    onValueChange={(value) =>
                      setFieldValue(`emergencyContacts[${index}].gender`, value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClassName(`emergencyContacts[${index}].gender`)}>
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
                    value={contact.nationality}
                    onChange={(e) =>
                      setFieldValue(
                        `emergencyContacts[${index}].nationality`,
                        e.target.value
                      )
                    }
                    onBlur={handleBlur}
                    className={inputClassName(`emergencyContacts[${index}].nationality`)}
                    placeholder="Ethiopian"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relation
                  </label>
                  <Select
                    value={contact.relationId}
                    onValueChange={(value) =>
                      setFieldValue(`emergencyContacts[${index}].relationId`, value)
                    }
                  >
                    <SelectTrigger className={selectTriggerClassName(`emergencyContacts[${index}].relationId`)}>
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

            {/* Address Information - ONLY HEADER UPDATED */}
            <div>
              {/* Updated Header to match GuarantorStep */}
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
                    value={contact.address?.addressType || ""}
                    onValueChange={(value) =>
                      setFieldValue(`emergencyContacts[${index}].address.addressType`, value)
                    }
                  >
                    <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                      getNestedError(errors, `emergencyContacts[${index}].address.addressType`) && 
                      getNestedTouched(touched, `emergencyContacts[${index}].address.addressType`) 
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
                  {getNestedError(errors, `emergencyContacts[${index}].address.addressType`) &&
                    getNestedTouched(touched, `emergencyContacts[${index}].address.addressType`) && (
                      <div className="text-red-500 text-xs mt-1">
                        {getNestedError(errors, `emergencyContacts[${index}].address.addressType`)}
                      </div>
                    )}
                </div>

                {/* Country - REQUIRED */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={contact.address?.country || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.country`, e.target.value)
                    }
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md ${
                      getNestedError(errors, `emergencyContacts[${index}].address.country`) && 
                      getNestedTouched(touched, `emergencyContacts[${index}].address.country`) 
                        ? "border-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder="Country"
                  />
                  {getNestedError(errors, `emergencyContacts[${index}].address.country`) &&
                    getNestedTouched(touched, `emergencyContacts[${index}].address.country`) && (
                      <div className="text-red-500 text-xs mt-1">
                        {getNestedError(errors, `emergencyContacts[${index}].address.country`)}
                      </div>
                    )}
                </div>

                {/* Telephone - REQUIRED with PhoneInput */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone <span className="text-red-500">*</span>
                  </label>
                  <div className={`w-full ${
                    getNestedError(errors, `emergencyContacts[${index}].address.telephone`) && 
                    getNestedTouched(touched, `emergencyContacts[${index}].address.telephone`) 
                      ? 'border border-red-500 rounded-md' 
                      : ''
                  }`}>
                    <PhoneInput
                      country={'et'} // Default to Ethiopia
                      value={contact.address?.telephone || ""}
                      onChange={(value) => handlePhoneChange(value, `emergencyContacts[${index}].address.telephone`)}
                      inputProps={{
                        name: `emergencyContacts[${index}].address.telephone`,
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
                  {getNestedError(errors, `emergencyContacts[${index}].address.telephone`) &&
                    getNestedTouched(touched, `emergencyContacts[${index}].address.telephone`) && (
                      <div className="text-red-500 text-xs mt-1">
                        {getNestedError(errors, `emergencyContacts[${index}].address.telephone`)}
                      </div>
                    )}
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <Input
                    value={contact.address?.region || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.region`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.subcity || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.subcity`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.zone || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.zone`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.woreda || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.woreda`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.kebele || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.kebele`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.houseNo || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.houseNo`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.poBox || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.poBox`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.fax || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.fax`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.email || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.email`, e.target.value)
                    }
                    onBlur={handleBlur}
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
                    value={contact.address?.website || ""}
                    onChange={(e) =>
                      setFieldValue(`emergencyContacts[${index}].address.website`, e.target.value)
                    }
                    onBlur={handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                    placeholder="Website"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};