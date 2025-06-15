import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, X, Zap, Users, AlertCircle, Info } from 'lucide-react';
import { RateioFormData } from '@/types/rateio';
import { useGenerators } from '@/hooks/useGenerators';
import { useSubscribers } from '@/hooks/useSubscribers';
interface RateioFormProps {
  onSubmit: (data: RateioFormData) => void;
  onCancel: () => void;
}
const RateioForm: React.FC<RateioFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const {
    generators,
    loading: loadingGenerators
  } = useGenerators();
  const {
    subscribers,
    isLoading: loadingSubscribers
  } = useSubscribers();
  const currentDate = new Date();
  const [formData, setFormData] = useState<RateioFormData>({
    generatorId: '',
    subscriberId: '',
    type: 'percentage',
    date: {
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    },
    expectedGeneration: 0
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const selectedGenerator = generators.find(gen => gen.id === formData.generatorId);
  const selectedSubscriber = subscribers.find(sub => sub.id === formData.subscriberId);
  return <div className="max-w-5xl mx-auto space-y-6">
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
                
                <Select value={formData.generatorId} onValueChange={value => setFormData(prev => ({
                ...prev,
                generatorId: value
              }))}>
                  <SelectTrigger className="h-12 text-left">
                    <SelectValue placeholder="Selecione uma geradora..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingGenerators ? <SelectItem value="loading" disabled>Carregando geradoras...</SelectItem> : generators.length === 0 ? <SelectItem value="empty" disabled>Nenhuma geradora encontrada</SelectItem> : generators.map(generator => <SelectItem key={generator.id} value={generator.id}>
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
                        </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de Assinante Principal */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-semibold text-gray-900">Assinante Principal</Label>
                </div>
                
                <Select value={formData.subscriberId} onValueChange={value => setFormData(prev => ({
                ...prev,
                subscriberId: value
              }))}>
                  <SelectTrigger className="h-12 text-left">
                    <SelectValue placeholder="Selecione um assinante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingSubscribers ? <SelectItem value="loading" disabled>Carregando assinantes...</SelectItem> : subscribers.length === 0 ? <SelectItem value="empty" disabled>Nenhum assinante encontrado</SelectItem> : subscribers.map(subscriber => <SelectItem key={subscriber.id} value={subscriber.id}>
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
                        </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cards de Informações Selecionadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedGenerator && <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Geradora Selecionada
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Nome:</span>
                      <span className="font-medium text-green-900">{selectedGenerator.plants?.[0]?.nickname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">UC:</span>
                      <span className="font-medium text-green-900">{selectedGenerator.plants?.[0]?.uc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Potência:</span>
                      <span className="font-medium text-green-900">{selectedGenerator.plants?.[0]?.power || 'N/A'} kWp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Concessionária:</span>
                      <span className="font-medium text-green-900">{selectedGenerator.concessionaria}</span>
                    </div>
                  </div>
                </div>}

              {selectedSubscriber && <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Assinante Selecionado
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Nome:</span>
                      <span className="font-medium text-blue-900">{selectedSubscriber.subscriber?.name || selectedSubscriber.subscriber?.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">UC:</span>
                      <span className="font-medium text-blue-900">{selectedSubscriber.energy_account?.uc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Concessionária:</span>
                      <span className="font-medium text-blue-900">{selectedSubscriber.concessionaria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Consumo Contratado:</span>
                      <span className="font-medium text-blue-900">{selectedSubscriber.plan_contract?.contractedConsumption || 'N/A'} kWh</span>
                    </div>
                  </div>
                </div>}
            </div>

            {/* Configurações do Rateio */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="p-1 bg-purple-100 rounded mr-3">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                Configurações do Rateio
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Tipo de Rateio</Label>
                    <Select value={formData.type} onValueChange={(value: 'percentage' | 'priority') => setFormData(prev => ({
                    ...prev,
                    type: value
                  }))}>
                      <SelectTrigger className="mt-2 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center space-x-3 py-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">Por Porcentagem</span>
                              <p className="text-xs text-gray-500">Distribui baseado em % fixas</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="priority">
                          <div className="flex items-center space-x-3 py-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">Por Prioridade</span>
                              <p className="text-xs text-gray-500">Distribui por ordem de prioridade</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {formData.type === 'percentage' ? 'A energia será distribuída baseada em porcentagens fixas para cada assinante.' : 'A energia será distribuída baseada na prioridade de cada assinante, preenchendo primeiro os de maior prioridade.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium text-gray-700">Geração Esperada (kWh)</Label>
                    <Input type="number" min="0" step="0.01" value={formData.expectedGeneration} onChange={e => setFormData(prev => ({
                    ...prev,
                    expectedGeneration: parseFloat(e.target.value) || 0
                  }))} className="mt-2 h-12 text-lg" placeholder="Ex: 1500.00" />
                    <p className="text-sm text-gray-500 mt-2">
                      Quantidade de energia que a geradora deve produzir no período
                    </p>
                  </div>

                  
                </div>
              </div>
            </div>

            {/* Validação */}
            {(!formData.generatorId || !formData.subscriberId) && <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800">
                  Selecione uma geradora e um assinante para continuar.
                </p>
              </div>}

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} className="px-8 py-3 h-12">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="px-8 py-3 h-12 bg-green-600 hover:bg-green-700" disabled={!formData.generatorId || !formData.subscriberId}>
                <Save className="w-4 h-4 mr-2" />
                Criar Rateio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default RateioForm;