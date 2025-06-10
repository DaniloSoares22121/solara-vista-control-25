
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

      {/* Discount Table */}
      {selectedFaixa && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg text-green-600">Tabela de Descontos - Escolha seu Plano</CardTitle>
            <p className="text-sm text-gray-600">
              Faixa selecionada: {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Tipo de Plano</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Período de Fidelidade</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Desconto</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const selectedPlanOption = planOptions.find(p => p.faixaConsumo === selectedFaixa);
                    if (!selectedPlanOption) return null;

                    return (
                      <>
                        <TableRow className={isSelected(selectedFaixa, 'sem') ? 'bg-green-50 border-green-200' : ''}>
                          <TableCell className="font-medium">Sem Fidelidade</TableCell>
                          <TableCell className="text-center text-gray-500">-</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                              {selectedPlanOption.semFidelidade}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm"
                              variant={isSelected(selectedFaixa, 'sem') ? 'default' : 'outline'}
                              onClick={() => {
                                setSelectedFidelidade('sem');
                                setSelectedAnos(undefined);
                              }}
                              className={isSelected(selectedFaixa, 'sem') ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {isSelected(selectedFaixa, 'sem') ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Selecionado
                                </>
                              ) : (
                                'Selecionar'
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={isSelected(selectedFaixa, 'com', '1') ? 'bg-green-50 border-green-200' : ''}>
                          <TableCell className="font-medium">Com Fidelidade</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">1 Ano</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                              {selectedPlanOption.comFidelidade1Ano}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm"
                              variant={isSelected(selectedFaixa, 'com', '1') ? 'default' : 'outline'}
                              onClick={() => {
                                setSelectedFidelidade('com');
                                setSelectedAnos('1');
                              }}
                              className={isSelected(selectedFaixa, 'com', '1') ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {isSelected(selectedFaixa, 'com', '1') ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Selecionado
                                </>
                              ) : (
                                'Selecionar'
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        <TableRow className={isSelected(selectedFaixa, 'com', '2') ? 'bg-green-50 border-green-200' : ''}>
                          <TableCell className="font-medium">Com Fidelidade</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">2 Anos</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50">
                              {selectedPlanOption.comFidelidade2Anos}% OFF
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm"
                              variant={isSelected(selectedFaixa, 'com', '2') ? 'default' : 'outline'}
                              onClick={() => {
                                setSelectedFidelidade('com');
                                setSelectedAnos('2');
                              }}
                              className={isSelected(selectedFaixa, 'com', '2') ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {isSelected(selectedFaixa, 'com', '2') ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Selecionado
                                </>
                              ) : (
                                'Selecionar'
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })()}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            {selectedFaixa && selectedFidelidade && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Plano Selecionado</h4>
                    <p className="text-sm text-gray-600">
                      {planOptions.find(p => p.faixaConsumo === selectedFaixa)?.label}
                      {selectedFidelidade === 'com' && ` - Fidelidade de ${selectedAnos} ano${selectedAnos === '2' ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {getDesconto(planOptions.find(p => p.faixaConsumo === selectedFaixa)!, selectedFidelidade, selectedAnos)}%
                    </p>
                    <p className="text-xs text-gray-500">de desconto</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanTable;
