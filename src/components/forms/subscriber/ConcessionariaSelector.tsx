
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';

interface ConcessionariaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ConcessionariaSelector = ({ value, onChange }: ConcessionariaSelectorProps) => {
  // Define automaticamente como Equatorial Goiás se não houver valor
  React.useEffect(() => {
    if (!value) {
      onChange('equatorial-goias');
    }
  }, [value, onChange]);

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-6 rounded-xl border border-green-100">
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 lg:w-10 lg:h-10 solar-gradient rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-primary">Concessionária de Energia</h3>
          <p className="text-primary/70 text-sm">Selecione a distribuidora de energia elétrica</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concessionaria" className="text-sm font-semibold text-foreground">Concessionária *</Label>
        <Select value={value || 'equatorial-goias'} onValueChange={onChange} required>
          <SelectTrigger className="h-10 lg:h-12 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary touch-manipulation">
            <SelectValue placeholder="Selecione a concessionária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equatorial-goias">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
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
