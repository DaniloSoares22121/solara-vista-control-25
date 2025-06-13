
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Upload, FileText, Trash2, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

  // Debug: Log do estado sempre que mudar
  useEffect(() => {
    console.log('🔍 [DEBUG] Estado atual dos arquivos:', uploadedFiles);
    console.log('🔍 [DEBUG] Número de arquivos no estado:', Object.keys(uploadedFiles).length);
    console.log('🔍 [DEBUG] Dados do formulário - attachments:', form.getValues('attachments'));
  }, [uploadedFiles, form]);

  const handleFileUpload = (fieldName: string, file: File | null) => {
    console.log('🔄 [FILE UPLOAD] Iniciando upload:', { fieldName, file: file?.name });
    
    if (!file) {
      console.log('❌ [FILE UPLOAD] Nenhum arquivo selecionado');
      return;
    }

    // Validar formato
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ [FILE UPLOAD] Formato inválido:', file.type);
      alert('Formato inválido. Use PDF, PNG ou JPG.');
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ [FILE UPLOAD] Arquivo muito grande:', file.size);
      alert('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    console.log('✅ [FILE UPLOAD] Arquivo válido, processando...');

    // Atualizar estado local usando callback para garantir que funcione
    setUploadedFiles(prev => {
      const newFiles = {
        ...prev,
        [fieldName]: file
      };
      console.log('🔄 [FILE UPLOAD] Novo estado será:', newFiles);
      return newFiles;
    });
    
    // Atualizar o formulário
    const currentAttachments = form.getValues('attachments') || {};
    form.setValue('attachments', {
      ...currentAttachments,
      [fieldName]: file
    });
    
    console.log('✅ [FILE UPLOAD] Arquivo processado com sucesso!');
  };

  const removeFile = (fieldName: string) => {
    console.log('🗑️ [FILE REMOVE] Removendo arquivo:', fieldName);
    
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      console.log('🗑️ [FILE REMOVE] Novo estado após remoção:', newFiles);
      return newFiles;
    });
    
    // Limpar o formulário
    const currentAttachments = form.getValues('attachments') || {};
    const newAttachments = { ...currentAttachments };
    delete newAttachments[fieldName];
    form.setValue('attachments', newAttachments);
    
    // Limpar o input
    if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
      fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
    }
    
    console.log('✅ [FILE REMOVE] Arquivo removido com sucesso');
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
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-green-600 font-medium">✅ Arquivo anexado</p>
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
                          onClick={() => {
                            console.log('🔄 [FILE BUTTON] Abrindo seletor de arquivo para:', name);
                            fileInputRefs[name].current?.click();
                          }}
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
                            console.log('🔄 [FILE INPUT] Arquivo selecionado:', selectedFile?.name);
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
          <h4 className="font-medium text-green-900 mb-2">Arquivos Anexados ({Object.keys(uploadedFiles).length})</h4>
          <div className="space-y-1">
            {Object.entries(uploadedFiles).map(([fieldName, file]) => (
              <div key={fieldName} className="flex items-center gap-2 text-sm text-green-800">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{fieldName}:</span>
                <span>{file.name}</span>
                <span className="text-green-600">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Debug - Estado dos Arquivos</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>Arquivos no estado:</strong> {Object.keys(uploadedFiles).length}</p>
          <p><strong>Nomes dos arquivos:</strong> {Object.keys(uploadedFiles).join(', ') || 'Nenhum'}</p>
          <div className="bg-white p-2 rounded mt-2 max-h-32 overflow-auto">
            <pre>{JSON.stringify(uploadedFiles, (key, value) => {
              if (value instanceof File) {
                return `File: ${value.name} (${value.size} bytes)`;
              }
              return value;
            }, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorAttachmentsForm;
