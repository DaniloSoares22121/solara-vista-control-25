
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper = ({ steps, currentStep, onStepClick, className }: StepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index < currentStep && onStepClick;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn(
                  "flex flex-col items-center relative group",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 bg-white",
                    isCompleted && "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg",
                    isCurrent && "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-md ring-4 ring-blue-100",
                    !isCompleted && !isCurrent && "border-gray-300 text-gray-400 hover:border-gray-400",
                    isClickable && "hover:scale-105 hover:shadow-lg"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <div className="mt-3 text-center max-w-32">
                  <p className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isCurrent && "text-blue-600",
                    isCompleted && "text-green-600",
                    !isCompleted && !isCurrent && "text-gray-500"
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className={cn(
                      "text-xs mt-1 transition-colors duration-200",
                      isCurrent && "text-blue-500",
                      isCompleted && "text-green-500",
                      !isCompleted && !isCurrent && "text-gray-400"
                    )}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 relative">
                  <div 
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      index < currentStep 
                        ? "bg-gradient-to-r from-green-400 to-emerald-400" 
                        : "bg-gray-300"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
