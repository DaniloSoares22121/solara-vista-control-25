
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepProps {
  title: string;
  description?: string;
}

export interface StepsProps {
  current: number;
  children: React.ReactElement<StepProps>[];
  className?: string;
}

export const Step = ({ title, description }: StepProps) => {
  return null; // This is just for type definition, actual rendering is handled by Steps
};

export const Steps = ({ current, children, className }: StepsProps) => {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 bg-white",
                    isCompleted && "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg",
                    isCurrent && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 shadow-md ring-4 ring-green-100",
                    !isCompleted && !isCurrent && "border-gray-300 text-gray-400 hover:border-gray-400"
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
                    isCurrent && "text-green-600",
                    isCompleted && "text-green-600",
                    !isCompleted && !isCurrent && "text-gray-500"
                  )}>
                    {step.props.title}
                  </p>
                  {step.props.description && (
                    <p className={cn(
                      "text-xs mt-1 transition-colors duration-200",
                      isCurrent && "text-green-500",
                      isCompleted && "text-green-500",
                      !isCompleted && !isCurrent && "text-gray-400"
                    )}>
                      {step.props.description}
                    </p>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-4 relative">
                  <div 
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      index < current 
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
