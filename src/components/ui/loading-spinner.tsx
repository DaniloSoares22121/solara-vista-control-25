
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

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
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center space-y-6 ${className}`}>
      <div className="text-center space-y-6">
        <div className="relative">
          {/* Main spinner */}
          <div className={`${sizeClasses[size]} relative mx-auto`}>
            <div className="absolute inset-0 border-4 border-emerald-200/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-emerald-400/50 border-t-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-emerald-300/20 rounded-full blur-sm animate-pulse mx-auto`}></div>
          
          {/* Center sparkle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
          </div>
        </div>
        
        {text && (
          <div className="space-y-3">
            <p className={`font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
              {text}
            </p>
            <p className="text-emerald-500/70 text-sm font-medium">Aguarde enquanto processamos</p>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
