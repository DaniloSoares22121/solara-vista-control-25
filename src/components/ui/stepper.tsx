
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
                  "flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                    isCompleted && "bg-green-600 border-green-600 text-white",
                    isCurrent && "border-blue-600 bg-blue-50 text-blue-600",
                    !isCompleted && !isCurrent && "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-24">
                  <p className={cn(
                    "text-xs font-medium",
                    isCurrent && "text-blue-600",
                    isCompleted && "text-green-600",
                    !isCompleted && !isCurrent && "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-200",
                    index < currentStep ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
