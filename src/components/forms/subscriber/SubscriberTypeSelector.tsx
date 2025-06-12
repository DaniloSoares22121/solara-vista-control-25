
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
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-6 rounded-xl border border-green-100">
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 solar-gradient rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
          <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-primary">Tipo de Assinante</h3>
          <p className="text-primary/70 text-sm">Selecione o tipo de pessoa</p>
        </div>
      </div>

      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-4 lg:p-6 border-2 border-green-200 rounded-xl hover:bg-green-50/50 cursor-pointer transition-all duration-200 touch-manipulation">
          <RadioGroupItem value="person" id="person" className="border-primary text-primary" />
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <Label htmlFor="person" className="cursor-pointer font-semibold text-foreground">Pessoa Física</Label>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 lg:p-6 border-2 border-green-200 rounded-xl hover:bg-green-50/50 cursor-pointer transition-all duration-200 touch-manipulation">
          <RadioGroupItem value="company" id="company" className="border-primary text-primary" />
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <Label htmlFor="company" className="cursor-pointer font-semibold text-foreground">Pessoa Jurídica</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SubscriberTypeSelector;
