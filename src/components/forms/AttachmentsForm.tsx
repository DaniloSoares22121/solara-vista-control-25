
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubscriberFormData } from '@/types/subscriber';

interface AttachmentsFormProps {
  initialValues: SubscriberFormData['attachments'];
  onChange: (value: SubscriberFormData['attachments']) => void;
  isEditing?: boolean;
}

const AttachmentsForm = forwardRef<HTMLFormElement, AttachmentsFormProps>(
  ({ initialValues, onChange, isEditing }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!);

    const handleFileChange = (field: string, file: File | null) => {
      onChange({
        ...initialValues,
        [field]: file
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>7. Anexos</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contrato">Contrato do Assinante assinado</Label>
                <Input
                  id="contrato"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('contrato', e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cnh">CNH do assinante</Label>
                <Input
                  id="cnh"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('cnh', e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="conta">Conta do assinante</Label>
                <Input
                  id="conta"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('conta', e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contratoSocial">Contrato Social (se PJ)</Label>
                <Input
                  id="contratoSocial"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('contratoSocial', e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="procuracao">Procuração (se troca de titularidade)</Label>
                <Input
                  id="procuracao"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('procuracao', e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
);

AttachmentsForm.displayName = 'AttachmentsForm';

export default AttachmentsForm;
