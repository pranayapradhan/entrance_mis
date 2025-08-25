import userSvc from "./user.service.js";

class UserController {
  async listAllUsers(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: { $ne: loggedInUser._id },
      };

      //query
      if (req.query.search) {
        filter = {
          ...filter,
          $or: [
            { name: new RegExp(req.query.search, "i") },
            { email: new RegExp(req.query.search, "i") },
            { gender: new RegExp(req.query.search, "i") },
            { phone: new RegExp(req.query.search, "i") },
            { "address.permanentAddress": new RegExp(req.query.search, "i") },
            { "address.temporaryAddress": new RegExp(req.query.search, "i") },
          ],
        };
      }

      if (req.query.role) {
        filter = {
          ...filter,
          role: req.query.role,
        };
      }

      const { data, pagination } = await userSvc.getAllUsersByFilter(
        filter,
        req.query
      );

      res.json({
        data: data,
        message: "User List",
        status: "USER_LIST",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.userId;
      const detail = await userSvc.getSingleUserByFilter({
        _id: userId,
      });

      if (!detail) {
        throw {
          code: 422,
          message: "User Not Found",
          status: "USER_NOT_FOUND",
        };
      }

      res.json({
        data: userSvc.getUserPublicProfile(detail),
        message: "User Information",
        status: "USER_DETAIL",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  }
} 

const userCtrl = new UserController()
export default userCtrl