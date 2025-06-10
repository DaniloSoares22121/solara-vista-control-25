
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubscribers } from '@/hooks/useSubscribers';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';

// Form components
import ConcessionariaForm from '@/components/forms/ConcessionariaForm';
import TipoAssinanteForm from '@/components/forms/TipoAssinanteForm';
import DadosPessoaFisicaForm from '@/components/forms/DadosPessoaFisicaForm';
import DadosPessoaJuridicaForm from '@/components/forms/DadosPessoaJuridicaForm';
import ContaEnergiaForm from '@/components/forms/ContaEnergiaForm';
import PlanoContratadoForm from '@/components/forms/PlanoContratadoForm';
import DetalhesPlanoForm from '@/components/forms/DetalhesPlanoForm';
import NotificacoesForm from '@/components/forms/NotificacoesForm';
import AnexosForm from '@/components/forms/AnexosForm';

// Schema de validação
const subscriberSchema = z.object({
  concessionaria: z.string().min(1, 'Concessionária é obrigatória'),
  subscriber: z.object({
    type: z.enum(['fisica', 'juridica']),
    cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
    numeroParceiroNegocio: z.string().min(1, 'Número parceiro é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
    telefone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email('Email inválido'),
  }),
  energyAccount: z.object({
    originalAccount: z.object({
      type: z.enum(['fisica', 'juridica']),
      cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório'),
      name: z.string().min(1, 'Nome é obrigatório'),
      uc: z.string().min(1, 'UC é obrigatória'),
      numeroParceiroUC: z.string().min(1, 'Número parceiro UC é obrigatório'),
    }),
  }),
  planContract: z.object({
    modalidadeCompensacao: z.enum(['autoconsumo', 'geracaoCompartilhada']),
    dataAdesao: z.string().min(1, 'Data de adesão é obrigatória'),
    kwhVendedor: z.number().min(1, 'kWh vendedor é obrigatório'),
    kwhContratado: z.number().min(1, 'kWh contratado é obrigatório'),
    faixaConsumo: z.enum(['400-599', '600-1099', '1100-3099', '3100-7000', '7000+']),
    fidelidade: z.enum(['sem', 'com']),
  }),
});

interface NovoAssinanteProps {
  onClose: () => void;
}

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const { createSubscriber, loading } = useSubscribers();

  // Initialize form with default values
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      concessionaria: 'equatorial-goias',
      subscriber: {
        type: 'fisica',
        name: '',
        cpfCnpj: '',
        numeroParceiroNegocio: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        estadoCivil: '',
        profissao: '',
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
        observacoes: '',
        contacts: [],
      },
      administrator: {
        cpf: '',
        nome: '',
        dataNascimento: '',
        estadoCivil: '',
        profissao: '',
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
      },
      energyAccount: {
        originalAccount: {
          type: 'fisica',
          cpfCnpj: '',
          name: '',
          dataNascimento: '',
          uc: '',
          numeroParceiroUC: '',
          address: {
            cep: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
          },
        },
        realizarTrocaTitularidade: false,
        newTitularity: {
          type: 'fisica',
          cpfCnpj: '',
          name: '',
          dataNascimento: '',
          uc: '',
          numeroParceiroUC: '',
          trocaConcluida: false,
          dataTroca: '',
          protocoloAnexo: undefined,
        },
      },
      planContract: {
        modalidadeCompensacao: 'autoconsumo',
        dataAdesao: '',
        kwhVendedor: 0,
        kwhContratado: 0,
        faixaConsumo: '400-599',
        fidelidade: 'sem',
        anosFidelidade: undefined,
        desconto: 0,
      },
      planDetails: {
        clientePagaPisCofins: true,
        clientePagaFioB: false,
        adicionarValorDistribuidora: false,
        assinanteIsento: false,
      },
      notifications: {
        whatsappFaturas: true,
        whatsappPagamento: false,
        notifications: {
          criarCobranca: { whatsapp: true, email: true },
          alteracaoValor: { whatsapp: true, email: true },
          vencimento1Dia: { whatsapp: true, email: true },
          vencimentoHoje: { whatsapp: true, email: true },
        },
        overdueNotifications: {
          day1: { whatsapp: true, email: true },
          day3: { whatsapp: true, email: true },
          day5: { whatsapp: true, email: true },
          day7: { whatsapp: true, email: true },
          day15: { whatsapp: true, email: true },
          day20: { whatsapp: true, email: true },
          day25: { whatsapp: true, email: true },
          day30: { whatsapp: true, email: true },
          after30: { whatsapp: true, email: true },
        },
      },
      attachments: {},
    },
  });

  const tipoAssinante = form.watch('subscriber.type');
  const contacts = form.watch('subscriber.contacts') || [];

  const handleContactsChange = (newContacts: any[]) => {
    form.setValue('subscriber.contacts', newContacts);
  };

  const handleSubmit = async () => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Sync UC for new titularity
      const formData = form.getValues();
      if (formData.energyAccount.realizarTrocaTitularidade && formData.energyAccount.newTitularity) {
        formData.energyAccount.newTitularity.uc = formData.energyAccount.originalAccount.uc;
        form.setValue('energyAccount.newTitularity.uc', formData.energyAccount.originalAccount.uc);
      }

      console.log('📝 [FORM] Dados do formulário:', JSON.stringify(formData, null, 2));
      
      await createSubscriber(formData);
      
      toast.success('Assinante cadastrado com sucesso!');
      onClose();
    } catch (error) {
      console.error('❌ [FORM] Erro ao cadastrar assinante:', error);
      toast.error('Erro ao cadastrar assinante. Tente novamente.');
    }
  };

  return (
    <FormProvider {...form}>
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Assinante</h1>
                <p className="text-sm text-gray-600">Cadastre um novo cliente de energia por UC</p>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Formulário Completo
            </Badge>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* 1. Concessionária */}
            <Card>
              <CardContent className="p-6">
                <ConcessionariaForm form={form} />
              </CardContent>
            </Card>

            {/* 2. Tipo de Assinante */}
            <Card>
              <CardContent className="p-6">
                <TipoAssinanteForm form={form} />
              </CardContent>
            </Card>

            {/* 3. Dados do Assinante */}
            <Card>
              <CardContent className="p-6">
                {tipoAssinante === 'fisica' ? (
                  <DadosPessoaFisicaForm 
                    form={form} 
                    contacts={contacts}
                    onContactsChange={handleContactsChange}
                  />
                ) : (
                  <DadosPessoaJuridicaForm 
                    form={form} 
                    contacts={contacts}
                    onContactsChange={handleContactsChange}
                  />
                )}
              </CardContent>
            </Card>

            {/* 4. Conta de Energia */}
            <Card>
              <CardContent className="p-6">
                <ContaEnergiaForm form={form} />
              </CardContent>
            </Card>

            {/* 5. Plano Contratado */}
            <Card>
              <CardContent className="p-6">
                <PlanoContratadoForm form={form} />
              </CardContent>
            </Card>

            {/* 6. Detalhes do Plano */}
            <Card>
              <CardContent className="p-6">
                <DetalhesPlanoForm form={form} />
              </CardContent>
            </Card>

            {/* 7. Notificações */}
            <Card>
              <CardContent className="p-6">
                <NotificacoesForm form={form} />
              </CardContent>
            </Card>

            {/* 8. Anexos */}
            <Card>
              <CardContent className="p-6">
                <AnexosForm form={form} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Cadastrar Assinante
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default NovoAssinante;
