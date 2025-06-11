
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { SubscriberFormData } from '@/types/subscriber';
import { useSubscribers } from '@/hooks/useSubscribers';
import NovoAssinante from '@/pages/dashboard/NovoAssinante';

interface EditSubscriberProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: (SubscriberFormData & { id: string }) | null;
}

const EditSubscriber = ({ isOpen, onClose, subscriber }: EditSubscriberProps) => {
  const { updateSubscriber, loading } = useSubscribers();

  if (!subscriber) return null;

  const handleUpdate = async (data: SubscriberFormData) => {
    try {
      await updateSubscriber(subscriber.id, data);
      toast.success('Assinante atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar assinante:', error);
      toast.error('Erro ao atualizar assinante');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Editar Assinante - {subscriber.subscriber.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 pt-0">
            <NovoAssinante 
              onClose={onClose}
              initialData={subscriber}
              onSubmit={handleUpdate}
              isEditing={true}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriber;
