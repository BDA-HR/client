import React from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Heart, DollarSign, Phone, Users } from "lucide-react";
import type {
  JobGradeDto,
  DepartmentDto,
  PositionDto,
  MaritalStatusDto,
  RelationDto,
} from "../../../../../types/hr/employee";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";

interface ReviewStepProps {
  values: ExtendedEmployeeData;
  mockCompanies: any[];
  mockBranches: any[];
  mockDepartments: DepartmentDto[];
  mockPositions: PositionDto[];
  mockJobGrades: JobGradeDto[];
  mockMaritalStatus: MaritalStatusDto[];
  mockRelations: RelationDto[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  values,
  mockCompanies,
  mockBranches,
  mockDepartments,
  mockPositions,
  mockJobGrades,
  mockMaritalStatus,
  mockRelations,
}) => {
  // Helper functions to get display values
  const getEmploymentTypeDisplay = (type: string) => {
    switch (type) {
      case "0": return "Replacement";
      case "1": return "New Opening";
      case "2": return "Additional Required";
      case "3": return "Old Employee";
      default: return "Not specified";
    }
  };

  const getEmploymentNatureDisplay = (nature: string) => {
    switch (nature) {
      case "0": return "Permanent";
      case "1": return "Contract";
      default: return "Not specified";
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case "0": return "Male";
      case "1": return "Female";
      default: return "Not specified";
    }
  };

  const getYesNoDisplay = (value: string) => {
    switch (value) {
      case "0": return "Yes";
      case "1": return "No";
      default: return "Not specified";
    }
  };

  const getAddressTypeDisplay = (type: string) => {
    switch (type) {
      case "0": return "Residence";
      case "1": return "Work Place";
      default: return "Not specified";
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
      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Full Name (English)
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.firstName} {values.middleName} {values.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Full Name (Amharic)
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.firstNameAm} {values.middleNameAm} {values.lastNameAm}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Gender
              </dt>
              <dd className="font-semibold text-gray-900">
                {getGenderDisplay(values.gender)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Nationality
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.nationality || "Not specified"}
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Employment Details Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Employment Details
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Employment Date
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.employmentDate || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Company
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockCompanies.find((c) => c.id === values.companyId)
                  ?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Branch
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockBranches.find((b) => b.id === values.branchId)
                  ?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Department
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockDepartments.find((d) => d.id === values.departmentId)
                  ?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Position
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockPositions.find((p) => p.id === values.positionId)
                  ?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Job Grade
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockJobGrades.find((g) => g.id === values.jobGradeId)
                  ?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Employment Type
              </dt>
              <dd className="font-semibold text-gray-900">
                {getEmploymentTypeDisplay(values.employmentType)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Employment Nature
              </dt>
              <dd className="font-semibold text-gray-900">
                {getEmploymentNatureDisplay(values.employmentNature)}
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Biographical Information Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Biographical Information
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Birth Date
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.biographicalData.birthDate || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Birth Location
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.biographicalData.birthLocation || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Mother's Name
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.biographicalData.motherFullName || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Marital Status
              </dt>
              <dd className="font-semibold text-gray-900">
                {mockMaritalStatus.find(
                  (m) => m.id === values.biographicalData.maritalStatusId
                )?.name || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Birth Certificate
              </dt>
              <dd className="font-semibold text-gray-900">
                {getYesNoDisplay(values.biographicalData.hasBirthCert)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Marriage Certificate
              </dt>
              <dd className="font-semibold text-gray-900">
                {getYesNoDisplay(values.biographicalData.hasMarriageCert)}
              </dd>
            </div>
          </dl>
        </motion.div>

        {/* Financial Information Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Financial Information
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                TIN Number
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.financialData.tin || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Bank Account
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.financialData.bankAccountNo || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pension Number
              </dt>
              <dd className="font-semibold text-gray-900">
                {values.financialData.pensionNumber || "Not provided"}
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>

      {/* Addresses Summary */}
      {values.addresses && values.addresses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Addresses ({values.addresses.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.addresses.map((address, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-700 mb-2">
                  Address {index + 1} - {getAddressTypeDisplay(address.addressType)}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {address.country && <p><span className="font-medium">Country:</span> {address.country}</p>}
                  {address.region && <p><span className="font-medium">Region:</span> {address.region}</p>}
                  {address.subcity && <p><span className="font-medium">Subcity:</span> {address.subcity}</p>}
                  {address.zone && <p><span className="font-medium">Zone:</span> {address.zone}</p>}
                  {address.woreda && <p><span className="font-medium">Woreda:</span> {address.woreda}</p>}
                  {address.kebele && <p><span className="font-medium">Kebele:</span> {address.kebele}</p>}
                  {address.houseNo && <p><span className="font-medium">House No:</span> {address.houseNo}</p>}
                  {address.telephone && <p><span className="font-medium">Telephone:</span> {address.telephone}</p>}
                  {address.poBox && <p><span className="font-medium">P.O. Box:</span> {address.poBox}</p>}
                  {address.email && <p><span className="font-medium">Email:</span> {address.email}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Emergency Contacts Summary */}
      {values.emergencyContacts && values.emergencyContacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Emergency Contacts ({values.emergencyContacts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-700 mb-2">
                  Contact {index + 1}
                </h4>
                <p className="text-sm text-gray-600">
                  {contact.firstName} {contact.middleName} {contact.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Gender: {getGenderDisplay(contact.gender)} | 
                  Nationality: {contact.nationality} | 
                  Relation: {mockRelations.find((r) => r.id === contact.relationId)
                    ?.name || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Family Members Summary */}
      {values.familyMembers && values.familyMembers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Family Members ({values.familyMembers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.familyMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-700">
                  Family Member {index + 1}
                </h4>
                <p className="text-sm text-gray-600">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Gender: {getGenderDisplay(member.gender)} | 
                  Nationality: {member.nationality} | 
                  Relation: {mockRelations.find((r) => r.id === member.relationId)
                    ?.name || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Guarantors Summary */}
      {values.guarantors && values.guarantors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Guarantors ({values.guarantors.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.guarantors.map((guarantor, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-700">
                  Guarantor {index + 1}
                </h4>
                <p className="text-sm text-gray-600">
                  {guarantor.firstName} {guarantor.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Gender: {getGenderDisplay(guarantor.gender)} | 
                  Nationality: {guarantor.nationality} | 
                  Relation: {mockRelations.find((r) => r.id === guarantor.relationId)
                    ?.name || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State if no additional data */}
      {(!values.emergencyContacts || values.emergencyContacts.length === 0) &&
       (!values.familyMembers || values.familyMembers.length === 0) &&
       (!values.guarantors || values.guarantors.length === 0) &&
       (!values.addresses || values.addresses.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200"
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Additional Information</h3>
          <p className="text-gray-500">
            No emergency contacts, family members, guarantors, or addresses added.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};