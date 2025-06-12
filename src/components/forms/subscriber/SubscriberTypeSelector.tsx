
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
    <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 p-4 lg:p-6 rounded-xl border border-emerald-100/50 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
          <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-emerald-800">Tipo de Assinante</h3>
          <p className="text-emerald-600/70 text-sm">Selecione o tipo de pessoa</p>
        </div>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-4 lg:p-6 border-2 border-emerald-200 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-all duration-200">
          <RadioGroupItem value="person" id="person" className="border-emerald-600 text-emerald-600" />
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <Label htmlFor="person" className="cursor-pointer font-semibold text-emerald-800">Pessoa Física</Label>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 lg:p-6 border-2 border-emerald-200 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-all duration-200">
          <RadioGroupItem value="company" id="company" className="border-emerald-600 text-emerald-600" />
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <Label htmlFor="company" className="cursor-pointer font-semibold text-emerald-800">Pessoa Jurídica</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SubscriberTypeSelector;
