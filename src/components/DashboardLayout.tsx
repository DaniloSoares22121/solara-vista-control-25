
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getUserDisplayName = () => {
    if (currentUser?.user_metadata?.full_name) {
      return currentUser.user_metadata.full_name;
    }
    return currentUser?.email || 'Usuário';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <AppSidebar />
        
        {/* Container principal com melhor espaçamento e visual */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header redesenhado com visual mais limpo */}
          <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-40 w-full">
            <div className="flex items-center justify-between h-16 px-6 lg:px-8">
              <div className="flex items-center space-x-4 min-w-0">
                {/* Mobile Menu Button - melhorado */}
                <div className="lg:hidden">
                  <SidebarTrigger className="p-2.5 h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                    <Menu className="w-5 h-5 text-white" />
                  </SidebarTrigger>
                </div>
                
                {/* Logo redesenhado */}
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 solar-gradient rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-bold text-slate-900">
                      Solar<span className="solar-text-gradient">Control</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">Sistema de Gestão</p>
                  </div>
                </div>
              </div>
              
              {/* User section redesenhada */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {/* User info melhorada */}
                <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                </div>
                
                {/* Logout button melhorado */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content com padding otimizado para desktop */}
          <main className="flex-1 w-full overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
