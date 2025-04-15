const express = require('express');
const { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Include task routes
const taskRouter = require('./taskRoutes');
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, createProject);



router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router
  .route('/:id/members')
  .put(protect, addMember);

router
  .route('/:id/members/:userId')
  .delete(protect, removeMember);

module.exports = router;