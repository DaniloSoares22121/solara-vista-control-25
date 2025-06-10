import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Calendar, TrendingUp, Award, Clock, Edit3 } from 'lucide-react';

interface PlanOption {
  faixaConsumo: string;
  label: string;
  semFidelidade: number;
  comFidelidade1Ano: number;
  comFidelidade2Anos: number;
}

const planOptions: PlanOption[] = [
  {
    faixaConsumo: '400-599',
    label: '400 kWh a 599 kWh',
    semFidelidade: 13,
    comFidelidade1Ano: 15,
    comFidelidade2Anos: 20,
  },
  {
    faixaConsumo: '600-1099',
    label: '600 kWh a 1099 kWh',
    semFidelidade: 15,
    comFidelidade1Ano: 18,
    comFidelidade2Anos: 20,
  },
  {
    faixaConsumo: '1100-3099',
    label: '1100 kWh a 3099 kWh',
    semFidelidade: 18,
    comFidelidade1Ano: 20,
    comFidelidade2Anos: 22,
  },
  {
    faixaConsumo: '3100-7000',
    label: '3100 kWh a 7000 kWh',
    semFidelidade: 20,
    comFidelidade1Ano: 22,
    comFidelidade2Anos: 25,
  },
  {
    faixaConsumo: '7000+',
    label: 'Maior que 7000 kWh',
    semFidelidade: 22,
    comFidelidade1Ano: 25,
    comFidelidade2Anos: 27,
  },
];

interface PlanTableProps {
  selectedPlan: string;
  fidelidade: 'sem' | 'com';
  anosFidelidade?: '1' | '2';
  onPlanChange: (faixaConsumo: string, fidelidade: 'sem' | 'com', anos?: '1' | '2', desconto?: number) => void;
}

