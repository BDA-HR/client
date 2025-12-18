import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { BasicInfoStep } from '../../../components/hr/employee/AddEmployee/steps/BasicInfoStep';
import { BasicInfoReviewStep } from '../../../components/core/usermgmt/AddEmployee/InfoReviewStep';
import type { Step1Dto } from '../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';

function PageAddUser() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfoData, setBasicInfoData] = useState<Partial<Step1Dto & { branchId: UUID }>>({});
  const [employeeCode, setEmployeeCode] = useState<string>('');
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Define steps for the header


  // Handle back to employees list
  const handleBackToEmployees = () => {
    navigate(-1);
  };


  // Handle going back from review to basic info
  const handleBackToBasicInfo = () => {
    setCurrentStep(1);
  };

  // Handle when Basic Info step is completed
  const handleBasicInfoComplete = (data: Step1Dto & { branchId: UUID }) => {
    // Store the data
    setBasicInfoData(data);
    
    // Generate a temporary employee code (in real app, this would come from API)
    const tempCode = `EMP${Date.now().toString().slice(-6)}`;
    setEmployeeCode(tempCode);
    
    // If a file is uploaded, create a preview
    if (data.File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(data.File);
    }
    
    // Move to review step
    setCurrentStep(2);
  };

  // Handle print functionality
  const handlePrint = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const basicInfoElement = document.getElementById("basic-info-section");

      if (!basicInfoElement) {
        alert("Basic Information section not found.");
        return;
      }

      // Clone the Basic Info section
      const clone = basicInfoElement.cloneNode(true) as HTMLElement;

      // Open print window
      const printWindow = window.open("", "_blank");

      if (!printWindow) return;

      // Extract styles
      const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map((node) => node.outerHTML)
        .join("\n");

      // Print-friendly CSS
      const printCSS = `
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            margin: 0;
            padding: 0;
            font-size: 14px;
          }

          #print-root {
            page-break-inside: avoid;
          }

          .print-section * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-layout {
            display: flex !important;
            flex-direction: row !important;
            gap: 20px !important;
            width: 100% !important;
          }

          .left-column {
            flex: 1 !important;
            max-width: 35% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }

          .right-column {
            flex: 2 !important;
            max-width: 65% !important;
          }

          .photo-section {
            width: 100% !important;
            max-width: 180px !important;
            margin-bottom: 20px !important;
          }

          .employee-photo {
            width: 100% !important;
            height: auto !important;
            max-height: 180px !important;
            object-fit: contain !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
          }

          .placeholder-photo {
            width: 180px !important;
            height: 180px !important;
            border: 2px dashed #ddd !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #f9fafb !important;
          }

          .employee-code {
            margin-top: 10px !important;
            text-align: center !important;
            width: 100% !important;
          }

          .employee-code div {
            background-color: #f0f9ff !important;
            border: 1px solid #bae6fd !important;
            border-radius: 6px !important;
            padding: 10px !important;
            width: 100% !important;
          }

          .field {
            margin-bottom: 12px !important;
            page-break-inside: avoid !important;
          }

          .field label {
            display: block !important;
            font-size: 12px !important;
            color: #6b7280 !important;
            margin-bottom: 4px !important;
            font-weight: 500 !important;
          }

          .field p {
            margin: 0 !important;
            font-size: 14px !important;
            color: #111827 !important;
            font-weight: 500 !important;
            word-break: break-word !important;
          }

          button, .no-print {
            display: none !important;
          }

          .print-header {
            margin-bottom: 20px !important;
            padding-bottom: 15px !important;
            border-bottom: 2px solid #e5e7eb !important;
          }

          .print-header h3 {
            margin: 0 !important;
            font-size: 18px !important;
            color: #111827 !important;
            font-weight: 600 !important;
          }

          .section-title {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 20px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
          }

          .border-gray-200 {
            border: 1px solid #e5e7eb !important;
          }

          .rounded-xl {
            border-radius: 12px !important;
          }

          .p-6 {
            padding: 24px !important;
          }

          .mb-4 {
            margin-bottom: 16px !important;
          }

          .mt-2 {
            margin-top: 8px !important;
          }
        </style>
      `;

      // Build print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Employee Basic Information</title>
          ${styles}
          ${printCSS}
        </head>
        <body>
          <div id="print-root">
            <div class="print-header">
              <h3>Employee Basic Information</h3>
            </div>
            <div class="print-section">
              ${clone.outerHTML}
            </div>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }, 50);
  };

  // Handle confirmation and save
  const handleConfirmAndSave = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success
      setSaveSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/hr/employees');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Failed to save employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render success message
  if (saveSuccess) {
    return (
      <section className="w-full bg-gray-50 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Employee Added Successfully!</h1>
            <p className="text-gray-600 mb-6">Employee code: <span className="font-semibold text-green-600">{employeeCode}</span></p>
            <p className="text-gray-500">Redirecting to employees list...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto">

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {currentStep === 1 ? (
            <BasicInfoStep
              data={basicInfoData}
              onNext={handleBasicInfoComplete}
              onBack={handleBackToEmployees}
              loading={isLoading}
            />
          ) : (
            <BasicInfoReviewStep
              step1Data={basicInfoData as Step1Dto & { branchId: UUID }}
              employeeCode={employeeCode}
              photo={photoData}
              onBack={handleBackToBasicInfo}
              onConfirm={handleConfirmAndSave}
              onPrint={handlePrint}
              loading={isLoading}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default PageAddUser;