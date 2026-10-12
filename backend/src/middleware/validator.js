const { VALID_PRIORITIES, VALID_STATUSES } = require('../config/constants');

function validateIdParam(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID. ID must be a positive integer.',
    });
  }
  req.taskId = id;
  next();
}

function validateTaskPayload(req, res, next) {
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
  const { title, description, status, priority, category, due_date } = req.body;
  const errors = [];

  // Title validation
  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must not be empty.');
    } else if (title.trim().length > 255) {
      errors.push('Title must be at most 255 characters.');
    }
  }

  // Description validation
  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  // Status validation
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
    }
  }

  // Priority validation
  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority.toLowerCase())) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }
  }

  // Category validation
  if (category !== undefined && typeof category !== 'string') {
    errors.push('Category must be a string.');
  }

  // Due date validation (YYYY-MM-DD or null/empty)
  if (due_date !== undefined && due_date !== null && due_date !== '') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(due_date) || isNaN(Date.parse(due_date))) {
      errors.push('Due date must be in YYYY-MM-DD format.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // Sanitized payload attached to req
  req.sanitizedTask = {
    title: title ? title.trim() : undefined,
    description: description !== undefined ? (description ? description.trim() : '') : undefined,
    status: status ? status.toLowerCase() : undefined,
    priority: priority ? priority.toLowerCase() : undefined,
    category: category !== undefined ? (category ? category.trim() : 'General') : undefined,
    due_date: due_date || null,
  };

  next();
}

module.exports = {
  validateIdParam,
  validateTaskPayload,
};
