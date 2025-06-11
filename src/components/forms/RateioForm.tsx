
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Save, X } from 'lucide-react';
import { RateioFormData } from '@/types/rateio';

interface RateioFormProps {
  onSubmit: (data: RateioFormData) => void;
  onCancel: () => void;
}

const RateioForm: React.FC<RateioFormProps> = ({ onSubmit, onCancel }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Novo Rateio de Energia</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="generatorId">Geradora</Label>
              <Select 
                value={formData.generatorId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, generatorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma geradora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temp">Nenhuma geradora disponível</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriberId">Assinante</Label>
              <Select 
                value={formData.subscriberId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subscriberId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um assinante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temp">Nenhum assinante disponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Rateio</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'percentage' | 'priority') => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Por Porcentagem</SelectItem>
                <SelectItem value="priority">Por Prioridade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Dia</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedGeneration">Geração Esperada (kWh)</Label>
            <Input
              id="expectedGeneration"
              type="number"
              min="0"
              step="0.01"
              value={formData.expectedGeneration}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                expectedGeneration: parseFloat(e.target.value) || 0
              }))}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Criar Rateio</span>
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center space-x-2">
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RateioForm;
