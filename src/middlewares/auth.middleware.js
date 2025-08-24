import { AppConfig } from "../config/config.js";
import authSvc from "../modules/auth/auth.service.js";
import jwt from "jsonwebtoken";
import userSvc from "../modules/user/user.service.js";
import {USER_ROLES} from "../config/constants.js"

const auth = (role = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"] || null;

      if (!token) {
        throw {
          code: 401,
          message: "Unauthorized",
          status: "UNAUTHORIZED",
        };
      }

      //Bearer token => "token"
      token = token.replace("Bearer ", "");

      //db token
      const authData = await authSvc.getSingleRowByFilter({
        maskedAccessToken: token,
      });

      if (!authData) {
        throw {
          code: 401,
          message: "Token not found",
          status: "UNDEFINED_TOKEN",
        };
      }

      //
      const data = jwt.verify(authData.accessToken, AppConfig.jwtSecret);

      //
      if (data.typ !== "Bearer") {
        throw {
          code: 401,
          message: "Bearer token expected",
          status: "UNEXPECTED_TOKEN",
        };
      }

      let userDetail = await userSvc.getSingleUserByFilter({
        _id: data.sub,
      });

      if (!userDetail) {
        throw {
          code: 403,
          message:
            "User not found or already being deleted from the application",
          status: "USER_NOT_FOUND",
        };
      }

      userDetail = userSvc.getUserPublicProfile(userDetail);
      req.loggedInUser = userDetail;

      if (
        userDetail.role === USER_ROLES.ADMIN ||
        role === null ||
        (Array.isArray(role) && role.includes(userDetail.role))
      ) {
        // system access
        next();
      } else {
        throw {
          code: 403,
          message: "Access denied!!!",
          status: "ACCESS_DENIED",
        };
      }
    } catch (exception) {
      // next(exception)
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
  };
};

export default auth;  
