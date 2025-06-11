
import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProgressProps {
  steps: string[];
  currentStep: number;
  completedSteps: boolean[];
  hasErrors: boolean[];
}

const FormProgress = ({ steps, currentStep, completedSteps, hasErrors }: FormProgressProps) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps[index];
            const hasError = hasErrors[index];
            const isClickable = index < currentStep || isCompleted;

            return (
              <div key={index} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      isActive && "border-blue-500 bg-blue-50",
                      isCompleted && !hasError && "border-green-500 bg-green-50",
                      hasError && "border-red-500 bg-red-50",
                      !isActive && !isCompleted && !hasError && "border-gray-300 bg-gray-50"
                    )}
                  >
                    {isCompleted && !hasError ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : hasError ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <span className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 text-center max-w-20",
                    isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                  )}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Etapa {currentStep + 1} de {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormProgress;
