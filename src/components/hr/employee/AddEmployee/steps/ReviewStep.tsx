import React from "react";
import { motion } from "framer-motion";
import { User, Heart, Phone, Users } from "lucide-react";
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
      className="space-y-6"
    >
      {/* Step 1: Basic Information - Full Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
               Basic Information
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-lg border-b border-gray-200 pb-2">
              Personal Details
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Full Name (English)</span>
                <p className="font-semibold text-gray-900 text-base mt-1">
                  {values.firstName} {values.middleName} {values.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Full Name (Amharic)</span>
                <p className="font-semibold text-gray-900 text-base mt-1">
                  {values.firstNameAm} {values.middleNameAm} {values.lastNameAm}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Gender</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {getGenderDisplay(values.gender)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Nationality</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.nationality || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-lg border-b border-gray-200 pb-2">
              Employment Details
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Employment Date</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.employmentDate || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Company</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {mockCompanies.find(c => c.id === values.companyId)?.name || "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Branch</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {mockBranches.find(b => b.id === values.branchId)?.name || "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Department</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {mockDepartments.find(d => d.id === values.departmentId)?.name || "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Position</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {mockPositions.find(p => p.id === values.positionId)?.name || "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Employment Type</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {getEmploymentTypeDisplay(values.employmentType)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step 2: Biographical & Financial - Full Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
               Biographical & Financial Information
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Biographical Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-lg border-b border-gray-200 pb-2">
              Biographical Information
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Birth Date</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.biographicalData.birthDate || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Birth Location</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.biographicalData.birthLocation || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Mother's Full Name</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.biographicalData.motherFullName || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Marital Status</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {mockMaritalStatus.find(m => m.id === values.biographicalData.maritalStatusId)?.name || "Not selected"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Birth Certificate</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {getYesNoDisplay(values.biographicalData.hasBirthCert)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Marriage Certificate</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {getYesNoDisplay(values.biographicalData.hasMarriageCert)}
                </p>
              </div>
            </div>
          </div>

          {/* Financial & Address Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 text-lg border-b border-gray-200 pb-2">
              Financial & Address Information
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">TIN Number</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.financialData.tin || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Bank Account Number</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.financialData.bankAccountNo || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Pension Number</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {values.financialData.pensionNumber || "Not provided"}
                </p>
              </div>
              {values.addresses && values.addresses[0] && (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address Type</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {getAddressTypeDisplay(values.addresses[0].addressType)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Country</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {values.addresses[0].country || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Telephone</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {values.addresses[0].telephone || "Not specified"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step 3: Emergency Contacts - Full Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-orange-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
               Emergency Contact
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {values.emergencyContacts && values.emergencyContacts.length > 0 ? (
            values.emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 text-lg mb-3">
                  Contact {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name (English)</span>
                      <p className="font-semibold text-gray-900">
                        {contact.firstName} {contact.middleName} {contact.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name (Amharic)</span>
                      <p className="font-semibold text-gray-900">
                        {contact.firstNameAm} {contact.lastNameAm}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Gender</span>
                      <p className="font-semibold text-gray-900">
                        {getGenderDisplay(contact.gender)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Relation</span>
                      <p className="font-semibold text-gray-900">
                        {mockRelations.find(r => r.id === contact.relationId)?.name || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nationality</span>
                      <p className="font-semibold text-gray-900">
                        {contact.nationality || "Not specified"}
                      </p>
                    </div>
                    {contact.address?.telephone && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Telephone</span>
                        <p className="font-semibold text-gray-900">
                          {contact.address.telephone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No emergency contacts added</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Step 4: Guarantors - Full Row */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
               Guarantor
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {values.guarantors && values.guarantors.length > 0 ? (
            values.guarantors.map((guarantor, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 text-lg mb-3">
                  Guarantor {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name (English)</span>
                      <p className="font-semibold text-gray-900">
                        {guarantor.firstName} {guarantor.middleName} {guarantor.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name (Amharic)</span>
                      <p className="font-semibold text-gray-900">
                        {guarantor.firstNameAm} {guarantor.middleNameAm} {guarantor.lastNameAm}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Gender</span>
                      <p className="font-semibold text-gray-900">
                        {getGenderDisplay(guarantor.gender)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Relation</span>
                      <p className="font-semibold text-gray-900">
                        {mockRelations.find(r => r.id === guarantor.relationId)?.name || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nationality</span>
                      <p className="font-semibold text-gray-900">
                        {guarantor.nationality || "Not specified"}
                      </p>
                    </div>
                    {guarantor.address?.telephone && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Telephone</span>
                        <p className="font-semibold text-gray-900">
                          {guarantor.address.telephone}
                        </p>
                      </div>
                    )}
                    {values.guarantorFiles && values.guarantorFiles[index] && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Document</span>
                        <p className="font-semibold text-gray-900">
                          {values.guarantorFiles[index].name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No guarantors added</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};