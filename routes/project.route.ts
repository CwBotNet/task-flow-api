import { Router } from "express";
import { authHandler } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controller/project.controller";
import taskRouter from "./task.route";

const router = Router();

router.use(authHandler);

router.route("/").post(createProject).get(getAllProjects);

router
  .route("/:projectId")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

router.use("/:projectId/tasks", taskRouter);

export default router;
