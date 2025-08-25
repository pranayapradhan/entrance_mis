import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js";
import questionRouter from "../modules/question/question.router.js";
import userRouter from "../modules/user/user.router.js";
import examRouter from "../modules/exam/exam.router.js";

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/exam', examRouter)
router.use('/question',questionRouter)

export default router;