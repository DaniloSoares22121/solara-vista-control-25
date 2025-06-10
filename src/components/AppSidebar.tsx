
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  Calculator, 
  UserCheck, 
  FileText, 
  FileCheck, 
  Receipt, 
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Geradoras', url: '/dashboard/geradoras', icon: Zap },
  { title: 'Assinantes', url: '/dashboard/assinantes', icon: Users },
  { title: 'Rateio', url: '/dashboard/rateio', icon: Calculator },
  { title: 'Representantes', url: '/dashboard/representantes', icon: UserCheck },
  { title: 'Fatura única', url: '/dashboard/fatura-unica', icon: FileText },
  { title: 'Fatura em validação', url: '/dashboard/fatura-validacao', icon: FileCheck },
  { title: 'Faturas emitidas', url: '/dashboard/faturas-emitidas', icon: Receipt },
  { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="bg-green-600 border-none" collapsible="icon">
      <div className="h-full bg-green-600">
        <SidebarContent className="bg-green-600">
          {/* Header com logo e botão de toggle */}
          <div className="flex items-center justify-between p-6 border-b border-green-500/30">
            {!isCollapsed && (
              <h2 className="text-2xl font-bold text-white">
                SolarControl
              </h2>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-lg bg-green-700/50 hover:bg-green-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu de navegação */}
          <SidebarGroup className="p-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-green-100 px-3 py-2 text-sm font-semibold uppercase tracking-wide">
                Navegação
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 mt-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => 
                          `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                            isActive 
                              ? 'bg-green-700 text-white shadow-lg transform scale-[1.02]' 
                              : 'text-white hover:bg-green-700/70 hover:text-white hover:transform hover:scale-[1.01]'
                          } ${isCollapsed ? 'justify-center px-3' : ''}`
                        }
                      >
                        <item.icon className="w-6 h-6 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium text-base">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Footer com status */}
          <div className="mt-auto p-6 border-t border-green-500/30">
            {!isCollapsed ? (
              <div className="bg-green-700/50 rounded-xl p-4 shadow-inner">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
                  <div>
                    <p className="text-white text-sm font-semibold">Sistema Online</p>
                    <p className="text-green-100 text-xs">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
