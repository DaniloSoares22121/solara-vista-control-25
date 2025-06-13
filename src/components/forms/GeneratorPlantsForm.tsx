import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MaskedInput } from '@/components/ui/masked-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import AddressForm from './AddressForm';
import { Plus, Trash2, Calculator, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';
import { useGeneratorCalculations } from '@/hooks/useGeneratorCalculations';
import { useGeneratorValidations } from '@/hooks/useGeneratorValidations';

interface GeneratorPlantsFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorPlantsForm = ({ form }: GeneratorPlantsFormProps) => {
  const { fields: plantFields, append: appendPlant, remove: removePlant } = useFieldArray({
    control: form.control,
    name: "plants"
  });

  const { 
    calculateTotalPower, 
    calculateInverterTotalPower, 
    estimateGeneration, 
    suggestPlantType,
    validateInverterCompatibility 
  } = useGeneratorCalculations();
  const { validateUC } = useGeneratorValidations();
  const concessionaria = form.watch('concessionaria');

  const addPlant = () => {
    const owner = form.getValues('owner');
    console.log('🌱 [PLANTS FORM] Adicionando nova usina com automações');
    
    const newPlant = {
      apelido: '',
      uc: '',
      tipoUsina: 'micro' as const,
      modalidadeCompensacao: 'autoconsumo' as const,
      ownerType: owner.type || 'fisica',
      ownerCpfCnpj: owner.cpfCnpj || '',
      ownerName: owner.name || '',
      ownerDataNascimento: owner.dataNascimento || '',
      ownerNumeroParceiroNegocio: owner.numeroParceiroNegocio || '',
      address: {
        cep: owner.address?.cep || '',
        endereco: owner.address?.endereco || '',
        numero: owner.address?.numero || '',
        complemento: owner.address?.complemento || '',
        bairro: owner.address?.bairro || '',
        cidade: owner.address?.cidade || '',
        estado: owner.address?.estado || '',
      },
      contacts: owner.name ? [{
        nome: owner.name,
        telefone: owner.telefone || '',
        funcao: 'Proprietário'
      }] : [],
      observacoes: '',
      marcaModulo: '',
      potenciaModulo: 580, // Sugestão automática para 2024
      quantidadeModulos: 0, // Changed from empty string to 0
      potenciaTotalUsina: 0,
      inversores: [{
        marca: '',
        potencia: 0, // Changed from empty string to 0
        quantidade: 0, // Changed from empty string to 0
      }],
      potenciaTotalInversores: 0,
      geracaoProjetada: 0,
      observacoesInstalacao: '',
    };

    appendPlant(newPlant);
  };

  // Adicionar primeira usina automaticamente
  useEffect(() => {
    if (plantFields.length === 0) {
      console.log('📋 [PLANTS FORM] Adicionando primeira usina automaticamente');
      addPlant();
    }
  }, [plantFields.length]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Dados das Usinas</h3>
        </div>
        <Button 
          type="button" 
          onClick={addPlant}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usina
        </Button>
      </div>

      {plantFields.map((field, plantIndex) => (
        <PlantForm 
          key={field.id}
          form={form}
          plantIndex={plantIndex}
          onRemove={() => removePlant(plantIndex)}
          canRemove={plantFields.length > 1}
          concessionaria={concessionaria}
        />
      ))}
    </div>
  );
};

interface PlantFormProps {
  form: UseFormReturn<GeneratorFormData>;
  plantIndex: number;
  onRemove: () => void;
  canRemove: boolean;
  concessionaria: string;
}

const PlantForm = ({ form, plantIndex, onRemove, canRemove, concessionaria }: PlantFormProps) => {
  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: `plants.${plantIndex}.contacts`
  });

  const { fields: inverterFields, append: appendInverter, remove: removeInverter } = useFieldArray({
    control: form.control,
    name: `plants.${plantIndex}.inversores`
  });

  const { 
    calculateTotalPower, 
    calculateInverterTotalPower, 
    estimateGeneration, 
    suggestPlantType,
    validateInverterCompatibility 
  } = useGeneratorCalculations();
  const { validateUC } = useGeneratorValidations();

  const ownerType = form.watch(`plants.${plantIndex}.ownerType`);
  const potenciaModulo = form.watch(`plants.${plantIndex}.potenciaModulo`);
  const quantidadeModulos = form.watch(`plants.${plantIndex}.quantidadeModulos`);
  const potenciaTotalUsina = form.watch(`plants.${plantIndex}.potenciaTotalUsina`);
  const potenciaTotalInversores = form.watch(`plants.${plantIndex}.potenciaTotalInversores`);
  const inversores = form.watch(`plants.${plantIndex}.inversores`) || [];
  const uc = form.watch(`plants.${plantIndex}.uc`);
  const geracaoProjetada = form.watch(`plants.${plantIndex}.geracaoProjetada`);
  const estado = form.watch(`plants.${plantIndex}.address.estado`);

  // Cálculos automáticos em tempo real
  useEffect(() => {
    if (potenciaModulo && quantidadeModulos) {
      const total = calculateTotalPower(Number(potenciaModulo), Number(quantidadeModulos));
      if (total !== potenciaTotalUsina) {
        form.setValue(`plants.${plantIndex}.potenciaTotalUsina`, total);
        
        // Sugerir tipo de usina
        const tipo = suggestPlantType(total);
        form.setValue(`plants.${plantIndex}.tipoUsina`, tipo);
      }
    }
  }, [potenciaModulo, quantidadeModulos, form, plantIndex, calculateTotalPower, suggestPlantType]);

  useEffect(() => {
    if (inversores && inversores.length > 0) {
      const total = calculateInverterTotalPower(inversores);
      if (total !== potenciaTotalInversores) {
        form.setValue(`plants.${plantIndex}.potenciaTotalInversores`, total);
      }
    }
  }, [inversores, form, plantIndex, calculateInverterTotalPower]);

  useEffect(() => {
    if (potenciaTotalUsina && estado) {
      const generation = estimateGeneration(potenciaTotalUsina, estado);
      if (generation.estimatedGeneration !== geracaoProjetada) {
        form.setValue(`plants.${plantIndex}.geracaoProjetada`, generation.estimatedGeneration);
      }
    }
  }, [potenciaTotalUsina, estado, form, plantIndex, estimateGeneration]);

  // Validações em tempo real
  const ucValidation = uc && concessionaria ? validateUC(uc, concessionaria) : { isValid: true, message: '' };
  const inverterCompatibility = potenciaTotalUsina && potenciaTotalInversores 
    ? validateInverterCompatibility(potenciaTotalUsina, potenciaTotalInversores)
    : { isValid: true, message: '' };

  const addContact = () => {
    appendContact({
      nome: '',
      telefone: '',
      funcao: '',
    });
  };

  const addInverter = () => {
    appendInverter({
      marca: '',
      potencia: 0, // Changed from empty string to 0
      quantidade: 0, // Changed from empty string to 0
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-800">
            Usina {plantIndex + 1}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {form.watch(`plants.${plantIndex}.apelido`) || `Usina ${plantIndex + 1}`}
            </Badge>
            {geracaoProjetada > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {geracaoProjetada.toLocaleString()} kWh/mês
              </Badge>
            )}
            {canRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Alertas de Validação */}
        {!ucValidation.isValid && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {ucValidation.message}
            </AlertDescription>
          </Alert>
        )}

        {!inverterCompatibility.isValid && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {inverterCompatibility.message}
            </AlertDescription>
          </Alert>
        )}

        {inverterCompatibility.isValid && potenciaTotalUsina > 0 && potenciaTotalInversores > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {inverterCompatibility.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Dados Básicos da Usina */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b pb-2">Dados Básicos</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`plants.${plantIndex}.apelido`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apelido da Usina *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Usina Solar 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.uc`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade Consumidora *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="00000000000000" {...field} />
                      {ucValidation.isValid && uc && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.tipoUsina`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usina *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mini" id={`mini-${plantIndex}`} />
                        <label htmlFor={`mini-${plantIndex}`} className="text-sm">Mini (75kW+)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="micro" id={`micro-${plantIndex}`} />
                        <label htmlFor={`micro-${plantIndex}`} className="text-sm">Micro (até 75kW)</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.modalidadeCompensacao`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidade de Compensação *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="autoconsumo">Autoconsumo</SelectItem>
                      <SelectItem value="geracaoCompartilhada">Geração Compartilhada</SelectItem>
                      <SelectItem value="autoconsumoCompartilhada">Autoconsumo + Geração Compartilhada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Dados da Usina */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b pb-2">Dados da Usina</h4>
          
          <FormField
            control={form.control}
            name={`plants.${plantIndex}.ownerType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fisica" id={`pf-${plantIndex}`} />
                      <label htmlFor={`pf-${plantIndex}`} className="text-sm">Pessoa Física</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="juridica" id={`pj-${plantIndex}`} />
                      <label htmlFor={`pj-${plantIndex}`} className="text-sm">Pessoa Jurídica</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`plants.${plantIndex}.ownerCpfCnpj`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ownerType === 'fisica' ? 'CPF' : 'CNPJ'} *</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      {...field} 
                      mask={ownerType === 'fisica' ? '999.999.999-99' : '99.999.999/9999-99'}
                      placeholder={ownerType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.ownerNumeroParceiroNegocio`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número Parceiro de Negócio *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.ownerName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {ownerType === 'fisica' && (
              <FormField
                control={form.control}
                name={`plants.${plantIndex}.ownerDataNascimento`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento *</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        {...field} 
                        mask="99/99/9999"
                        placeholder="DD/MM/AAAA"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Endereço da Usina */}
        <AddressForm 
          form={form} 
          prefix={`plants.${plantIndex}.address`} 
          title="Endereço da Usina"
        />

        {/* Contatos da Usina */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 border-b pb-2">Contatos da Usina</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addContact}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </div>

          {contactFields.length === 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Contato do proprietário foi adicionado automaticamente. Adicione mais contatos se necessário.
              </AlertDescription>
            </Alert>
          )}

          {contactFields.map((contact, contactIndex) => (
            <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`plants.${plantIndex}.contacts.${contactIndex}.nome`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Contato {contactIndex + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plants.${plantIndex}.contacts.${contactIndex}.telefone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <MaskedInput 
                        {...field} 
                        mask="(99) 99999-9999"
                        placeholder="(00) 00000-0000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plants.${plantIndex}.contacts.${contactIndex}.funcao`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Zelador, Supervisor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeContact(contactIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Dados da Instalação Fotovoltaica */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b pb-2">Dados da Instalação Fotovoltaica</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name={`plants.${plantIndex}.marcaModulo`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca do Módulo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Canadian Solar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.potenciaModulo`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potência do Módulo (W) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="580" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value) || '')}
                        value={field.value || ''}
                      />
                      {field.value === 580 && (
                        <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs">
                          Sugerido 2024
                        </Badge>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.quantidadeModulos`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Módulos *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="150" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`plants.${plantIndex}.potenciaTotalUsina`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potência Total (kWp)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        value={field.value ? field.value.toFixed(2).replace('.', ',') : '0,00'}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Inversores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 border-b pb-2">Inversores</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addInverter}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Inversor
            </Button>
          </div>

          {inverterFields.map((inverter, inverterIndex) => (
            <div key={inverter.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`plants.${plantIndex}.inversores.${inverterIndex}.marca`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca do Inversor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sungrow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plants.${plantIndex}.inversores.${inverterIndex}.potencia`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potência (kW) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="50" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`plants.${plantIndex}.inversores.${inverterIndex}.quantidade`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                {inverterFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeInverter(inverterIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-4 rounded-lg">
            <FormField
              control={form.control}
              name={`plants.${plantIndex}.potenciaTotalInversores`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potência Total dos Inversores (kW)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        value={field.value ? field.value.toFixed(2).replace('.', ',') : '0,00'}
                        readOnly
                        className="bg-white"
                      />
                      <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Geração e Observações */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`plants.${plantIndex}.geracaoProjetada`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geração Projetada (kWh/mês)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        value={field.value ? field.value.toLocaleString('pt-BR') : '0'}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={`plants.${plantIndex}.observacoes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações da Usina</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Observações automáticas serão geradas..." 
                    {...field} 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratorPlantsForm;
