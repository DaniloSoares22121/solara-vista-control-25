
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, User, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { SubscriberSelector } from '@/components/faturas/SubscriberSelector';
import { SubscriberDetails } from '@/components/faturas/SubscriberDetails';
import { InvoiceUpload } from '@/components/faturas/InvoiceUpload';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

const steps = [
  { id: 1, title: 'Selecionar Assinante', icon: User },
  { id: 2, title: 'Verificar Dados', icon: CheckCircle2 },
  { id: 3, title: 'Upload da Fatura', icon: Upload },
];

export default function FaturaManual() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRecord | null>(null);

  const handleSubscriberSelect = (subscriber: SubscriberRecord) => {
    setSelectedSubscriber(subscriber);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedSubscriber(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SubscriberSelector onSelect={handleSubscriberSelect} />;
      case 2:
        return selectedSubscriber ? (
          <SubscriberDetails subscriber={selectedSubscriber} />
        ) : null;
      case 3:
        return selectedSubscriber ? (
          <InvoiceUpload subscriber={selectedSubscriber} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fatura Manual</h1>
        <p className="text-muted-foreground">
          Processe faturas manualmente selecionando um assinante e fazendo upload da fatura da Equatorial
        </p>
      </div>

      {/* Steps Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>Siga as etapas para processar a fatura manual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <Badge variant={currentStep >= step.id ? 'default' : 'secondary'}>
                    Etapa {step.id}
                  </Badge>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep > 1 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Recomeçar
            </Button>
            {currentStep === 2 && selectedSubscriber && (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