const PlanTable = ({ selectedPlan, fidelidade, anosFidelidade, onPlanChange }: PlanTableProps) => {
  const [selectedFaixa, setSelectedFaixa] = useState(selectedPlan);
  const [selectedFidelidade, setSelectedFidelidade] = useState(fidelidade);
  const [selectedAnos, setSelectedAnos] = useState(anosFidelidade);
  
  // Novos campos de contratação
  const [modalidadeCompensacao, setModalidadeCompensacao] = useState('');
  const [dataAdesao, setDataAdesao] = useState('');
  const [kwhVendedor, setKwhVendedor] = useState('');
  const [kwhContratado, setKwhContratado] = useState('');

  // Estados para descontos editáveis
  const [customDiscounts, setCustomDiscounts] = useState<{[key: string]: {semFidelidade: number, comFidelidade1Ano: number, comFidelidade2Anos: number}}>({});

  const getCustomDiscount = (faixaConsumo: string, type: 'semFidelidade' | 'comFidelidade1Ano' | 'comFidelidade2Anos') => {
    return customDiscounts[faixaConsumo]?.[type] ?? planOptions.find(p => p.faixaConsumo === faixaConsumo)?.[type] ?? 0;
  };

  const updateCustomDiscount = (faixaConsumo: string, type: 'semFidelidade' | 'comFidelidade1Ano' | 'comFidelidade2Anos', value: number) => {
    setCustomDiscounts(prev => ({
      ...prev,
      [faixaConsumo]: {
        ...prev[faixaConsumo],
        [type]: value
      }
    }));
  };

  const getDesconto = (plan: PlanOption, fidelidade: string, anos?: string) => {
    const faixaConsumo = plan.faixaConsumo;
    if (fidelidade === 'sem') return getCustomDiscount(faixaConsumo, 'semFidelidade');
    if (anos === '1') return getCustomDiscount(faixaConsumo, 'comFidelidade1Ano');
    if (anos === '2') return getCustomDiscount(faixaConsumo, 'comFidelidade2Anos');
    return getCustomDiscount(faixaConsumo, 'comFidelidade1Ano');
  };

  const isSelected = (planFaixa: string, planFidelidade: 'sem' | 'com', planAnos?: '1' | '2') => {
    if (selectedFaixa !== planFaixa) return false;
    if (selectedFidelidade !== planFidelidade) return false;
    if (planFidelidade === 'com' && selectedAnos !== planAnos) return false;
    return true;
  };

  useEffect(() => {
    if (selectedFaixa) {
      const plan = planOptions.find(p => p.faixaConsumo === selectedFaixa);
      if (plan) {
        const desconto = getDesconto(plan, selectedFidelidade, selectedAnos);
        onPlanChange(selectedFaixa, selectedFidelidade, selectedAnos, desconto);
      }
    }
  }, [selectedFaixa, selectedFidelidade, selectedAnos, customDiscounts]);

  return (
    <div className="space-y-8">
      {/* Campos de Contratação */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-700">Contratação - Plano Escolhido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="modalidade" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Modalidade de Compensação
              </Label>
              <Select value={modalidadeCompensacao} onValueChange={setModalidadeCompensacao}>
                <SelectTrigger className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                  <SelectItem value="geracao-compartilhada">Geração Compartilhada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-adesao" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data de Adesão
              </Label>
              <div className="relative">
                <Input
                  id="data-adesao"
                  type="date"
                  value={dataAdesao}
                  onChange={(e) => setDataAdesao(e.target.value)}
                  className="h-12 pl-10 bg-white border-2 border-gray-200 focus:border-blue-400"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kwh-vendedor" className="text-sm font-semibold text-gray-700">
                kWh Vendedor Informou
              </Label>
              <Input
                id="kwh-vendedor"
                type="number"
                placeholder="Ex: 500"
                value={kwhVendedor}
                onChange={(e) => setKwhVendedor(e.target.value)}
                className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kwh-contratado" className="text-sm font-semibold text-gray-700">
                kWh Contratado (Gestor Definido)
              </Label>
              <Input
                id="kwh-contratado"
                type="number"
                placeholder="Ex: 450"
                value={kwhContratado}
                onChange={(e) => setKwhContratado(e.target.value)}
                className="h-12 bg-white border-2 border-gray-200 focus:border-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-700">Escolha sua Faixa de Consumo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedFaixa} 
            onValueChange={setSelectedFaixa}
            className="space-y-4"
          >
            {planOptions.map((plan) => (
              <div 
                key={plan.faixaConsumo} 
                className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                  selectedFaixa === plan.faixaConsumo 
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={plan.faixaConsumo} id={plan.faixaConsumo} className="w-5 h-5" />
                  <Label htmlFor={plan.faixaConsumo} className="font-semibold text-gray-800 flex-1 text-lg">
                    {plan.label}
                  </Label>
                  {selectedFaixa === plan.faixaConsumo && (
                    <Badge className="bg-green-600 text-white px-3 py-1 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Fidelidade Selection */}
      {selectedFaixa && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-700">Tipo de Fidelidade</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedFidelidade} 
              onValueChange={(value: string) => {
                const fidelidadeValue = value as 'sem' | 'com';
                setSelectedFidelidade(fidelidadeValue);
                if (fidelidadeValue === 'sem') {
                  setSelectedAnos(undefined);
                } else {
                  setSelectedAnos('1'); // default para 1 ano
                }
              }}
              className="space-y-4"
            >
              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                selectedFidelidade === 'sem' 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'
              }`}>
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="sem" id="sem-fidelidade" className="w-5 h-5" />
                  <Label htmlFor="sem-fidelidade" className="font-semibold text-gray-800 flex-1 text-lg">
                    Sem Fidelidade
                  </Label>
                  {selectedFidelidade === 'sem' && (
                    <Badge className="bg-purple-600 text-white px-3 py-1 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
              </div>

              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                selectedFidelidade === 'com' 
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
              }`}>
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="com" id="com-fidelidade" className="w-5 h-5" />
                  <Label htmlFor="com-fidelidade" className="font-semibold text-gray-800 flex-1 text-lg">
                    Com Fidelidade
                  </Label>
                  {selectedFidelidade === 'com' && (
                    <Badge className="bg-orange-600 text-white px-3 py-1 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
                
                {selectedFidelidade === 'com' && (
                  <div className="mt-6 ml-9 space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Período de Fidelidade:
                    </Label>
                    <RadioGroup 
                      value={selectedAnos} 
                      onValueChange={(value: string) => {
                        const anosValue = value as '1' | '2';
                        setSelectedAnos(anosValue);
                      }}
                      className="flex gap-6"
                    >
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedAnos === '1' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'
                      }`}>
                        <RadioGroupItem value="1" id="1-ano" />
                        <Label htmlFor="1-ano" className="font-medium">1 Ano</Label>
                      </div>
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedAnos === '2' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'
                      }`}>
                        <RadioGroupItem value="2" id="2-anos" />
                        <Label htmlFor="2-anos" className="font-medium">2 Anos</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Visualização dos Descontos - Com Edição */}
      {selectedFaixa && selectedFidelidade && (
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-lg">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-6 h-6" />
                <CardTitle className="text-2xl font-bold">
                  Tabela de Descontos
                </CardTitle>
                <Edit3 className="w-5 h-5 ml-2" />
              </div>
              <p className="text-blue-100 font-medium text-lg">
                {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
              </p>
              <p className="text-blue-200 text-sm">
                Clique nos valores para editar os descontos
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-slate-100 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-gray-800 text-center py-6 text-base">
                      Tipo de Plano
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-center py-6 text-base">
                      Período
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-center py-6 text-base">
                      Desconto
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-center py-6 text-base">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const selectedPlanOption = planOptions.find(p => p.faixaConsumo === selectedFaixa);
                    if (!selectedPlanOption) return null;

                    return (
                      <>
                        <TableRow className={`${
                          selectedFidelidade === 'sem' 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-md' 
                            : 'bg-white hover:bg-gray-50'
                        } transition-all duration-300`}>
                          <TableCell className="font-semibold text-center py-8 text-base">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              Sem Fidelidade
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8 text-gray-500 text-base">
                            <Badge variant="outline" className="bg-gray-100 text-gray-600">
                              Flexível
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            <div className="flex items-center justify-center gap-2">
                              <div className="relative group">
                                <Input
                                  type="number"
                                  value={getCustomDiscount(selectedFaixa, 'semFidelidade')}
                                  onChange={(e) => updateCustomDiscount(selectedFaixa, 'semFidelidade', Number(e.target.value))}
                                  className={`w-20 h-12 text-center text-lg font-bold border-2 rounded-lg ${
                                    selectedFidelidade === 'sem'
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 focus:border-green-300'
                                      : 'bg-gray-100 text-gray-600 border-gray-300 focus:border-gray-400'
                                  }`}
                                  min="0"
                                  max="100"
                                />
                                <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold ${
                                  selectedFidelidade === 'sem' ? 'text-white' : 'text-gray-600'
                                }`}>%</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            {selectedFidelidade === 'sem' ? (
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 text-base shadow-md">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300 px-4 py-2">
                                Disponível
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={`${
                          selectedFidelidade === 'com' && selectedAnos === '1'
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-l-blue-500 shadow-md' 
                            : 'bg-white hover:bg-gray-50'
                        } transition-all duration-300`}>
                          <TableCell className="font-semibold text-center py-8 text-base">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              Com Fidelidade
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 text-base font-semibold">
                              1 Ano
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            <div className="flex items-center justify-center gap-2">
                              <div className="relative group">
                                <Input
                                  type="number"
                                  value={getCustomDiscount(selectedFaixa, 'comFidelidade1Ano')}
                                  onChange={(e) => updateCustomDiscount(selectedFaixa, 'comFidelidade1Ano', Number(e.target.value))}
                                  className={`w-20 h-12 text-center text-lg font-bold border-2 rounded-lg ${
                                    selectedFidelidade === 'com' && selectedAnos === '1'
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-400 focus:border-blue-300'
                                      : 'bg-gray-100 text-gray-600 border-gray-300 focus:border-gray-400'
                                  }`}
                                  min="0"
                                  max="100"
                                />
                                <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold ${
                                  selectedFidelidade === 'com' && selectedAnos === '1' ? 'text-white' : 'text-gray-600'
                                }`}>%</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            {selectedFidelidade === 'com' && selectedAnos === '1' ? (
                              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-4 py-2 text-base shadow-md">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300 px-4 py-2">
                                Disponível
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={`${
                          selectedFidelidade === 'com' && selectedAnos === '2'
                            ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-l-purple-500 shadow-md' 
                            : 'bg-white hover:bg-gray-50'
                        } transition-all duration-300`}>
                          <TableCell className="font-semibold text-center py-8 text-base">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              Com Fidelidade
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 px-4 py-2 text-base font-semibold">
                              2 Anos
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            <div className="flex items-center justify-center gap-2">
                              <div className="relative group">
                                <Input
                                  type="number"
                                  value={getCustomDiscount(selectedFaixa, 'comFidelidade2Anos')}
                                  onChange={(e) => updateCustomDiscount(selectedFaixa, 'comFidelidade2Anos', Number(e.target.value))}
                                  className={`w-20 h-12 text-center text-lg font-bold border-2 rounded-lg ${
                                    selectedFidelidade === 'com' && selectedAnos === '2'
                                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-400 focus:border-purple-300'
                                      : 'bg-gray-100 text-gray-600 border-gray-300 focus:border-gray-400'
                                  }`}
                                  min="0"
                                  max="100"
                                />
                                <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold ${
                                  selectedFidelidade === 'com' && selectedAnos === '2' ? 'text-white' : 'text-gray-600'
                                }`}>%</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-8">
                            {selectedFidelidade === 'com' && selectedAnos === '2' ? (
                              <Badge className="bg-gradient-to-r from-purple-600 to-violet-700 text-white px-4 py-2 text-base shadow-md">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300 px-4 py-2">
                                Disponível
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })()}
                </TableBody>
              </Table>
            </div>

            {/* Resumo Final Melhorado */}
            <div className="p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-t-4 border-amber-300">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-amber-600" />
                  <h4 className="text-3xl font-bold text-gray-900">Seu Desconto Final</h4>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-20 transform scale-110"></div>
                    <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white rounded-full w-40 h-40 flex items-center justify-center shadow-2xl">
                      <div className="text-center">
                        <p className="text-5xl font-black">
                          {(() => {
                            const plan = planOptions.find(p => p.faixaConsumo === selectedFaixa);
                            if (!plan) return '0';
                            return getDesconto(plan, selectedFidelidade, selectedAnos);
                          })()}%
                        </p>
                        <p className="text-sm font-semibold">OFF</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6 max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">Faixa:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">Tipo:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedFidelidade === 'sem' ? 'Sem Fidelidade' : `Com Fidelidade - ${selectedAnos} ano${selectedAnos === '2' ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanTable;
