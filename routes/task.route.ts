import {
  createTask,
  deleteTask,
  getTaskByProject,
  updateTask,
} from "controller";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.route("/").post(createTask).get(getTaskByProject);
router.route("/:taskId").patch(updateTask).delete(deleteTask);

export default router;
