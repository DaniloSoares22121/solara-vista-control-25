
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
    <Sidebar className="bg-green-600" collapsible="icon">
      <div className="h-full bg-green-600">
        <SidebarContent className="bg-green-600">
          {/* Header com botão de toggle */}
          <div className="flex items-center justify-between p-4 border-b border-green-500">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-white">
                SolarControl
              </h2>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-green-700 hover:bg-green-800 text-white transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu de navegação */}
          <SidebarGroup className="p-2">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-green-100 px-4 py-2 text-sm font-medium">
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
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-green-700 text-white' 
                              : 'text-green-100 hover:bg-green-700 hover:text-white'
                          } ${isCollapsed ? 'justify-center px-3' : ''}`
                        }
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Footer com status */}
          <div className="mt-auto p-4 border-t border-green-500">
            {!isCollapsed ? (
              <div className="bg-green-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Sistema Online</p>
                    <p className="text-green-100 text-xs">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
