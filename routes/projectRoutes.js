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

// Handle "new" route before the dynamic ID route
router.route('/new').get(protect, (req, res) => {
  // This route exists just to prevent "new" from being treated as an ID
  res.status(200).json({ success: true, message: 'Create new project page' });
});

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