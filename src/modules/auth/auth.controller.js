import { AppConfig } from "../../config/config.js";
import { Status } from "../../config/constants.js";
import userSvc from "../user/user.service.js";
import authSvc from "./auth.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomStringGenerator } from "../../utilities/helper.js";

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = await authSvc.transformUserCreate(req)
      let user = await userSvc.createUser(data)

      // Email for Activation
      await authSvc.sendActivationNotification(user)

      res.json({
        data: userSvc.getUserPublicProfile(user),
        message: "Thank You for registering, Please activate your account via email.",
        status: "REGISTER_SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception)
    }
  }

  activateUser = async (req, res, next) => {
    try {
      const token = req.params.token
      const userDetail = await userSvc.getSingleUserByFilter({
        activationToken: token
      })

      if(!userDetail){
        throw {
          code: 404,
          message: "User associated with token not found or has been already activated",
          status: "NOT_FOUND"
        }
      }

      const updatedUser = await userSvc.updateSingleUserByFilter({
        _id: userDetail._id
      }, {
        status: Status.ACTIVE,
        activationToken: null
      })

      await authSvc.newUserWelcomeEmail(updatedUser)
      res.json({
        data: null,
        message: "Your account has been activated successfully. Please login to continue..",
        status: "ACTIVATION_SUCCESS",
        options: null
      })
    } catch (exception) {
      next(exception)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const {email, password} = req.body;
      const userDetail = await userSvc.getSingleUserByFilter({
        email: email
      })

      if(!userDetail) {
        throw {
          code: 422,
          message: "Email not registered yet!",
          status: "EMAIL_NOT_REGISTERED"
        }
      }

      if(!bcrypt.compareSync(password, userDetail.password)){
        throw {
          code: 422,
          message: "Credentials does not match!!!",
          status: "CREDENTIALS_DOES_NOT_MATCH"
        }
      }

      if(userDetail.status !== Status.ACTIVE || userDetail.activationToken !==  null){
        throw {
          code: 422,
          message: "User not activated yet!",
          status: "USER_NOT_ACTIVATED"
        }
      }

      // jwt token
      const accessToken = jwt.sign({
        sub: userDetail._id,
        typ: "Bearer"
      }, AppConfig.jwtSecret,{
        expiresIn: "6h"
      })

      const refreshToken = jwt.sign({
        sub: userDetail._id,
        typ: "Refresh"
      }, AppConfig.jwtSecret,{
        expiresIn: "1d"
      });

      const maskedAccessToken = randomStringGenerator(150)
      const maskedRefreshToken = randomStringGenerator(150)

      const authData = {
        user: userDetail._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        maskedAccessToken: maskedAccessToken,
        maskedRefreshToken: maskedRefreshToken
      }

      await authSvc.createAuthData(authData)

      res.json({
        data: {
          accessToken: maskedAccessToken,
          refreshToken: maskedRefreshToken
        },
        message: "Welcome to "+userDetail.role+" Panel!!!",
        status: "LOGIN_SUCCESS",
        options: null
      })
    } catch (exception) {
      next(exception)
    }
  }

  loggedInUserProfile = async (req, res, next) => {
    res.json({
      data: req.loggedInUser,
      message: "Me Router",
      status: "SUCCESS",
      options: null
    })
  }

  logoutUser = async (req, res, next) => {
    try {
      await authSvc.logoutUser(req.headers['authorization'])
      res.json({
        data: null,
        message: "LoggedOut Successfully",
        status: "LOGGED_OUT",
        options: null
      })
    } catch (exception) {
      next(exception)
    }
  }

  refreshToken = async (req, res, next) => {
    try {
      let token = req.headers['authorization']
      token = token.replace("Refresh ", "")

      if(!token){
        throw {
          code: 401,
          message: "Token not found",
          status: "TOKEN_REQUIRED"
        }
      }

      const authToken = await authSvc.getSingleRowByFilter({
        maskedRefreshToken: token
      });

      if(!authToken){
        throw {
          code: 401,
          message: "Invalid Token",
          status: "INVALID_TOKEN"
        }
      }

      const data = jwt.verify(authToken.refreshToken, AppConfig.jwtSecret)
      const userDetail = await userSvc.getSingleUserByFilter({
        _id: data.sub
      })

      if(!userDetail){
        throw {
          code: 422,
          message: "User not found",
          status: "USER_NOT_FOUND"
        }
      }

      // jwt token
      const accessToken = jwt.sign({
        sub: userDetail._id,
        typ: "Bearer"
      }, AppConfig.jwtSecret,{
        expiresIn: "6h"
      })

      const refreshToken = jwt.sign({
        sub: userDetail._id,
        typ: "Refresh"
      }, AppConfig.jwtSecret,{
        expiresIn: "1d"
      });

      const maskedAccessToken = randomStringGenerator(150)
      const maskedRefreshToken = randomStringGenerator(150)

      const authData = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        maskedAccessToken: maskedAccessToken,
        maskedRefreshToken: maskedRefreshToken
      }

      await authSvc.updateSingleRowByFilter({
        _id: authToken._id
      }, authData)

      res.json({
        data: {
          accessToken: authData.maskedAccessToken,
          refreshToken: authData.maskedRefreshToken
        },
        message: "New access token and refresh token",
        status: "TOKEN_REFRESHED",
        options: null
      })
    } catch (exception) {
      if (
        exception.hasOwnProperty("name") &&
        exception.name === "TokenExpiredError"
      ) {
        next({
          code: 401,
          message: exception.message,
          status: "TOKEN_EXPIRED",
        });
      } else {
        next(exception);
      }
    }
  }

  forgetPasswordRequset = async (req, res, next) => {
    try {
      const {email} = req.body;
      const userDetail = await userSvc.getSingleUserByFilter({
        email: email
      })

      if(!userDetail){
        throw {
          code: 400,
          detail: {
            email: "User not registered yet"
          },
          message: "User not registered",
          status: "USER_NOT_FOUND"
        }
      }

      //request
      const forgetData = {
        forgetPasswordToken: randomStringGenerator(150),
        expiryTime: new Date(Date.now() + 3*60*60*1000)
      }

      const updatedUser = await userSvc.updateSingleUserByFilter({
        _id: userDetail._id,
      }, forgetData)

      await authSvc.sendPasswordResetRequestEmail(updatedUser)
      res.json({
        data: null,
        message: "An email has been forwarded to the registered email. Please follow the steps from email",
        status: "RESET_PASSWORD_LINK_SENT",
        options: null
      })
    } catch (exception) {
      next(exception)  
    }
  }

  forgetPasswordTokenVerify =async (req, res, next) => {
    try {
      let token = req.params.token
      const userDetail = await authSvc.verifyPasswordResetToken(token)

      // token 
      token = randomStringGenerator(150)
      await userSvc.updateSingleUserByFilter({
        _id: userDetail._id,
      }, {
        forgetPasswordToken: token
      })

      res.json({
        data: token,
        message: "Token Verified.",
        status: "SUCCESS",
        options: null
      })
    } catch (exception) {
      next(exception)
    }
  };

  resetPassword =async (req, res, next) => {
    try {
      let token = req.headers.authorization
      token = token.replace("Bearer ", "")

      const userDetail = await authSvc.verifyPasswordResetToken(token)
      const password = bcrypt.hashSync(req.body.password, 12)      
      await userSvc.updateSingleUserByFilter({
        _id: userDetail._id
      }, {
        password: password,
        forgetPasswordToken: null,
        expiryTime: null
      })
      await authSvc.logoutFromAll({
        user: userDetail._id
      })

      await authSvc.sendPasswordResetSuccessEmail(userDetail)
      res.json({
        data: null,
        message: "Password reset successfully.",
        status: "PASSWORD_RESET",
        options: null
      })
    } catch (exception) {
      next(exception)
    }
  };

  updateUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const userDetail = await userSvc.getSingleUserByFilter({
        _id: id
      })

      if(!userDetail){
        throw{
          code: 401,
          message: "User not found",
          status: "USER_NOT_FOUND"
        }
      }

      const updatedUser = await userSvc.updateSingleUserById(id, req.body);

      res.json({
        data: updatedUser,
        message: "User updated successfully.",
        status: "USER_UPDATED",
        options: null
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const authCtrl = new AuthController()
export default authCtrl;