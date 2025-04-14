const projectService = require("../services/projectService");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects(
      req.user._id,
      req.user.role
    );
    console.log(req.user);
    console.log(projects);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
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
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await projectService.deleteProject(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a user ID",
      });
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to add members to this project",
      });
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeMember = async (req, res) => {
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove members from this project",
      });
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
