
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';

interface ConcessionariaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ConcessionariaSelector = ({ value, onChange }: ConcessionariaSelectorProps) => {
  React.useEffect(() => {
    if (!value) {
      onChange('equatorial-goias');
    }
  }, [value, onChange]);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-yellow-900">Concessionária de Energia</h3>
          <p className="text-yellow-600 text-sm">Selecione a distribuidora de energia elétrica</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concessionaria" className="text-sm font-semibold text-gray-700">Concessionária *</Label>
        <Select value={value || 'equatorial-goias'} onValueChange={onChange} required>
          <SelectTrigger className="h-12 transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            <SelectValue placeholder="Selecione a concessionária" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="equatorial-goias">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Equatorial Goiás
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConcessionariaSelector;
