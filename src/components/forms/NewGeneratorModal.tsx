
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Zap,
  User,
  Building,
  CreditCard,
  FileText,
  X
} from 'lucide-react';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import GeneratorConcessionariaForm from '@/components/forms/GeneratorConcessionariaForm';
import GeneratorOwnerTypeForm from '@/components/forms/GeneratorOwnerTypeForm';
import GeneratorOwnerDataForm from '@/components/forms/GeneratorOwnerDataForm';
import GeneratorAdministratorForm from '@/components/forms/GeneratorAdministratorForm';
import GeneratorPlantsForm from '@/components/forms/GeneratorPlantsForm';
import GeneratorPaymentForm from '@/components/forms/GeneratorPaymentForm';
import GeneratorDistributorLoginForm from '@/components/forms/GeneratorDistributorLoginForm';
import GeneratorAttachmentsForm from '@/components/forms/GeneratorAttachmentsForm';
import { useToast } from '@/hooks/use-toast';

interface NewGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewGeneratorModal = ({ isOpen, onClose, onSuccess }: NewGeneratorModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const {
    form,
    handleCepLookup,
    addPlant,
    removePlant,
    saveGenerator,
    isLoading
  } = useGeneratorForm();

  const ownerType = form.watch('owner.type');

  const steps = [
    { 
      number: 1, 
      title: 'Concessionária', 
      icon: Zap,
      component: <GeneratorConcessionariaForm form={form} />
    },
    { 
      number: 2, 
      title: 'Tipo de Proprietário', 
      icon: User,
      component: <GeneratorOwnerTypeForm form={form} />
    },
    { 
      number: 3, 
      title: 'Dados do Proprietário', 
      icon: Building,
      component: <GeneratorOwnerDataForm form={form} ownerType={ownerType} />
    },
    ...(ownerType === 'juridica' ? [{
      number: 4, 
      title: 'Administrador', 
      icon: User,
      component: <GeneratorAdministratorForm form={form} />
    }] : []),
    { 
      number: ownerType === 'juridica' ? 5 : 4, 
      title: 'Usinas', 
      icon: Zap,
      component: <GeneratorPlantsForm form={form} />
    },
    { 
      number: ownerType === 'juridica' ? 6 : 5, 
      title: 'Dados de Pagamento', 
      icon: CreditCard,
      component: <GeneratorPaymentForm form={form} />
    },
    { 
      number: ownerType === 'juridica' ? 7 : 6, 
      title: 'Login da Distribuidora', 
      icon: FileText,
      component: <GeneratorDistributorLoginForm form={form} />
    },
    { 
      number: ownerType === 'juridica' ? 8 : 7, 
      title: 'Anexos', 
      icon: FileText,
      component: <GeneratorAttachmentsForm form={form} />
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const formData = form.getValues();
      await saveGenerator(formData);
      toast({
        title: "Geradora cadastrada!",
        description: "A geradora foi cadastrada com sucesso.",
      });
      onSuccess();
      onClose();
      setCurrentStep(1);
    } catch (error) {
      console.error('Erro ao salvar geradora:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar a geradora. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Header Fixo */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Nova Geradora
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <currentStepData.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Etapa {currentStep} de {totalSteps}</p>
                <p className="text-xl font-semibold text-white">{currentStepData.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <Form {...form}>
                    <form>
                      {currentStepData.component}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer com Navegação */}
        <div className="bg-white border-t p-6 flex-shrink-0">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step.number === currentStep
                      ? 'bg-green-600'
                      : step.number < currentStep
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleFinish}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewGeneratorModal;
