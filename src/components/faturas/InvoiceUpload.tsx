
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';
import { toast } from 'sonner';

interface InvoiceUploadProps {
  subscriber: SubscriberRecord;
}

export function InvoiceUpload({ subscriber }: InvoiceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [observations, setObservations] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são aceitos');
        return;
      }
      
      // Validar tamanho (máximo 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 10MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Selecione um arquivo para upload');
      return;
    }

    setUploading(true);
    
    try {
      // Simular upload - aqui você integraria com o Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploaded(true);
      toast.success('Fatura enviada com sucesso!');
      
      // Aqui você salvaria os dados no banco de dados
      console.log('Dados para salvar:', {
        subscriber_id: subscriber.id,
        file_name: file.name,
        file_size: file.size,
        observations: observations,
        upload_date: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da fatura');
    } finally {
      setUploading(false);
    }
  };

  const subscriberData = subscriber.subscriber;
  const energyAccount = subscriber.energy_account;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload da Fatura</h3>
        <p className="text-muted-foreground">
          Faça o upload da fatura da Equatorial para o assinante selecionado
        </p>
      </div>

      {/* Resumo do Assinante */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo do Assinante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {subscriberData?.fullName || subscriberData?.companyName}
              </p>
              <p className="text-sm text-muted-foreground">
                UC: {energyAccount?.uc} | {subscriberData?.cpf || subscriberData?.cnpj}
              </p>
            </div>
            <Badge variant="outline">
              {subscriber.plan_contract?.discountPercentage || 0}% desconto
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upload da Fatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Fatura da Equatorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploaded ? (
            <>
              <div>
                <Label htmlFor="invoice-file">Arquivo da Fatura (PDF)</Label>
                <Input
                  id="invoice-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Apenas arquivos PDF, máximo 10MB
                </p>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="observations">Observações (Opcional)</Label>
                <Textarea
                  id="observations"
                  placeholder="Adicione observações sobre esta fatura..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Fatura
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Fatura Enviada com Sucesso!
              </h3>
              <p className="text-muted-foreground mb-4">
                A fatura foi processada e está pronta para análise
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">Próximos passos:</p>
                    <ul className="text-sm text-green-700 mt-1 space-y-1">
                      <li>• A fatura será validada automaticamente</li>
                      <li>• O desconto será aplicado conforme o plano</li>
                      <li>• Uma nova fatura será gerada em breve</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Informações Importantes</h4>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• Certifique-se de que a fatura está legível e completa</li>
                <li>• O desconto será aplicado automaticamente: {subscriber.plan_contract?.discountPercentage || 0}%</li>
                <li>• A fatura processada estará disponível em "Faturas Emitidas"</li>
                <li>• Em caso de erro, entre em contato com o suporte</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
