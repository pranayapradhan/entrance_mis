import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import userCtrl from "./user.controller.js";
import { USER_ROLES } from "../../config/constants.js";

const userRouter = Router()

userRouter.get("/", auth([USER_ROLES.ADMIN]), userCtrl.listAllUsers)
userRouter.get("/:userId", auth([USER_ROLES.ADMIN]), userCtrl.getUserById)

export default userRouter;