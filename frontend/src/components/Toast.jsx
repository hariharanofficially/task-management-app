import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const typeClass =
          toast.type === 'error'
            ? 'toast-error'
            : toast.type === 'info'
            ? 'toast-info'
            : 'toast-success';

        const Icon =
          toast.type === 'error'
            ? AlertCircle
            : toast.type === 'info'
            ? Info
            : CheckCircle2;

        const iconColor =
          toast.type === 'error'
            ? 'var(--danger)'
            : toast.type === 'info'
            ? 'var(--info)'
            : 'var(--success)';

        return (
          <div key={toast.id} className={`toast ${typeClass}`} role="status">
            <div className="toast-content">
              <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
