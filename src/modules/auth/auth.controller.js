import { AppConfig } from "../../config/config.js";
import { Status } from "../../config/constants.js";
import userSvc from "../user/user.service.js";
import authSvc from "./auth.service.js";
import jwt from "jsonwebtoken";

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
      })

      res.json({
        data: {
          accessToken,
          refreshToken
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
      data: null,
      message: "Logged In User Profile",
      status: "LOGGED_IN_USER_PROFILE_FETCHED",
      options: null
    })
  }

  logoutUser = async (req, res, next) => {
    res.json({
      data: null,
      message: "User Logged Out",
      status: "USER_LOGOUT_SUCCESS",
      options: null
    })
  }

  refreshToken = async (req, res, next) => {
    res.json({
      data: null,
      message: "User TOken Refreshed",
      status: "USER_TOKEN_REFRESHED",
      options: null
    })
  }

  forgetPasswordRequset = async (req, res, next) => {
    res.json({
      data: null,
      message: "Forget Password Request",
      status: "FORGET_PASSWORD_REQUEST",
      options: null
    })
  }

  forgetPasswordTokenVerify = async (req, res, next) => {
    res.json({
      data: null,
      message: "Forget password token verified",
      status: "TOKEN_VERIFIED",
      options: null
    })
  }

  resetPassword = async (req, res, next) => {
    res.json({
      data: null,
      message: "Reset password",
      status: "PASSWORD_RESET_SUCCESS",
      options: null
    })
  }

  updateUserById = async (req, res, next) => {
    res.json({
      data: null,
      message: "User Updated Successfully",
      status: "USER_UPDATE_SUCCESS",
      options: null
    })
  }
}

const authCtrl = new AuthController()
export default authCtrl;