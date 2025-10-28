import React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import { Input } from "../../../../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../ui/select";
// import { Button } from "../../../../../components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
import type { RelationDto, AddressDto } from "../../../../../types/hr/employee";
// import type { UUID } from "crypto";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
// import { amharicRegex } from "../../../../../utils/amharic-regex";
// import DocumentUploadSection from "../AddEmployeeStepForm";

interface FinancialStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockRelations: RelationDto[];
  mockAddresses: AddressDto[];
  guarantorFiles: File[];
  stampFiles: File[];
  signatureFiles: File[];
  onGuarantorFileSelect: (file: File) => void;
  onStampFileSelect: (file: File) => void;
  onSignatureFileSelect: (file: File) => void;
  onGuarantorFileRemove: () => void;
  onStampFileRemove: () => void;
  onSignatureFileRemove: () => void;
}

export const FinancialStep: React.FC<FinancialStepProps> = ({
  formikProps,
//   mockRelations,
//   mockAddresses,
//   guarantorFiles,
//   stampFiles,
//   signatureFiles,
//   onGuarantorFileSelect,
//   onStampFileSelect,
//   onSignatureFileSelect,
//   onGuarantorFileRemove,
//   onStampFileRemove,
//   onSignatureFileRemove,
}) => {
  const { errors, touched, values, handleChange, handleBlur } = formikProps;

  const inputClassName = (fieldName: string) =>
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

//   const handleAmharicChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     fieldName: string
//   ) => {
//     const value = e.target.value;
//     if (value === "" || amharicRegex.test(value)) {
//       setFieldValue(fieldName, value);
//     }
//   };

//   const addGuarantor = () => {
//     const newGuarantor = {
//       firstName: "",
//       firstNameAm: "",
//       middleName: "",
//       middleNameAm: "",
//       lastName: "",
//       lastNameAm: "",
//       gender: "" as "0" | "1",
//       nationality: "Ethiopian",
//       relationId: "" as UUID,
//       addressId: "" as UUID,
//     };
//     setFieldValue("guarantors", [...values.guarantors, newGuarantor]);
//   };

//   const removeGuarantor = (index: number) => {
//     const updatedGuarantors = values.guarantors.filter((_, i) => i !== index);
//     setFieldValue("guarantors", updatedGuarantors);
//   };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center text-center gap-2">
        {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <DollarSign className="w-7 h-7 text-white" />
        </div> */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Financial & Guarantors
        </h2>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Financial Information
            </h3>
          </div>
        </div>

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

      {/* Guarantors Section - Commented out for now */}
      {/*
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Guarantors
            </h3>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addGuarantor}
            className="cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Guarantor
          </Button>
        </div>

        {values.guarantors.map((guarantor, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-lg mb-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-700">
                Guarantor {index + 1}
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGuarantor(index)}
                className="cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={guarantor.firstName}
                  onChange={(e) =>
                    setFieldValue(`guarantors[${index}].firstName`, e.target.value)
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
                  value={guarantor.firstNameAm}
                  onChange={(e) =>
                    handleAmharicChange(e, `guarantors[${index}].firstNameAm`)
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
                  value={guarantor.middleName}
                  onChange={(e) =>
                    setFieldValue(`guarantors[${index}].middleName`, e.target.value)
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
                  value={guarantor.middleNameAm}
                  onChange={(e) =>
                    handleAmharicChange(e, `guarantors[${index}].middleNameAm`)
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
                  value={guarantor.lastName}
                  onChange={(e) =>
                    setFieldValue(`guarantors[${index}].lastName`, e.target.value)
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
                  value={guarantor.lastNameAm}
                  onChange={(e) =>
                    handleAmharicChange(e, `guarantors[${index}].lastNameAm`)
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
                  value={guarantor.gender}
                  onValueChange={(value) =>
                    setFieldValue(`guarantors[${index}].gender`, value)
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
                  value={guarantor.nationality}
                  onChange={(e) =>
                    setFieldValue(`guarantors[${index}].nationality`, e.target.value)
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
                  value={guarantor.relationId}
                  onValueChange={(value) =>
                    setFieldValue(`guarantors[${index}].relationId`, value)
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Select
                  value={guarantor.addressId}
                  onValueChange={(value) =>
                    setFieldValue(`guarantors[${index}].addressId`, value)
                  }
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md">
                    <SelectValue placeholder="Select Address" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
      */}

      {/* Document Upload Section - Commented out for now */}
      {/*
      <DocumentUploadSection
        guarantorFiles={guarantorFiles}
        stampFiles={stampFiles}
        signatureFiles={signatureFiles}
        onGuarantorFileSelect={onGuarantorFileSelect}
        onStampFileSelect={onStampFileSelect}
        onSignatureFileSelect={onSignatureFileSelect}
        onGuarantorFileRemove={onGuarantorFileRemove}
        onStampFileRemove={onStampFileRemove}
        onSignatureFileRemove={onSignatureFileRemove}
      />
      */}
    </motion.div>
  );
};