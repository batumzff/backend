const projectService = require("../services/projectService");
const { ErrorResponse } = require("../utils/errorHandler");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Add creator as a member automatically
    if (!req.body.members) {
      req.body.members = [];
    }
    if (!req.body.members.includes(req.user.id)) {
      req.body.members.push(req.user.id);
    }

    const project = await projectService.createProject(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects(
      req.user._id,
      req.user.role
    );
    // console.log(req.user);
    // console.log(projects);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    // Check if user is the creator or admin before updating
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    if (
      req.user.role !== "admin" &&
      project.createdBy._id.toString() !== req.user.id
    ) {
      return next(new ErrorResponse("Not authorized to update this project", 403));
    }

    // Update the project
    const updatedProject = await projectService.updateProject(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    // Check if user is the creator or admin before deleting
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    if (
      req.user.role !== "admin" &&
      project.createdBy._id.toString() !== req.user.id
    ) {
      return next(new ErrorResponse("Not authorized to delete this project", 403));
    }

    await projectService.deleteProject(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return next(new ErrorResponse("Please provide a user ID", 400));
    }

    // Check if user is the creator or admin before adding member
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      project.createdBy._id.toString() !== req.user.id
    ) {
      return next(new ErrorResponse("Not authorized to add members to this project", 403));
    }

    const updatedProject = await projectService.addMemberToProject(
      req.params.id,
      userId
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeMember = async (req, res, next) => {
  try {
    // Check if user is the creator or admin before removing member
    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      project.createdBy._id.toString() !== req.user.id
    ) {
      return next(new ErrorResponse("Not authorized to remove members from this project", 403));
    }

    const updatedProject = await projectService.removeMemberFromProject(
      req.params.id,
      req.params.userId
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};
