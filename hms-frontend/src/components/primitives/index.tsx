// Primitive UI components — Linear dark-mode design system

import { forwardRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { Spinner, Warning, CheckCircle, X } from '@phosphor-icons/react';

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props 
}, ref) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover active:scale-[0.98]',
    ghost: 'bg-white/[0.02] text-text-secondary border border-border-standard hover:bg-white/[0.05] hover:border-border-strong',
    danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="animate-spin h-4 w-4" weight="bold" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 bg-white/[0.02] border border-border-standard rounded-lg text-text-primary placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all ${error ? 'border-error' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-error">{error}</p>}
  </div>
));
Input.displayName = 'Input';

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 bg-white/[0.02] border border-border-standard rounded-lg text-text-primary placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none ${error ? 'border-error' : ''} ${className}`}
      rows={3}
      {...props}
    />
    {error && <p className="text-xs text-error">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-4 py-2.5 bg-white/[0.02] border border-border-standard rounded-lg text-text-primary appearance-none focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all ${error ? 'border-error' : ''} ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-bg-surface">{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-error">{error}</p>}
  </div>
));
Select.displayName = 'Select';

// Card
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = false, onClick }: CardProps) => (
  <div 
    className={`bg-bg-surface rounded-xl border border-border-standard ${hover ? 'hover:border-border-strong transition-colors cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Badge
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  size?: 'sm' | 'md';
}

export const Badge = ({ children, variant = 'default', size = 'sm' }: BadgeProps) => {
  const variants = {
    default: 'bg-white/5 text-text-tertiary',
    success: 'bg-success-alt/10 text-success-alt',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-brand/10 text-brand-accent',
    error: 'bg-error/10 text-error',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border border-transparent ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// Loading
export const Loading = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Spinner className="animate-spin h-6 w-6 text-brand-accent" weight="bold" />
    <span className="ml-3 text-text-secondary">Loading...</span>
  </div>
);

// Error display
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => (
  <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center gap-3">
    <Warning className="h-5 w-5 text-error flex-shrink-0" weight="bold" />
    <p className="text-sm text-error flex-1">{message}</p>
    {onRetry && (
      <Button variant="ghost" size="sm" onClick={onRetry}>Retry</Button>
    )}
  </div>
);

// Success toast
interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-success-alt/10 border border-success-alt/20 rounded-lg p-4 shadow-lg flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-success-alt" weight="bold" />
      <p className="text-sm text-success-alt font-medium">{message}</p>
    </div>
  );
};

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div className={`bg-bg-surface rounded-xl border border-border-standard shadow-2xl w-full ${sizes[size]} max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-secondary hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Empty state
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-16">
    {icon && <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-text-muted">{icon}</div>}
    <p className="text-text-secondary font-medium">{title}</p>
    {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
    {action && <Button className="mt-4" onClick={action.onClick}>{action.label}</Button>}
  </div>
);

// Confirm dialog
export const confirm = (message: string): boolean => window.confirm(message);
