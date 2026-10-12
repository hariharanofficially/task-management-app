import React from 'react';
import { CheckSquare, Plus, Sun, Moon } from 'lucide-react';

export default function Navbar({ onOpenCreateModal, pendingCount = 0, theme, onToggleTheme }) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-content">
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon" aria-hidden="true">
            <CheckSquare size={22} />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            {pendingCount > 0 && (
              <span className="brand-badge" style={{ marginLeft: '0.5rem' }}>
                {pendingCount} Pending
              </span>
            )}
          </div>
        </div>

        <div className="navbar-actions">
          <button
            id="theme-toggle-btn"
            type="button"
            className="btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="https://github.com/hariharanofficially/task-management-app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="View on GitHub"
            aria-label="GitHub Repository"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          <button
            id="create-task-nav-btn"
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
            aria-label="Create a new task"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
