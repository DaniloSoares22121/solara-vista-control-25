
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface GeneratorAttachmentsFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

interface FileUploadData {
  file: File;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

const GeneratorAttachmentsForm = ({ form }: GeneratorAttachmentsFormProps) => {
  const [files, setFiles] = useState<Record<string, FileUploadData>>({});
  const [forceUpdate, setForceUpdate] = useState(0);
  const ownerType = form.watch('owner.type');
  
  // Refs para os inputs de arquivo
  const fileInputRefs = {
    contrato: useRef<HTMLInputElement>(null),
    cnh: useRef<HTMLInputElement>(null),
    contratoSocial: useRef<HTMLInputElement>(null),
    conta: useRef<HTMLInputElement>(null),
    procuracao: useRef<HTMLInputElement>(null),
  };

  // Função para atualizar estado local baseado no formulário
  const updateLocalState = useCallback(() => {
    const formAttachments = form.getValues('attachments');
    console.log('🔄 Atualizando estado local, attachments do form:', formAttachments);
    
    if (formAttachments && typeof formAttachments === 'object') {
      const validFiles: Record<string, FileUploadData> = {};
      
      Object.entries(formAttachments).forEach(([key, value]) => {
        if (value && 
            typeof value === 'object' && 
            'name' in value && 
            'size' in value &&
            'type' in value) {
          
          const fileObject = 'file' in value && value.file instanceof File 
            ? value.file 
            : new File([''], value.name as string, { type: value.type as string });
          
          validFiles[key] = {
            file: fileObject,
            name: value.name as string,
            size: value.size as number,
            type: value.type as string,
            uploadedAt: ('uploadedAt' in value ? value.uploadedAt : new Date().toISOString()) as string
          };
          
          console.log(`✅ Arquivo válido encontrado [${key}]:`, validFiles[key].name);
        }
      });
      
      console.log('📁 Total de arquivos válidos:', Object.keys(validFiles).length);
      setFiles(validFiles);
    } else {
      console.log('❌ Nenhum attachment encontrado no formulário');
      setFiles({});
    }
  }, [form]);

  // Sincronizar quando attachments mudar
  useEffect(() => {
    updateLocalState();
  }, [updateLocalState, forceUpdate]);

  // Watch mudanças no campo attachments
  const watchedAttachments = form.watch('attachments');
  useEffect(() => {
    console.log('👁️ Watch detectou mudança em attachments:', watchedAttachments);
    updateLocalState();
  }, [watchedAttachments, updateLocalState]);

  const handleFileUpload = async (fieldName: string, selectedFile: File | null) => {
    console.log(`📤 Iniciando upload para campo [${fieldName}]:`, selectedFile?.name);
    
    if (!selectedFile) {
      console.log('❌ Nenhum arquivo selecionado');
      return;
    }

    // Validações
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Formato inválido. Use PDF, PNG ou JPG.');
      if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
        fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
      }
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      alert('Arquivo muito grande. Máximo 10MB.');
      if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
        fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
      }
      return;
    }

    // Criar objeto do arquivo
    const fileData: FileUploadData = {
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      uploadedAt: new Date().toISOString()
    };

    console.log(`💾 Dados do arquivo criados [${fieldName}]:`, fileData);

    // Atualizar formulário
    const currentAttachments = form.getValues('attachments') || {};
    const updatedAttachments = { 
      ...currentAttachments, 
      [fieldName]: fileData
    };
    
    console.log('📝 Atualizando formulário com:', updatedAttachments);
    
    // Usar setValue
    form.setValue('attachments', updatedAttachments, { 
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true 
    });

    // Atualizar estado local imediatamente
    setFiles(prev => {
      const newFiles = {
        ...prev,
        [fieldName]: fileData
      };
      console.log('🔄 Estado local atualizado:', newFiles);
      return newFiles;
    });

    // Forçar re-render
    setForceUpdate(prev => prev + 1);
    
    console.log(`✅ Upload concluído para [${fieldName}]`);
  };

  const removeFile = (fieldName: string) => {
    console.log(`🗑️ Removendo arquivo [${fieldName}]`);
    
    // Atualizar formulário
    const currentAttachments = form.getValues('attachments') || {};
    const updatedAttachments = { ...currentAttachments };
    delete updatedAttachments[fieldName];
    
    form.setValue('attachments', updatedAttachments, { 
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true 
    });
    
    // Limpar input
    if (fileInputRefs[fieldName as keyof typeof fileInputRefs].current) {
      fileInputRefs[fieldName as keyof typeof fileInputRefs].current!.value = '';
    }
    
    // Atualizar estado local imediatamente
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      console.log('🔄 Estado local após remoção:', newFiles);
      return newFiles;
    });

    // Forçar re-render
    setForceUpdate(prev => prev + 1);
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
    const fileData = files[name];
    const hasFile = !!fileData && fileData.name && fileData.size > 0;
    
    console.log(`🔍 [FIELD ${name}] hasFile: ${hasFile}, fileData:`, fileData);
    
    return (
      <FormField
        control={form.control}
        name={`attachments.${name}` as any}
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Card className={`border-2 border-dashed transition-all ${
                hasFile 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <CardContent className="p-6">
                  {hasFile ? (
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
                            Arquivo anexado
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
                          onClick={() => fileInputRefs[name].current?.click()}
                          className="mb-2 hover:bg-blue-50 border-blue-200"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Selecionar Arquivo
                        </Button>
                        <p className="text-sm text-gray-600">
                          Clique para fazer upload do arquivo
                        </p>
                        <p className="text-xs text-gray-500">
                          Formatos: PDF, JPG, PNG (máx. 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Input
                    ref={fileInputRefs[name]}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      handleFileUpload(name, selectedFile);
                    }}
                    className="hidden"
                  />
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
      {Object.keys(files).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Arquivos Anexados ({Object.keys(files).length})
          </h4>
          <div className="space-y-2">
            {Object.entries(files).map(([fieldName, fileData]) => (
              <div key={fieldName} className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <span className="font-medium text-green-900 capitalize">
                    {fieldName === 'contratoSocial' ? 'Contrato Social' : 
                     fieldName === 'contrato' ? 'Contrato' :
                     fieldName === 'cnh' ? 'CNH' :
                     fieldName === 'conta' ? 'Conta' :
                     fieldName === 'procuracao' ? 'Procuração' : fieldName}:
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
    </div>
  );
};

export default GeneratorAttachmentsForm;
