import React from "react";
import { Formik, Form } from "formik";
import type { FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import * as Yup from "yup";
import { Button } from "../../../../components/ui/button";
import { ChevronRight } from "lucide-react";
import type {
  EmployeeAddDto,
  JobGradeDto,
  DepartmentDto,
  PositionDto,
  MaritalStatusDto,
  RelationDto,
  EmContactAddDto,
  EmpBioAddDto,
  EmpFamilyAddDto,
  EmpFinanceAddDto,
  EmpGuarantorAddDto,
} from "../../../../types/hr/employee";
import type { UUID } from "crypto";
import type { AddressType } from "../../../../types/hr/enum";
import { amharicRegex } from "../../../../utils/amharic-regex";

// Import step components
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { BiographicalStep } from "./steps/BiograohicalStep";
import { EmergencyContactStep } from "./steps/EmergencyContactStep";
// import { GuarantorStep } from "./steps/GurantorStep";
import { ReviewStep } from "./steps/ReviewStep";

// Mock data
const mockCompanies = [
  { id: "1" as UUID, name: "Main Company", nameAm: "ዋና ኩባንያ" },
  { id: "2" as UUID, name: "Subsidiary A", nameAm: "ንዑስ ኩባንያ አ" },
  { id: "3" as UUID, name: "Subsidiary B", nameAm: "ንዑስ ኩባንያ ለ" },
];

const mockBranches = [
  {
    id: "1" as UUID,
    name: "Head Office",
    nameAm: "ዋና ቢሮ",
    companyId: "1" as UUID,
  },
  {
    id: "2" as UUID,
    name: "Branch A",
    nameAm: "ቅርንጫፍ አ",
    companyId: "1" as UUID,
  },
  {
    id: "3" as UUID,
    name: "Branch B",
    nameAm: "ቅርንጫፍ ለ",
    companyId: "1" as UUID,
  },
  {
    id: "4" as UUID,
    name: "Subsidiary Office",
    nameAm: "ንዑስ ቢሮ",
    companyId: "2" as UUID,
  },
  {
    id: "5" as UUID,
    name: "Subsidiary Branch",
    nameAm: "ንዑስ ቅርንጫፍ",
    companyId: "3" as UUID,
  },
];

const mockJobGrades: JobGradeDto[] = [
  { id: "1" as UUID, name: "Grade 1", nameAm: "ግሬድ 1" },
  { id: "2" as UUID, name: "Grade 2", nameAm: "ግሬድ 2" },
  { id: "3" as UUID, name: "Grade 3", nameAm: "ግሬድ 3" },
];

const mockDepartments: DepartmentDto[] = [
  {
    id: "1" as UUID,
    name: "Engineering",
    nameAm: "ኢንጂነሪንግ",
    branchId: "1" as UUID,
  },
  {
    id: "2" as UUID,
    name: "Human Resources",
    nameAm: "ሰው ሀብት",
    branchId: "1" as UUID,
  },
  { id: "3" as UUID, name: "Finance", nameAm: "ፋይናንስ", branchId: "1" as UUID },
  { id: "4" as UUID, name: "Marketing", nameAm: "ግብይት", branchId: "2" as UUID },
  {
    id: "5" as UUID,
    name: "Operations",
    nameAm: "ኦፕሬሽን",
    branchId: "2" as UUID,
  },
];

const mockPositions: PositionDto[] = [
  {
    id: "1" as UUID,
    name: "Software Engineer",
    nameAm: "ሶፍትዌር ኢንጂነር",
    departmentId: "1" as UUID,
  },
  {
    id: "2" as UUID,
    name: "Senior Software Engineer",
    nameAm: "ከፍተኛ ሶፍትዌር ኢንጂነር",
    departmentId: "1" as UUID,
  },
  {
    id: "3" as UUID,
    name: "HR Manager",
    nameAm: "ሰው ሀብት ማኔጅር",
    departmentId: "2" as UUID,
  },
  {
    id: "4" as UUID,
    name: "Finance Analyst",
    nameAm: "ፋይናንስ አናላይዝር",
    departmentId: "3" as UUID,
  },
  {
    id: "5" as UUID,
    name: "Marketing Specialist",
    nameAm: "ግብይት ስፔሻሊስት",
    departmentId: "4" as UUID,
  },
  {
    id: "6" as UUID,
    name: "Operations Manager",
    nameAm: "ኦፕሬሽንስ ማኔጅር",
    departmentId: "5" as UUID,
  },
];

const mockMaritalStatus: MaritalStatusDto[] = [
  { id: "1" as UUID, name: "Single", nameAm: "ያላገባ" },
  { id: "2" as UUID, name: "Married", nameAm: "ያገባ" },
  { id: "3" as UUID, name: "Divorced", nameAm: "የተፋታ" },
  { id: "4" as UUID, name: "Widowed", nameAm: "የተመሰረተ" },
];

const mockRelations: RelationDto[] = [
  { id: "1" as UUID, name: "Spouse", nameAm: "ባል/ሚስት" },
  { id: "2" as UUID, name: "Parent", nameAm: "ወላጅ" },
  { id: "3" as UUID, name: "Sibling", nameAm: "ወንድም/እህት" },
  { id: "4" as UUID, name: "Child", nameAm: "ልጅ" },
  { id: "5" as UUID, name: "Friend", nameAm: "ጓደኛ" },
];

const mockAddresses = [
  {
    id: "1" as UUID,
    name: "Main Office",
    nameAm: "ዋና አድራሻ",
    fullAddress: "Addis Ababa, Ethiopia",
  },
  {
    id: "2" as UUID,
    name: "Branch Office",
    nameAm: "ቅርንጫፍ አድራሻ",
    fullAddress: "Addis Ababa, Ethiopia",
  },
];

// Validation schemas
const basicInfoValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name in English is required")
    .min(2, "First name must be at least 2 characters"),
  firstNameAm: Yup.string()
    .required("First name in Amharic is required")
    .min(2, "First name must be at least 2 characters")
    .matches(amharicRegex, "First name must be in Amharic characters"),
  middleName: Yup.string().optional(),
  middleNameAm: Yup.string()
    .optional()
    .test(
      "amharic-or-empty",
      "Middle name must be in Amharic characters",
      (value) => !value || amharicRegex.test(value)
    ),
  lastName: Yup.string()
    .required("Last name in English is required")
    .min(2, "Last name must be at least 2 characters"),
  lastNameAm: Yup.string()
    .required("Last name in Amharic is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(amharicRegex, "Last name must be in Amharic characters"),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["0", "1"], "Please select a valid gender"),
  nationality: Yup.string()
    .required("Nationality is required")
    .min(2, "Nationality must be at least 2 characters"),
  employmentDate: Yup.date()
    .required("Employment date is required")
    .max(new Date(), "Employment date cannot be in the future"),
  companyId: Yup.string().required("Company is required"),
  branchId: Yup.string().required("Branch is required"),
  jobGradeId: Yup.string().required("Job grade is required"),
  positionId: Yup.string().required("Position is required"),
  departmentId: Yup.string().required("Department is required"),
  employmentType: Yup.string()
    .required("Employment type is required")
    .oneOf(["0", "1", "2", "3"], "Please select a valid employment type"),
  employmentNature: Yup.string()
    .required("Employment nature is required")
    .oneOf(["0", "1"], "Please select a valid employment nature"),
});

