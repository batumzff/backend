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

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin', 'manager'), createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, authorize('admin', 'manager'), deleteTask);

router
  .route('/:id/logs')
  .get(protect, getTaskLogs);

module.exports = router;