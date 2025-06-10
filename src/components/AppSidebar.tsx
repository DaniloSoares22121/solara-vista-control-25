
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
    <Sidebar 
      className="border-r border-green-200 bg-white shadow-lg" 
      collapsible="icon"
    >
      <SidebarContent className="bg-white">
        {/* Header com botão de toggle */}
        <div className="flex items-center justify-between p-4 border-b border-green-100 bg-white">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-green-800">Menu</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200 border border-green-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <SidebarGroup className="py-4 bg-white">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-green-700 uppercase tracking-wider bg-white">
              Navegação
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="bg-white">
            <SidebarMenu className="px-3 space-y-2 bg-white">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="bg-white">
                  <SidebarMenuButton asChild className="bg-white">
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group bg-white border border-transparent ${
                          isActive 
                            ? 'bg-green-500 text-white shadow-md border-green-500' 
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">
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
      </SidebarContent>
    </Sidebar>
  );
}
