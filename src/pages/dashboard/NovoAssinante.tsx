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
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload } from 'lucide-react';
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
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Informações do Assinante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Concessionária e Tipo */}
          <div className="space-y-4">
            <div>
              <Label>Concessionária</Label>
              <Select value={formData.concessionaria} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equatorial Goiás">Equatorial Goiás</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de Assinante</Label>
              <RadioGroup 
                value={formData.subscriber.type} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, type: value as 'fisica' | 'juridica' }
                }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="fisica" />
                  <Label htmlFor="fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Dados Pessoais/Empresariais */}
          <Separator />
          <h3 className="font-semibold text-gray-700">
            {formData.subscriber.type === 'fisica' ? 'Dados Pessoais' : 'Dados da Empresa'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{formData.subscriber.type === 'fisica' ? 'CPF' : 'CNPJ'}</Label>
              <Input
                value={formData.subscriber.cpfCnpj}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, cpfCnpj: formatCpfCnpj(e.target.value) }
                }))}
                placeholder={formData.subscriber.type === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </div>
            <div>
              <Label>Número Parceiro de Negócio</Label>
              <Input
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
                <Label>Nome Completo</Label>
                <Input
                  value={formData.subscriber.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscriber: { ...prev.subscriber, name: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.subscriber.dataNascimento}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subscriber: { ...prev.subscriber, dataNascimento: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>Estado Civil</Label>
                  <Select 
                    value={formData.subscriber.estadoCivil} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      subscriber: { ...prev.subscriber, estadoCivil: value }
                    }))}
                  >
                    <SelectTrigger>
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
                  <Label>Profissão</Label>
                  <Input
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
                  <Label>Razão Social</Label>
                  <Input
                    value={formData.subscriber.razaoSocial}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subscriber: { ...prev.subscriber, razaoSocial: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>Nome Fantasia</Label>
                  <Input
                    value={formData.subscriber.nomeFantasia}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subscriber: { ...prev.subscriber, nomeFantasia: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Dados do Administrador */}
              <Separator />
              <h4 className="font-medium text-gray-600">Dados do Administrador</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>CPF do Administrador</Label>
                  <Input
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
                  <Label>Nome do Administrador</Label>
                  <Input
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
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
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
                  <Label>Estado Civil</Label>
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
                    <SelectTrigger>
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
                  <Label>Profissão</Label>
                  <Input
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

          {/* Endereço Principal */}
          <Separator />
          <h3 className="font-semibold text-gray-700">Endereço Principal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>CEP</Label>
              <Input
                value={formData.subscriber.address.cep}
                onChange={(e) => handleCepChange(e.target.value, 'subscriber')}
                placeholder="00000-000"
                disabled={cepLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Endereço</Label>
              <Input
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
              <Label>Número</Label>
              <Input
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
              <Label>Complemento</Label>
              <Input
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
              <Label>Bairro</Label>
              <Input
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
              <Label>Cidade</Label>
              <Input
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
              <Label>Estado</Label>
              <Input
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

          {/* Contato Principal */}
          <Separator />
          <h3 className="font-semibold text-gray-700">Contato Principal</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.subscriber.telefone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, telefone: formatPhone(e.target.value) }
                }))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={formData.subscriber.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  subscriber: { ...prev.subscriber, email: e.target.value }
                }))}
              />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={formData.subscriber.observacoes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                subscriber: { ...prev.subscriber, observacoes: e.target.value }
              }))}
              rows={3}
            />
          </div>

          {/* Contatos Adicionais para Cobrança */}
          <Separator />
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Contatos Adicionais para Cobrança</h3>
            <Button onClick={addContact} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </div>

          {formData.subscriber.contacts.map((contact, index) => (
            <div key={contact.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contato {index + 1}</h4>
                {formData.subscriber.contacts.length > 1 && (
                  <Button
                    onClick={() => removeContact(contact.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input
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
                  <Label>Telefone</Label>
                  <Input
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
                  <Label>Função</Label>
                  <Input
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
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Conta de Energia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Titularidade</Label>
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
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="tipo-fisica" />
                  <Label htmlFor="tipo-fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="tipo-juridica" />
                  <Label htmlFor="tipo-juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>CPF/CNPJ</Label>
              <Input
                value={formData.energyAccount.originalAccount.cpfCnpj}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  energyAccount: {
                    ...prev.energyAccount,
                    originalAccount: {
                      ...prev.energyAccount.originalAccount,
                      cpfCnpj: e.target.value
                    }
                  }
                }))}
              />
            </div>
          </div>

          <div>
            <Label>Nome</Label>
            <Input
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

          <div>
            <Label>Data de Nascimento</Label>
            <Input
              type="date"
              value={formData.energyAccount.originalAccount.dataNascimento || ''}
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

          <div>
            <Label>Unidade Consumidora (UC)</Label>
            <Input
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
            <Label>Número Parceiro UC</Label>
            <Input
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

          <Separator />
          <h4 className="font-semibold text-gray-700">Endereço da UC</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>CEP</Label>
              <Input
                value={formData.energyAccount.originalAccount.address.cep}
                onChange={(e) => handleCepChange(e.target.value, 'energyAccount')}
                placeholder="00000-000"
                disabled={cepLoading}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Endereço</Label>
              <Input
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
              <Label>Número</Label>
              <Input
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
              <Label>Complemento</Label>
              <Input
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
              <Label>Bairro</Label>
              <Input
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
              <Label>Cidade</Label>
              <Input
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
              <Label>Estado</Label>
              <Input
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

          <Separator />
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.energyAccount.realizarTrocaTitularidade}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                energyAccount: {
                  ...prev.energyAccount,
                  realizarTrocaTitularidade: checked
                }
              }))}
              id="troca-titularidade"
            />
            <Label htmlFor="troca-titularidade" className="cursor-pointer">
              Realizar Troca de Titularidade
            </Label>
          </div>

          {formData.energyAccount.realizarTrocaTitularidade && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <h4 className="font-semibold text-gray-700">Novo Titular</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <RadioGroup
                    value={formData.energyAccount.newTitularity?.type || 'fisica'}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      energyAccount: {
                        ...prev.energyAccount,
                        newTitularity: {
                          ...(prev.energyAccount.newTitularity || {}),
                          type: value as 'fisica' | 'juridica'
                        }
                      }
                    }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fisica" id="new-titular-fisica" />
                      <Label htmlFor="new-titular-fisica">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="juridica" id="new-titular-juridica" />
                      <Label htmlFor="new-titular-juridica">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>CPF/CNPJ</Label>
                  <Input
                    value={formData.energyAccount.newTitularity?.cpfCnpj || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      energyAccount: {
                        ...prev.energyAccount,
                        newTitularity: {
                          ...(prev.energyAccount.newTitularity || {}),
                          cpfCnpj: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Nome</Label>
                <Input
                  value={formData.energyAccount.newTitularity?.name || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        name: e.target.value
                      }
                    }
                  }))}
                />
              </div>

              <div>
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={formData.energyAccount.newTitularity?.dataNascimento || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        dataNascimento: e.target.value
                      }
                    }
                  }))}
                />
              </div>

              <div>
                <Label>UC</Label>
                <Input
                  value={formData.energyAccount.newTitularity?.uc || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        uc: e.target.value
                      }
                    }
                  }))}
                />
              </div>

              <div>
                <Label>Número Parceiro UC</Label>
                <Input
                  value={formData.energyAccount.newTitularity?.numeroParceiroUC || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        numeroParceiroUC: e.target.value
                      }
                    }
                  }))}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.energyAccount.newTitularity?.trocaConcluida || false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        trocaConcluida: checked
                      }
                    }
                  }))}
                  id="troca-concluida"
                />
                <Label htmlFor="troca-concluida" className="cursor-pointer">
                  Troca Concluída
                </Label>
              </div>

              <div>
                <Label>Data da Troca</Label>
                <Input
                  type="date"
                  value={formData.energyAccount.newTitularity?.dataTroca || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    energyAccount: {
                      ...prev.energyAccount,
                      newTitularity: {
                        ...(prev.energyAccount.newTitularity || {}),
                        dataTroca: e.target.value
                      }
                    }
                  }))}
                />
              </div>

              <div>
                <Label>Anexar Protocolo</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : undefined;
                    setFormData(prev => ({
                      ...prev,
                      energyAccount: {
                        ...prev.energyAccount,
                        newTitularity: {
                          ...(prev.energyAccount.newTitularity || {}),
                          protocoloAnexo: file
                        }
                      }
                    }));
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Plano e Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Modalidade de Compensação</Label>
            <Select
              value={formData.planContract.modalidadeCompensacao}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                planContract: { ...prev.planContract, modalidadeCompensacao: value as 'autoconsumo' | 'geracaoCompartilhada' }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="autoconsumo">Autoconsumo</SelectItem>
                <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data de Adesão</Label>
            <Input
              type="date"
              value={formData.planContract.dataAdesao}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                planContract: { ...prev.planContract, dataAdesao: e.target.value }
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>kWh Vendedor</Label>
              <Input
                type="number"
                value={formData.planContract.kwhVendedor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  planContract: { ...prev.planContract, kwhVendedor: Number(e.target.value) }
                }))}
              />
            </div>
            <div>
              <Label>kWh Contratado</Label>
              <Input
                type="number"
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
                  faixaConsumo,
                  fidelidade,
                  anosFidelidade: anos,
                  desconto: desconto || prev.planContract.desconto,
                }
              }));
            }}
          />

          <Separator />
          <h4 className="font-semibold text-gray-700">Detalhes do Plano</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.planDetails.clientePagaPisCofins}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  planDetails: { ...prev.planDetails, clientePagaPisCofins: checked }
                }))}
                id="cliente-paga-pis-cofins"
              />
              <Label htmlFor="cliente-paga-pis-cofins" className="cursor-pointer">
                Cliente Paga PIS/COFINS
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.planDetails.clientePagaFioB}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  planDetails: { ...prev.planDetails, clientePagaFioB: checked }
                }))}
                id="cliente-paga-fio-b"
              />
              <Label htmlFor="cliente-paga-fio-b" className="cursor-pointer">
                Cliente Paga Fio B
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.planDetails.adicionarValorDistribuidora}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  planDetails: { ...prev.planDetails, adicionarValorDistribuidora: checked }
                }))}
                id="adicionar-valor-distribuidora"
              />
              <Label htmlFor="adicionar-valor-distribuidora" className="cursor-pointer">
                Adicionar Valor Distribuidora
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.planDetails.assinanteIsento}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  planDetails: { ...prev.planDetails, assinanteIsento: checked }
                }))}
                id="assinante-isento"
              />
              <Label htmlFor="assinante-isento" className="cursor-pointer">
                Assinante Isento
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Anexos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Contrato</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setFormData(prev => ({
                  ...prev,
                  attachments: { ...prev.attachments, contrato: file }
                }));
              }}
            />
          </div>

          <div>
            <Label>CNH</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setFormData(prev => ({
                  ...prev,
                  attachments: { ...prev.attachments, cnh: file }
                }));
              }}
            />
          </div>

          <div>
            <Label>Conta</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setFormData(prev => ({
                  ...prev,
                  attachments: { ...prev.attachments, conta: file }
                }));
              }}
            />
          </div>

          <div>
            <Label>Contrato Social</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setFormData(prev => ({
                  ...prev,
                  attachments: { ...prev.attachments, contratoSocial: file }
                }));
              }}
            />
          </div>

          <div>
            <Label>Procuração</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setFormData(prev => ({
                  ...prev,
                  attachments: { ...prev.attachments, procuracao: file }
                }));
              }}
            />
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Assinante</h1>
        <p className="text-gray-600">Cadastre um novo assinante no sistema</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-full h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-200">
            Etapa {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
          </Badge>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Finalizar Cadastro
          </Button>
        )}
      </div>
    </div>
  );
};

export default NovoAssinante;
