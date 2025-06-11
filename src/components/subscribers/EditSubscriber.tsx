
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
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
  const { updateSubscriber } = useSubscribers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!subscriber) return null;

  const handleUpdate = async (data: SubscriberFormData) => {
    try {
      setIsSubmitting(true);
      await updateSubscriber(subscriber.id, data);
      toast.success('Assinante atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar assinante:', error);
      toast.error('Erro ao atualizar assinante');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] p-0 overflow-hidden flex flex-col">
        {/* Header personalizado */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Editar Assinante
                </h2>
                <p className="text-sm text-gray-600">
                  Atualize os dados de {subscriber.subscriber.name}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="hidden sm:flex"
            >
              Cancelar
            </Button>
          </div>
        </div>
        
        {/* Conteúdo com scroll */}
        <div className="flex-grow overflow-y-auto">
          <NovoAssinante 
            onClose={onClose}
            initialData={subscriber}
            onSubmit={handleUpdate}
            isEditing={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriber;
