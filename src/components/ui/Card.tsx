import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLElement> {
  padding?: 'md' | 'lg';
}

export function Card({ padding = 'md', className, ...rest }: CardProps) {
  return <section className={cn('glass flex flex-col', padding === 'lg' ? 'p-7' : 'p-6', className)} {...rest} />;
}

export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 rounded-full border border-white/12 px-2 py-1 font-mono text-[11px] text-subtle">
      {children}
    </span>
  );
}

interface CardHeaderProps {
  id: string;
  title: ReactNode;
  tag?: string;
  description?: string;
  actions?: ReactNode;
  size?: 'md' | 'lg';
}

export function CardHeader({ id, title, tag, description, actions, size = 'md' }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h2 id={id} className={cn('m-0 font-semibold', size === 'lg' ? 'text-lg' : 'text-base')}>
            {title}
          </h2>
          {tag && <SectionTag>{tag}</SectionTag>}
        </div>
        {description && <p className="m-0 text-sm font-medium text-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
