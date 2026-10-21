import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'border-white/22 bg-primary text-white shadow-primary',
  secondary: 'border-white/18 bg-white/8 text-fg',
  ghost: 'border-white/14 bg-transparent text-lilac',
  soft: 'border-lilac/30 bg-accent/18 text-fg',
  danger: 'border-danger-strong/38 bg-danger-strong/12 text-[#FDD3E2]',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 rounded-xl px-3.5 text-[13px]',
  md: 'h-11 rounded-[14px] px-4.5 text-sm',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'secondary', size = 'md', type = 'button', className, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 border font-semibold whitespace-nowrap',
        'disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  size?: Size;
}

/** Квадратная кнопка с иконкой; подпись обязательна для скринридеров */
export function IconButton({ label, active = false, size = 'sm', type = 'button', className, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl border text-lilac',
        size === 'md' ? 'size-11' : 'size-10',
        active ? 'border-lilac/40 bg-accent/24' : 'border-white/14 bg-white/6',
        className,
      )}
      {...rest}
    />
  );
}

export interface ToggleChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
}

/** Кнопка-переключатель: пресеты, категории, оценки */
export function ToggleChip({ pressed, type = 'button', className, ...rest }: ToggleChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        'inline-flex items-center justify-center gap-2 border text-fg',
        pressed ? 'border-lilac/45 bg-accent/26' : 'border-white/12 bg-white/5',
        className,
      )}
      {...rest}
    />
  );
}
