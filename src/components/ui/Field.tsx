import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

const labelClass = 'text-[13px] font-semibold text-[#D4C8F5]';

export function FieldLabel({ htmlFor, id, children }: { htmlFor?: string; id?: string; children: ReactNode }) {
  return htmlFor ? (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  ) : (
    <span id={id} className={labelClass}>
      {children}
    </span>
  );
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mono?: boolean;
}

export function TextInput({ invalid = false, mono = true, className, ...rest }: TextInputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-11 w-full min-w-0 rounded-xl border bg-well/50 px-3 text-sm text-fg outline-none',
        'focus-visible:border-lilac/60 focus-visible:ring-2 focus-visible:ring-accent/30',
        mono ? 'font-mono' : 'font-sans',
        invalid ? 'border-danger-strong/70' : 'border-white/16',
        className,
      )}
      {...rest}
    />
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="m-0 text-[13px] font-medium text-danger">
      {children}
    </p>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <span className="text-xs font-medium text-subtle">{children}</span>;
}
