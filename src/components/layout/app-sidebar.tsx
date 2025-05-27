
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ListChecks,
  UserPlus,
  HeartHandshake,
  Hospital,
  Brain,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  LogIn,
  LogOut,
  UserCircle,
  type LucideIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../ui/button'; // Ensure Button is imported if used standalone

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  authRequired?: boolean; // true if shown only when logged in
  noAuthRequired?: boolean; // true if shown only when logged out
  action?: () => void; // For logout button
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '#', label: 'Find Blood', icon: Users, subItems: [
      { href: '/donors', label: 'Donor List', icon: ListChecks },
      { href: '/requests', label: 'Request List', icon: ListChecks },
    ]
  },
  {
    href: '#', label: 'Get Involved', icon: HeartHandshake, subItems: [
      { href: '/donor-registration', label: 'Register as Donor', icon: UserPlus },
      { href: '/request-blood', label: 'Post a Request', icon: HeartHandshake },
    ]
  },
  { href: '/hospitals', label: 'Hospital Directory', icon: Hospital },
  {
    href: '#', label: 'AI Tools', icon: Sparkles, subItems: [
      { href: '/ai-matcher', label: 'AI Matcher', icon: Brain },
      { href: '/ai-summary', label: 'AI Request Summary', icon: BookOpen },
    ]
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { user, logOut, loading: authLoading } = useAuth();

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  React.useEffect(() => {
    if (isCollapsed) {
      setOpenMenus({});
    }
  }, [isCollapsed]);
  
  const authNavItems: NavItem[] = [
    { href: '/profile', label: 'Profile', icon: UserCircle, authRequired: true },
    { href: '/login', label: 'Login', icon: LogIn, noAuthRequired: true },
    { href: '/signup', label: 'Sign Up', icon: UserPlus, noAuthRequired: true },
    // Logout is handled as a button, not a NavItem with href
  ];

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    if (item.authRequired && !user) return null;
    if (item.noAuthRequired && user) return null;

    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    const Icon = item.icon;
    const isOpen = openMenus[item.label] ?? false;

    if (item.subItems && item.subItems.length > 0) {
      return (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            onClick={() => !isCollapsed && toggleMenu(item.label)}
            className="justify-between"
            isActive={item.subItems.some(sub => pathname === sub.href || (sub.href !== '/' && pathname.startsWith(sub.href)))}
            tooltip={isCollapsed ? item.label : undefined}
          >
            <div className="flex items-center gap-2">
              <Icon />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (isOpen ? <ChevronUp /> : <ChevronDown />)}
          </SidebarMenuButton>
          {!isCollapsed && isOpen && (
            <SidebarMenuSub>
              {item.subItems.map(subItem => (
                <SidebarMenuSubItem key={subItem.label}>
                  <Link href={subItem.href} asChild>
                    <SidebarMenuSubButton isActive={pathname === subItem.href || (subItem.href !== '/' && pathname.startsWith(subItem.href))}>
                      <subItem.icon />
                      <span>{subItem.label}</span>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    const MenuButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

    return (
      <SidebarMenuItem key={item.label}>
        <Link href={item.href} asChild>
          <MenuButtonComponent isActive={isActive} tooltip={isCollapsed ? item.label : undefined}>
            <Icon />
            {!isCollapsed && <span>{item.label}</span>}
          </MenuButtonComponent>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
      <SidebarHeader>
        <Logo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map(item => renderNavItem(item))}
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
        <SidebarMenu>
          {authNavItems.map(item => renderNavItem(item))}
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logOut} disabled={authLoading} tooltip={isCollapsed ? "Logout" : undefined}>
                <LogOut />
                {!isCollapsed && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
