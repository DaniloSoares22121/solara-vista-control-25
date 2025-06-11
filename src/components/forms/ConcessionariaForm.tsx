
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ConcessionariaFormProps {
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
}

const ConcessionariaForm = forwardRef<HTMLFormElement, ConcessionariaFormProps>(
  ({ value, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    return (
      <Card>
        <CardHeader>
          <CardTitle>1. Seleção da Concessionária</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
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
            <input type="hidden" name="concessionaria" value={value} required />
          </form>
        </CardContent>
      </Card>
    );
  }
);

ConcessionariaForm.displayName = 'ConcessionariaForm';

export default ConcessionariaForm;
