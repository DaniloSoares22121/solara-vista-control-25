
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle2, User, FileText } from 'lucide-react';
import { useSubscribers } from '@/hooks/useSubscribers'; // hook fictício (adapte se necessário)
import { Badge } from '@/components/ui/badge';

const subscriberListDummy = [
  { id: '1', nome: 'João da Silva', uc: '12345', desconto: 10 },
  { id: '2', nome: 'Maria dos Santos', uc: '67890', desconto: 5 },
];

const FaturaManual = () => {
  // Etapas: 1=selecionar assinante, 2=upload fatura, 3=confirmar dados
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Dados da seleção
  const [assinanteId, setAssinanteId] = useState<string>('');
  const [assinante, setAssinante] = useState<{ id: string; nome: string; uc: string; desconto: number } | null>(null);

  // Fatura lida (simulado)
  const [faturaData, setFaturaData] = useState<{ valor: number; consumo: number } | null>(null);

  // USAR hook real, ou mock
  const subscribers = subscriberListDummy;

  // Seleciona assinante
  const handleAssinanteSelecionado = () => {
    const sub = subscribers.find((s) => s.id === assinanteId);
    setAssinante(sub || null);
    setStep(2);
  };

  // Simula upload/parse da fatura
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simulando leitura de um PDF (fictício)
      setTimeout(() => {
        setFaturaData({
          valor: 320.75,
          consumo: 410,
        });
        setStep(3);
      }, 1200);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-10 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Fatura Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <Label className="font-semibold mb-2">Selecione um assinante:</Label>
              <select
                className="w-full border px-4 py-2 rounded-lg"
                value={assinanteId}
                onChange={e => setAssinanteId(e.target.value)}
              >
                <option value="">Selecione o assinante...</option>
                {subscribers.map(sub => (
                  <option value={sub.id} key={sub.id}>{sub.nome} • UC: {sub.uc}</option>
                ))}
              </select>
              <Button
                className="w-full mt-3"
                disabled={!assinanteId}
                onClick={handleAssinanteSelecionado}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && assinante && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-green-700" />
                <div>
                  <div className="font-bold">{assinante.nome}</div>
                  <div className="text-xs text-gray-500">UC: {assinante.uc} <Badge className="ml-1">{assinante.desconto}% desc.</Badge></div>
                </div>
              </div>
              <Label htmlFor="faturaPdf" className="block font-semibold mb-1">Upload da Fatura PDF</Label>
              <Input type="file" id="faturaPdf" accept="application/pdf" onChange={handleUpload} />
              <Button type="button" variant="outline" className="mt-4" onClick={() => setStep(1)}>
                Voltar
              </Button>
            </div>
          )}

          {step === 3 && assinante && faturaData && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-blue-900">Dados extraídos da fatura</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-700">Assinante:</span>
                  <div className="font-semibold">{assinante.nome}</div>
                </div>
                <div>
                  <span className="text-gray-700">UC:</span>
                  <div className="font-semibold">{assinante.uc}</div>
                </div>
                <div>
                  <span className="text-gray-700">Consumo:</span>
                  <div className="font-semibold">{faturaData.consumo} kWh</div>
                </div>
                <div>
                  <span className="text-gray-700">Valor (sem desconto):</span>
                  <div className="font-semibold">R$ {faturaData.valor.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-700">Desconto plano:</span>
                  <div className="font-semibold text-green-600">{assinante.desconto}%</div>
                </div>
                <div>
                  <span className="text-gray-700">Valor com desconto:</span>
                  <div className="font-semibold text-green-700">
                    R$ {(faturaData.valor * (1 - assinante.desconto / 100)).toFixed(2)}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-3" onClick={() => setStep(2)}>
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FaturaManual;
