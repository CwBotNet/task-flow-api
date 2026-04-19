import { createTask, getTaskByProject } from "controller";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.route("/").post(createTask);

export default router;
