
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
  ChevronRight,
  Sun
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
    <Sidebar className="bg-gradient-to-b from-green-600 via-green-700 to-green-800 border-none" collapsible="icon">
      <div className="h-screen bg-gradient-to-b from-green-600 via-green-700 to-green-800 flex flex-col">
        <SidebarContent className="bg-transparent flex flex-col h-full">
          {/* Header - Mais bonito no mobile */}
          <div className={`flex items-center p-3 sm:p-4 border-b border-green-500/20 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  SolarControl
                </h2>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-green-700/40 hover:bg-green-700/60 text-white transition-all duration-200 shadow-sm flex-shrink-0 touch-manipulation"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu de navegação - Melhorado */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-green-100 px-2 py-2 text-xs font-medium uppercase tracking-wider mb-3 opacity-80">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        size="default"
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-white group touch-manipulation ${
                              isActive 
                                ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/10' 
                                : 'hover:bg-white/10 hover:backdrop-blur-sm'
                            } ${isCollapsed ? 'justify-start px-2' : ''}`
                          }
                        >
                          <item.icon className="flex-shrink-0 w-5 h-5" />
                          {/* No mobile sempre mostra o texto quando aberto */}
                          <span className="font-medium text-sm truncate lg:hidden">
                            {item.title}
                          </span>
                          {/* Desktop: mostra/esconde baseado no estado colapsado */}
                          {!isCollapsed && (
                            <span className="font-medium text-sm truncate hidden lg:block">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          
          {/* Footer - Mais elegante */}
          <div className="flex-shrink-0 p-3 sm:p-4">
            {!isCollapsed ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full shadow-sm animate-pulse"></div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium">Sistema Online</p>
                    <p className="text-green-100 text-xs opacity-80 truncate">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-300 rounded-full shadow-sm animate-pulse"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
