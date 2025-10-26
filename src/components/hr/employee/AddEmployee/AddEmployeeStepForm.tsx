import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import type { FormikProps } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { Button } from '../../../../components/ui/button';
import { ChevronRight, User, Briefcase, CheckCircle2, Users, FileText, DollarSign, Heart, Plus, Trash2, X, File, FileImage, FileText as FileTextIcon } from 'lucide-react';
import type { 
  EmployeeAddDto, 
  JobGradeDto, 
  DepartmentDto, 
  EmploymentTypeDto, 
  EmploymentNatureDto, 
  PositionDto,
  MaritalStatusDto,
  RelationDto,
  AddressDto,
  EmContactAddDto,
  EmpBioAddDto,
  EmpFamilyAddDto,
  EmpFinanceAddDto,
  EmpGuarantorAddDto
} from '../../../../types/hr/employee';
import type { UUID } from 'crypto';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Input } from '../../../ui/input';
import { amharicRegex } from '../../../../utils/amharic-regex';

// Mock data
const mockCompanies = [
  { id: '1' as UUID, name: 'Main Company', nameAm: 'ዋና ኩባንያ' },
  { id: '2' as UUID, name: 'Subsidiary A', nameAm: 'ንዑስ ኩባንያ አ' },
  { id: '3' as UUID, name: 'Subsidiary B', nameAm: 'ንዑስ ኩባንያ ለ' },
];

const mockBranches = [
  { id: '1' as UUID, name: 'Head Office', nameAm: 'ዋና ቢሮ', companyId: '1' as UUID },
  { id: '2' as UUID, name: 'Branch A', nameAm: 'ቅርንጫፍ አ', companyId: '1' as UUID },
  { id: '3' as UUID, name: 'Branch B', nameAm: 'ቅርንጫፍ ለ', companyId: '1' as UUID },
  { id: '4' as UUID, name: 'Subsidiary Office', nameAm: 'ንዑስ ቢሮ', companyId: '2' as UUID },
  { id: '5' as UUID, name: 'Subsidiary Branch', nameAm: 'ንዑስ ቅርንጫፍ', companyId: '3' as UUID },
];

const mockJobGrades: JobGradeDto[] = [
  { id: '1' as UUID, name: 'Grade 1', nameAm: 'ግሬድ 1' },
  { id: '2' as UUID, name: 'Grade 2', nameAm: 'ግሬድ 2' },
  { id: '3' as UUID, name: 'Grade 3', nameAm: 'ግሬድ 3' },
];

const mockDepartments: DepartmentDto[] = [
  { id: '1' as UUID, name: 'Engineering', nameAm: 'ኢንጂነሪንግ', branchId: '1' as UUID },
  { id: '2' as UUID, name: 'Human Resources', nameAm: 'ሰው ሀብት', branchId: '1' as UUID },
  { id: '3' as UUID, name: 'Finance', nameAm: 'ፋይናንስ', branchId: '1' as UUID },
  { id: '4' as UUID, name: 'Marketing', nameAm: 'ግብይት', branchId: '2' as UUID },
  { id: '5' as UUID, name: 'Operations', nameAm: 'ኦፕሬሽን', branchId: '2' as UUID },
];

const mockPositions: PositionDto[] = [
  { id: '1' as UUID, name: 'Software Engineer', nameAm: 'ሶፍትዌር ኢንጂነር', departmentId: '1' as UUID },
  { id: '2' as UUID, name: 'Senior Software Engineer', nameAm: 'ከፍተኛ ሶፍትዌር ኢንጂነር', departmentId: '1' as UUID },
  { id: '3' as UUID, name: 'HR Manager', nameAm: 'ሰው ሀብት ማኔጅር', departmentId: '2' as UUID },
  { id: '4' as UUID, name: 'Finance Analyst', nameAm: 'ፋይናንስ አናላይዝር', departmentId: '3' as UUID },
  { id: '5' as UUID, name: 'Marketing Specialist', nameAm: 'ግብይት ስፔሻሊስት', departmentId: '4' as UUID },
  { id: '6' as UUID, name: 'Operations Manager', nameAm: 'ኦፕሬሽንስ ማኔጅር', departmentId: '5' as UUID },
];

const mockEmploymentTypes: EmploymentTypeDto[] = [
  { id: '1' as UUID, name: 'Full-time', nameAm: 'ሙሉ ጊዜ' },
  { id: '2' as UUID, name: 'Part-time', nameAm: 'ከፊል ጊዜ' },
  { id: '3' as UUID, name: 'Contract', nameAm: 'ኮንትራት' },
];

const mockEmploymentNatures: EmploymentNatureDto[] = [
  { id: '1' as UUID, name: 'Permanent', nameAm: 'ቋሚ' },
  { id: '2' as UUID, name: 'Temporary', nameAm: 'ጊዜያዊ' },
  { id: '3' as UUID, name: 'Probation', nameAm: 'ሙከራ' },
];

const mockMaritalStatus: MaritalStatusDto[] = [
  { id: '1' as UUID, name: 'Single', nameAm: 'ያላገባ' },
  { id: '2' as UUID, name: 'Married', nameAm: 'ያገባ' },
  { id: '3' as UUID, name: 'Divorced', nameAm: 'የተፋታ' },
  { id: '4' as UUID, name: 'Widowed', nameAm: 'የተመሰረተ' },
];

