const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask,
  getTaskLogs
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router({ mergeParams: true });

// Routes for /api/projects/:projectId/tasks
router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin', 'manager'), createTask);

// Routes for both /api/projects/:projectId/tasks/:id and /api/tasks/:id 
router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, authorize('admin', 'manager'), deleteTask);

router
  .route('/:id/logs')
  .get(protect, getTaskLogs);

module.exports = router;