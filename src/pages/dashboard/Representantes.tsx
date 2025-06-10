
import { Card } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

const Representantes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 solar-gradient rounded-lg flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Representantes</h1>
      </div>
      
      <Card className="p-8 text-center">
        <p className="text-gray-600">
          Página de representantes em desenvolvimento...
        </p>
      </Card>
    </div>
  );
};

export default Representantes;
