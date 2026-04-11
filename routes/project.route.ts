import { Router } from "express";
import { authHandler } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controller/project.controller";

const router = Router();

router.use(authHandler);

router.route("/").post(createProject).get(getAllProjects);

router
  .route("/:projectId")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
