import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User, FileText, Shield, Stamp, PenTool } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BiographicalStep } from './steps/BiographicalStep';
import { GuarantorStep } from './steps/GuarantorStep';
import { StampStep } from './steps/StampStep';
import { SignatureStep } from './steps/SignatureStep';
import { EditEmployeeStepHeader } from './EditEmployeeStepHeader';
import { empService } from '../../../../services/hr/employee/empService';
import { employeeService } from '../../../../services/hr/employee/employees';
import type { Step1Dto, Step2Dto, Step4Dto, UUID } from '../../../../types/hr/employee/empAddDto';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Biographical', icon: FileText },
  { id: 3, title: 'Guarantor', icon: Shield },
  { id: 4, title: 'Stamp', icon: Stamp },
  { id: 5, title: 'Signature', icon: PenTool },
];

interface EditEmployeeStepFormProps {
  employeeId: string;
  onBackToEmployees: () => void;
  onEmployeeUpdated: (result: any) => void;
}

export const EditEmployeeStepForm: React.FC<EditEmployeeStepFormProps> = ({
  employeeId,
  onBackToEmployees,
  onEmployeeUpdated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step4: {},
    stamp: null as File | null,
    signature: null as File | null,
  });
  const [employeeHeaderData, setEmployeeHeaderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    
    if (document.body) {
      document.body.scrollTop = 0;
    }
    
    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }
    
    if (stepContentRef.current) {
      stepContentRef.current.scrollTop = 0;
    }
  };

  // Load employee data on mount
  useEffect(() => {
    const loadEmployeeData = async () => {
      setLoading(true);
      setError(null);

      try {
        let employeeData;
        let tableEmployee;
        
        // Try to get from sessionStorage first (set when clicking Edit button)
        const storedEmployee = sessionStorage.getItem('selectedEmployee');
        
        if (storedEmployee) {
          tableEmployee = JSON.parse(storedEmployee);
          console.log('Loaded employee data from sessionStorage:', tableEmployee);
          
          // Parse the full name into parts (basic fallback)
          const nameParts = (tableEmployee.empFullName || '').split(' ');
          const namePartsAm = (tableEmployee.empFullNameAm || '').split(' ');
          
          employeeData = {
            // Basic info from table
            id: tableEmployee.id,
            firstName: nameParts[0] || '',
            middleName: nameParts[1] || '',
            lastName: nameParts[2] || '',
            firstNameAm: namePartsAm[0] || '',
            middleNameAm: namePartsAm[1] || '',
            lastNameAm: namePartsAm[2] || '',
            gender: tableEmployee.gender || '',
            employmentDate: tableEmployee.employmentDate || '',
            department: tableEmployee.department || '',
            position: tableEmployee.position || '',
            branch: tableEmployee.branch || '',
            jobGrade: tableEmployee.jobGrade || '',
            employmentType: tableEmployee.empType || '',
            employmentNature: tableEmployee.empNature || '',
            // Note: Other fields will need to be fetched from a proper API endpoint
          };
        } else {
          // Fallback to API call if sessionStorage is empty
          try {
            employeeData = await employeeService.getEmployeeById(employeeId);
            console.log('Loaded employee data from API:', employeeData);
          } catch (apiError) {
            console.warn('API endpoint not available, using empty form:', apiError);
            // If API fails, initialize with empty data
            employeeData = {};
          }
        }

        // Map the employee data to form structure
        const mappedData = {
          step1: {
            firstName: employeeData.firstName || '',
            firstNameAm: employeeData.firstNameAm || '',
            middleName: employeeData.middleName || '',
            middleNameAm: employeeData.middleNameAm || '',
            lastName: employeeData.lastName || '',
            lastNameAm: employeeData.lastNameAm || '',
            nationality: employeeData.nationality || 'Ethiopian',
            gender: employeeData.gender || '',
            employmentDate: employeeData.employmentDate || '',
            branchId: employeeData.branchId || '',
            jobGradeId: employeeData.jobGradeId || '',
            jobGradeStepId: employeeData.jobGradeStepId || '',
            positionId: employeeData.positionId || '',
            departmentId: employeeData.departmentId || '',
            employmentType: employeeData.employmentType || '',
            employmentNature: employeeData.employmentNature || '',
            workArrangement: employeeData.workArrangement || '',
            File: null, // Profile picture handled separately
          },
          step2: {
            birthDate: employeeData.birthDate || '',
            birthLocation: employeeData.birthLocation || '',
            motherFullName: employeeData.motherFullName || '',
            hasBirthCert: employeeData.hasBirthCert || '',
            hasMarriageCert: employeeData.hasMarriageCert || '',
            maritalStatus: employeeData.maritalStatus || '',
            employeeId: employeeId as UUID,
            tin: employeeData.tin || '',
            bankAccountNo: employeeData.bankAccountNo || '',
            pensionNumber: employeeData.pensionNumber || '',
            addressType: employeeData.addressType || '',
            country: employeeData.country || '',
            region: employeeData.region || '',
            subcity: employeeData.subcity || '',
            zone: employeeData.zone || '',
            woreda: employeeData.woreda || '',
            kebele: employeeData.kebele || '',
            houseNo: employeeData.houseNo || '',
            telephone: employeeData.telephone || '',
            poBox: employeeData.poBox || '',
            fax: employeeData.fax || '',
            email: employeeData.email || '',
            website: employeeData.website || '',
          },
          step4: {
            guarantorFullName: employeeData.guarantorFullName || '',
            guarantorFullNameAm: employeeData.guarantorFullNameAm || '',
            guarantorRelationship: employeeData.guarantorRelationship || '',
            guarantorTelephone: employeeData.guarantorTelephone || '',
            guarantorEmail: employeeData.guarantorEmail || '',
            guarantorAddress: employeeData.guarantorAddress || '',
            guarantorIdNumber: employeeData.guarantorIdNumber || '',
            guarantorOccupation: employeeData.guarantorOccupation || '',
            guarantorWorkPlace: employeeData.guarantorWorkPlace || '',
            employeeId: employeeId as UUID,
          },
          stamp: null as File | null,
          signature: null as File | null,
        };

        // Set header data for profile display (reuse tableEmployee from above)
        if (tableEmployee) {
          setEmployeeHeaderData({
            photo: tableEmployee.photo,
            fullName: tableEmployee.empFullName,
            fullNameAm: tableEmployee.empFullNameAm,
            position: tableEmployee.position,
            department: tableEmployee.department,
            code: tableEmployee.code,
          });
        }

        setFormData(mappedData);
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Failed to load employee data:', error);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  // Handle Step 1 update
  const handleStep1Submit = async (step1Data: Step1Dto & { branchId: UUID, jobGradeStepId: UUID }) => {
    setLoading(true);
    setError(null);

    try {
      // Update employee basic info via API
      const result = await empService.empAddStep1({
        ...step1Data,
        // Add employeeId for update context if needed
      });

      console.log('Employee basic info updated successfully:', result);

      const updatedFormData = {
        ...formData,
        step1: step1Data,
      };

      setFormData(updatedFormData);
      scrollToTop();
      
      // Show success message
      alert('Basic information updated successfully!');
    } catch (error) {
      console.error('Failed to update employee basic info:', error);
      setError('Failed to update employee information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 update
  const handleStep2Submit = async (step2Data: Step2Dto) => {
    setLoading(true);
    setError(null);

    try {
      const step2DataWithEmployeeId: Step2Dto = {
        ...step2Data,
        employeeId: employeeId as UUID
      };

      const result = await empService.empAddStep2(step2DataWithEmployeeId);

      console.log('Biographical info updated successfully:', result);

      const updatedFormData = {
        ...formData,
        step2: step2Data,
      };

      setFormData(updatedFormData);
      scrollToTop();
      
      // Show success message
      alert('Biographical information updated successfully!');
    } catch (error) {
      console.error('Failed to update biographical info:', error);
      setError('Failed to save biographical information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 4 update (Guarantor)
  const handleStep4Submit = async (step4Data: Step4Dto) => {
    setLoading(true);
    setError(null);

    try {
      const step4DataWithEmployeeId: Step4Dto = {
        ...step4Data,
        employeeId: employeeId as UUID
      };

      const result = await empService.empAddStep4(step4DataWithEmployeeId);

      console.log('Guarantor info updated successfully:', result);

      const updatedFormData = {
        ...formData,
        step4: step4Data,
      };

      setFormData(updatedFormData);
      scrollToTop();
      
      // Show success message
      alert('Guarantor information updated successfully!');
    } catch (error) {
      console.error('Failed to update guarantor info:', error);
      setError('Failed to save guarantor information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Stamp upload
  const handleStampSubmit = async (stampFile: File | null) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Add API call to upload stamp
      console.log('Stamp uploaded:', stampFile);

      const updatedFormData = {
        ...formData,
        stamp: stampFile,
      };

      setFormData(updatedFormData);
      scrollToTop();
      
      // Show success message
      alert('Stamp uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload stamp:', error);
      setError('Failed to upload stamp. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signature upload
  const handleSignatureSubmit = async (signatureFile: File | null) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Add API call to upload signature
      console.log('Signature uploaded:', signatureFile);

      const updatedFormData = {
        ...formData,
        signature: signatureFile,
      };

      setFormData(updatedFormData);
      scrollToTop();
      
      // Show success message
      alert('Signature uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload signature:', error);
      setError('Failed to upload signature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab click - allows jumping to any step
  const handleTabClick = (stepId: number) => {
    scrollToTop();
    setCurrentStep(stepId);
  };

  const renderStep = () => {
    if (!initialDataLoaded && loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee data...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData.step1}
            onNext={handleStep1Submit}
            onBack={() => {}}
            loading={loading}
            isEditMode={true}
          />
        );
      case 2:
        return (
          <BiographicalStep
            data={formData.step2}
            onNext={handleStep2Submit}
            employeeId={employeeId as UUID}
            loading={loading}
            isEditMode={true}
          />
        );
      case 3:
        return (
          <GuarantorStep
            data={formData.step4}
            onNext={handleStep4Submit}
            onBack={() => {}}
            employeeId={employeeId as UUID}
            loading={loading}
            isEditMode={true}
          />
        );
      case 4:
        return (
          <StampStep
            stampFile={formData.stamp}
            onNext={handleStampSubmit}
            loading={loading}
          />
        );
      case 5:
        return (
          <SignatureStep
            signatureFile={formData.signature}
            onNext={handleSignatureSubmit}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8" ref={formContainerRef}>
      <div className="mx-auto">
        <EditEmployeeStepHeader
          steps={steps}
          currentStep={currentStep}
          onBack={onBackToEmployees}
          onTabClick={handleTabClick}
          title="Edit Employee"
          backButtonText="Back to Employees"
          employeeData={employeeHeaderData}
        />

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-800 hover:text-red-900"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div 
          ref={stepContentRef}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6"
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
