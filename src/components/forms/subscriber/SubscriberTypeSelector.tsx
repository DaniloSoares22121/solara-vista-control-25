
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SubscriberTypeSelectorProps {
  value: 'person' | 'company';
  onChange: (value: 'person' | 'company') => void;
}

const SubscriberTypeSelector = ({ value, onChange }: SubscriberTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tipo de Assinante</h3>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="person" id="person" />
          <Label htmlFor="person" className="cursor-pointer">Pessoa Física</Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="company" id="company" />
          <Label htmlFor="company" className="cursor-pointer">Pessoa Jurídica</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SubscriberTypeSelector;
