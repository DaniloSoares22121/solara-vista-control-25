
import React, { useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Attachments } from '@/types/subscriber';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AttachmentsFormProps {
  data: Attachments;
  subscriberType: 'person' | 'company';
  willTransfer: boolean;
  onUpdate: (data: Partial<Attachments>) => void;
  form: UseFormReturn<any>;
}

const AttachmentsForm = ({ 
  data, 
  subscriberType, 
  willTransfer, 
  onUpdate, 
  form 
}: AttachmentsFormProps) => {
  const fileInputRefs = {
    contract: useRef<HTMLInputElement>(null),
    cnh: useRef<HTMLInputElement>(null),
    bill: useRef<HTMLInputElement>(null),
    companyContract: useRef<HTMLInputElement>(null),
    procuration: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (type: keyof Attachments, file: File | null) => {
    if (file) {
      // Validar formato
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Formato inválido. Use PDF, PNG ou JPG.');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      onUpdate({ [type]: file });
      toast.success(`Arquivo ${file.name} anexado com sucesso!`);
    }
  };

  const removeFile = (type: keyof Attachments) => {
    onUpdate({ [type]: undefined });
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current!.value = '';
    }
  };

  const renderFileUpload = (
    type: keyof Attachments,
    label: string,
    required: boolean = false
  ) => {
    const file = data[type];
    
    return (
      <FormField
        control={form.control}
        name={`attachments.${type}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label} {required && '*'}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRefs[type].current?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Selecionar Arquivo</span>
                  </Button>
                  <Input
                    ref={fileInputRefs[type]}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      field.onChange(selectedFile);
                      handleFileSelect(type, selectedFile);
                    }}
                  />
                </div>
                
                {file && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">{file.name}</span>
                      <span className="text-xs text-green-600">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(type)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Formatos aceitos: PDF, PNG, JPG. Tamanho máximo: 5MB.
                </p>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">9. Anexos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documentos Obrigatórios */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Documentos Obrigatórios</h4>
          
          {renderFileUpload('contract', 'Contrato do Assinante assinado', true)}
          {renderFileUpload('bill', 'Conta do Assinante', true)}
          
          {subscriberType === 'person' && 
            renderFileUpload('cnh', 'CNH do Assinante', true)
          }
          
          {subscriberType === 'company' && 
            renderFileUpload('companyContract', 'Contrato Social', true)
          }
        </div>

        {/* Documentos Condicionais */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Documentos Condicionais</h4>
          
          {willTransfer && (
            renderFileUpload('procuration', 'Procuração (Troca de Titularidade)', true)
          )}
          
          {!willTransfer && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                Nenhum documento condicional necessário no momento.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumo dos Anexos */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Resumo dos Anexos</h4>
        <div className="text-sm text-blue-800">
          <p>• Contrato do Assinante: {data.contract ? '✓ Anexado' : '✗ Pendente'}</p>
          <p>• Conta do Assinante: {data.bill ? '✓ Anexado' : '✗ Pendente'}</p>
          {subscriberType === 'person' && (
            <p>• CNH: {data.cnh ? '✓ Anexado' : '✗ Pendente'}</p>
          )}
          {subscriberType === 'company' && (
            <p>• Contrato Social: {data.companyContract ? '✓ Anexado' : '✗ Pendente'}</p>
          )}
          {willTransfer && (
            <p>• Procuração: {data.procuration ? '✓ Anexado' : '✗ Pendente'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsForm;
