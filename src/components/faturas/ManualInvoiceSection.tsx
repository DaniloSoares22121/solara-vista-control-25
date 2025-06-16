
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, User, Calculator, CreditCard } from 'lucide-react';
import SubscriberSelector from './SubscriberSelector';
import SubscriberDetails from './SubscriberDetails';
import InvoiceUpload from './InvoiceUpload';
import { SubscriberRecord } from '@/services/supabaseSubscriberService';

const ManualInvoiceSection = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberRecord | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubscriberSelect = (subscriber: SubscriberRecord) => {
    setSelectedSubscriber(subscriber);
    setUploadedFile(null); // Reset upload when changing subscriber
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleProcessInvoice = () => {
    if (!selectedSubscriber || !uploadedFile) return;
    
    // TODO: Implementar processamento da fatura
    console.log('Processando fatura:', {
      subscriber: selectedSubscriber,
      file: uploadedFile
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold">Fatura Manual</div>
              <div className="text-blue-100 text-sm font-normal">
                Selecione um assinante e faça upload da fatura da Equatorial
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedSubscriber ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium">1. Selecionar Assinante</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${uploadedFile ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium">2. Upload da Fatura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedSubscriber && uploadedFile ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium">3. Processar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Subscriber Selection */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <User className="w-5 h-5 text-blue-600" />
            Selecionar Assinante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriberSelector
            selectedSubscriber={selectedSubscriber}
            onSubscriberSelect={handleSubscriberSelect}
          />
        </CardContent>
      </Card>

      {/* Step 2: Subscriber Details (shown when subscriber is selected) */}
      {selectedSubscriber && (
        <Card className="shadow-lg border-green-200">
          <CardHeader className="pb-4 bg-green-50">
            <CardTitle className="flex items-center gap-3 text-lg text-green-800">
              <Calculator className="w-5 h-5" />
              Detalhes do Assinante
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Selecionado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SubscriberDetails subscriber={selectedSubscriber} />
          </CardContent>
        </Card>
      )}

      {/* Step 3: Invoice Upload (shown when subscriber is selected) */}
      {selectedSubscriber && (
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <FileUp className="w-5 h-5 text-purple-600" />
              Upload da Fatura da Equatorial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Process Button (shown when both subscriber and file are selected) */}
      {selectedSubscriber && uploadedFile && (
        <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Pronto para Processar
                  </h3>
                  <p className="text-blue-700">
                    Assinante selecionado e fatura carregada
                  </p>
                </div>
              </div>
              <Button
                onClick={handleProcessInvoice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                Processar Fatura
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManualInvoiceSection;