const biographicalValidationSchema = Yup.object({
  biographicalData: Yup.object({
    birthDate: Yup.date()
      .required("Birth date is required")
      .max(new Date(), "Birth date cannot be in the future"),
    birthLocation: Yup.string().required("Birth location is required"),
    motherFullName: Yup.string().required("Mother's full name is required"),
    hasBirthCert: Yup.string()
      .required("Please specify if you have a birth certificate")
      .oneOf(["0", "1"], "Please select a valid option"),
    hasMarriageCert: Yup.string()
      .required("Please specify if you have a marriage certificate")
      .oneOf(["0", "1"], "Please select a valid option"),
    maritalStatusId: Yup.string().required("Marital status is required"),
  }),
  // Add address validation for step 2
  addresses: Yup.array()
    .of(
      Yup.object({
        addressType: Yup.string()
          .required("Address type is required")
          .oneOf(["0", "1"], "Please select a valid address type"),
        country: Yup.string()
          .required("Country is required")
          .min(2, "Country must be at least 2 characters"),
        telephone: Yup.string()
          .required("Telephone number is required")
          .min(5, "Telephone number must be at least 5 characters"),
        region: Yup.string().optional(),
        subcity: Yup.string().optional(),
        zone: Yup.string().optional(),
        woreda: Yup.string().optional(),
        kebele: Yup.string().optional(),
        houseNo: Yup.string().optional(),
        poBox: Yup.string().optional(),
        fax: Yup.string().optional(),
        email: Yup.string()
          .optional()
          .email("Please enter a valid email address"),
        website: Yup.string().optional(),
      })
    )
    .min(1, "At least one address is required"),
  // Add financial data validation
  financialData: Yup.object({
    tin: Yup.string()
      .optional()
      .matches(/^\d{10}$/, "TIN must be exactly 10 digits")
      .nullable(),
    bankAccountNo: Yup.string()
      .optional()
      .min(5, "Bank account number must be at least 5 characters")
      .nullable(),
    pensionNumber: Yup.string()
      .optional()
      .min(3, "Pension number must be at least 3 characters")
      .nullable(),
  }),
});

const emergencyContactValidationSchema = Yup.object({
  emergencyContacts: Yup.array()
    .of(
      Yup.object({
        firstName: Yup.string().required("First name is required"),
        firstNameAm: Yup.string().required("First name in Amharic is required"),
        lastName: Yup.string().required("Last name is required"),
        lastNameAm: Yup.string().required("Last name in Amharic is required"),
        gender: Yup.string().required("Gender is required"),
        relationId: Yup.string().required("Relation is required"),
        nationality: Yup.string().optional(),
        addressId: Yup.string().optional(),
      })
    )
    .min(1, "At least one emergency contact is required"),
});

