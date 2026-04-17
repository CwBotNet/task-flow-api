import type { Request, Response } from "express";
import { asyncHandler, AppError } from "../lib";
import { projectValidator } from "../utils/projectValidater";
import Project from "../models/project.model";
import Task from "../models/task.model";
import { Types } from "mongoose";

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate, assignedTo } =
    req.body;

  if (!title || !dueDate) {
    throw new AppError("Title and dueDate are required", 400);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  projectValidator(req.user!._id, project.owner);

  const normalizedAssignedTo = Array.isArray(assignedTo)
    ? assignedTo
    : [assignedTo || req.user!._id];

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo: normalizedAssignedTo as any,
    projectId: new Types.ObjectId(projectId as string),
  });

  if (!task) {
    throw new AppError("Failed to create task !!!", 500);
  }

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    task: task!,
  });
});

export { createTask };
