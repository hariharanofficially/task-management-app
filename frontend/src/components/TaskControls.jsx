import React from 'react';
import { Search, X, Filter, ArrowUpDown, Tag, AlertCircle, RotateCcw } from 'lucide-react';

export default function TaskControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
  onResetFilters,
  counts = { all: 0, pending: 0, completed: 0 },
}) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sortOrder !== 'created_desc';

  return (
    <section className="controls-section" aria-label="Task Filters and Controls">
      {/* Top row: Search input & Status tabs */}
      <div className="controls-top-row">
        <div className="search-box">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            id="task-search-input"
            type="text"
            className="search-input"
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="filter-tabs" role="tablist" aria-label="Filter by task completion state">
          <button
            id="filter-all-tab"
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusChange('all')}
          >
            <span>All Tasks</span>
            <span className="filter-count">{counts.all}</span>
          </button>

          <button
            id="filter-active-tab"
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => onStatusChange('pending')}
          >
            <span>Active</span>
            <span className="filter-count">{counts.pending}</span>
          </button>

          <button
            id="filter-completed-tab"
            type="button"
            role="tab"
            aria-selected={statusFilter === 'completed'}
            className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusChange('completed')}
          >
            <span>Completed</span>
            <span className="filter-count">{counts.completed}</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Priority, Category, Sorting, and Reset */}
      <div className="controls-bottom-row">
        <div className="secondary-filters">
          {/* Priority filter */}
          <div className="filter-label">
            <AlertCircle size={15} />
            <label htmlFor="priority-filter-select">Priority:</label>
            <select
              id="priority-filter-select"
              className="custom-select"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="filter-label">
            <Tag size={15} />
            <label htmlFor="category-filter-select">Category:</label>
            <select
              id="category-filter-select"
              className="custom-select"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="filter-label">
            <ArrowUpDown size={15} />
            <label htmlFor="sort-order-select">Sort by:</label>
            <select
              id="sort-order-select"
              className="custom-select"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="due_date_asc">Due Date (Soonest)</option>
              <option value="due_date_desc">Due Date (Latest)</option>
              <option value="priority_desc">Highest Priority</option>
            </select>
          </div>
        </div>

        {isFiltered && (
          <button
            id="reset-filters-btn"
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            title="Reset all search and filter options"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </section>
  );
}
