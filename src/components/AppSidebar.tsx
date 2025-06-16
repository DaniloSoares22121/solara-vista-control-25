
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  FileText, 
  FileCheck, 
  Receipt, 
  UserCheck, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Upload,
  Spline
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
  { title: 'Geradoras', url: '/dashboard/geradoras', icon: Zap },
  { title: 'Rateio de Créditos', url: '/dashboard/rateio', icon: Spline },
  { title: 'Fatura única', url: '/dashboard/fatura-unica', icon: FileText },
  { title: 'Fatura Manual', url: '/dashboard/fatura-manual', icon: Upload },
  { title: 'Faturas em Validação', url: '/dashboard/fatura-validacao', icon: FileCheck },
  { title: 'Faturas Emitidas', url: '/dashboard/faturas-emitidas', icon: Receipt },
  { title: 'Representantes', url: '/dashboard/representantes', icon: UserCheck },
  { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm" collapsible="icon">
      <div className="h-full bg-white flex flex-col">
        <SidebarContent className="flex flex-col h-full">
          {/* Header com altura consistente */}
          <div className={`flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-gray-900">
                  SolarControl
                </h2>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Menu de navegação com espaçamento consistente */}
          <div className="flex-1 p-4 overflow-y-auto">
            <SidebarGroup className="p-0">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-gray-500 px-3 py-2 text-xs font-medium uppercase tracking-wide mb-2">
                  Menu Principal
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
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
                            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                              isActive 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            } ${isCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          <item.icon className="flex-shrink-0 w-5 h-5" />
                          {!isCollapsed && (
                            <span className="font-medium text-sm truncate">
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
          
          {/* Footer com padding consistente */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            {!isCollapsed ? (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-800 text-sm font-medium">Sistema Online</p>
                    <p className="text-green-600 text-xs">Todos os serviços ativos</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
