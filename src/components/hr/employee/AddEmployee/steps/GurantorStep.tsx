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
  const { values, setFieldValue } = formikProps;

  const handleAmharicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === "" || amharicRegex.test(value)) {
      setFieldValue(fieldName, value);
    }
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Select
              value={values.guarantors[0]?.addressId || ""}
              onValueChange={(value) =>
                setFieldValue(`guarantors[0].addressId`, value)
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
    </motion.div>
  );
};