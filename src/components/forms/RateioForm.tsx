
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, X, Zap, Users, AlertCircle, Info } from 'lucide-react';
import { RateioFormData } from '@/types/rateio';
import { useGenerators } from '@/hooks/useGenerators';
import { useSubscribers } from '@/hooks/useSubscribers';

interface RateioFormProps {
  onSubmit: (data: RateioFormData) => void;
  onCancel: () => void;
}

const RateioForm: React.FC<RateioFormProps> = ({ onSubmit, onCancel }) => {
  const { generators, loading: loadingGenerators } = useGenerators();
  const { subscribers, isLoading: loadingSubscribers } = useSubscribers();
  
  const [formData, setFormData] = useState<RateioFormData>({
    generatorId: '',
    subscriberId: '',
    type: 'percentage',
    date: {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
    expectedGeneration: 0
  });

  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedGenerator = generators.find(gen => gen.id === formData.generatorId);
  const selectedSubscriber = subscribers.find(sub => sub.id === formData.subscriberId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Novo Rateio de Energia</h2>
              <p className="text-gray-600 mt-1">Configure a distribuição de energia entre assinantes</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção de Seleção */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seleção de Geradora */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <Label className="text-lg font-semibold text-gray-900">Geradora de Energia</Label>
                </div>
                
                <Select 
                  value={formData.generatorId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, generatorId: value }))}
                >
                  <SelectTrigger className="h-12 text-left">
                    <SelectValue placeholder="Selecione uma geradora..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingGenerators ? (
                      <SelectItem value="loading" disabled>Carregando geradoras...</SelectItem>
                    ) : generators.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhuma geradora encontrada</SelectItem>
                    ) : (
                      generators.map((generator) => (
                        <SelectItem key={generator.id} value={generator.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">
                                {generator.plants?.[0]?.nickname || 'Geradora sem nome'}
                              </div>
                              <div className="text-sm text-gray-500">
                                UC: {generator.plants?.[0]?.uc || 'N/A'} • 
                                {generator.concessionaria || 'Concessionária não informada'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {selectedGenerator && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Geradora Selecionada</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Nome:</span> {selectedGenerator.plants?.[0]?.nickname}</p>
                      <p><span className="font-medium">UC:</span> {selectedGenerator.plants?.[0]?.uc}</p>
                      <p><span className="font-medium">Potência:</span> {selectedGenerator.plants?.[0]?.power || 'N/A'} kWp</p>
                      <p><span className="font-medium">Concessionária:</span> {selectedGenerator.concessionaria}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seleção de Assinante Principal */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-semibold text-gray-900">Assinante Principal</Label>
                </div>
                
                <Select 
                  value={formData.subscriberId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subscriberId: value }))}
                >
                  <SelectTrigger className="h-12 text-left">
                    <SelectValue placeholder="Selecione um assinante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingSubscribers ? (
                      <SelectItem value="loading" disabled>Carregando assinantes...</SelectItem>
                    ) : subscribers.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum assinante encontrado</SelectItem>
                    ) : (
                      subscribers.map((subscriber) => (
                        <SelectItem key={subscriber.id} value={subscriber.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">
                                {subscriber.subscriber?.name || subscriber.subscriber?.companyName || 'Nome não informado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                UC: {subscriber.energy_account?.uc || 'N/A'} • 
                                {subscriber.concessionaria || 'Concessionária não informada'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {selectedSubscriber && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Assinante Selecionado</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Nome:</span> {selectedSubscriber.subscriber?.name || selectedSubscriber.subscriber?.companyName}</p>
                      <p><span className="font-medium">UC:</span> {selectedSubscriber.energy_account?.uc}</p>
                      <p><span className="font-medium">Concessionária:</span> {selectedSubscriber.concessionaria}</p>
                      <p><span className="font-medium">Consumo Contratado:</span> {selectedSubscriber.plan_contract?.contractedConsumption || 'N/A'} kWh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Configurações do Rateio */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="p-1 bg-purple-100 rounded mr-3">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                Configurações do Rateio
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Tipo de Rateio</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'percentage' | 'priority') => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Por Porcentagem</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="priority">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Por Prioridade</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {formData.type === 'percentage' 
                          ? 'A energia será distribuída baseada em porcentagens fixas para cada assinante.'
                          : 'A energia será distribuída baseada na prioridade de cada assinante, preenchendo primeiro os de maior prioridade.'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-gray-700">Geração Esperada (kWh)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.expectedGeneration}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        expectedGeneration: parseFloat(e.target.value) || 0
                      }))}
                      className="mt-2"
                      placeholder="Ex: 1500.00"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Quantidade de energia que a geradora deve produzir no período
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Período do Rateio</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div>
                        <Label htmlFor="day" className="text-sm text-gray-600">Dia</Label>
                        <Input
                          id="day"
                          type="number"
                          min="1"
                          max="31"
                          value={formData.date.day}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: { ...prev.date, day: parseInt(e.target.value) || 1 }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="month" className="text-sm text-gray-600">Mês</Label>
                        <Input
                          id="month"
                          type="number"
                          min="1"
                          max="12"
                          value={formData.date.month}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: { ...prev.date, month: parseInt(e.target.value) || 1 }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year" className="text-sm text-gray-600">Ano</Label>
                        <Input
                          id="year"
                          type="number"
                          min="2020"
                          max="2030"
                          value={formData.date.year}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            date: { ...prev.date, year: parseInt(e.target.value) || new Date().getFullYear() }
                          }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-gray-700">Observações (Opcional)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicione observações sobre este rateio..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Validação */}
            {(!formData.generatorId || !formData.subscriberId) && (
              <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-yellow-800">
                  Selecione uma geradora e um assinante para continuar.
                </p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="px-6 py-3"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="px-6 py-3 bg-green-600 hover:bg-green-700"
                disabled={!formData.generatorId || !formData.subscriberId}
              >
                <Save className="w-4 h-4 mr-2" />
                Criar Rateio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateioForm;
