
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface WhatsAppTestMessageProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (number: string, text: string) => Promise<boolean>;
  isSending: boolean;
}

const WhatsAppTestMessage = ({ isOpen, onClose, onSend, isSending }: WhatsAppTestMessageProps) => {
  const [number, setNumber] = useState('');
  const [text, setText] = useState('Olá! Esta é uma mensagem de teste do Energy Pay.');

  const handleSend = async () => {
    if (!number || !text) return;
    
    const success = await onSend(number, text);
    if (success) {
      setNumber('');
      setText('Olá! Esta é uma mensagem de teste do Energy Pay.');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Mensagem de Teste</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número (com código do país)</Label>
            <Input
              id="number"
              placeholder="5511999999999"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Exemplo: 5511999999999 (Brasil + DDD + número)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text">Mensagem</Label>
            <Textarea
              id="text"
              placeholder="Digite sua mensagem..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!number || !text || isSending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppTestMessage;
