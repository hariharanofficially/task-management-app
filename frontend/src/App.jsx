import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import TaskControls from './components/TaskControls';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { taskApi } from './services/api';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskflow_theme') || 'dark';
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('created_desc');

  // Tasks & Analytics data
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    completionRate: 0,
  });

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast dispatch helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not refresh stats:', err.message);
    }
  }, []);

  // Fetch tasks with current query and filters
  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const res = await taskApi.getTasks({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sort: sortOrder,
      });

      if (res && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.message || 'Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, sortOrder, fetchTasks]);

  // Keyboard shortcut Ctrl+N / Cmd+N for quick task creation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortOrder('created_desc');
  };

  // Toggle complete / pending
  const handleToggleStatus = async (taskId) => {
    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );

    try {
      const res = await taskApi.toggleTaskStatus(taskId);
      if (res && res.data) {
        // Update with fresh server response
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? res.data : t))
        );
        addToast(
          res.data.status === 'completed'
            ? 'Task completed! Keep up the momentum.'
            : 'Task moved back to active queue.',
          'success'
        );
        fetchStats();
      }
    } catch (err) {
      // Revert on error
      fetchTasks();
      addToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  // Create or Update task handler
  const handleSaveTask = async (taskPayload) => {
    if (editingTask && editingTask.id) {
      // Update
      const res = await taskApi.updateTask(editingTask.id, taskPayload);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t))
        );
        addToast('Task updated successfully!', 'success');
        fetchStats();
      }
    } else {
      // Create
      const res = await taskApi.createTask(taskPayload);
      if (res && res.data) {
        setTasks((prev) => [res.data, ...prev]);
        addToast('New task added to workspace!', 'success');
        fetchStats();
      }
    }
  };

  // Delete modal open
  const handlePromptDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      addToast('Task deleted permanently.', 'info');
      fetchStats();
    } catch (err) {
      addToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit task trigger
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Create task trigger
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sortOrder !== 'created_desc';

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: stats.total || tasks.length,
      pending: stats.pending || 0,
      completed: stats.completed || 0,
    };
  }, [stats, tasks]);

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar
        onOpenCreateModal={handleOpenCreate}
        pendingCount={stats.pending}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="main-container">
        {/* Analytics & Metrics */}
        <DashboardStats stats={stats} />

        {/* Search, Filter Tabs & Sorting */}
        <TaskControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onResetFilters={handleResetFilters}
          counts={tabCounts}
        />

        {/* Task Cards Feed */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onRetry={() => {
            setLoading(true);
            fetchTasks();
            fetchStats();
          }}
          onToggleStatus={handleToggleStatus}
          onEdit={handleOpenEdit}
          onDelete={handlePromptDelete}
          onOpenCreateModal={handleOpenCreate}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Create / Edit Modal Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
        deleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <p>
          TaskFlow © {new Date().getFullYear()} • Built with React, Vite, Node.js, Express & SQLite •{' '}
          <a
            href="https://github.com/hariharanofficially/task-management-app"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  );
}
