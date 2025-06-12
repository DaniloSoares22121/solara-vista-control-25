
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
    <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 p-4 lg:p-6 rounded-xl border border-emerald-100/50 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-emerald-800">Concessionária de Energia</h3>
          <p className="text-emerald-600/70 text-sm">Selecione a distribuidora de energia elétrica</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concessionaria" className="text-sm font-semibold text-emerald-800">Concessionária *</Label>
        <Select value={value || 'equatorial-goias'} onValueChange={onChange} required>
          <SelectTrigger className="h-10 lg:h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 transition-all duration-200">
            <SelectValue placeholder="Selecione a concessionária" />
          </SelectTrigger>
          <SelectContent className="bg-white border-emerald-200">
            <SelectItem value="equatorial-goias">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
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
