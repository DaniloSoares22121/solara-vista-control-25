
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Upload, FileText, Trash2, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface GeneratorAttachmentsFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorAttachmentsForm = ({ form }: GeneratorAttachmentsFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const ownerType = form.watch('owner.type');
  
  // Refs para os inputs de arquivo
  const fileInputRefs = {
    contrato: useRef<HTMLInputElement>(null),
    cnh: useRef<HTMLInputElement>(null),
    contratoSocial: useRef<HTMLInputElement>(null),
    conta: useRef<HTMLInputElement>(null),
    procuracao: useRef<HTMLInputElement>(null),
  };

  const handleFileUpload = (fieldName: string, file: File | null) => {
    if (file) {
      // Validar formato
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Formato inválido. Use PDF, PNG ou JPG.');
        return;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.error('Arquivo muito grande. Máximo 10MB.');
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
      
      // Atualizar o formulário
      form.setValue(`attachments.${fieldName}` as any, file);
      console.log(`✅ Arquivo ${file.name} anexado com sucesso!`);
    }
  };

  const removeFile = (fieldName: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
    
    // Limpar o formulário
    form.setValue(`attachments.${fieldName}` as any, undefined);
    
    // Limpar o input
    if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
      fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
    }
  };

  const FileUploadField = ({ 
    name, 
    label, 
    required = false 
  }: { 
    name: keyof typeof fileInputRefs; 
    label: string; 
    required?: boolean;
  }) => {
    const file = uploadedFiles[name];
    
    return (
      <FormField
        control={form.control}
        name={`attachments.${name}` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">
              {label} {required && '*'}
            </FormLabel>
            <FormControl>
              <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-6">
                  {file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRefs[name].current?.click()}
                          className="mb-2"
                        >
                          Selecionar Arquivo
                        </Button>
                        <p className="text-sm text-gray-600">
                          Clique para fazer upload ou arraste o arquivo aqui
                        </p>
                        <Input
                          ref={fileInputRefs[name]}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0] || null;
                            handleFileUpload(name, selectedFile);
                            field.onChange(selectedFile);
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">5</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Anexos</h3>
      </div>

      <div className="space-y-6">
        <FileUploadField 
          name="contrato" 
          label="Contrato da Venda dos Créditos" 
          required 
        />

        <FileUploadField 
          name="cnh" 
          label="CNH" 
        />

        {ownerType === 'juridica' && (
          <FileUploadField 
            name="contratoSocial" 
            label="Contrato Social" 
            required 
          />
        )}

        <FileUploadField 
          name="conta" 
          label="Conta da Geradora" 
          required 
        />

        <FileUploadField 
          name="procuracao" 
          label="Procuração" 
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          <strong>Formatos aceitos:</strong> PDF, JPG, JPEG, PNG, DOC, DOCX
        </p>
        <p className="text-yellow-800 text-sm mt-1">
          <strong>Tamanho máximo:</strong> 10MB por arquivo
        </p>
      </div>

      {/* Resumo dos Anexos */}
      {Object.keys(uploadedFiles).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Arquivos Anexados</h4>
          <div className="space-y-1">
            {Object.entries(uploadedFiles).map(([fieldName, file]) => (
              <div key={fieldName} className="flex items-center gap-2 text-sm text-green-800">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
                <span className="text-green-600">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorAttachmentsForm;
