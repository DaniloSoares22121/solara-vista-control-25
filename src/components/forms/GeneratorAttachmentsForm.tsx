
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { GeneratorFormData } from '@/types/generator';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GeneratorAttachmentsFormProps {
  form: UseFormReturn<GeneratorFormData>;
}

const GeneratorAttachmentsForm = ({ form }: GeneratorAttachmentsFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const ownerType = form.watch('owner.type');

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
    // TODO: Implementar upload real do arquivo
  };

  const removeFile = (fieldName: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
  };

  const FileUploadField = ({ 
    name, 
    label, 
    required = false 
  }: { 
    name: string; 
    label: string; 
    required?: boolean;
  }) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} {required && '*'}</FormLabel>
          <FormControl>
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                {uploadedFiles[name] ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFiles[name].name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFiles[name].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo aqui</p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(name, file);
                            field.onChange(file);
                          }
                        }}
                        className="cursor-pointer"
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
          name="attachments.contrato" 
          label="Contrato da Venda dos Créditos" 
          required 
        />

        <FileUploadField 
          name="attachments.cnh" 
          label="CNH" 
        />

        {ownerType === 'juridica' && (
          <FileUploadField 
            name="attachments.contratoSocial" 
            label="Contrato Social" 
            required 
          />
        )}

        <FileUploadField 
          name="attachments.conta" 
          label="Conta da Geradora" 
          required 
        />

        <FileUploadField 
          name="attachments.procuracao" 
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
    </div>
  );
};

export default GeneratorAttachmentsForm;
