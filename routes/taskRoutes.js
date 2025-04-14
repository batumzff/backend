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

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router
  .route('/:id/logs')
  .get(protect, getTaskLogs);

module.exports = router;