import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, X, User, Building2, CreditCard, FileText, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { SubscriberFormData } from '@/types/subscriber';
import { useCepLookup } from '@/hooks/useCepLookup';
import PlanTable from '@/components/forms/PlanTable';

interface NovoAssinanteProps {
  onClose?: () => void;
}

const NovoAssinante = ({ onClose }: NovoAssinanteProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { lookupCep, loading: cepLoading } = useCepLookup();
  
  const [formData, setFormData] = useState<SubscriberFormData>({
    concessionaria: 'Equatorial Goiás',
    subscriber: {
      type: 'fisica',
      cpfCnpj: '',
      numeroParceiroNegocio: '',
      name: '',
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
      observacoes: '',
      contacts: [{ id: '1', name: '', phone: '', role: '' }],
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
    },
    planContract: {
      modalidadeCompensacao: 'autoconsumo',
      dataAdesao: '',
      kwhVendedor: 0,
      kwhContratado: 0,
      faixaConsumo: '400-599',
      fidelidade: 'sem',
      desconto: 13,
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
  });

  const totalSteps = 4;

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepChange = async (cep: string, field: 'subscriber' | 'administrator' | 'energyAccount') => {
    const formattedCep = formatCep(cep);
    
    if (field === 'subscriber') {
      setFormData(prev => ({
        ...prev,
        subscriber: {
          ...prev.subscriber,
          address: { ...prev.subscriber.address, cep: formattedCep }
        }
      }));
    } else if (field === 'administrator') {
      setFormData(prev => ({
        ...prev,
        administrator: prev.administrator ? {
          ...prev.administrator,
          address: { ...prev.administrator.address, cep: formattedCep }
        } : prev.administrator
      }));
    } else if (field === 'energyAccount') {
      setFormData(prev => ({
        ...prev,
        energyAccount: {
          ...prev.energyAccount,
          originalAccount: {
            ...prev.energyAccount.originalAccount,
            address: { ...prev.energyAccount.originalAccount.address, cep: formattedCep }
          }
        }
      }));
    }

    if (formattedCep.length === 9) {
      const addressData = await lookupCep(formattedCep);
      if (addressData) {
        if (field === 'subscriber') {
          setFormData(prev => ({
            ...prev,
            subscriber: {
              ...prev.subscriber,
              address: { ...prev.subscriber.address, ...addressData }
            }
          }));
        } else if (field === 'administrator') {
          setFormData(prev => ({
            ...prev,
            administrator: prev.administrator ? {
              ...prev.administrator,
              address: { ...prev.administrator.address, ...addressData }
            } : prev.administrator
          }));
        } else if (field === 'energyAccount') {
          setFormData(prev => ({
            ...prev,
            energyAccount: {
              ...prev.energyAccount,
              originalAccount: {
                ...prev.energyAccount.originalAccount,
                address: { ...prev.energyAccount.originalAccount.address, ...addressData }
              }
            }
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      setFormData(prev => ({
        ...prev,
        energyAccount: {
          ...prev.energyAccount,
          originalAccount: {
            ...prev.energyAccount.originalAccount,
            type: prev.subscriber.type,
            cpfCnpj: prev.subscriber.cpfCnpj,
            name: prev.subscriber.name,
            dataNascimento: prev.subscriber.dataNascimento,
            numeroParceiroUC: prev.subscriber.numeroParceiroNegocio,
            address: prev.subscriber.address
          }
        }
      }));
    }
  }, [currentStep, formData.subscriber]);

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

  const addContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: ''
    };
    setFormData(prev => ({
      ...prev,
      subscriber: {
        ...prev.subscriber,
        contacts: [...prev.subscriber.contacts, newContact]
      }
    }));
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subscriber: {
        ...prev.subscriber,
        contacts: prev.subscriber.contacts.filter(contact => contact.id !== id)
      }
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    toast.success('Assinante cadastrado com sucesso!');
    if (onClose) {
      onClose();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Informações Pessoais</CardTitle>
              <p className="text-sm text-gray-500">Dados básicos do assinante</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Concessionária</Label>
              <Select value={formData.concessionaria} disabled>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equatorial Goiás">Equatorial Goiás</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Tipo de Assinante</Label>
              <RadioGroup 
                value={formData.subscriber.type} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, type: value as 'fisica' | 'juridica' }
                }))}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="fisica" />
                  <Label htmlFor="fisica" className="font-normal">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica" className="font-normal">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">{formData.subscriber.type === 'fisica' ? 'CPF' : 'CNPJ'}</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.cpfCnpj}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: { ...prev.subscriber, cpfCnpj: formatCpfCnpj(e.target.value) }
                  }))}
                  placeholder={formData.subscriber.type === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Número Parceiro de Negócio</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.numeroParceiroNegocio}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: { ...prev.subscriber, numeroParceiroNegocio: e.target.value }
                  }))}
                />
              </div>
            </div>

            {formData.subscriber.type === 'fisica' ? (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome Completo</Label>
                  <Input
                    className="h-11"
                    value={formData.subscriber.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subscriber: { ...prev.subscriber, name: e.target.value }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Data de Nascimento</Label>
                    <Input
                      type="date"
                      className="h-11"
                      value={formData.subscriber.dataNascimento}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subscriber: { ...prev.subscriber, dataNascimento: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Estado Civil</Label>
                    <Select 
                      value={formData.subscriber.estadoCivil} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        subscriber: { ...prev.subscriber, estadoCivil: value }
                      }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Profissão</Label>
                    <Input
                      className="h-11"
                      value={formData.subscriber.profissao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subscriber: { ...prev.subscriber, profissao: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Razão Social</Label>
                    <Input
                      className="h-11"
                      value={formData.subscriber.razaoSocial}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subscriber: { ...prev.subscriber, razaoSocial: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nome Fantasia</Label>
                    <Input
                      className="h-11"
                      value={formData.subscriber.nomeFantasia}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subscriber: { ...prev.subscriber, nomeFantasia: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Dados do Administrador</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">CPF do Administrador</Label>
                    <Input
                      className="h-11"
                      value={formData.administrator?.cpf || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        administrator: {
                          ...prev.administrator!,
                          cpf: formatCpfCnpj(e.target.value)
                        }
                      }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nome do Administrador</Label>
                    <Input
                      className="h-11"
                      value={formData.administrator?.nome || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        administrator: {
                          ...prev.administrator!,
                          nome: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Data de Nascimento</Label>
                    <Input
                      type="date"
                      className="h-11"
                      value={formData.administrator?.dataNascimento || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        administrator: {
                          ...prev.administrator!,
                          dataNascimento: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Estado Civil</Label>
                    <Select 
                      value={formData.administrator?.estadoCivil || ''} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        administrator: {
                          ...prev.administrator!,
                          estadoCivil: value
                        }
                      }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Profissão</Label>
                    <Input
                      className="h-11"
                      value={formData.administrator?.profissao || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        administrator: {
                          ...prev.administrator!,
                          profissao: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              </>
            )}

            <Separator className="my-6" />
            <h3 className="font-semibold text-gray-700">Endereço Principal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">CEP</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.cep}
                  onChange={(e) => handleCepChange(e.target.value, 'subscriber')}
                  placeholder="00000-000"
                  disabled={cepLoading}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Endereço</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.endereco}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, endereco: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Número</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.numero}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, numero: e.target.value }
                    }
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Complemento</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.complemento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, complemento: e.target.value }
                    }
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Bairro</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.bairro}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, bairro: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Cidade</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.cidade}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, cidade: e.target.value }
                    }
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Estado</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.address.estado}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      address: { ...prev.subscriber.address, estado: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                <Input
                  className="h-11"
                  value={formData.subscriber.telefone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: { ...prev.subscriber, telefone: formatPhone(e.target.value) }
                  }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">E-mail</Label>
                <Input
                  type="email"
                  className="h-11"
                  value={formData.subscriber.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: { ...prev.subscriber, email: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Observações</Label>
              <Textarea
                value={formData.subscriber.observacoes}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, observacoes: e.target.value }
                }))}
                rows={3}
                className="resize-none"
              />
            </div>

            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Contatos Adicionais para Cobrança</h3>
              <Button onClick={addContact} size="sm" variant="outline" className="h-9">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {formData.subscriber.contacts.map((contact, index) => (
              <div key={contact.id} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Contato {index + 1}</h4>
                  {formData.subscriber.contacts.length > 1 && (
                    <Button
                      onClick={() => removeContact(contact.id)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nome</Label>
                    <Input
                      className="h-11"
                      value={contact.name}
                      onChange={(e) => {
                        const updatedContacts = formData.subscriber.contacts.map(c =>
                          c.id === contact.id ? { ...c, name: e.target.value } : c
                        );
                        setFormData(prev => ({
                          ...prev,
                          subscriber: { ...prev.subscriber, contacts: updatedContacts }
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                    <Input
                      className="h-11"
                      value={contact.phone}
                      onChange={(e) => {
                        const updatedContacts = formData.subscriber.contacts.map(c =>
                          c.id === contact.id ? { ...c, phone: formatPhone(e.target.value) } : c
                        );
                        setFormData(prev => ({
                          ...prev,
                          subscriber: { ...prev.subscriber, contacts: updatedContacts }
                        }));
                      }}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Função</Label>
                    <Input
                      className="h-11"
                      value={contact.role}
                      onChange={(e) => {
                        const updatedContacts = formData.subscriber.contacts.map(c =>
                          c.id === contact.id ? { ...c, role: e.target.value } : c
                        );
                        setFormData(prev => ({
                          ...prev,
                          subscriber: { ...prev.subscriber, contacts: updatedContacts }
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Conta de Energia</CardTitle>
              <p className="text-sm text-gray-500">Informações da unidade consumidora</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800 font-medium">Dados preenchidos automaticamente com base no assinante</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Tipo</Label>
            <RadioGroup 
              value={formData.energyAccount.originalAccount.type} 
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                energyAccount: {
                  ...prev.energyAccount,
                  originalAccount: {
                    ...prev.energyAccount.originalAccount,
                    type: value as 'fisica' | 'juridica'
                  }
                }
              }))}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fisica" id="energia-fisica" />
                <Label htmlFor="energia-fisica" className="font-normal">Pessoa Física</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="juridica" id="energia-juridica" />
                <Label htmlFor="energia-juridica" className="font-normal">Pessoa Jurídica</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">{formData.energyAccount.originalAccount.type === 'fisica' ? 'CPF' : 'CNPJ'} na Conta de Energia</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.cpfCnpj}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      cpfCnpj: formatCpfCnpj(e.target.value)
                    }
                  }
                }))}
                placeholder={formData.energyAccount.originalAccount.type === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Nome na Conta de Energia</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      name: e.target.value
                    }
                  }
                }))}
              />
            </div>
          </div>

          {formData.energyAccount.originalAccount.type === 'fisica' && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Data de Nascimento na Conta de Energia</Label>
              <Input
                type="date"
                className="h-11"
                value={formData.energyAccount.originalAccount.dataNascimento}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      dataNascimento: e.target.value
                    }
                  }
                }))}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">UC - Unidade Consumidora</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.uc}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      uc: e.target.value
                    }
                  }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Número do Parceiro UC</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.numeroParceiroUC}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      numeroParceiroUC: e.target.value
                    }
                  }
                }))}
              />
            </div>
          </div>

          <Separator className="my-6" />
          <h4 className="font-medium text-gray-900 mb-4">Endereço da Conta de Energia</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">CEP</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.cep}
                onChange={(e) => handleCepChange(e.target.value, 'energyAccount')}
                placeholder="00000-000"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Endereço</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.endereco}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, endereco: e.target.value }
                    }
                  }
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Número</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.numero}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, numero: e.target.value }
                    }
                  }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Complemento</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.complemento}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, complemento: e.target.value }
                    }
                  }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Bairro</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.bairro}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, bairro: e.target.value }
                    }
                  }
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Cidade</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.cidade}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, cidade: e.target.value }
                    }
                  }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Estado</Label>
              <Input
                className="h-11"
                value={formData.energyAccount.originalAccount.address.estado}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      address: { ...prev.energyAccount.originalAccount.address, estado: e.target.value }
                    }
                  }
                }))}
              />
            </div>
          </div>

          <Separator className="my-6" />
          <div className="flex items-center space-x-2">
            <Switch
              id="troca-titularidade"
              checked={formData.energyAccount.realizarTrocaTitularidade}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                energyAccount: {
                  ...prev.energyAccount,
                  realizarTrocaTitularidade: checked
                }
              }))}
            />
            <Label htmlFor="troca-titularidade" className="text-sm font-medium text-gray-700">Realizará Troca de Titularidade?</Label>
          </div>

          {formData.energyAccount.realizarTrocaTitularidade && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nova Titularidade da Conta de Energia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo</Label>
                  <RadioGroup 
                    value={formData.energyAccount.newTitularity?.type || 'fisica'} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      energyAccount: {
                        ...prev.energyAccount,
                        newTitularity: {
                          type: value as 'fisica' | 'juridica',
                          cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                          name: prev.energyAccount.newTitularity?.name || '',
                          dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                          uc: prev.energyAccount.newTitularity?.uc || '',
                          numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                          trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                          dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                        }
                      }
                    }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fisica" id="nova-fisica" />
                      <Label htmlFor="nova-fisica" className="font-normal">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="juridica" id="nova-juridica" />
                      <Label htmlFor="nova-juridica" className="font-normal">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">{formData.energyAccount.newTitularity?.type === 'fisica' ? 'CPF' : 'CNPJ'}</Label>
                    <Input
                      className="h-11"
                      value={formData.energyAccount.newTitularity?.cpfCnpj || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        energyAccount: {
                          ...prev.energyAccount,
                          newTitularity: {
                            type: prev.energyAccount.newTitularity?.type || 'fisica',
                            cpfCnpj: formatCpfCnpj(e.target.value),
                            name: prev.energyAccount.newTitularity?.name || '',
                            dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                            uc: prev.energyAccount.newTitularity?.uc || '',
                            numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                            trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                            dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                          }
                        }
                      }))}
                      placeholder={formData.energyAccount.newTitularity?.type === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nome</Label>
                    <Input
                      className="h-11"
                      value={formData.energyAccount.newTitularity?.name || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        energyAccount: {
                          ...prev.energyAccount,
                          newTitularity: {
                            type: prev.energyAccount.newTitularity?.type || 'fisica',
                            cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                            name: e.target.value,
                            dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                            uc: prev.energyAccount.newTitularity?.uc || '',
                            numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                            trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                            dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                          }
                        }
                      }))}
                    />
                  </div>
                </div>

                {formData.energyAccount.newTitularity?.type === 'fisica' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Data de Nascimento</Label>
                    <Input
                      type="date"
                      className="h-11"
                      value={formData.energyAccount.newTitularity?.dataNascimento || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        energyAccount: {
                          ...prev.energyAccount,
                          newTitularity: {
                            type: prev.energyAccount.newTitularity?.type || 'fisica',
                            cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                            name: prev.energyAccount.newTitularity?.name || '',
                            dataNascimento: e.target.value,
                            uc: prev.energyAccount.newTitularity?.uc || '',
                            numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                            trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                            dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                          }
                        }
                      }))}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">UC</Label>
                    <Input
                      className="h-11"
                      value={formData.energyAccount.newTitularity?.uc || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        energyAccount: {
                          ...prev.energyAccount,
                          newTitularity: {
                            type: prev.energyAccount.newTitularity?.type || 'fisica',
                            cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                            name: prev.energyAccount.newTitularity?.name || '',
                            dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                            uc: e.target.value,
                            numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                            trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                            dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Número do Parceiro UC</Label>
                    <Input
                      className="h-11"
                      value={formData.energyAccount.newTitularity?.numeroParceiroUC || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        energyAccount: {
                          ...prev.energyAccount,
                          newTitularity: {
                            type: prev.energyAccount.newTitularity?.type || 'fisica',
                            cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                            name: prev.energyAccount.newTitularity?.name || '',
                            dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                            uc: prev.energyAccount.newTitularity?.uc || '',
                            numeroParceiroUC: e.target.value,
                            trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                            dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                          }
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="troca-concluida"
                    checked={formData.energyAccount.newTitularity?.trocaConcluida || false}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      energyAccount: {
                        ...prev.energyAccount,
                        newTitularity: {
                          type: prev.energyAccount.newTitularity?.type || 'fisica',
                          cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                          name: prev.energyAccount.newTitularity?.name || '',
                          dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                          uc: prev.energyAccount.newTitularity?.uc || '',
                          numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                          trocaConcluida: checked,
                          dataTroca: prev.energyAccount.newTitularity?.dataTroca || '',
                        }
                      }
                    }))}
                  />
                  <Label htmlFor="troca-concluida" className="text-sm font-medium text-gray-700">Troca de Titularidade Concluída</Label>
                </div>

                {formData.energyAccount.newTitularity?.trocaConcluida && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Data da Troca</Label>
                      <Input
                        type="date"
                        className="h-11"
                        value={formData.energyAccount.newTitularity?.dataTroca || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          energyAccount: {
                            ...prev.energyAccount,
                            newTitularity: {
                              type: prev.energyAccount.newTitularity?.type || 'fisica',
                              cpfCnpj: prev.energyAccount.newTitularity?.cpfCnpj || '',
                              name: prev.energyAccount.newTitularity?.name || '',
                              dataNascimento: prev.energyAccount.newTitularity?.dataNascimento || '',
                              uc: prev.energyAccount.newTitularity?.uc || '',
                              numeroParceiroUC: prev.energyAccount.newTitularity?.numeroParceiroUC || '',
                              trocaConcluida: prev.energyAccount.newTitularity?.trocaConcluida || false,
                              dataTroca: e.target.value,
                            }
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Protocolo de Troca de Titularidade</Label>
                      <Input type="file" className="h-11" accept=".pdf,.doc,.docx" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Contratação do Plano</CardTitle>
              <p className="text-sm text-gray-500">Configurações e detalhes do plano</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Modalidade de Compensação</Label>
              <Select 
                value={formData.planContract.modalidadeCompensacao} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  planContract: { ...prev.planContract, modalidadeCompensacao: value as 'autoconsumo' | 'geracaoCompartilhada' }
                }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                  <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Data de Adesão</Label>
              <Input
                type="date"
                className="h-11"
                value={formData.planContract.dataAdesao}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  planContract: { ...prev.planContract, dataAdesao: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">kWh Vendedor Informou</Label>
              <Input
                type="number"
                className="h-11"
                value={formData.planContract.kwhVendedor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  planContract: { ...prev.planContract, kwhVendedor: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">kWh Contratado</Label>
              <Input
                type="number"
                className="h-11"
                value={formData.planContract.kwhContratado}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  planContract: { ...prev.planContract, kwhContratado: Number(e.target.value) }
                }))}
              />
            </div>
          </div>

          <PlanTable
            selectedPlan={formData.planContract.faixaConsumo}
            fidelidade={formData.planContract.fidelidade}
            anosFidelidade={formData.planContract.anosFidelidade}
            onPlanChange={(faixaConsumo, fidelidade, anos, desconto) => {
              setFormData(prev => ({
                ...prev,
                planContract: {
                  ...prev.planContract,
                  faixaConsumo: faixaConsumo as any,
                  fidelidade,
                  anosFidelidade: anos,
                  desconto: desconto || 13
                }
              }));
            }}
          />

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Detalhes do Plano</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Cliente Paga PIS e COFINS</Label>
                <Switch
                  checked={formData.planDetails.clientePagaPisCofins}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    planDetails: { ...prev.planDetails, clientePagaPisCofins: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Cliente Paga Fio B</Label>
                <Switch
                  checked={formData.planDetails.clientePagaFioB}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    planDetails: { ...prev.planDetails, clientePagaFioB: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Adicionar Valor da Distribuidora na Fatura</Label>
                <Switch
                  checked={formData.planDetails.adicionarValorDistribuidora}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    planDetails: { ...prev.planDetails, adicionarValorDistribuidora: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Assinante ISENTO de pagamento das Faturas de Energia?</Label>
                <Switch
                  checked={formData.planDetails.assinanteIsento}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    planDetails: { ...prev.planDetails, assinanteIsento: checked }
                  }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Configurações de Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Enviar por WhatsApp Faturas de Energia?</Label>
                <Switch
                  checked={formData.notifications.whatsappFaturas}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, whatsappFaturas: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Informar por WhatsApp Pagamento Recebido</Label>
                <Switch
                  checked={formData.notifications.whatsappPagamento}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, whatsappPagamento: checked }
                  }))}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Configurações avançadas de notificações:</strong> Por padrão, todas as notificações antes do vencimento e de cobrança vencida estão ativadas para WhatsApp e E-mail. Essas configurações podem ser ajustadas posteriormente na edição do assinante.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Anexos</CardTitle>
              <p className="text-sm text-gray-500">Documentos necessários para o cadastro</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <Label className="text-sm font-medium text-gray-700 block mb-2">Contrato do Assinante assinado</Label>
              <Input type="file" className="h-11" accept=".pdf,.doc,.docx" />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <Label className="text-sm font-medium text-gray-700 block mb-2">CNH do assinante</Label>
              <Input type="file" className="h-11" accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <Label className="text-sm font-medium text-gray-700 block mb-2">Conta do assinante</Label>
              <Input type="file" className="h-11" accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            {formData.subscriber.type === 'juridica' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <Label className="text-sm font-medium text-gray-700 block mb-2">Contrato Social</Label>
                <Input type="file" className="h-11" accept=".pdf,.doc,.docx" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Dados do Assinante';
      case 2: return 'Conta de Energia';
      case 3: return 'Plano e Configurações';
      case 4: return 'Anexos';
      default: return '';
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return User;
      case 2: return CreditCard;
      case 3: return FileText;
      case 4: return Upload;
      default: return User;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Assinante</h1>
              <p className="text-gray-600">Cadastre um novo assinante no sistema</p>
            </div>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
              const StepIcon = getStepIcon(step);
              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              Etapa {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="h-11 px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="h-11 px-6 bg-blue-600 hover:bg-blue-700">
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="h-11 px-8 bg-green-600 hover:bg-green-700">
              Finalizar Cadastro
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovoAssinante;
