const Project = require("../models/Project");
const mongoose = require("mongoose");

exports.createProject = async (projectData) => {
  return await Project.create(projectData);
};

exports.getAllProjects = async (userId, role) => {
  // Admin sees all projects
  if (role === "admin") {
    return await Project.find().populate("createdBy", "name email");
  }

  // Manager and Developer see only projects they are members of or created
  return await Project.find({
    $or: [{ createdBy: userId }, { members: userId }],
  }).populate("createdBy", "name email");
};

exports.getProjectById = async (projectId, userId, role) => {
  // Check if the projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID format");
  }

  const project = await Project.findById(projectId)
    .populate("createdBy", "name email")
    .populate("members", "name email");

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user has access to this project
  if (
    role !== "admin" &&
    project.createdBy._id.toString() !== userId.toString() &&
    !project.members.some(
      (member) => member._id.toString() === userId.toString()
    )
  ) {
    throw new Error("Not authorized to access this project");
  }

  return project;
};

exports.updateProject = async (projectId, projectData) => {
  // Check if the projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID format");
  }

  return await Project.findByIdAndUpdate(projectId, projectData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteProject = async (projectId) => {
  // Check if the projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID format");
  }

  return await Project.findByIdAndDelete(projectId);
};

exports.addMemberToProject = async (projectId, userId) => {
  // Check if the projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID format");
  }

  return await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: userId } },
    { new: true }
  );
};

exports.removeMemberFromProject = async (projectId, userId) => {
  // Check if the projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID format");
  }

  return await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: userId } },
    { new: true }
  );
};
