
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Carregando...', 
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center space-y-4 ${className}`}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto`}>
          </div>
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-green-200 rounded-full mx-auto`}>
          </div>
        </div>
        {text && (
          <div className="space-y-2">
            <p className={`text-gray-700 font-semibold ${textSizeClasses[size]}`}>
              {text}
            </p>
            <p className="text-gray-500 text-sm">Aguarde enquanto processamos</p>
          </div>
        )}
      </div>
    </div>
  );
};
