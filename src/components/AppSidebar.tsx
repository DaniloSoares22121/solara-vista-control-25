
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  Calculator, 
  UserCheck, 
  FileText, 
  FileCheck, 
  Receipt, 
  MessageCircle 
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
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200 shadow-lg">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold px-4 py-3 text-sm uppercase tracking-wide">
            {!isCollapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'solar-gradient text-white shadow-lg transform scale-105' 
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-md hover:scale-102'
                        }`
                      }
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isCollapsed ? 'mx-auto' : ''}`} />
                      {!isCollapsed && (
                        <span className="font-medium text-sm tracking-wide group-hover:translate-x-1 transition-transform duration-200">
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
