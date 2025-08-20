import { Router } from "express";
import authCtrl from "./auth.controller.js";
import bodyValidator from "../../middlewares/request-validate.middleware.js";
import { LoginDTO, RegisterDTO, ResetPasswordRequestDTO } from "./auth.validator.js";
import uploader from "../../middlewares/uploader.middleware.js";

const authRouter = Router()

authRouter.post('/register',uploader().single('image'), bodyValidator(RegisterDTO), authCtrl.registerUser)
authRouter.post('/activate/:token', authCtrl.activateUser)
authRouter.post('/login', bodyValidator(LoginDTO), authCtrl.loginUser)
authRouter.get('/me', authCtrl.loggedInUserProfile)
authRouter.get('/logout',  authCtrl.logoutUser)
authRouter.get('/refresh', authCtrl.refreshToken)
authRouter.post('/forget-password', bodyValidator(ResetPasswordRequestDTO), authCtrl.forgetPasswordRequset)
authRouter.get('/forget-password-verify/:token', authCtrl.forgetPasswordTokenVerify)

authRouter.put('/reset-password', authCtrl.resetPassword)

authRouter.put('/update-user/:id', authCtrl.updateUserById)

// authRouter.post('/register', uploader().single('image'), bodyValidator(RegisterDTO), authCtrl.registerUser)
// authRouter.post('/activate/:token', authCtrl.activateUser)
// authRouter.post('/login', bodyValidator(LoginDTO), authCtrl.loginUser)
// authRouter.get('/me', auth(), authCtrl.loggedInUserProfile)
// authRouter.get('/logout', auth(), authCtrl.logoutUser)
// authRouter.get('/refresh', authCtrl.refreshToken)
// authRouter.post('/forget-password', bodyValidator(ResetPasswordRequestDTO), authCtrl.forgetPasswordRequset)
// authRouter.get('/forget-password-verify/:token', authCtrl.forgetPasswordTokenVerify)

// authRouter.put('/reset-password', bodyValidator(ResetPasswordDataDTO), authCtrl.resetPassword)

// authRouter.put('/update-user/:id', authCtrl.updateUserById)

export default authRouter;