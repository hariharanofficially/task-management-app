import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, task, deleting }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 id="delete-modal-title" className="modal-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            <span>Delete Task?</span>
          </h2>
          <button
            type="button"
            className="btn-icon btn-sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '0.75rem' }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            Are you sure you want to delete this task?
          </p>
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            <strong>"{task.title}"</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This action will permanently remove the task from SQLite database and cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task.id)}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
