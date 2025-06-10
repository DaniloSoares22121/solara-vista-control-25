
import DashboardLayout from '@/components/DashboardLayout';
import { Sun } from 'lucide-react';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 solar-gradient rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 solar-gradient rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 solar-gradient rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 solar-gradient rounded-3xl shadow-2xl">
            <Sun className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bem-vindo ao SolarControl!
          </h2>
          <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Sua plataforma de gestão de energia solar está pronta para revolucionar 
            o gerenciamento dos seus projetos.
          </p>
          <div className="inline-flex items-center space-x-2 text-green-600 font-semibold">
            <span>Selecione uma opção no menu lateral para começar</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
