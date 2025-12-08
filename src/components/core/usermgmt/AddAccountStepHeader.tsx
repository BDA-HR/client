import React from 'react';
import { motion } from 'framer-motion';
import type{ LucideIcon } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface AddAccountStepHeaderProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const AddAccountStepHeader: React.FC<AddAccountStepHeaderProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative mb-4">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-10 transition-all duration-300"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
          }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id < currentStep;

          return (
            <div key={step.id} className="relative z-20">
              <motion.button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex flex-col items-center gap-2 transition-all duration-200 ${
                  isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                }`}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-white border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-100'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isCompleted || isCurrent
                        ? 'text-gray-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};