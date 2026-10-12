import React from 'react';
import { Check, Calendar, Tag, Flame, AlertCircle, CheckCircle, Edit2, Trash2, Clock } from 'lucide-react';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';

  // Helper to format due date and detect urgency
  const getDueDateInfo = (dueDateStr) => {
    if (!dueDateStr) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const isOverdue = !isCompleted && dueDateStr < todayStr;
    const isToday = dueDateStr === todayStr;
    const isTomorrow = dueDateStr === tomorrow;

    let label = dueDateStr;
    if (isToday) label = 'Today';
    else if (isTomorrow) label = 'Tomorrow';

    return {
      label,
      isOverdue,
      isToday,
    };
  };

  const dueDateInfo = getDueDateInfo(task.due_date);

  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge badge-high" title="High Priority">
            <Flame size={12} />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="badge badge-medium" title="Medium Priority">
            <AlertCircle size={12} />
            <span>Medium</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="badge badge-low" title="Low Priority">
            <Clock size={12} />
            <span>Low</span>
          </span>
        );
    }
  };

  return (
    <article
      id={`task-item-${task.id}`}
      className={`task-card ${isCompleted ? 'completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Complete toggle checkbox */}
      <div
        className="task-checkbox-container"
        onClick={() => onToggleStatus(task.id)}
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onToggleStatus(task.id);
          }
        }}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        aria-label={`Mark task ${task.title} as ${isCompleted ? 'pending' : 'completed'}`}
      >
        <div className={`task-checkbox ${isCompleted ? 'checked' : ''}`}>
          {isCompleted && <Check size={14} strokeWidth={3} />}
        </div>
      </div>

      {/* Task Content */}
      <div className="task-body">
        <div className="task-main-row">
          <h3 className={`task-title ${isCompleted ? 'completed-text' : ''}`}>
            {task.title}
          </h3>

          {/* Quick Actions */}
          <div className="task-actions">
            <button
              id={`edit-task-btn-${task.id}`}
              type="button"
              className="btn-icon btn-sm"
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label={`Edit task ${task.title}`}
            >
              <Edit2 size={15} />
            </button>
            <button
              id={`delete-task-btn-${task.id}`}
              type="button"
              className="btn-icon btn-sm"
              onClick={() => onDelete(task)}
              title="Delete task"
              aria-label={`Delete task ${task.title}`}
              style={{ color: 'var(--priority-high-text)' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        {/* Badges and metadata */}
        <div className="task-badges">
          {renderPriorityBadge(task.priority)}

          {task.category && (
            <span className="badge badge-category" title="Category">
              <Tag size={12} />
              <span>{task.category}</span>
            </span>
          )}

          {dueDateInfo && (
            <span
              className={`badge badge-date ${dueDateInfo.isOverdue ? 'overdue' : ''} ${dueDateInfo.isToday ? 'today' : ''}`}
              title={dueDateInfo.isOverdue ? 'Task is overdue!' : `Due: ${task.due_date}`}
            >
              <Calendar size={12} />
              <span>{dueDateInfo.isOverdue ? `Overdue (${dueDateInfo.label})` : `Due: ${dueDateInfo.label}`}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
