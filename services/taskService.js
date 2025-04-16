const Task = require('../models/Task');
const TaskLog = require('../models/TaskLog');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const { ErrorResponse } = require('../utils/errorHandler');

exports.createTask = async (taskData) => {
  // Create the task
  const task = await Task.create(taskData);
  
  // Add the assigned user to project members if they aren't already a member
  if (task.assignedTo) {
    console.log(`Adding user ${task.assignedTo} to project ${task.project} members`);
    const updated = await Project.findByIdAndUpdate(
      task.project,
      { $addToSet: { members: task.assignedTo } },
      { new: true }
    );
    console.log('Updated project members:', updated.members);
  }
  
  return task;
};

exports.getTasksByProject = async (projectId, userId, role) => {
  // First check if user has access to this project
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new ErrorResponse('Project not found', 404);
  }
  
  if (role !== 'admin' && 
      project.createdBy.toString() !== userId.toString() && 
      !project.members.some(member => member.toString() === userId.toString())) {
    throw new ErrorResponse('Not authorized to access tasks for this project', 403);
  }
  
  return await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};

exports.getTaskById = async (taskId, userId, role) => {
  // Validate taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ErrorResponse('Invalid task ID', 400);
  }

  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project');
    
  if (!task) {
    throw new ErrorResponse('Task not found', 404);
  }
  
  // Check if user has access to this task's project
  const project = await Project.findById(task.project);
  
  if (!project) {
    throw new ErrorResponse('Project associated with this task not found', 404);
  }
  
  if (role !== 'admin' && 
      project.createdBy.toString() !== userId.toString() && 
      !project.members.some(member => member.toString() === userId.toString())) {
    throw new ErrorResponse('Not authorized to access this task', 403);
  }
  
  return task;
};

exports.updateTask = async (taskId, taskData, userId) => {
  // Validate taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ErrorResponse('Invalid task ID', 400);
  }
  
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new ErrorResponse('Task not found', 404);
  }
  
  // If status is being updated, create a log entry
  if (taskData.status && task.status !== taskData.status) {
    await TaskLog.create({
      task: taskId,
      previousStatus: task.status,
      newStatus: taskData.status,
      changedBy: userId
    });
  }
  
  // If assignedTo is being updated, add user to project members
  if (taskData.assignedTo) {
    console.log(`Updating task assignment: ${taskData.assignedTo}`);
    const project = await Project.findById(task.project);
    
    if (!project) {
      throw new ErrorResponse('Project associated with this task not found', 404);
    }
    
    console.log('Current project members:', project.members);
    
    const updated = await Project.findByIdAndUpdate(
      task.project,
      { $addToSet: { members: mongoose.Types.ObjectId(taskData.assignedTo) } },
      { new: true }
    );
    console.log('Updated project members:', updated.members);
  }
  
  // Update the task
  return await Task.findByIdAndUpdate(taskId, taskData, {
    new: true,
    runValidators: true
  });
};

exports.deleteTask = async (taskId) => {
  // Validate taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ErrorResponse('Invalid task ID', 400);
  }
  
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new ErrorResponse('Task not found', 404);
  }
  
  // Delete the task and all associated logs
  await TaskLog.deleteMany({ task: taskId });
  return await Task.findByIdAndDelete(taskId);
};

exports.getTaskLogs = async (taskId) => {
  // Validate taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ErrorResponse('Invalid task ID', 400);
  }
  
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new ErrorResponse('Task not found', 404);
  }
  
  return await TaskLog.find({ task: taskId })
    .populate('changedBy', 'name email')
    .sort({ changedAt: -1 });
};