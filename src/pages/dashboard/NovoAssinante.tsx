
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Users, FileText, Settings, Bell, Upload } from 'lucide-react';
import { SubscriberFormData, Contact } from '@/types/subscriber';
import AddressForm from '@/components/forms/AddressForm';
import ContactsForm from '@/components/forms/ContactsForm';

const NovoAssinante = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subscriberType, setSubscriberType] = useState<'fisica' | 'juridica'>('fisica');
  const [originalAccountType, setOriginalAccountType] = useState<'fisica' | 'juridica'>('fisica');
  const [newAccountType, setNewAccountType] = useState<'fisica' | 'juridica'>('fisica');
  const [realizarTroca, setRealizarTroca] = useState(false);
  const [fidelidade, setFidelidade] = useState<'sem' | 'com'>('sem');
  const [faixaConsumo, setFaixaConsumo] = useState<string>('400-599');
  const [contacts, setContacts] = useState<Contact[]>([]);

  const form = useForm<SubscriberFormData>({
    defaultValues: {
      concessionaria: 'Equatorial Goiás',
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
    },
  });

  const steps = [
    { id: 1, title: 'Dados do Assinante', icon: Users },
    { id: 2, title: 'Conta de Energia', icon: FileText },
    { id: 3, title: 'Plano e Contrato', icon: Settings },
    { id: 4, title: 'Notificações', icon: Bell },
    { id: 5, title: 'Anexos', icon: Upload },
  ];

  const getDiscountOptions = (faixaConsumo: string, fidelidade: 'sem' | 'com') => {
    const discountMap = {
      '400-599': { sem: 13, com: { '1': 15, '2': 20 } },
      '600-1099': { sem: 15, com: { '1': 18, '2': 20 } },
      '1100-3099': { sem: 18, com: { '1': 20, '2': 22 } },
      '3100-7000': { sem: 20, com: { '1': 22, '2': 25 } },
      '7000+': { sem: 22, com: { '1': 25, '2': 27 } },
    };

    return discountMap[faixaConsumo as keyof typeof discountMap] || discountMap['400-599'];
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = (data: SubscriberFormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
    navigate('/dashboard/assinantes');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Concessionária */}
            <FormField
              control={form.control}
              name="concessionaria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concessionária</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a concessionária" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Equatorial Goiás">Equatorial Goiás</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Assinante */}
            <FormField
              control={form.control}
              name="subscriber.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Assinante</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSubscriberType(value as 'fisica' | 'juridica');
                      }}
                      defaultValue={field.value}
                      className="flex space-x-6"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dados do Assinante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subscriber.cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{subscriberType === 'fisica' ? 'CPF' : 'CNPJ'}</FormLabel>
                    <FormControl>
                      <Input placeholder={subscriberType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriber.numeroParceiroNegocio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Parceiro de Negócio</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriber.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{subscriberType === 'fisica' ? 'Nome Completo' : 'Razão Social'}</FormLabel>
                    <FormControl>
                      <Input placeholder={subscriberType === 'fisica' ? 'Nome completo' : 'Razão social'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {subscriberType === 'fisica' && (
                <>
                  <FormField
                    control={form.control}
                    name="subscriber.dataNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriber.estadoCivil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriber.profissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Profissão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {subscriberType === 'juridica' && (
                <FormField
                  control={form.control}
                  name="subscriber.nomeFantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome fantasia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="subscriber.telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriber.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Endereço */}
            <AddressForm form={form} prefix="subscriber.address" title="Endereço" />

            {/* Observações */}
            <FormField
              control={form.control}
              name="subscriber.observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contatos */}
            <ContactsForm contacts={contacts} onChange={setContacts} />

            {/* Dados do Administrador (apenas PJ) */}
            {subscriberType === 'juridica' && (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Dados do Administrador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="administrator.cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF do Administrador</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Administrador</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão</FormLabel>
                          <FormControl>
                            <Input placeholder="Profissão" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="administrator.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <AddressForm form={form} prefix="administrator.address" title="Endereço Residencial" />
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Cadastro Original da Conta */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Cadastro Original da Conta de Energia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de Pessoa na Conta</Label>
                    <RadioGroup
                      onValueChange={(value) => setOriginalAccountType(value as 'fisica' | 'juridica')}
                      defaultValue={originalAccountType}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fisica" id="original-fisica" />
                        <Label htmlFor="original-fisica">Pessoa Física</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="juridica" id="original-juridica" />
                        <Label htmlFor="original-juridica">Pessoa Jurídica</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="energyAccount.originalAccount.cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{originalAccountType === 'fisica' ? 'CPF' : 'CNPJ'} na Conta</FormLabel>
                          <FormControl>
                            <Input placeholder={originalAccountType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="energyAccount.originalAccount.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome na Conta de Energia</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome na conta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {originalAccountType === 'fisica' && (
                      <FormField
                        control={form.control}
                        name="energyAccount.originalAccount.dataNascimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento na Conta</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="energyAccount.uc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UC - Unidade Consumidora</FormLabel>
                          <FormControl>
                            <Input placeholder="00000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="energyAccount.numeroParceiroUC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Parceiro</FormLabel>
                          <FormControl>
                            <Input placeholder="000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <AddressForm form={form} prefix="energyAccount.originalAccount.address" title="Endereço da UC" />
                </div>
              </CardContent>
            </Card>

            {/* Troca de Titularidade */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Troca de Titularidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Realizará Troca de Titularidade?</Label>
                  <RadioGroup
                    onValueChange={(value) => setRealizarTroca(value === 'sim')}
                    defaultValue={realizarTroca ? 'sim' : 'nao'}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="troca-sim" />
                      <Label htmlFor="troca-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="troca-nao" />
                      <Label htmlFor="troca-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                {realizarTroca && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900">Nova Titularidade da Conta de Energia</h4>
                    
                    <div>
                      <Label>Tipo de Pessoa</Label>
                      <RadioGroup
                        onValueChange={(value) => setNewAccountType(value as 'fisica' | 'juridica')}
                        defaultValue={newAccountType}
                        className="flex space-x-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fisica" id="new-fisica" />
                          <Label htmlFor="new-fisica">Pessoa Física</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="juridica" id="new-juridica" />
                          <Label htmlFor="new-juridica">Pessoa Jurídica</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="energyAccount.newTitularity.cpfCnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{newAccountType === 'fisica' ? 'CPF' : 'CNPJ'} Nova Conta</FormLabel>
                            <FormControl>
                              <Input placeholder={newAccountType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="energyAccount.newTitularity.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Nova Conta</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome na nova conta" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {newAccountType === 'fisica' && (
                        <FormField
                          control={form.control}
                          name="energyAccount.newTitularity.dataNascimento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Nascimento</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Troca de Titularidade Concluída?</Label>
                        <RadioGroup className="flex space-x-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sim" id="concluida-sim" />
                            <Label htmlFor="concluida-sim">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nao" id="concluida-nao" />
                            <Label htmlFor="concluida-nao">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <FormField
                        control={form.control}
                        name="energyAccount.newTitularity.dataTroca"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data da Troca (se concluída)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Contratação do Plano */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Contratação Plano Escolhido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="planContract.modalidadeCompensacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modalidade de Compensação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                            <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planContract.dataAdesao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Adesão</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planContract.kwhVendedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>kWh Vendedor Informou</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planContract.kwhContratado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>kWh Contratado</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Faixa de Consumo</Label>
                    <RadioGroup
                      onValueChange={(value) => setFaixaConsumo(value)}
                      defaultValue={faixaConsumo}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="400-599" id="faixa1" />
                        <Label htmlFor="faixa1">400 kWh a 599 kWh</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="600-1099" id="faixa2" />
                        <Label htmlFor="faixa2">600 kWh a 1099 kWh</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1100-3099" id="faixa3" />
                        <Label htmlFor="faixa3">1100 kWh a 3099 kWh</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3100-7000" id="faixa4" />
                        <Label htmlFor="faixa4">3100 kWh a 7000 kWh</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="7000+" id="faixa5" />
                        <Label htmlFor="faixa5">Maior que 7000 kWh</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Tipo de Fidelidade</Label>
                    <RadioGroup
                      onValueChange={(value) => setFidelidade(value as 'sem' | 'com')}
                      defaultValue={fidelidade}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sem" id="sem-fidelidade" />
                        <Label htmlFor="sem-fidelidade">
                          Sem Fidelidade - {getDiscountOptions(faixaConsumo, 'sem').sem}% Desconto
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="com" id="com-fidelidade" />
                        <Label htmlFor="com-fidelidade">Com Fidelidade</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {fidelidade === 'com' && (
                    <div className="ml-6">
                      <Label>Anos de Fidelidade</Label>
                      <RadioGroup className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="1ano" />
                          <Label htmlFor="1ano">
                            1 Ano - {getDiscountOptions(faixaConsumo, 'com')['1']}% Desconto
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="2anos" />
                          <Label htmlFor="2anos">
                            2 Anos - {getDiscountOptions(faixaConsumo, 'com')['2']}% Desconto
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes do Plano */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Cliente Paga PIS e COFINS</Label>
                    <RadioGroup defaultValue="sim" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="pis-sim" />
                        <Label htmlFor="pis-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="pis-nao" />
                        <Label htmlFor="pis-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Cliente Paga Fio B</Label>
                    <RadioGroup defaultValue="nao" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="fiob-sim" />
                        <Label htmlFor="fiob-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="fiob-nao" />
                        <Label htmlFor="fiob-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Adicionar Valor da Distribuidora na Fatura</Label>
                    <RadioGroup defaultValue="nao" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="dist-sim" />
                        <Label htmlFor="dist-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="dist-nao" />
                        <Label htmlFor="dist-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Assinante ISENTO de pagamento das Faturas de Energia?</Label>
                    <RadioGroup defaultValue="nao" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="isento-sim" />
                        <Label htmlFor="isento-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="isento-nao" />
                        <Label htmlFor="isento-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Cadência de Mensagens */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Cadência de Mensagens (WhatsApp e E-Mail)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enviar por WhatsApp Faturas de Energia?</Label>
                    <RadioGroup defaultValue="sim" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="whats-faturas-sim" />
                        <Label htmlFor="whats-faturas-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="whats-faturas-nao" />
                        <Label htmlFor="whats-faturas-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Informar por WhatsApp Pagamento Recebido</Label>
                    <RadioGroup defaultValue="nao" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="whats-pag-sim" />
                        <Label htmlFor="whats-pag-sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="whats-pag-nao" />
                        <Label htmlFor="whats-pag-nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Notificações antes do vencimento:</h4>
                  
                  {[
                    { key: 'criarCobranca', label: 'Ao Criar Nova Cobrança' },
                    { key: 'alteracaoValor', label: 'Alteração de Valor ou na Data de Vencimento' },
                    { key: 'vencimento1Dia', label: 'Aviso do Vencimento 1 dia antes' },
                    { key: 'vencimentoHoje', label: 'Aviso do Vencimento hoje no dia do vencimento' },
                  ].map((item) => (
                    <div key={item.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 border-b border-gray-100">
                      <Label className="text-sm">{item.label}</Label>
                      <div className="flex items-center space-x-4">
                        <Label className="text-xs text-gray-600">WhatsApp:</Label>
                        <RadioGroup defaultValue="sim" className="flex space-x-2">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="sim" id={`${item.key}-whats-sim`} />
                            <Label htmlFor={`${item.key}-whats-sim`} className="text-xs">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="nao" id={`${item.key}-whats-nao`} />
                            <Label htmlFor={`${item.key}-whats-nao`} className="text-xs">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Label className="text-xs text-gray-600">E-Mail:</Label>
                        <RadioGroup defaultValue="sim" className="flex space-x-2">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="sim" id={`${item.key}-email-sim`} />
                            <Label htmlFor={`${item.key}-email-sim`} className="text-xs">Sim</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="nao" id={`${item.key}-email-nao`} />
                            <Label htmlFor={`${item.key}-email-nao`} className="text-xs">Não</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notificações de Cobranças Vencidas */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Notificações de cobranças vencidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'day1', label: 'Aviso Cobrança Vencida a 1 dia após o vencimento' },
                  { key: 'day3', label: 'Aviso Cobrança Vencida 3 dias após o vencimento' },
                  { key: 'day5', label: 'Aviso Cobrança Vencida 5 dias após o vencimento' },
                  { key: 'day7', label: 'Aviso Cobrança Vencida 7 dias após o vencimento' },
                  { key: 'day15', label: 'Aviso Cobrança Vencida 15 dias após o vencimento' },
                  { key: 'day20', label: 'Aviso Cobrança Vencida 20 dias após o vencimento' },
                  { key: 'day25', label: 'Aviso Cobrança Vencida 25 dia após o vencimento' },
                  { key: 'day30', label: 'Aviso Cobrança Vencida 30 dia após o vencimento' },
                  { key: 'after30', label: 'Aviso Cobrança Vencida após 30 dias de 5 em 5 dias' },
                ].map((item) => (
                  <div key={item.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 border-b border-gray-100">
                    <Label className="text-sm">{item.label}</Label>
                    <div className="flex items-center space-x-4">
                      <Label className="text-xs text-gray-600">WhatsApp:</Label>
                      <RadioGroup defaultValue="sim" className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="sim" id={`${item.key}-whats-sim`} />
                          <Label htmlFor={`${item.key}-whats-sim`} className="text-xs">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="nao" id={`${item.key}-whats-nao`} />
                          <Label htmlFor={`${item.key}-whats-nao`} className="text-xs">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label className="text-xs text-gray-600">E-Mail:</Label>
                      <RadioGroup defaultValue="sim" className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="sim" id={`${item.key}-email-sim`} />
                          <Label htmlFor={`${item.key}-email-sim`} className="text-xs">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="nao" id={`${item.key}-email-nao`} />
                          <Label htmlFor={`${item.key}-email-nao`} className="text-xs">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Anexos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contrato do Assinante assinado</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>

                  <div className="space-y-2">
                    <Label>CNH do assinante</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>

                  <div className="space-y-2">
                    <Label>Conta do assinante</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>

                  {subscriberType === 'juridica' && (
                    <div className="space-y-2">
                      <Label>Contrato Social</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  )}

                  {realizarTroca && (
                    <div className="space-y-2">
                      <Label>Procuração (para troca de titularidade)</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/assinantes')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Novo Assinante
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Cadastre um novo assinante no sistema
              </p>
            </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep === step.id
                          ? 'bg-blue-600 text-white'
                          : currentStep > step.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-gray-200 mx-2 sm:mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl">
                  {steps.find(s => s.id === currentStep)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex gap-2 order-1 sm:order-2">
                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep}>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Cadastrar Assinante
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default NovoAssinante;
