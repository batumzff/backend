const taskService = require('../services/taskService');
const projectService = require('../services/projectService');

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Check if user has access to this project
    await projectService.getProjectById(projectId, req.user.id, req.user.role);
    
    // Create task
    req.body.project = projectId;
    req.body.createdBy = req.user.id;

    //add assignedTo to the project members
    const project = await projectService.getProjectById(projectId, req.user.id, req.user.role);
    project.members.push(req.body.assignedTo);
    await project.save();

    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(
      req.params.projectId,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    // First check if user has access to this task
    await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    
    // Update the task
    const updatedTask = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    // First check if user has access to this task
    const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    
    // Only allow admin, task creator, or project creator to delete tasks
    const project = await projectService.getProjectById(task.project, req.user.id, req.user.role);
    
    if (
      req.user.role !== 'admin' && 
      task.createdBy._id.toString() !== req.user.id &&
      project.createdByproject.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }
    
    await taskService.deleteTask(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get task logs
// @route   GET /api/tasks/:id/logs
// @access  Private
exports.getTaskLogs = async (req, res) => {
  try {
    // First check if user has access to this task
    await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    
    // Get logs
    const logs = await taskService.getTaskLogs(req.params.id);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};