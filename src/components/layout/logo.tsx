import { Droplets } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2 py-4">
      <Droplets className="h-8 w-8 text-primary" />
      {!collapsed && <span className="text-xl font-bold text-primary">{APP_NAME}</span>}
    </div>
  );
}
