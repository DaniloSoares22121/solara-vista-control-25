
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Building2 } from 'lucide-react';

interface SubscriberTypeSelectorProps {
  value: 'person' | 'company';
  onChange: (value: 'person' | 'company') => void;
}

const SubscriberTypeSelector = ({ value, onChange }: SubscriberTypeSelectorProps) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-yellow-900">Tipo de Assinante</h3>
          <p className="text-yellow-600 text-sm">Selecione o tipo de pessoa</p>
        </div>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-6 border-2 border-yellow-200 rounded-xl hover:bg-yellow-50 cursor-pointer transition-all duration-200">
          <RadioGroupItem value="person" id="person" className="border-yellow-600 text-yellow-600" />
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-600" />
            <Label htmlFor="person" className="cursor-pointer font-semibold text-yellow-900">Pessoa Física</Label>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-6 border-2 border-yellow-200 rounded-xl hover:bg-yellow-50 cursor-pointer transition-all duration-200">
          <RadioGroupItem value="company" id="company" className="border-yellow-600 text-yellow-600" />
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-yellow-600" />
            <Label htmlFor="company" className="cursor-pointer font-semibold text-yellow-900">Pessoa Jurídica</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SubscriberTypeSelector;
