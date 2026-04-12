import { Request, Response } from "express";
import { asyncHandler, AppError } from "../lib";
import Project from "../models/project.model";
import { projectValidator } from "../utils/projectValidater";

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    status,
    priority,
    codeLink,
    liveLink,
    dueDate,
    assignDate,
  } = req.body;

  if (!name || !codeLink || !dueDate) {
    throw new AppError("Name, codeLink and dueDate are required", 400);
  }

  const project = await Project.create({
    owner: req.user!._id,
    name,
    description,
    status,
    priority,
    codeLink,
    liveLink,
    dueDate,
    assignDate,
  });

  if (!project) {
    throw new AppError("Failed to create the project", 500);
  }

  return res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const userProjects = await Project.find({ owner: req.user!._id })
    .sort("-createdAt")
    .populate("owner", "name email");

  return res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    count: userProjects.length,
    projects: userProjects,
  });
});

const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  projectValidator(req.user!._id, project.owner);

  return res.status(200).json({
    success: true,
    message: "Project fetched successfully",
    project,
  });
});

const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const {
    name,
    description,
    status,
    priority,
    codeLink,
    liveLink,
    dueDate,
    assignDate,
  } = req.body;

  /**
   * 🛡️ ATOMIC SECURITY PATTERN
   * SENIOR NOTE: Always include 'owner' in the search query ({ _id, owner }).
   * This prevents "Insecure Direct Object Reference" (IDOR) attacks.
   * Even if a hacker knows a projectId, they can't update it because they aren't the owner.
   * Using { new: true } ensures we return the data AFTER the update.
   */
  const updateProject = await Project.findOneAndUpdate(
    { _id: projectId, owner: req.user!._id },
    {
      $set: {
        name,
        description,
        status,
        priority,
        codeLink,
        liveLink,
        dueDate,
        assignDate,
      },
    },
    { new: true },
  );

  if (!updateProject) {
    throw new AppError("Project not found or unauthorized to update", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Project updated successfully",
    updateProject,
  });
});

const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const deleteProject = await Project.findOneAndDelete({
    _id: projectId,
    owner: req.user!._id,
  });

  if (!deleteProject) {
    throw new AppError("Project not found or unauthoriized to delete", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
