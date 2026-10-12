const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateIdParam, validateTaskPayload } = require('../middleware/validator');

// Stats route (must be before :id route to prevent collision)
router.get('/stats', taskController.getStats);

// List tasks with query filtering & search
router.get('/', taskController.getAllTasks);

// Get single task by ID
router.get('/:id', validateIdParam, taskController.getTaskById);

// Create a new task
router.post('/', validateTaskPayload, taskController.createTask);

// Update an existing task
router.put('/:id', validateIdParam, validateTaskPayload, taskController.updateTask);

// Toggle task completion status
router.patch('/:id/toggle', validateIdParam, taskController.toggleTaskStatus);

// Delete a task
router.delete('/:id', validateIdParam, taskController.deleteTask);

module.exports = router;
