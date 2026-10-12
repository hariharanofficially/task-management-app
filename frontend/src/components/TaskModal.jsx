import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Flame, AlertCircle, Clock, Calendar, Tag, CheckCircle2 } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task = null }) {
  const isEditing = Boolean(task && task.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const titleInputRef = useRef(null);

  // Sync form state when opened or task prop changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setPriority(task.priority || 'medium');
        setCategory(task.category || 'General');
        setDueDate(task.due_date || '');
        setStatus(task.status || 'pending');
      } else {
        // Reset defaults for new task
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('Work');
        // Default due date to tomorrow or empty
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        setDueDate(tomorrow);
        setStatus('pending');
      }
      setErrors({});
      setSubmitting(false);

      // Focus input on open
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, task]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (title.trim().length > 255) {
      newErrors.title = 'Title must be 255 characters or fewer.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        due_date: dueDate || null,
        status,
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save task.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-task-title"
    >
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-task-title" className="modal-title">
            <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
            <span>{isEditing ? 'Edit Task' : 'Create New Task'}</span>
          </h2>
          <button
            type="button"
            className="btn-icon btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && (
              <div className="form-error-msg" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                {errors.form}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Task Title *
              </label>
              <input
                id="task-title-input"
                ref={titleInputRef}
                type="text"
                className="form-input"
                placeholder="e.g. Design responsive task dashboard"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                maxLength={255}
                required
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Add helpful details, subtasks, notes, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Priority Picker */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-options">
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'low' ? 'selected-low' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  <Clock size={14} />
                  <span>Low</span>
                </button>
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'medium' ? 'selected-medium' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  <AlertCircle size={14} />
                  <span>Medium</span>
                </button>
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'high' ? 'selected-high' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  <Flame size={14} />
                  <span>High</span>
                </button>
              </div>
            </div>

            {/* Category & Due Date row */}
            <div className="form-row">
              {/* Category */}
              <div className="form-group">
                <label htmlFor="modal-category-select" className="form-label">
                  Category
                </label>
                <select
                  id="modal-category-select"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="form-group">
                <label htmlFor="modal-due-date-input" className="form-label">
                  Due Date
                </label>
                <input
                  id="modal-due-date-input"
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Status (If editing) */}
            {isEditing && (
              <div className="form-group">
                <label htmlFor="modal-status-select" className="form-label">
                  Status
                </label>
                <select
                  id="modal-status-select"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending (Active)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              id="modal-cancel-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="modal-save-btn"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
