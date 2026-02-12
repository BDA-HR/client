import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft, User, UserX, PauseCircle, CheckCircle, XCircle, Menu } from 'lucide-react';
import { InteractiveGridPattern } from '../../../../components/ui/interactive-grid-pattern';
import { cn } from '../../../../lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/popover';

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
}

interface EditEmployeeStepHeaderProps {
  steps: Step[];
  currentStep: number;
  onBack: () => void;
  onTabClick: (stepId: number) => void;
  title: string;
  backButtonText?: string;
  employeeData?: {
    photo?: string;
    fullName?: string;
    fullNameAm?: string;
    position?: string;
    department?: string;
    code?: string;
  };
}

const greenTheme = {
  primary: {
    light: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-200"
  }
};

export const EditEmployeeStepHeader: React.FC<EditEmployeeStepHeaderProps> = ({
  steps,
  currentStep,
  onBack,
  onTabClick,
  title,
  backButtonText = 'Back to Employees',
  employeeData,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleTerminate = () => {
    setPopoverOpen(false);
    // TODO: Implement terminate functionality
    if (window.confirm('Are you sure you want to terminate this employee?')) {
      console.log('Terminate employee');
      alert('Terminate functionality will be implemented');
    }
  };

  const handleSuspend = () => {
    setPopoverOpen(false);
    // TODO: Implement suspend functionality
    if (window.confirm('Are you sure you want to suspend this employee?')) {
      console.log('Suspend employee');
      alert('Suspend functionality will be implemented');
    }
  };

  const handleActivate = () => {
    setPopoverOpen(false);
    // TODO: Implement activate functionality
    console.log('Activate employee');
    alert('Activate functionality will be implemented');
  };

  const handleDeactivate = () => {
    setPopoverOpen(false);
    // TODO: Implement deactivate functionality
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      console.log('Deactivate employee');
      alert('Deactivate functionality will be implemented');
    }
  };

  return (
    <div className="space-y-8 mb-8">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="cursor-pointer hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-gray-700">{backButtonText}</span>
        </Button>
      </div>

      {/* Profile Header Section */}
      <div className="relative -mt-6 w-full flex flex-col items-center justify-center overflow-hidden rounded-xl">
        {/* Decorative Pattern Layer */}
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(ellipse_at_center,_grey,_transparent_70%)]",
            "inset-0 h-full w-full skew-y-6"
          )}
          width={22}
          height={22}
          squares={[80, 80]}
          squaresClassName="hover:fill-green-400"
        />

        {/* Floating Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green-200 blur-[90px] opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center p-10 flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 transform transition-transform duration-500 hover:scale-105">
            {employeeData?.photo ? (
              <img 
                src={`data:image/png;base64,${employeeData.photo}`}
                alt={employeeData.fullName || 'Employee'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
            )}
          </div>

          {/* Text */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
            {employeeData?.fullName || 'Employee Name'}
          </h1>
          {employeeData?.fullNameAm && (
            <p className="text-gray-600 mt-1 text-lg">
              {employeeData.fullNameAm}
            </p>
          )}
          <p className="text-green-600 font-semibold mt-1 text-lg">
            {employeeData?.position || 'Position'}
          </p>
          <p className="text-gray-600 mt-1">
            {employeeData?.department || 'Department'} • {employeeData?.code || 'Code'}
          </p>
        </div>
      </div>

      {/* Tabs Section - Profile Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-2">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-2 overflow-x-auto flex-1">
            {steps.map((step) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onTabClick(step.id)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `${greenTheme.primary.light} border border-green-300 text-green-700 shadow-sm`
                      : "text-gray-500 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <IconComponent
                    className={`h-5 w-5 ${
                      isActive ? greenTheme.primary.icon : "text-gray-400"
                    }`}
                  />
                  {step.title}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-1"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions Menu */}
          <div className="ml-4 flex-shrink-0">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="py-1">
                    <button
                    onClick={handleTerminate}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                  >
                    <UserX size={16} />
                    Terminate
                  </button>
         <button
                    onClick={handleActivate}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                  >
                    <CheckCircle size={16} className="text-green-600" />
                    Stand By
                  </button>
                  <button
                    onClick={handleSuspend}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 rounded text-orange-600 flex items-center gap-2"
                  >
                    <PauseCircle size={16} />
                    Suspend
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                  >
                    <XCircle size={16} className="text-gray-600" />
                    Retire
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
