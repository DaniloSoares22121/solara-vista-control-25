import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, User, Upload, ArrowRight, ArrowLeft, Clock, Check } from 'lucide-react';
import { SubscriberSelector } from '@/components/faturas/SubscriberSelector';
import { SubscriberDetails } from '@/components/faturas/SubscriberDetails';
import { InvoiceUpload } from '@/components/faturas/InvoiceUpload';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import DashboardLayout from '@/components/DashboardLayout';

const steps = [
  { id: 1, title: 'Selecionar Assinante', description: 'Escolha o assinante para processar a fatura', icon: User },
  { id: 2, title: 'Verificar Dados', description: 'Confirme as informações do assinante', icon: CheckCircle2 },
  { id: 3, title: 'Upload da Fatura', description: 'Faça o upload do arquivo da fatura', icon: Upload },
];

export default function FaturaManual() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRecord | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [processCompleted, setProcessCompleted] = useState(false);

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
    setExtractedData(null);
  };

  const handleDataConfirmed = (data: any) => {
    console.log('Dados confirmados na página principal:', data);
    
    if (data.extractedData && data.calculationData) {
      setExtractedData(data.extractedData);
      setCalculationData(data.calculationData);
      setProcessCompleted(true);
    } else {
      setExtractedData(data);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
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
          <InvoiceUpload 
            subscriber={selectedSubscriber} 
            onDataConfirmed={handleDataConfirmed}
          />
        ) : null;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fatura Manual</h1>
              <p className="text-green-700">
                Processe faturas manualmente selecionando um assinante e fazendo upload da fatura da Equatorial
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso: Etapa {currentStep} de {steps.length}</span>
              <span>{Math.round(progressPercentage)}% concluído</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Steps Navigation */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Progresso das Etapas</span>
            </CardTitle>
            <CardDescription>Siga as etapas para processar a fatura manual</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                        status === 'completed' 
                          ? 'bg-green-600 border-green-600 text-white' 
                          : status === 'current'
                          ? 'bg-green-100 border-green-600 text-green-600'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${
                          status === 'current' ? 'text-green-700' : 
                          status === 'completed' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500 hidden sm:block">
                          {step.description}
                        </p>
                        <Badge 
                          variant={status === 'completed' ? 'default' : status === 'current' ? 'secondary' : 'outline'}
                          className="mt-1"
                        >
                          {status === 'completed' ? 'Concluída' : 
                           status === 'current' ? 'Em andamento' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block">
                        <ArrowRight className={`w-6 h-6 ${
                          status === 'completed' ? 'text-green-600' : 'text-gray-300'
                        }`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border-0 shadow-lg min-h-[400px]">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="flex items-center space-x-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
            <CardDescription className="text-green-100">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep > 1 && (
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Etapa Anterior</span>
            </Button>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="px-6 py-3"
              >
                Recomeçar Processo
              </Button>
              
              {currentStep === 2 && selectedSubscriber && (
                <Button 
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 px-6 py-3"
                >
                  <span>Próxima Etapa</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Debug - Dados Confirmados */}
        {extractedData && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Dados da Fatura Extraídos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-2">
                Dados da fatura extraídos e confirmados.
              </p>
              <details>
                <summary className="cursor-pointer font-medium text-blue-700 hover:text-blue-900">
                  Ver dados da fatura
                </summary>
                <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Debug - Dados de Cálculo da API */}
        {calculationData && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Cálculos via API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-2">
                Cálculos realizados via API e confirmados.
              </p>
              <details>
                <summary className="cursor-pointer font-medium text-green-700 hover:text-green-900">
                  Ver cálculos da API
                </summary>
                <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                  {JSON.stringify(calculationData, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Processo Completo */}
        {processCompleted && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Processo Concluído!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                A fatura foi processada com sucesso. Todos os dados foram extraídos e os cálculos foram realizados via API.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-gray-800 mb-2">Dados da Fatura</h4>
                  <p>Cliente: {extractedData?.nomeCliente}</p>
                  <p>UC: {extractedData?.numeroFatura}</p>
                  <p>Valor Original: R$ {extractedData?.valorTotal?.toFixed(2)}</p>
                  <p>Consumo: {extractedData?.consumoKwh} kWh</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-gray-800 mb-2">Resultado da API</h4>
                  <p>Desconto: {calculationData?.percentualDesconto}%</p>
                  <p>Valor com EnergyPay: R$ {calculationData?.valorComEnergyPay?.toFixed(2)}</p>
                  <p>Economia: R$ {calculationData?.economiaMes?.toFixed(2)}</p>
                  <p>Economia Acumulada: R$ {calculationData?.economiaAcumulada?.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