const mockRelations: RelationDto[] = [
  { id: '1' as UUID, name: 'Spouse', nameAm: 'ባል/ሚስት' },
  { id: '2' as UUID, name: 'Parent', nameAm: 'ወላጅ' },
  { id: '3' as UUID, name: 'Sibling', nameAm: 'ወንድም/እህት' },
  { id: '4' as UUID, name: 'Child', nameAm: 'ልጅ' },
  { id: '5' as UUID, name: 'Friend', nameAm: 'ጓደኛ' },
];

const mockAddresses: AddressDto[] = [
  { id: '1' as UUID, name: 'Main Office', nameAm: 'ዋና አድራሻ', fullAddress: 'Addis Ababa, Ethiopia' },
  { id: '2' as UUID, name: 'Branch Office', nameAm: 'ቅርንጫፍ አድራሻ', fullAddress: 'Addis Ababa, Ethiopia' },
];

// Validation schemas
const basicInfoValidationSchema = Yup.object({
  firstName: Yup.string().required('First name in English is required').min(2, 'First name must be at least 2 characters'),
  firstNameAm: Yup.string().required('First name in Amharic is required').min(2, 'First name must be at least 2 characters').matches(amharicRegex, 'First name must be in Amharic characters'),
  middleName: Yup.string().optional(),
  middleNameAm: Yup.string().optional().test('amharic-or-empty', 'Middle name must be in Amharic characters', (value) => !value || amharicRegex.test(value)),
  lastName: Yup.string().required('Last name in English is required').min(2, 'Last name must be at least 2 characters'),
  lastNameAm: Yup.string().required('Last name in Amharic is required').min(2, 'Last name must be at least 2 characters').matches(amharicRegex, 'Last name must be in Amharic characters'),
  gender: Yup.string().required('Gender is required').oneOf(['0', '1'], 'Please select a valid gender'),
  nationality: Yup.string().required('Nationality is required').min(2, 'Nationality must be at least 2 characters'),
  employmentDate: Yup.date().required('Employment date is required').max(new Date(), 'Employment date cannot be in the future'),
  companyId: Yup.string().required('Company is required'),
  branchId: Yup.string().required('Branch is required'),
  jobGradeId: Yup.string().required('Job grade is required'),
  positionId: Yup.string().required('Position is required'),
  departmentId: Yup.string().required('Department is required'),
  employmentTypeId: Yup.string().required('Employment type is required'),
  employmentNatureId: Yup.string().required('Employment nature is required'),
});

const biographicalValidationSchema = Yup.object({
  biographicalData: Yup.object({
    birthDate: Yup.date().required('Birth date is required').max(new Date(), 'Birth date cannot be in the future'),
    birthLocation: Yup.string().required('Birth location is required'),
    motherFullName: Yup.string().required('Mother\'s full name is required'),
    hasBirthCert: Yup.string().required('Please specify if you have a birth certificate').oneOf(['0', '1'], 'Please select a valid option'),
    hasMarriageCert: Yup.string().required('Please specify if you have a marriage certificate').oneOf(['0', '1'], 'Please select a valid option'),
    maritalStatusId: Yup.string().required('Marital status is required'),
    addressId: Yup.string().required('Address is required'),
  })
});

const financialValidationSchema = Yup.object({
  financialData: Yup.object({
    tin: Yup.string().optional().matches(/^\d{10}$/, 'TIN must be 10 digits'),
    bankAccountNo: Yup.string().optional(),
    pensionNumber: Yup.string().optional(),
  })
});

// Extended interface that properly uses the DTOs
interface ExtendedEmployeeData extends EmployeeAddDto {
  // Additional fields not in EmployeeAddDto
  companyId: UUID;
  branchId: UUID;
  
  // Biographical data using EmpBioAddDto (without employeeId)
  biographicalData: Omit<EmpBioAddDto, 'employeeId'>;
  
  // Financial data using EmpFinanceAddDto (without employeeId)
  financialData: Omit<EmpFinanceAddDto, 'employeeId'>;
  
  // Arrays from other DTOs
  emergencyContacts: Omit<EmContactAddDto, 'employeeId'>[];
  familyMembers: Omit<EmpFamilyAddDto, 'employeeId'>[];
  guarantors: Omit<EmpGuarantorAddDto, 'employeeId'>[];
  
  // File uploads
  guarantorFiles: File[];
  stampFiles: File[];
  signatureFiles: File[];
  
  // Employment state
  isTerminated: '0' | '1';
  isApproved: '0' | '1';
  isStandBy: '0' | '1';
  isRetired: '0' | '1';
  isUnderProbation: '0' | '1';
}

const validationSchemas = [
  basicInfoValidationSchema,
  biographicalValidationSchema,
  financialValidationSchema,
  Yup.object({}),
];

interface AddEmployeeStepFormProps {
  currentStep: number;
  totalSteps: number;
  snapshot: ExtendedEmployeeData;
  onSubmit: (values: ExtendedEmployeeData, actions: any) => void;
  onBack: (values: ExtendedEmployeeData) => void;
  isSubmitting?: boolean;
}

