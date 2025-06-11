
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SubscriberTypeSelectorProps {
  value: 'fisica' | 'juridica';
  onChange: (value: 'fisica' | 'juridica') => void;
}

const SubscriberTypeSelector = ({ value, onChange }: SubscriberTypeSelectorProps) => {
  console.log('SubscriberTypeSelector - current value:', value);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">2. Tipo de Assinante</h3>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => {
          console.log('SubscriberTypeSelector - changing to:', newValue);
          onChange(newValue as 'fisica' | 'juridica');
        }}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fisica" id="fisica" />
          <Label htmlFor="fisica" className="cursor-pointer">Pessoa Física</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="juridica" id="juridica" />
          <Label htmlFor="juridica" className="cursor-pointer">Pessoa Jurídica</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SubscriberTypeSelector;
