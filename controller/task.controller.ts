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

const getTaskByProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found!", 404);
  }

  projectValidator(req.user!._id, project.owner);

  const tasks = await Task.find({ projectId }).populate(
    "assignedTo",
    "name email",
  );

  return res.status(200).json({
    success: true,
    message: "Task fetched successfully",
    tasks: tasks,
  });
});
const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status, priority } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  projectValidator(req.user!._id, project.owner);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      status,
      priority,
    },
    { new: true },
  );

  if (!updatedTask) {
    throw new AppError("Failed to update task !!!", 500);
  }

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found!", 404);
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  projectValidator(req.user!._id, project.owner);

  const deletedTask = await Task.findByIdAndDelete(taskId);

  if (!deletedTask) {
    throw new AppError("Unable to delete the task!", 500);
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    task: deletedTask,
  });
});

export { createTask, getTaskByProject, updateTask, deleteTask };