const guarantorValidationSchema = Yup.object({
  guarantors: Yup.array().of(
    Yup.object({
      firstName: Yup.string().required("First name is required"),
      firstNameAm: Yup.string().required("First name in Amharic is required"),
      lastName: Yup.string().required("Last name is required"),
      lastNameAm: Yup.string().required("Last name in Amharic is required"),
      gender: Yup.string().required("Gender is required"),
      relationId: Yup.string().required("Relation is required"),
      nationality: Yup.string().optional(),
      addressId: Yup.string().optional(),
    })
  ),
});

// Extended interface that properly uses the DTOs
interface ExtendedEmployeeData extends EmployeeAddDto {
  // Additional fields not in EmployeeAddDto
  companyId: UUID;
  branchId: UUID;

  // Biographical data using EmpBioAddDto (without employeeId)
  biographicalData: Omit<EmpBioAddDto, "employeeId">;

  // Financial data using EmpFinanceAddDto (without employeeId)
  financialData: Omit<EmpFinanceAddDto, "employeeId">;

  // Arrays from other DTOs
  emergencyContacts: Omit<EmContactAddDto, "employeeId">[];
  familyMembers: Omit<EmpFamilyAddDto, "employeeId">[];
  guarantors: Omit<EmpGuarantorAddDto, "employeeId">[];

  // Addresses array
  addresses: Array<{
    addressType: AddressType;
    country: string;
    region: string;
    subcity: string;
    zone: string;
    woreda: string;
    kebele: string;
    houseNo: string;
    telephone: string;
    poBox: string;
    fax: string;
    email: string;
    website: string;
  }>;

  // File uploads
  guarantorFiles: File[];
  stampFiles: File[];
  signatureFiles: File[];
  profilePicture: File | null;

  // Employment state
  isTerminated: "0" | "1";
  isApproved: "0" | "1";
  isStandBy: "0" | "1";
  isRetired: "0" | "1";
  isUnderProbation: "0" | "1";
}

const validationSchemas = [
  basicInfoValidationSchema,
  biographicalValidationSchema,
  emergencyContactValidationSchema,
  guarantorValidationSchema,
  Yup.object({}), // Review step has no validation
];

interface AddEmployeeStepFormProps {
  currentStep: number;
  totalSteps: number;
  snapshot: ExtendedEmployeeData;
  onSubmit: (values: ExtendedEmployeeData, actions: any) => void;
  onBack: (values: ExtendedEmployeeData) => void;
  isSubmitting?: boolean;
}

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  currentStep,
  totalSteps,
  snapshot,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  const renderStepContent = (
    formikProps: FormikProps<ExtendedEmployeeData> & { isSubmitting?: boolean }
  ) => {
    const { values } = formikProps;

    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formikProps={formikProps}
            mockCompanies={mockCompanies}
            mockBranches={mockBranches}
            mockJobGrades={mockJobGrades}
            mockDepartments={mockDepartments}
            mockPositions={mockPositions}
          />
        );

      case 1:
        return (
          <BiographicalStep
            formikProps={formikProps}
            mockMaritalStatus={mockMaritalStatus}
            mockRelations={mockRelations}
          />
        );

      case 2:
        return (
          <EmergencyContactStep
            formikProps={formikProps}
            mockRelations={mockRelations}
          />
        );

      case 3:
        return (
          <GuarantorStep
            formikProps={formikProps}
            mockRelations={mockRelations}
            mockAddresses={mockAddresses}
          />
        );

      case 4:
        return (
          <ReviewStep
            values={values}
            mockCompanies={mockCompanies}
            mockBranches={mockBranches}
            mockDepartments={mockDepartments}
            mockPositions={mockPositions}
            mockJobGrades={mockJobGrades}
            mockMaritalStatus={mockMaritalStatus}
            mockRelations={mockRelations}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Step Not Found
            </h2>
            <p className="text-gray-600">
              This step is not configured properly.
            </p>
          </div>
        );
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      validationSchema={validationSchemas[currentStep]}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <Form>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8">
            <AnimatePresence mode="wait">
              {renderStepContent({ ...formikProps, isSubmitting })}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex-1">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onBack(formikProps.values)}
                    disabled={formikProps.isSubmitting}
                    className="cursor-pointer"
                  >
                    Back
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  formikProps.isSubmitting ||
                  !formikProps.isValid ||
                  isSubmitting
                }
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100 cursor-pointer"
              >
                <span className="font-semibold">
                  {formikProps.isSubmitting || isSubmitting
                    ? "Processing..."
                    : isLastStep
                    ? "Complete Registration"
                    : "Save & Continue"}
                </span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export type { ExtendedEmployeeData };
