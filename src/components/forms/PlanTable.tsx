
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Calendar } from 'lucide-react';

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

  const getDesconto = (plan: PlanOption, fidelidade: string, anos?: string) => {
    if (fidelidade === 'sem') return plan.semFidelidade;
    if (anos === '1') return plan.comFidelidade1Ano;
    if (anos === '2') return plan.comFidelidade2Anos;
    return plan.comFidelidade1Ano;
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
  }, [selectedFaixa, selectedFidelidade, selectedAnos]);

  return (
    <div className="space-y-6">
      {/* Campos de Contratação */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg text-green-600">Contratação - Plano Escolhido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modalidade" className="text-sm font-medium text-gray-700">
                Modalidade de Compensação
              </Label>
              <Select value={modalidadeCompensacao} onValueChange={setModalidadeCompensacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autoconsumo">AutoConsumo</SelectItem>
                  <SelectItem value="geracao-compartilhada">Geração Compartilhada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data-adesao" className="text-sm font-medium text-gray-700">
                Data de Adesão
              </Label>
              <div className="relative">
                <Input
                  id="data-adesao"
                  type="date"
                  value={dataAdesao}
                  onChange={(e) => setDataAdesao(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="kwh-vendedor" className="text-sm font-medium text-gray-700">
                kWh Vendedor Informou
              </Label>
              <Input
                id="kwh-vendedor"
                type="number"
                placeholder="Ex: 500"
                value={kwhVendedor}
                onChange={(e) => setKwhVendedor(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="kwh-contratado" className="text-sm font-medium text-gray-700">
                kWh Contratado (Gestor Definido)
              </Label>
              <Input
                id="kwh-contratado"
                type="number"
                placeholder="Ex: 450"
                value={kwhContratado}
                onChange={(e) => setKwhContratado(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg text-green-600">Escolha sua Faixa de Consumo</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedFaixa} 
            onValueChange={setSelectedFaixa}
            className="space-y-3"
          >
            {planOptions.map((plan) => (
              <div 
                key={plan.faixaConsumo} 
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedFaixa === plan.faixaConsumo 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={plan.faixaConsumo} id={plan.faixaConsumo} />
                  <Label htmlFor={plan.faixaConsumo} className="font-semibold text-gray-800 flex-1">
                    {plan.label}
                  </Label>
                  {selectedFaixa === plan.faixaConsumo && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg text-green-600">Tipo de Fidelidade</CardTitle>
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
              className="space-y-3"
            >
              <div className={`p-4 border-2 rounded-lg transition-all ${
                selectedFidelidade === 'sem' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sem" id="sem-fidelidade" />
                  <Label htmlFor="sem-fidelidade" className="font-semibold text-gray-800 flex-1">
                    Sem Fidelidade
                  </Label>
                  {selectedFidelidade === 'sem' && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
              </div>

              <div className={`p-4 border-2 rounded-lg transition-all ${
                selectedFidelidade === 'com' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="com" id="com-fidelidade" />
                  <Label htmlFor="com-fidelidade" className="font-semibold text-gray-800 flex-1">
                    Com Fidelidade
                  </Label>
                  {selectedFidelidade === 'com' && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
                
                {selectedFidelidade === 'com' && (
                  <div className="mt-4 ml-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Período:</Label>
                    <RadioGroup 
                      value={selectedAnos} 
                      onValueChange={(value: string) => {
                        const anosValue = value as '1' | '2';
                        setSelectedAnos(anosValue);
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="1-ano" />
                        <Label htmlFor="1-ano" className="text-sm">1 Ano</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="2-anos" />
                        <Label htmlFor="2-anos" className="text-sm">2 Anos</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Visualização dos Descontos */}
      {selectedFaixa && selectedFidelidade && (
        <Card className="w-full border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-xl text-green-700 text-center">
              💰 Tabela de Descontos - Plano Selecionado
            </CardTitle>
            <p className="text-center text-gray-600 font-medium">
              {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-lg border-2 border-green-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-600 text-white">
                    <TableHead className="font-bold text-white text-center py-4">Tipo de Plano</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Período</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Desconto</TableHead>
                    <TableHead className="font-bold text-white text-center py-4">Status</TableHead>
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
                            ? 'bg-green-100 border-l-4 border-l-green-500' 
                            : 'bg-gray-50'
                        } hover:bg-green-50 transition-colors`}>
                          <TableCell className="font-semibold text-center py-4">
                            Sem Fidelidade
                          </TableCell>
                          <TableCell className="text-center py-4 text-gray-500">
                            -
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge 
                              variant="outline" 
                              className={`text-lg px-4 py-2 font-bold ${
                                selectedFidelidade === 'sem'
                                  ? 'bg-green-100 text-green-800 border-green-400'
                                  : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {selectedPlanOption.semFidelidade}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            {selectedFidelidade === 'sem' ? (
                              <Badge className="bg-green-600 text-white px-3 py-1">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Disponível
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={`${
                          selectedFidelidade === 'com' && selectedAnos === '1'
                            ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                            : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}>
                          <TableCell className="font-semibold text-center py-4">
                            Com Fidelidade
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              1 Ano
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge 
                              variant="outline" 
                              className={`text-lg px-4 py-2 font-bold ${
                                selectedFidelidade === 'com' && selectedAnos === '1'
                                  ? 'bg-blue-100 text-blue-800 border-blue-400'
                                  : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {selectedPlanOption.comFidelidade1Ano}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            {selectedFidelidade === 'com' && selectedAnos === '1' ? (
                              <Badge className="bg-blue-600 text-white px-3 py-1">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Disponível
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={`${
                          selectedFidelidade === 'com' && selectedAnos === '2'
                            ? 'bg-purple-100 border-l-4 border-l-purple-500' 
                            : 'bg-gray-50'
                        } hover:bg-purple-50 transition-colors`}>
                          <TableCell className="font-semibold text-center py-4">
                            Com Fidelidade
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              2 Anos
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge 
                              variant="outline" 
                              className={`text-lg px-4 py-2 font-bold ${
                                selectedFidelidade === 'com' && selectedAnos === '2'
                                  ? 'bg-purple-100 text-purple-800 border-purple-400'
                                  : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {selectedPlanOption.comFidelidade2Anos}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            {selectedFidelidade === 'com' && selectedAnos === '2' ? (
                              <Badge className="bg-purple-600 text-white px-3 py-1">
                                ✓ SELECIONADO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
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

            {/* Resumo Final */}
            <div className="mt-6 p-6 bg-gradient-to-r from-green-100 via-blue-50 to-purple-50 rounded-xl border-2 border-green-200">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">🎉 Seu Desconto Final</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-green-600">
                      {(() => {
                        const plan = planOptions.find(p => p.faixaConsumo === selectedFaixa);
                        if (!plan) return '0';
                        return getDesconto(plan, selectedFidelidade, selectedAnos);
                      })()}%
                    </p>
                    <p className="text-lg text-gray-600 font-medium">de desconto</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-700">
                    <strong>Faixa:</strong> {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Tipo:</strong> {selectedFidelidade === 'sem' ? 'Sem Fidelidade' : `Com Fidelidade - ${selectedAnos} ano${selectedAnos === '2' ? 's' : ''}`}
                  </p>
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
