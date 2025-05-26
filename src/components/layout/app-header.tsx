"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';

function getPageTitle(pathname: string): string {
  if (pathname === '/') return `Welcome to ${APP_NAME}`;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return APP_NAME;
  return segments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')).join(' - ');
}

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" /> {/* Hidden on md and larger screens if sidebar is visible */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
      {/* Future user profile / actions can go here */}
    </header>
  );
}
