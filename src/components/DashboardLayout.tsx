
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
      <div className="min-h-screen w-full flex bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header com altura fixa e padding consistente */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 h-16 flex-shrink-0">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <SidebarTrigger className="h-10 w-10 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    <Menu className="w-5 h-5" />
                  </SidebarTrigger>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Solar<span className="text-green-600">Control</span>
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* User info com padding consistente */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Logout button com tamanho consistente */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content SEM PADDING para ocupar toda a largura */}
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
