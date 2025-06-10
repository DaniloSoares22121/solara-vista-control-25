
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Zap, 
  FileText, 
  FileCheck, 
  Receipt, 
  UserCheck, 
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
  { title: 'Assinantes', url: '/dashboard/assinantes', icon: Users },
  { title: 'Cadastrar rateio', url: '/dashboard/rateio', icon: Calculator },
  { title: 'Geradoras', url: '/dashboard/geradoras', icon: Zap },
  { title: 'Fatura única', url: '/dashboard/fatura-unica', icon: FileText },
  { title: 'Faturas em Validação', url: '/dashboard/fatura-validacao', icon: FileCheck },
  { title: 'Faturas Emitidas', url: '/dashboard/faturas-emitidas', icon: Receipt },
  { title: 'Representantes', url: '/dashboard/representantes', icon: UserCheck },
  { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="bg-green-600 border-none" collapsible="icon">
      <div className="h-screen bg-green-600 flex flex-col">
        <SidebarContent className="bg-green-600 flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center p-3 border-b border-green-500/20 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-white">
                SolarControl
              </h2>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-green-700/40 hover:bg-green-700/60 text-white transition-all duration-200 shadow-sm"
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
                <SidebarGroupLabel className="text-green-100 px-2 py-2 text-xs font-medium uppercase tracking-wider mb-3">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className={`space-y-2 ${isCollapsed ? 'items-center' : ''}`}>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        size="lg"
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-white group ${
                              isActive 
                                ? 'bg-green-700/80 text-white shadow-md' 
                                : 'hover:bg-green-700/50'
                            } ${isCollapsed ? 'justify-center w-12 h-12' : ''}`
                          }
                        >
                          <item.icon className={`flex-shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
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
          
          {/* Footer */}
          <div className="flex-shrink-0 p-3">
            {!isCollapsed ? (
              <div className="bg-green-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-300 rounded-full flex-shrink-0"></div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium">Sistema Online</p>
                    <p className="text-green-100 text-xs opacity-80">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-300 rounded-full shadow-sm"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
