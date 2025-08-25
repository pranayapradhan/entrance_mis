import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../../config/constants";
import uploader from "../../middlewares/uploader.middleware";
import examCtrl from "./exam.controller";
import bodyValidator from "../../middlewares/request-validate.middleware";
import { ExamCreateDTO } from "./exam.validator";

const examRouter = Router()

// CRUD operations
examRouter.post("/create",uploader().single(), auth(USER_ROLES.ADMIN), bodyValidator(ExamCreateDTO), examCtrl.createExam);
examRouter.get("/", auth(), examCtrl.getAllExams);
examRouter.get("/:id", auth(), examCtrl.getExamById);
examRouter.put("/:id", auth([USER_ROLES.ADMIN, USER_ROLES.EXAMINER]), examCtrl.updateExamById);
examRouter.delete("/:id", auth(USER_ROLES.ADMIN), examCtrl.deleteExam);

// Extra operations
examRouter.patch("/:id/publish", auth([USER_ROLES.ADMIN, USER_ROLES.EXAMINER]), examController.publishExam);

// Unpublish exam
examRouter.patch("/:id/unpublish", auth([USER_ROLES.ADMIN, USER_ROLES.EXAMINER]), examController.unpublishExam);

// Get active exams (students can see)
examRouter.get("/status/active", auth(), examController.getActiveExams);

export default examRouter