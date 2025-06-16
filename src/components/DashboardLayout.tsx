
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu, Bell, Settings } from 'lucide-react';
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
      <div className="min-h-screen w-full flex bg-gray-50/30">
        <AppSidebar />
        
        {/* Container principal */}
        <div className="flex-1 flex flex-col">
          {/* Header simplificado */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <SidebarTrigger className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
              </div>
              
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">SolarControl</h1>
                </div>
              </div>
            </div>
            
            {/* User section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </Button>
              
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
              
              {/* Logout button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
