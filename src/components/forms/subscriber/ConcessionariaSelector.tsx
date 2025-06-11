
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ConcessionariaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ConcessionariaSelector = ({ value, onChange }: ConcessionariaSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Seleção da Concessionária</h3>
      <div className="space-y-2">
        <Label htmlFor="concessionaria">Concessionária *</Label>
        <Select value={value} onValueChange={onChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a concessionária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equatorial-goias">Equatorial Goiás</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConcessionariaSelector;
