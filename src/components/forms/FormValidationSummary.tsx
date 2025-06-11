
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationError {
  field: string;
  message: string;
  step: number;
}

interface FormValidationSummaryProps {
  errors: ValidationError[];
  onGoToStep: (step: number) => void;
}

const FormValidationSummary = ({ errors, onGoToStep }: FormValidationSummaryProps) => {
  if (errors.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Todos os campos obrigatórios foram preenchidos corretamente!
        </AlertDescription>
      </Alert>
    );
  }

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.step]) {
      acc[error.step] = [];
    }
    acc[error.step].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <p className="font-semibold">Campos obrigatórios pendentes:</p>
          {Object.entries(groupedErrors).map(([step, stepErrors]) => (
            <div key={step}>
              <button
                onClick={() => onGoToStep(parseInt(step))}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                Etapa {parseInt(step) + 1}:
              </button>
              <ul className="ml-4 mt-1 space-y-1">
                {stepErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    • {error.field}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FormValidationSummary;
