
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
          {/* Header - More compact on mobile */}
          <div className={`flex items-center p-1.5 xs:p-2 sm:p-3 border-b border-green-500/20 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <h2 className="text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-white truncate">
                SolarControl
              </h2>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-1 xs:p-1.5 sm:p-2 rounded-md xs:rounded-lg bg-green-700/40 hover:bg-green-700/60 text-white transition-all duration-200 shadow-sm flex-shrink-0 touch-manipulation"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
              ) : (
                <ChevronLeft className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>

          {/* Menu de navegação */}
          <div className="flex-1 p-1.5 xs:p-2 sm:p-3 overflow-y-auto">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-green-100 px-1.5 xs:px-2 py-1 sm:py-2 text-xs font-medium uppercase tracking-wider mb-1.5 xs:mb-2 sm:mb-3">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5 xs:space-y-1 sm:space-y-2">
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
                            `flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-1.5 xs:px-2 sm:px-3 py-2 xs:py-2.5 sm:py-3 rounded-md xs:rounded-lg transition-all duration-200 text-white group touch-manipulation ${
                              isActive 
                                ? 'bg-green-700/80 text-white shadow-md' 
                                : 'hover:bg-green-700/50'
                            }`
                          }
                        >
                          <item.icon className="flex-shrink-0 w-4 h-4 xs:w-4 xs:h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                          {/* Always show text on mobile when sidebar is open, only hide when collapsed on desktop */}
                          <span className="font-medium text-xs xs:text-xs sm:text-sm truncate block lg:hidden">
                            {item.title}
                          </span>
                          {/* Desktop: show/hide based on collapsed state */}
                          {!isCollapsed && (
                            <span className="font-medium text-xs xs:text-xs sm:text-sm truncate hidden lg:block">
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
          
          {/* Footer - Mais compacto */}
          <div className="flex-shrink-0 p-1.5 xs:p-2 sm:p-3">
            {!isCollapsed ? (
              <div className="bg-green-700/30 rounded-md xs:rounded-lg p-1.5 xs:p-2 sm:p-3">
                <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-300 rounded-full flex-shrink-0"></div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium">Sistema Online</p>
                    <p className="text-green-100 text-xs opacity-80 truncate">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 bg-green-300 rounded-full shadow-sm"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
