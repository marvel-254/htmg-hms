import { useEffect } from 'react';
import { X, Spinner, Warning, CheckCircle } from '@phosphor-icons/react';

// Reusable UI components — Linear dark-mode design system

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner className="animate-spin h-6 w-6 text-brand-accent" weight="bold" />
      <span className="ml-3 text-text-secondary">Loading...</span>
    </div>
  );
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center gap-3">
      <Warning className="h-5 w-5 text-error flex-shrink-0" weight="bold" />
      <p className="text-sm text-error flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-brand-accent font-medium hover:text-brand-hover underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-success/10 border border-success/20 rounded-lg p-4 shadow-lg flex items-center gap-2">
      <CheckCircle className="h-5 w-5 text-success-alt" weight="bold" />
      <p className="text-sm text-success-alt font-medium">{message}</p>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  completed: 'badge-success',
};

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
  };

  return (
    <span className={`badge ${statusStyles[status] || 'bg-white/5 text-text-tertiary'}`}>
      {labels[status] || status}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface rounded-xl border border-border-standard shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
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
}
