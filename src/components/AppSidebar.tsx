
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
      <div className="h-full bg-green-600 flex flex-col">
        <SidebarContent className="bg-green-600 flex flex-col h-full">
          {/* Header com logo e botão de toggle */}
          <div className="flex items-center justify-between p-4 border-b border-green-500/20">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-white">
                SolarControl
              </h2>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-green-700/30 hover:bg-green-700/50 text-white transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu de navegação */}
          <div className="flex-1 p-3">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-green-100 px-2 py-2 text-xs font-medium uppercase tracking-wider mb-2">
                  Navegação
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild size="lg">
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-3 rounded-md transition-colors text-white ${
                              isActive 
                                ? 'bg-green-700/70 text-white' 
                                : 'hover:bg-green-700/40'
                            } ${isCollapsed ? 'justify-center px-2' : ''}`
                          }
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <span className="font-medium text-sm">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          
          {/* Footer com status */}
          <div className="p-4 border-t border-green-500/20">
            {!isCollapsed ? (
              <div className="bg-green-700/30 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <div>
                    <p className="text-white text-xs font-medium">Sistema Online</p>
                    <p className="text-green-100 text-xs opacity-80">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
