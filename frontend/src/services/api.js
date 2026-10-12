const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to handle fetch responses with robust error messaging
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = result.error || (result.errors && result.errors.join(', ')) || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please verify the Express API is running on port 5000.');
    }
    throw error;
  }
}

export const taskApi = {
  // Fetch tasks with query parameters
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/tasks${qs}`);
  },

  // Fetch summary statistics
  async getStats() {
    return request('/tasks/stats');
  },

  // Fetch single task
  async getTask(id) {
    return request(`/tasks/${id}`);
  },

  // Create a new task
  async createTask(taskData) {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update existing task
  async updateTask(id, taskData) {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Toggle status between pending and completed
  async toggleTaskStatus(id) {
    return request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Delete task
  async deleteTask(id) {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
