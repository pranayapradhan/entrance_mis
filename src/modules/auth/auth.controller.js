import authSvc from "./auth.service.js";

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = await authSvc.transformUserCreate(req)

      // Email for Activation
      await authSvc.sendActivationNotification(data)
      res.json({
        data: data,
        message: "Register Success",
        status: "REGISTER_SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception)
    }
  }

  activateUser = async (req, res, next) => {
    res.json({
      data: req.body,
      message: "User Activated",
      status: "USER_ACTIVATION_SUCCESS",
      options: null
    })
  }

  loginUser = async (req, res, next) => {
    res.json({
      data: null,
      message: "User Logged In",
      status: "USER_LOGIN_SUCCESS",
      options: null
    })
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