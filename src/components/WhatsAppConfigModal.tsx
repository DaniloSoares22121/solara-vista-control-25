
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WhatsAppConfig } from '@/services/whatsappService';

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WhatsAppConfig;
  onSave: (config: WhatsAppConfig) => void;
}

const WhatsAppConfigModal = ({ isOpen, onClose, config, onSave }: WhatsAppConfigModalProps) => {
  const [formData, setFormData] = useState<WhatsAppConfig>(config);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar API WhatsApp</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da API</Label>
            <Input
              id="apiUrl"
              placeholder="https://sub.domain.com"
              value={formData.apiUrl}
              onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Sua chave de API global"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instanceName">Nome da Instância</Label>
            <Input
              id="instanceName"
              placeholder="nome-da-instancia"
              value={formData.instanceName}
              onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConfigModal;
