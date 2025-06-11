
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

interface StepNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isNextDisabled: boolean;
  isEditing?: boolean;
}

const StepNavigationButtons = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isNextDisabled,
  isEditing = false
}: StepNavigationButtonsProps) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between items-center bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 z-10">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{currentStep + 1} de {totalSteps}</span>
      </div>

      <div className="flex gap-2">
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditing ? 'Atualizando...' : 'Cadastrando...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigationButtons;
