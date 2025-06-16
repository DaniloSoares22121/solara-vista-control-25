
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
      <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 max-w-full">
          {/* Header otimizado */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 h-14 flex-shrink-0">
            <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <SidebarTrigger className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    <Menu className="w-4 h-4" />
                  </SidebarTrigger>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
                    Solar<span className="text-green-600">Control</span>
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User info otimizado */}
                <div className="flex items-center gap-2 bg-gray-50 px-2 sm:px-3 py-2 rounded-lg border">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 hidden sm:block max-w-24 truncate">
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Logout button otimizado */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 sm:px-3 border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline text-xs">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content sem padding para ocupar toda a largura */}
          <main className="flex-1 w-full overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
