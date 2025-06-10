
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import GeneratorConcessionariaForm from '@/components/forms/GeneratorConcessionariaForm';
import GeneratorOwnerTypeForm from '@/components/forms/GeneratorOwnerTypeForm';
import GeneratorOwnerDataForm from '@/components/forms/GeneratorOwnerDataForm';
import GeneratorAdministratorForm from '@/components/forms/GeneratorAdministratorForm';
import { GeneratorFormData } from '@/types/generator';

const generatorSchema = z.object({
  concessionaria: z.string().min(1, 'Selecione uma concessionária'),
  owner: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'Campo obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Campo obrigatório'),
    name: z.string().min(1, 'Campo obrigatório'),
    dataNascimento: z.string().optional(),
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    address: z.object({
      cep: z.string().min(1, 'CEP é obrigatório'),
      endereco: z.string().min(1, 'Endereço é obrigatório'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string(),
      bairro: z.string().min(1, 'Bairro é obrigatório'),
      cidade: z.string().min(1, 'Cidade é obrigatória'),
      estado: z.string().min(1, 'Estado é obrigatório'),
    }),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('E-mail inválido'),
    observacoes: z.string(),
  }),
  administrator: z.object({
    cpf: z.string(),
    nome: z.string(),
    dataNascimento: z.string(),
    address: z.object({
      cep: z.string(),
      endereco: z.string(),
      numero: z.string(),
      complemento: z.string(),
      bairro: z.string(),
      cidade: z.string(),
      estado: z.string(),
    }),
    telefone: z.string(),
    email: z.string(),
  }).optional(),
  plants: z.array(z.any()).default([]),
  distributorLogin: z.object({
    uc: z.string(),
    cpfCnpj: z.string(),
    dataNascimento: z.string().optional(),
  }),
  paymentData: z.object({
    banco: z.string(),
    agencia: z.string(),
    conta: z.string(),
    pix: z.string(),
  }),
  attachments: z.object({}).default({}),
});

interface NovaGeradoraProps {
  onClose: () => void;
}

const NovaGeradora = ({ onClose }: NovaGeradoraProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      concessionaria: '',
      owner: {
        type: 'fisica',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        name: '',
        dataNascimento: '',
        razaoSocial: '',
        nomeFantasia: '',
        address: {
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
        telefone: '',
        email: '',
        observacoes: '',
      },
      plants: [],
      distributorLogin: {
        uc: '',
        cpfCnpj: '',
        dataNascimento: '',
      },
      paymentData: {
        banco: '',
        agencia: '',
        conta: '',
        pix: '',
      },
      attachments: {},
    },
  });

  const ownerType = form.watch('owner.type');

  const steps = [
    { 
      number: 1, 
      title: 'Dados Gerais e Dono da Usina', 
      description: 'Concessionária e informações do proprietário' 
    },
    { 
      number: 2, 
      title: 'Dados das Usinas', 
      description: 'Informações das unidades geradoras' 
    },
    { 
      number: 3, 
      title: 'Login e Pagamento', 
      description: 'Credenciais e dados bancários' 
    },
    { 
      number: 4, 
      title: 'Anexos', 
      description: 'Documentos e contratos' 
    },
  ];

  const onSubmit = (data: GeneratorFormData) => {
    console.log('Generator data:', data);
    // TODO: Implementar salvamento no banco
    onClose();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    // TODO: Implementar validação específica por step
    return true;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Geradora</h1>
            <p className="text-gray-600 mt-1">Cadastre uma nova unidade geradora de energia</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.number 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-12 h-0.5 mx-4
                  ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Step 1: Dados Gerais e Dono da Usina */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-green-800">
                          Dados Gerais e Dono da Usina
                        </CardTitle>
                        <p className="text-green-600 mt-1">
                          Informações da concessionária e proprietário da geradora
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Passo 1 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-8">
                    <GeneratorConcessionariaForm form={form} />
                    <GeneratorOwnerTypeForm form={form} />
                    <GeneratorOwnerDataForm form={form} ownerType={ownerType} />
                    {ownerType === 'juridica' && (
                      <GeneratorAdministratorForm form={form} />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Dados das Usinas */}
              {currentStep === 2 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-blue-800">
                          Dados das Usinas
                        </CardTitle>
                        <p className="text-blue-600 mt-1">
                          Informações técnicas das unidades geradoras
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Passo 2 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Formulário de dados das usinas será implementado aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Login e Pagamento */}
              {currentStep === 3 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-purple-800">
                          Login e Pagamento
                        </CardTitle>
                        <p className="text-purple-600 mt-1">
                          Credenciais da distribuidora e dados de recebimento
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Passo 3 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Formulário de login e pagamento será implementado aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Anexos */}
              {currentStep === 4 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-amber-800">
                          Anexos
                        </CardTitle>
                        <p className="text-amber-600 mt-1">
                          Documentos e contratos necessários
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Passo 4 de {totalSteps}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Formulário de anexos será implementado aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

            </form>
          </Form>
        </div>
      </div>

      {/* Footer with Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Limpar
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                Salvar Geradora
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaGeradora;
