
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface GeneratorAttachmentsFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
}

const GeneratorAttachmentsForm = ({ form }: GeneratorAttachmentsFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileData>>({});
  const ownerType = form.watch('owner.type');
  
  // Refs para os inputs de arquivo
  const fileInputRefs = {
    contrato: useRef<HTMLInputElement>(null),
    cnh: useRef<HTMLInputElement>(null),
    contratoSocial: useRef<HTMLInputElement>(null),
    conta: useRef<HTMLInputElement>(null),
    procuracao: useRef<HTMLInputElement>(null),
  };

  // Sync form data with local state on mount
  useEffect(() => {
    const formAttachments = form.getValues('attachments') || {};
    console.log('🔍 [ATTACHMENTS] Dados do formulário ao carregar:', formAttachments);
    
    const fileEntries: Record<string, FileData> = {};
    
    Object.entries(formAttachments).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'file' in value) {
        fileEntries[key] = value as FileData;
      }
    });
    
    if (Object.keys(fileEntries).length > 0) {
      setUploadedFiles(fileEntries);
      console.log('✅ [ATTACHMENTS] Arquivos carregados do formulário:', fileEntries);
    }
  }, []);

  const handleFileUpload = (fieldName: string, file: File | null) => {
    console.log('🔄 [FILE UPLOAD] Iniciando upload:', { 
      fieldName, 
      fileName: file?.name, 
      fileSize: file?.size,
      fileType: file?.type 
    });
    
    if (!file) {
      console.log('❌ [FILE UPLOAD] Nenhum arquivo selecionado');
      return;
    }

    // Validar formato
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ [FILE UPLOAD] Formato inválido:', file.type);
      alert('Formato inválido. Use PDF, PNG ou JPG.');
      if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
        fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
      }
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ [FILE UPLOAD] Arquivo muito grande:', file.size);
      alert('Arquivo muito grande. Máximo 10MB.');
      if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
        fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
      }
      return;
    }

    console.log('✅ [FILE UPLOAD] Arquivo válido, processando...');

    // Criar estrutura de dados do arquivo
    const fileData: FileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type
    };

    // Atualizar estado local
    setUploadedFiles(prevFiles => {
      const newFiles = {
        ...prevFiles,
        [fieldName]: fileData
      };
      console.log('🔄 [FILE UPLOAD] Estado anterior:', Object.keys(prevFiles));
      console.log('🔄 [FILE UPLOAD] Novo estado:', Object.keys(newFiles));
      return newFiles;
    });
    
    // Atualizar o formulário
    const currentAttachments = form.getValues('attachments') || {};
    const newAttachments = {
      ...currentAttachments,
      [fieldName]: fileData
    };
    
    console.log('📝 [FORM UPDATE] Atualizando formulário com:', fieldName, fileData.name);
    form.setValue('attachments', newAttachments, { shouldValidate: true });
    
    console.log('✅ [FILE UPLOAD] Arquivo processado com sucesso!');
  };

  const removeFile = (fieldName: string) => {
    console.log('🗑️ [FILE REMOVE] Removendo arquivo:', fieldName);
    
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      console.log('🗑️ [FILE REMOVE] Novo estado após remoção:', Object.keys(newFiles));
      return newFiles;
    });
    
    // Limpar o formulário
    const currentAttachments = form.getValues('attachments') || {};
    const newAttachments = { ...currentAttachments };
    delete newAttachments[fieldName];
    form.setValue('attachments', newAttachments, { shouldValidate: true });
    
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
    const fileData = uploadedFiles[name];
    
    return (
      <FormField
        control={form.control}
        name={`attachments.${name}` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Card className={`border-2 border-dashed transition-all ${
                fileData 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <CardContent className="p-6">
                  {fileData ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{fileData.name}</p>
                          <p className="text-sm text-gray-500">
                            {(fileData.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Arquivo anexado com sucesso
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
                          className="mb-2 hover:bg-blue-50 border-blue-200"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Selecionar Arquivo
                        </Button>
                        <p className="text-sm text-gray-600">
                          Clique para fazer upload ou arraste o arquivo aqui
                        </p>
                        <p className="text-xs text-gray-500">
                          Formatos: PDF, JPG, PNG (máx. 10MB)
                        </p>
                        <Input
                          ref={fileInputRefs[name]}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0] || null;
                            console.log('🔄 [FILE INPUT] Arquivo selecionado no input:', { 
                              fieldName: name, 
                              fileName: selectedFile?.name,
                              fileSize: selectedFile?.size,
                              fileType: selectedFile?.type
                            });
                            
                            if (selectedFile) {
                              handleFileUpload(name, selectedFile);
                              // Atualizar o campo do formulário com o fileData, não o arquivo bruto
                              // O field.onChange será chamado automaticamente pelo handleFileUpload
                            }
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">5</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Anexos e Documentos</h3>
          <p className="text-sm text-gray-600 mt-1">
            Faça upload dos documentos necessários para a geradora
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <FileUploadField 
          name="contrato" 
          label="Contrato da Venda dos Créditos" 
          required 
        />

        <FileUploadField 
          name="cnh" 
          label="Carteira Nacional de Habilitação (CNH)" 
        />

        {ownerType === 'juridica' && (
          <FileUploadField 
            name="contratoSocial" 
            label="Contrato Social da Empresa" 
            required 
          />
        )}

        <FileUploadField 
          name="conta" 
          label="Comprovante da Conta da Geradora" 
          required 
        />

        <FileUploadField 
          name="procuracao" 
          label="Procuração (se aplicável)" 
        />
      </div>

      {/* Informações sobre formatos aceitos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 Informações Importantes</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Formatos aceitos:</strong> PDF, JPG, JPEG, PNG</p>
          <p><strong>Tamanho máximo:</strong> 10MB por arquivo</p>
          <p><strong>Qualidade:</strong> Certifique-se de que os documentos estejam legíveis</p>
        </div>
      </div>

      {/* Resumo dos Anexos */}
      {Object.keys(uploadedFiles).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Arquivos Anexados ({Object.keys(uploadedFiles).length})
          </h4>
          <div className="space-y-2">
            {Object.entries(uploadedFiles).map(([fieldName, fileData]) => (
              <div key={fieldName} className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <span className="font-medium text-green-900 capitalize">
                    {fieldName === 'contratoSocial' ? 'Contrato Social' : fieldName}:
                  </span>
                  <span className="ml-2 text-green-700">{fileData.name}</span>
                  <span className="ml-2 text-green-600 text-xs">
                    ({(fileData.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info - Temporário para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">🔧 Debug - Estado dos Arquivos</h4>
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Arquivos no estado local:</strong> {Object.keys(uploadedFiles).length}</p>
            <p><strong>Nomes dos arquivos:</strong> {Object.keys(uploadedFiles).join(', ') || 'Nenhum'}</p>
            {Object.entries(uploadedFiles).map(([key, fileData]) => (
              <p key={key}>
                <strong>{key}:</strong> {fileData?.name || 'undefined'} ({fileData?.size || 0} bytes)
              </p>
            ))}
            
            <div className="bg-white p-2 rounded mt-2 max-h-32 overflow-auto">
              <p><strong>Form attachments:</strong></p>
              <pre className="text-xs">{JSON.stringify(form.getValues('attachments'), (key, value) => {
                if (value && typeof value === 'object' && 'file' in value) {
                  return `FileData: ${value.name} (${value.size} bytes)`;
                }
                return value;
              }, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorAttachmentsForm;
