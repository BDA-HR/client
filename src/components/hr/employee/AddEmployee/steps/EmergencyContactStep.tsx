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
import { Plus, Trash2, Users } from "lucide-react";
import type { RelationDto } from "../../../../../types/hr/employee";
import type { UUID } from "crypto";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
import { amharicRegex } from "../../../../../utils/amharic-regex";

interface EmergencyContactStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockRelations: RelationDto[];
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  formikProps,
  mockRelations,
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

  const addEmergencyContact = () => {
    const newContact = {
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
    };
    setFieldValue("emergencyContacts", [...values.emergencyContacts, newContact]);
  };

  const removeEmergencyContact = (index: number) => {
    const updatedContacts = values.emergencyContacts.filter((_, i) => i !== index);
    setFieldValue("emergencyContacts", updatedContacts);
  };

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
              Emergency Contacts
            </h3>
          </div>
        </div>

        {values.emergencyContacts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contacts</h3>
            <p className="text-gray-500 mb-4">Add at least one emergency contact for the employee.</p>
          </div>
        ) : (
          values.emergencyContacts.map((contact, index) => (
            <div
              key={index}
            >
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
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
                    value={contact.nationality}
                    onChange={(e) =>
                      setFieldValue(
                        `emergencyContacts[${index}].nationality`,
                        e.target.value
                      )
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
                    value={contact.relationId}
                    onValueChange={(value) =>
                      setFieldValue(`emergencyContacts[${index}].relationId`, value)
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
          ))
        )}
      </div>
    </motion.div>
  );
};