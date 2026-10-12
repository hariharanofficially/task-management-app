import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenCreateModal,
  isFiltered,
  onResetFilters,
}) {
  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" style={{ borderColor: 'var(--danger)' }} role="alert">
        <div className="empty-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <AlertCircle size={32} />
        </div>
        <h3 className="empty-title">Failed to load tasks</h3>
        <p className="empty-desc">{error}</p>
        <button
          id="retry-fetch-btn"
          type="button"
          className="btn btn-secondary"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state" aria-live="polite">
        <div className="empty-icon-wrapper">
          <ClipboardList size={32} />
        </div>
        <h3 className="empty-title">
          {isFiltered ? 'No matching tasks found' : 'No tasks in your workspace'}
        </h3>
        <p className="empty-desc">
          {isFiltered
            ? 'Try adjusting your search criteria, priority filter, or category selection.'
            : 'Get organized and boost your daily productivity. Create your first task to get started.'}
        </p>
        {isFiltered ? (
          <button
            id="empty-reset-filters-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            <span>Reset Filters</span>
          </button>
        ) : (
          <button
            id="empty-create-task-btn"
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={16} />
            <span>Create First Task</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="task-grid" role="feed" aria-busy={loading}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
