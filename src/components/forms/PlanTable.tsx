
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

  const getDesconto = (plan: PlanOption, fidelidade: string, anos?: string) => {
    if (fidelidade === 'sem') return plan.semFidelidade;
    if (anos === '1') return plan.comFidelidade1Ano;
    if (anos === '2') return plan.comFidelidade2Anos;
    return plan.comFidelidade1Ano;
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-green-600">Tabela de Planos - Escolha seu Consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {planOptions.map((plan) => (
            <div 
              key={plan.faixaConsumo} 
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedFaixa === plan.faixaConsumo 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <RadioGroup 
                    value={selectedFaixa} 
                    onValueChange={setSelectedFaixa}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={plan.faixaConsumo} id={plan.faixaConsumo} />
                      <Label htmlFor={plan.faixaConsumo} className="font-semibold text-gray-800">
                        {plan.label}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {selectedFaixa === plan.faixaConsumo ? 'Selecionado' : 'Disponível'}
                </Badge>
              </div>

              {selectedFaixa === plan.faixaConsumo && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Sem Fidelidade</h4>
                      <Button 
                        variant={selectedFidelidade === 'sem' ? 'default' : 'outline'}
                        onClick={() => {
                          setSelectedFidelidade('sem');
                          setSelectedAnos(undefined);
                        }}
                        className="w-full"
                      >
                        {plan.semFidelidade}% Desconto
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Com Fidelidade - 1 Ano</h4>
                      <Button 
                        variant={selectedFidelidade === 'com' && selectedAnos === '1' ? 'default' : 'outline'}
                        onClick={() => {
                          setSelectedFidelidade('com');
                          setSelectedAnos('1');
                        }}
                        className="w-full"
                      >
                        {plan.comFidelidade1Ano}% Desconto
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Com Fidelidade - 2 Anos</h4>
                      <Button 
                        variant={selectedFidelidade === 'com' && selectedAnos === '2' ? 'default' : 'outline'}
                        onClick={() => {
                          setSelectedFidelidade('com');
                          setSelectedAnos('2');
                        }}
                        className="w-full"
                      >
                        {plan.comFidelidade2Anos}% Desconto
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      Desconto selecionado: {getDesconto(plan, selectedFidelidade, selectedAnos)}%
                      {selectedFidelidade === 'com' && ` - Fidelidade de ${selectedAnos} ano${selectedAnos === '2' ? 's' : ''}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanTable;
