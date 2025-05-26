import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
}

export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
      </div>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}
