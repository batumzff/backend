const taskService = require('../services/taskService');
const projectService = require('../services/projectService');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Admin, Manager)
exports.createTask = async (req, res, next) => {
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
    next(error);
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
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
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
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
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
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
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin, Manager)
exports.deleteTask = async (req, res, next) => {
  try {
    // First check if user has access to this task
    const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    
    // Task deletion handled by role middleware, no need for manual checks
    await taskService.deleteTask(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task logs
// @route   GET /api/tasks/:id/logs
// @access  Private
exports.getTaskLogs = async (req, res, next) => {
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
    next(error);
  }
};