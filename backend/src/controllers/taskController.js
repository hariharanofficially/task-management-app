const db = require('../database/db');

function getAllTasks(req, res, next) {
  try {
    const { search, status, priority, category, sort } = req.query;

    const conditions = [];
    const params = [];

    // Filter by search query in title or description
    if (search && search.trim() !== '') {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const wildcard = `%${search.trim()}%`;
      params.push(wildcard, wildcard);
    }

    // Filter by status (all, pending, completed)
    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status.toLowerCase());
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      conditions.push('priority = ?');
      params.push(priority.toLowerCase());
    }

    // Filter by category
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting logic
    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'due_date_asc') {
      // Nulls last in SQLite
      orderBy = 'ORDER BY CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ASC';
    } else if (sort === 'due_date_desc') {
      orderBy = 'ORDER BY CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date DESC';
    } else if (sort === 'created_asc') {
      orderBy = 'ORDER BY created_at ASC';
    } else if (sort === 'priority_desc') {
      orderBy = `ORDER BY CASE priority 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
        ELSE 4 END ASC`;
    }

    const sql = `SELECT * FROM tasks ${whereClause} ${orderBy}`;
    const tasks = db.all(sql, params);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
}

function getStats(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalRow = db.get('SELECT COUNT(*) as count FROM tasks');
    const completedRow = db.get("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'");
    const pendingRow = db.get("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'");
    const highPriorityRow = db.get("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending' AND priority = 'high'");
    const overdueRow = db.get("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending' AND due_date IS NOT NULL AND due_date < ?", [today]);

    const total = totalRow ? totalRow.count : 0;
    const completed = completedRow ? completedRow.count : 0;
    const pending = pendingRow ? pendingRow.count : 0;
    const highPriority = highPriorityRow ? highPriorityRow.count : 0;
    const overdue = overdueRow ? overdueRow.count : 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        highPriority,
        overdue,
        completionRate,
      },
    });
  } catch (err) {
    next(err);
  }
}

function getTaskById(req, res, next) {
  try {
    const task = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${req.taskId} not found.`,
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

function createTask(req, res, next) {
  try {
    const { title, description, status, priority, category, due_date } = req.sanitizedTask;

    const taskStatus = status || 'pending';
    const taskPriority = priority || 'medium';
    const taskCategory = category || 'General';
    const taskDescription = description || '';

    const result = db.run(
      `INSERT INTO tasks (title, description, status, priority, category, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, taskDescription, taskStatus, taskPriority, taskCategory, due_date]
    );

    const newTask = db.get('SELECT * FROM tasks WHERE id = ?', [result.lastInsertRowid]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (err) {
    next(err);
  }
}

function updateTask(req, res, next) {
  try {
    const existing = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${req.taskId} not found.`,
      });
    }

    const { title, description, status, priority, category, due_date } = req.sanitizedTask;

    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedStatus = status !== undefined ? status : existing.status;
    const updatedPriority = priority !== undefined ? priority : existing.priority;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedDueDate = due_date !== undefined ? due_date : existing.due_date;

    db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, updated_at = datetime('now', 'localtime')
       WHERE id = ?`,
      [updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedCategory, updatedDueDate, req.taskId]
    );

    const updatedTask = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (err) {
    next(err);
  }
}

function toggleTaskStatus(req, res, next) {
  try {
    const existing = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${req.taskId} not found.`,
      });
    }

    const newStatus = existing.status === 'completed' ? 'pending' : 'completed';

    db.run(
      `UPDATE tasks 
       SET status = ?, updated_at = datetime('now', 'localtime')
       WHERE id = ?`,
      [newStatus, req.taskId]
    );

    const updatedTask = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);

    res.json({
      success: true,
      message: `Task marked as ${newStatus}`,
      data: updatedTask,
    });
  } catch (err) {
    next(err);
  }
}

function deleteTask(req, res, next) {
  try {
    const existing = db.get('SELECT * FROM tasks WHERE id = ?', [req.taskId]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${req.taskId} not found.`,
      });
    }

    db.run('DELETE FROM tasks WHERE id = ?', [req.taskId]);

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.taskId },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
