
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, LogOut, User, Menu, Bell, Settings, Search } from 'lucide-react';
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
      <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 h-20 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="lg:hidden">
                <SidebarTrigger className="h-11 w-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    SolarControl
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Sistema de Gestão Solar</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar assinantes, geradoras..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Enhanced User Section */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="h-11 w-11 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200">
                <Settings className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 max-w-[140px] truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">Administrador</p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-xl transition-all duration-200 px-4 py-2.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Sair</span>
              </Button>
            </div>
          </header>

          {/* Enhanced Main Content */}
          <main className="flex-1 p-8 overflow-hidden">
            <div className="h-full bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="h-full p-8 overflow-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