// Helper function to get file icon
const getFileIcon = (file: File) => {
  const isImageFile = (file: File) => file.type.startsWith('image/');
  const isPdfFile = (file: File) => file.type === 'application/pdf';
  const isDocumentFile = (file: File) => 
    file.type === 'application/msword' || 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (isImageFile(file)) return <FileImage className="w-5 h-5 text-blue-500" />;
  if (isPdfFile(file)) return <FileTextIcon className="w-5 h-5 text-red-500" />;
  if (isDocumentFile(file)) return <FileText className="w-5 h-5 text-green-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
};

// Enhanced File upload area component with preview for different file types
const FileUploadArea: React.FC<{
  title: string;
  description: string;
  accept: string;
  files: File[];
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}> = ({ title, description, accept, files, onFileSelect, onFileRemove }) => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      
      // Generate preview for PDF files
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPdfPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPdfPreviewUrl(null);
      }
    }
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const isPdfFile = (file: File) => {
    return file.type === 'application/pdf';
  };

  const getFilePreview = (file: File) => {
    if (isImageFile(file)) {
      return (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <img 
            src={URL.createObjectURL(file)} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else if (isPdfFile(file) && pdfPreviewUrl) {
      // For PDF, we show the first page preview if available
      return (
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-white flex items-center justify-center">
          <div className="text-center p-4">
            <FileTextIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">PDF Document</p>
            <div className="mt-2 bg-gray-100 rounded p-2">
              <p className="text-xs text-gray-600">First page preview available</p>
            </div>
          </div>
        </div>
      );
    } else {
      // For other file types, show file icon and name
      return (
        <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-4">
          {getFileIcon(file)}
          <p className="text-sm font-medium text-gray-700 mt-2 text-center truncate w-full">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {file.type.split('/')[1]?.toUpperCase() || 'FILE'} • {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <label className="cursor-pointer block">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors duration-200 relative h-40">
          {files.length > 0 ? (
            <>
              {getFilePreview(files[0])}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPdfPreviewUrl(null);
                  onFileRemove();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              {/* File type badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
                {files[0].type.split('/')[1]?.toUpperCase() || 'FILE'}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">{title}</p>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
              <div className="mt-2 text-xs text-gray-400">
                Supports: {accept.split(',').map(ext => ext.trim()).join(', ')}
              </div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

// Enhanced file upload section for the form
const DocumentUploadSection: React.FC<{
  guarantorFiles: File[];
  stampFiles: File[];
  signatureFiles: File[];
  onGuarantorFileSelect: (file: File) => void;
  onStampFileSelect: (file: File) => void;
  onSignatureFileSelect: (file: File) => void;
  onGuarantorFileRemove: () => void;
  onStampFileRemove: () => void;
  onSignatureFileRemove: () => void;
}> = ({
  guarantorFiles,
  stampFiles,
  signatureFiles,
  onGuarantorFileSelect,
  onStampFileSelect,
  onSignatureFileSelect,
  onGuarantorFileRemove,
  onStampFileRemove,
  onSignatureFileRemove,
}) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
        <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guarantor File Upload */}
        <FileUploadArea
          title="Guarantor File"
          description="Upload guarantor document (PDF, Word, Image)"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          files={guarantorFiles}
          onFileSelect={onGuarantorFileSelect}
          onFileRemove={onGuarantorFileRemove}
        />

        {/* Stamp File Upload */}
        <FileUploadArea
          title="Stamp"
          description="Upload stamp document (PDF, Image)"
          accept=".pdf,.jpg,.jpeg,.png"
          files={stampFiles}
          onFileSelect={onStampFileSelect}
          onFileRemove={onStampFileRemove}
        />

        {/* Signature File Upload */}
        <FileUploadArea
          title="Signature"
          description="Upload signature (Image preferred)"
          accept="image/*,.pdf"
          files={signatureFiles}
          onFileSelect={onSignatureFileSelect}
          onFileRemove={onSignatureFileRemove}
        />
      </div>

      {/* Uploaded files summary */}
      {(guarantorFiles.length > 0 || stampFiles.length > 0 || signatureFiles.length > 0) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            {guarantorFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
            {stampFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
            {signatureFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  currentStep,
  totalSteps,
  snapshot,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const [guarantorFiles, setGuarantorFiles] = useState<File[]>([]);
  const [stampFiles, setStampFiles] = useState<File[]>([]);
  const [signatureFiles, setSignatureFiles] = useState<File[]>([]);

  const handleAmharicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setFieldValue(fieldName, value);
    }
  };

  const addEmergencyContact = (formikProps: FormikProps<ExtendedEmployeeData>) => {
    const { values, setFieldValue } = formikProps;
    const newContact: Omit<EmContactAddDto, 'employeeId'> = {
      firstName: '',
      firstNameAm: '',
      middleName: '',
      middleNameAm: '',
      lastName: '',
      lastNameAm: '',
      gender: '' as '0' | '1',
      nationality: 'Ethiopian',
      relationId: '' as UUID,
      addressId: '' as UUID,
    };
    setFieldValue('emergencyContacts', [...values.emergencyContacts, newContact]);
  };

  const removeEmergencyContact = (formikProps: FormikProps<ExtendedEmployeeData>, index: number) => {
    const { values, setFieldValue } = formikProps;
    const updatedContacts = values.emergencyContacts.filter((_, i) => i !== index);
    setFieldValue('emergencyContacts', updatedContacts);
  };

  const addFamilyMember = (formikProps: FormikProps<ExtendedEmployeeData>) => {
    const { values, setFieldValue } = formikProps;
    const newMember: Omit<EmpFamilyAddDto, 'employeeId'> = {
      firstName: '',
      firstNameAm: '',
      middleName: '',
      middleNameAm: '',
      lastName: '',
      lastNameAm: '',
      gender: '' as '0' | '1',
      nationality: 'Ethiopian',
      relationId: '' as UUID,
    };
    setFieldValue('familyMembers', [...values.familyMembers, newMember]);
  };

  const removeFamilyMember = (formikProps: FormikProps<ExtendedEmployeeData>, index: number) => {
    const { values, setFieldValue } = formikProps;
    const updatedMembers = values.familyMembers.filter((_, i) => i !== index);
    setFieldValue('familyMembers', updatedMembers);
  };

  const addGuarantor = (formikProps: FormikProps<ExtendedEmployeeData>) => {
    const { values, setFieldValue } = formikProps;
    const newGuarantor: Omit<EmpGuarantorAddDto, 'employeeId'> = {
      firstName: '',
      firstNameAm: '',
      middleName: '',
      middleNameAm: '',
      lastName: '',
      lastNameAm: '',
      gender: '' as '0' | '1',
      nationality: 'Ethiopian',
      relationId: '' as UUID,
      addressId: '' as UUID,
    };
    setFieldValue('guarantors', [...values.guarantors, newGuarantor]);
  };

  const removeGuarantor = (formikProps: FormikProps<ExtendedEmployeeData>, index: number) => {
    const { values, setFieldValue } = formikProps;
    const updatedGuarantors = values.guarantors.filter((_, i) => i !== index);
    setFieldValue('guarantors', updatedGuarantors);
  };

  const handleFileSelect = (
    file: File,
    fileType: 'guarantor' | 'stamp' | 'signature',
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (file) {
      if (fileType === 'guarantor') {
        setGuarantorFiles([file]);
        setFieldValue('guarantorFiles', [file]);
      } else if (fileType === 'stamp') {
        setStampFiles([file]);
        setFieldValue('stampFiles', [file]);
      } else if (fileType === 'signature') {
        setSignatureFiles([file]);
        setFieldValue('signatureFiles', [file]);
      }
    }
  };

  const removeFile = (fileType: 'guarantor' | 'stamp' | 'signature', setFieldValue: (field: string, value: any) => void) => {
    if (fileType === 'guarantor') {
      setGuarantorFiles([]);
      setFieldValue('guarantorFiles', []);
    } else if (fileType === 'stamp') {
      setStampFiles([]);
      setFieldValue('stampFiles', []);
    } else if (fileType === 'signature') {
      setSignatureFiles([]);
      setFieldValue('signatureFiles', []);
    }
  };

  const getFilteredBranches = (companyId: UUID) => {
    return mockBranches.filter(branch => branch.companyId === companyId);
  };

  const getFilteredDepartments = (branchId: UUID) => {
    return mockDepartments.filter(dept => dept.branchId === branchId);
  };

  const getFilteredPositions = (departmentId: UUID) => {
    return mockPositions.filter(position => position.departmentId === departmentId);
  };

  const renderStepContent = (formikProps: FormikProps<ExtendedEmployeeData> & { isSubmitting?: boolean }) => {
    const { errors, touched, values, handleChange, handleBlur, setFieldValue } = formikProps;

    const inputClassName = (fieldName: string) => 
      `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
        getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName) ? 'border-red-500' : 'border-gray-300'
      }`;

    const selectTriggerClassName = (fieldName: string) => 
      `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
        getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName) ? 'border-red-500' : 'border-gray-300'
      }`;

    // Helper functions to get nested errors and touched
    const getNestedError = (errorObj: any, path: string) => {
      return path.split('.').reduce((obj, key) => obj && obj[key], errorObj);
    };

    const getNestedTouched = (touchedObj: any, path: string) => {
      return path.split('.').reduce((obj, key) => obj && obj[key], touchedObj);
    };

    switch (currentStep) {
      case 0:
        const filteredBranches = values.companyId ? getFilteredBranches(values.companyId) : [];
        const filteredDepartments = values.branchId ? getFilteredDepartments(values.branchId) : [];
        const filteredPositions = values.departmentId ? getFilteredPositions(values.departmentId) : [];

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
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Basic Information
              </h2>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Information Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                </div>
              </div>

              {/* First Name (English) */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name (English) *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('firstName')}
                  placeholder="John"
                />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
                )}
              </div>

              {/* ስም */}
              <div className="space-y-2">
                <label htmlFor="firstNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  ስም *
                </label>
                <Input
                  id="firstNameAm"
                  name="firstNameAm"
                  type="text"
                  value={values.firstNameAm}
                  onChange={(e) => handleAmharicChange(e, 'firstNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className={inputClassName('firstNameAm')}
                  placeholder="አየለ"
                />
                {errors.firstNameAm && touched.firstNameAm && (
                  <div className="text-red-500 text-xs mt-1">{errors.firstNameAm}</div>
                )}
              </div>

              {/* Middle Name (English) */}
              <div className="space-y-2">
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name (English)
                </label>
                <Input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                  placeholder="Michael"
                />
              </div>

              {/* የአባት ስም */}
              <div className="space-y-2">
                <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  የአባት ስም
                </label>
                <Input
                  id="middleNameAm"
                  name="middleNameAm"
                  type="text"
                  value={values.middleNameAm}
                  onChange={(e) => handleAmharicChange(e, 'middleNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                  placeholder="በቀለ"
                />
                {errors.middleNameAm && touched.middleNameAm && (
                  <div className="text-red-500 text-xs mt-1">{errors.middleNameAm}</div>
                )}
              </div>

              {/* Last Name (English) */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name (English) *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('lastName')}
                  placeholder="Doe"
                />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
                )}
              </div>

              {/* የአያት ስም */}
              <div className="space-y-2">
                <label htmlFor="lastNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  የአያት ስም *
                </label>
                <Input
                  id="lastNameAm"
                  name="lastNameAm"
                  type="text"
                  value={values.lastNameAm}
                  onChange={(e) => handleAmharicChange(e, 'lastNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className={inputClassName('lastNameAm')}
                  placeholder="ዮሐንስ"
                />
                {errors.lastNameAm && touched.lastNameAm && (
                  <div className="text-red-500 text-xs mt-1">{errors.lastNameAm}</div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <Select 
                  value={values.gender} 
                  onValueChange={(value) => setFieldValue('gender', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('gender')}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Male</SelectItem>
                    <SelectItem value="1">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && touched.gender && (
                  <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality *
                </label>
                <Input
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={values.nationality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('nationality')}
                  placeholder="Ethiopian"
                />
                {errors.nationality && touched.nationality && (
                  <div className="text-red-500 text-xs mt-1">{errors.nationality}</div>
                )}
              </div>
            </div>

            {/* Employment Details Section - Updated to 3-column grid */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-semibold text-gray-800">Employment Details</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Employment Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="employmentDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Employment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="employmentDate"
                    name="employmentDate"
                    type="date"
                    value={values.employmentDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                      errors.employmentDate && touched.employmentDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.employmentDate && touched.employmentDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.employmentDate}</p>
                  )}
                </div>
                {/* Company */}
                <div className="space-y-2">
                  <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <Select 
                    value={values.companyId} 
                    onValueChange={(value) => {
                      setFieldValue('companyId', value);
                      setFieldValue('branchId', '');
                      setFieldValue('departmentId', '');
                      setFieldValue('positionId', '');
                    }}
                  >
                    <SelectTrigger className={selectTriggerClassName('companyId')}>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyId && touched.companyId && (
                    <div className="text-red-500 text-xs mt-1">{errors.companyId}</div>
                  )}
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch *
                  </label>
                  <Select 
                    value={values.branchId} 
                    onValueChange={(value) => {
                      setFieldValue('branchId', value);
                      setFieldValue('departmentId', '');
                      setFieldValue('positionId', '');
                    }}
                    disabled={!values.companyId}
                  >
                    <SelectTrigger className={selectTriggerClassName('branchId')}>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.branchId && touched.branchId && (
                    <div className="text-red-500 text-xs mt-1">{errors.branchId}</div>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <Select 
                    value={values.departmentId} 
                    onValueChange={(value) => {
                      setFieldValue('departmentId', value);
                      setFieldValue('positionId', '');
                    }}
                    disabled={!values.branchId}
                  >
                    <SelectTrigger className={selectTriggerClassName('departmentId')}>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && touched.departmentId && (
                    <div className="text-red-500 text-xs mt-1">{errors.departmentId}</div>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <Select 
                    value={values.positionId} 
                    onValueChange={(value) => setFieldValue('positionId', value)}
                    disabled={!values.departmentId}
                  >
                    <SelectTrigger className={selectTriggerClassName('positionId')}>
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.positionId && touched.positionId && (
                    <div className="text-red-500 text-xs mt-1">{errors.positionId}</div>
                  )}
                </div>

                {/* Job Grade */}
                <div className="space-y-2">
                  <label htmlFor="jobGradeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Grade *
                  </label>
                  <Select 
                    value={values.jobGradeId} 
                    onValueChange={(value) => setFieldValue('jobGradeId', value)}
                  >
                    <SelectTrigger className={selectTriggerClassName('jobGradeId')}>
                      <SelectValue placeholder="Select Job Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockJobGrades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jobGradeId && touched.jobGradeId && (
                    <div className="text-red-500 text-xs mt-1">{errors.jobGradeId}</div>
                  )}
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                  <label htmlFor="employmentTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type *
                  </label>
                  <Select 
                    value={values.employmentTypeId} 
                    onValueChange={(value) => setFieldValue('employmentTypeId', value)}
                  >
                    <SelectTrigger className={selectTriggerClassName('employmentTypeId')}>
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmploymentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentTypeId && touched.employmentTypeId && (
                    <div className="text-red-500 text-xs mt-1">{errors.employmentTypeId}</div>
                  )}
                </div>

                {/* Employment Nature */}
                <div className="space-y-2">
                  <label htmlFor="employmentNatureId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Nature *
                  </label>
                  <Select 
                    value={values.employmentNatureId} 
                    onValueChange={(value) => setFieldValue('employmentNatureId', value)}
                  >
                    <SelectTrigger className={selectTriggerClassName('employmentNatureId')}>
                      <SelectValue placeholder="Select Employment Nature" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmploymentNatures.map((nature) => (
                        <SelectItem key={nature.id} value={nature.id}>
                          {nature.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentNatureId && touched.employmentNatureId && (
                    <div className="text-red-500 text-xs mt-1">{errors.employmentNatureId}</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Biographical & Family
              </h2>
            </div>

            {/* Biographical Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Biographical Information</h3>
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
                    getNestedError(errors, 'biographicalData.birthDate') && getNestedTouched(touched, 'biographicalData.birthDate') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {getNestedError(errors, 'biographicalData.birthDate') && getNestedTouched(touched, 'biographicalData.birthDate') && (
                  <p className="text-red-500 text-sm mt-1">{getNestedError(errors, 'biographicalData.birthDate')}</p>
                )}
              </div>

              {/* Birth Location */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.birthLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Location *
                </label>
                <Input
                  id="biographicalData.birthLocation"
                  name="biographicalData.birthLocation"
                  type="text"
                  value={values.biographicalData.birthLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('biographicalData.birthLocation')}
                  placeholder="Addis Ababa"
                />
                {getNestedError(errors, 'biographicalData.birthLocation') && getNestedTouched(touched, 'biographicalData.birthLocation') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.birthLocation')}</div>
                )}
              </div>

              {/* Mother's Full Name */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.motherFullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Full Name *
                </label>
                <Input
                  id="biographicalData.motherFullName"
                  name="biographicalData.motherFullName"
                  type="text"
                  value={values.biographicalData.motherFullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('biographicalData.motherFullName')}
                  placeholder="Mother's full name"
                />
                {getNestedError(errors, 'biographicalData.motherFullName') && getNestedTouched(touched, 'biographicalData.motherFullName') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.motherFullName')}</div>
                )}
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.maritalStatusId" className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status *
                </label>
                <Select 
                  value={values.biographicalData.maritalStatusId} 
                  onValueChange={(value) => setFieldValue('biographicalData.maritalStatusId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('biographicalData.maritalStatusId')}>
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
                {getNestedError(errors, 'biographicalData.maritalStatusId') && getNestedTouched(touched, 'biographicalData.maritalStatusId') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.maritalStatusId')}</div>
                )}
              </div>

              {/* Has Birth Certificate */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.hasBirthCert" className="block text-sm font-medium text-gray-700 mb-1">
                  Has Birth Certificate? *
                </label>
                <Select 
                  value={values.biographicalData.hasBirthCert} 
                  onValueChange={(value) => setFieldValue('biographicalData.hasBirthCert', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('biographicalData.hasBirthCert')}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>                    
                    <SelectItem value="0">Yes</SelectItem>
                    <SelectItem value="1">No</SelectItem>
                  </SelectContent>
                </Select>
                {getNestedError(errors, 'biographicalData.hasBirthCert') && getNestedTouched(touched, 'biographicalData.hasBirthCert') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.hasBirthCert')}</div>
                )}
              </div>

              {/* Has Marriage Certificate */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.hasMarriageCert" className="block text-sm font-medium text-gray-700 mb-1">
                  Has Marriage Certificate? *
                </label>
                <Select 
                  value={values.biographicalData.hasMarriageCert} 
                  onValueChange={(value) => setFieldValue('biographicalData.hasMarriageCert', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('biographicalData.hasMarriageCert')}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="0">Yes</SelectItem>
                  <SelectItem value="1">No</SelectItem>
                  </SelectContent>
                </Select>
                {getNestedError(errors, 'biographicalData.hasMarriageCert') && getNestedTouched(touched, 'biographicalData.hasMarriageCert') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.hasMarriageCert')}</div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label htmlFor="biographicalData.addressId" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Select 
                  value={values.biographicalData.addressId} 
                  onValueChange={(value) => setFieldValue('biographicalData.addressId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('biographicalData.addressId')}>
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
                {getNestedError(errors, 'biographicalData.addressId') && getNestedTouched(touched, 'biographicalData.addressId') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'biographicalData.addressId')}</div>
                )}
              </div>
            </div>

            {/* Emergency Contacts Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Emergency Contacts</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addEmergencyContact(formikProps)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact
                </Button>
              </div>

              {values.emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700">Emergency Contact {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmergencyContact(formikProps, index)}
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
                        value={contact.firstName}
                        onChange={(e) => setFieldValue(`emergencyContacts[${index}].firstName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `emergencyContacts[${index}].firstNameAm`, setFieldValue)}
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
                        onChange={(e) => setFieldValue(`emergencyContacts[${index}].middleName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `emergencyContacts[${index}].middleNameAm`, setFieldValue)}
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
                        onChange={(e) => setFieldValue(`emergencyContacts[${index}].lastName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `emergencyContacts[${index}].lastNameAm`, setFieldValue)}
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
                        onValueChange={(value) => setFieldValue(`emergencyContacts[${index}].gender`, value)}
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
                        onChange={(e) => setFieldValue(`emergencyContacts[${index}].nationality`, e.target.value)}
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
                        onValueChange={(value) => setFieldValue(`emergencyContacts[${index}].relationId`, value)}
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
                        value={contact.addressId} 
                        onValueChange={(value) => setFieldValue(`emergencyContacts[${index}].addressId`, value)}
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

            {/* Family Members Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Family Members</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addFamilyMember(formikProps)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Family Member
                </Button>
              </div>

              {values.familyMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700">Family Member {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFamilyMember(formikProps, index)}
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
                        value={member.firstName}
                        onChange={(e) => setFieldValue(`familyMembers[${index}].firstName`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ስም
                      </label>
                      <Input
                        value={member.firstNameAm}
                        onChange={(e) => handleAmharicChange(e, `familyMembers[${index}].firstNameAm`, setFieldValue)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="አየለ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name
                      </label>
                      <Input
                        value={member.middleName}
                        onChange={(e) => setFieldValue(`familyMembers[${index}].middleName`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="Middle name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        የአባት ስም
                      </label>
                      <Input
                        value={member.middleNameAm}
                        onChange={(e) => handleAmharicChange(e, `familyMembers[${index}].middleNameAm`, setFieldValue)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="በቀለ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={member.lastName}
                        onChange={(e) => setFieldValue(`familyMembers[${index}].lastName`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="Last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        የአያት ስም
                      </label>
                      <Input
                        value={member.lastNameAm}
                        onChange={(e) => handleAmharicChange(e, `familyMembers[${index}].lastNameAm`, setFieldValue)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="ዮሐንስ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <Select 
                        value={member.gender} 
                        onValueChange={(value) => setFieldValue(`familyMembers[${index}].gender`, value)}
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
                        value={member.nationality}
                        onChange={(e) => setFieldValue(`familyMembers[${index}].nationality`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                        placeholder="Ethiopian"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relation
                      </label>
                      <Select 
                        value={member.relationId} 
                        onValueChange={(value) => setFieldValue(`familyMembers[${index}].relationId`, value)}
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
              ))}
            </div>
          </motion.div>
        );

      case 2:
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Financial & Documents
              </h2>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Financial Information</h3>
                </div>
              </div>

              {/* TIN Number */}
              <div className="space-y-2">
                <label htmlFor="financialData.tin" className="block text-sm font-medium text-gray-700 mb-1">
                  TIN Number
                </label>
                <Input
                  id="financialData.tin"
                  name="financialData.tin"
                  type="text"
                  value={values.financialData.tin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('financialData.tin')}
                  placeholder="1234567890"
                />
                {getNestedError(errors, 'financialData.tin') && getNestedTouched(touched, 'financialData.tin') && (
                  <div className="text-red-500 text-xs mt-1">{getNestedError(errors, 'financialData.tin')}</div>
                )}
              </div>

              {/* Bank Account Number */}
              <div className="space-y-2">
                <label htmlFor="financialData.bankAccountNo" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Number
                </label>
                <Input
                  id="financialData.bankAccountNo"
                  name="financialData.bankAccountNo"
                  type="text"
                  value={values.financialData.bankAccountNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('financialData.bankAccountNo')}
                  placeholder="Account number"
                />
              </div>

              {/* Pension Number */}
              <div className="space-y-2">
                <label htmlFor="financialData.pensionNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Pension Number
                </label>
                <Input
                  id="financialData.pensionNumber"
                  name="financialData.pensionNumber"
                  type="text"
                  value={values.financialData.pensionNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('financialData.pensionNumber')}
                  placeholder="Pension number"
                />
              </div>
            </div>

            {/* Guarantors Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Guarantors</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addGuarantor(formikProps)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Guarantor
                </Button>
              </div>

              {values.guarantors.map((guarantor, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700">Guarantor {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeGuarantor(formikProps, index)}
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
                        onChange={(e) => setFieldValue(`guarantors[${index}].firstName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `guarantors[${index}].firstNameAm`, setFieldValue)}
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
                        onChange={(e) => setFieldValue(`guarantors[${index}].middleName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `guarantors[${index}].middleNameAm`, setFieldValue)}
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
                        onChange={(e) => setFieldValue(`guarantors[${index}].lastName`, e.target.value)}
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
                        onChange={(e) => handleAmharicChange(e, `guarantors[${index}].lastNameAm`, setFieldValue)}
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
                        onValueChange={(value) => setFieldValue(`guarantors[${index}].gender`, value)}
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
                        onChange={(e) => setFieldValue(`guarantors[${index}].nationality`, e.target.value)}
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
                        onValueChange={(value) => setFieldValue(`guarantors[${index}].relationId`, value)}
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
                        onValueChange={(value) => setFieldValue(`guarantors[${index}].addressId`, value)}
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

            {/* Enhanced Document Upload Section */}
            <DocumentUploadSection
              guarantorFiles={guarantorFiles}
              stampFiles={stampFiles}
              signatureFiles={signatureFiles}
              onGuarantorFileSelect={(file) => handleFileSelect(file, 'guarantor', setFieldValue)}
              onStampFileSelect={(file) => handleFileSelect(file, 'stamp', setFieldValue)}
              onSignatureFileSelect={(file) => handleFileSelect(file, 'signature', setFieldValue)}
              onGuarantorFileRemove={() => removeFile('guarantor', setFieldValue)}
              onStampFileRemove={() => removeFile('stamp', setFieldValue)}
              onSignatureFileRemove={() => removeFile('signature', setFieldValue)}
            />
          </motion.div>
        );

      case 3:
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Review Information
              </h2>
            </div>

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
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name (English)</dt>
                    <dd className="font-semibold text-gray-900">{values.firstName} {values.middleName} {values.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name (Amharic)</dt>
                    <dd className="font-semibold text-gray-900">{values.firstNameAm} {values.middleNameAm} {values.lastNameAm}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</dt>
                    <dd className="font-semibold text-gray-900">{values.gender === '0' ? 'Male' : values.gender === '1' ? 'Female' : 'Not selected'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</dt>
                    <dd className="font-semibold text-gray-900">{values.nationality}</dd>
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
                  <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Date</dt>
                    <dd className="font-semibold text-gray-900">{values.employmentDate}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockCompanies.find(c => c.id === values.companyId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Branch</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockBranches.find(b => b.id === values.branchId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockDepartments.find(d => d.id === values.departmentId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Position</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockPositions.find(p => p.id === values.positionId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Grade</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockJobGrades.find(g => g.id === values.jobGradeId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Type</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockEmploymentTypes.find(t => t.id === values.employmentTypeId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Nature</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockEmploymentNatures.find(n => n.id === values.employmentNatureId)?.name || 'Not selected'}
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
                  <h3 className="text-lg font-semibold text-gray-800">Biographical Information</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Birth Date</dt>
                    <dd className="font-semibold text-gray-900">{values.biographicalData.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Birth Location</dt>
                    <dd className="font-semibold text-gray-900">{values.biographicalData.birthLocation}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mother's Name</dt>
                    <dd className="font-semibold text-gray-900">{values.biographicalData.motherFullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Marital Status</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockMaritalStatus.find(m => m.id === values.biographicalData.maritalStatusId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Birth Certificate</dt>
                    <dd className="font-semibold text-gray-900">{values.biographicalData.hasBirthCert === '0' ? 'Yes' : values.biographicalData.hasBirthCert === '1' ? 'No' : 'Not selected'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Marriage Certificate</dt>
                    <dd className="font-semibold text-gray-900">{values.biographicalData.hasMarriageCert === '0' ? 'Yes' : values.biographicalData.hasMarriageCert === '1' ? 'No' : 'Not selected'}</dd>
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
                  <h3 className="text-lg font-semibold text-gray-800">Financial Information</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">TIN Number</dt>
                    <dd className="font-semibold text-gray-900">{values.financialData.tin || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bank Account</dt>
                    <dd className="font-semibold text-gray-900">{values.financialData.bankAccountNo || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pension Number</dt>
                    <dd className="font-semibold text-gray-900">{values.financialData.pensionNumber || 'Not provided'}</dd>
                  </div>
                </dl>
              </motion.div>
            </div>

            {/* Emergency Contacts Summary */}
            {values.emergencyContacts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {values.emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700">Contact {index + 1}</h4>
                      <p className="text-sm text-gray-600">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gender: {contact.gender === '0' ? 'Male' : contact.gender === '1' ? 'Female' : 'Not selected'} | 
                        Nationality: {contact.nationality} | 
                        Relation: {mockRelations.find(r => r.id === contact.relationId)?.name || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Family Members Summary */}
            {values.familyMembers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Family Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {values.familyMembers.map((member, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700">Family Member {index + 1}</h4>
                      <p className="text-sm text-gray-600">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gender: {member.gender === '0' ? 'Male' : member.gender === '1' ? 'Female' : 'Not selected'} | 
                        Nationality: {member.nationality} | 
                        Relation: {mockRelations.find(r => r.id === member.relationId)?.name || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Guarantors Summary */}
            {values.guarantors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Guarantors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {values.guarantors.map((guarantor, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-700">Guarantor {index + 1}</h4>
                      <p className="text-sm text-gray-600">
                        {guarantor.firstName} {guarantor.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gender: {guarantor.gender === '0' ? 'Male' : guarantor.gender === '1' ? 'Female' : 'Not selected'} | 
                        Nationality: {guarantor.nationality} | 
                        Relation: {mockRelations.find(r => r.id === guarantor.relationId)?.name || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
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
                disabled={formikProps.isSubmitting || !formikProps.isValid || isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100 cursor-pointer"
              >
                <span className="font-semibold">
                  {(formikProps.isSubmitting || isSubmitting) ? (
                    'Processing...'
                  ) : isLastStep ? (
                    'Complete Registration'
                  ) : (
                    'Save & Continue'
                  )}
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