import UserModel from "./user.model.js";

class UserService {
  getUserPublicProfile(user) {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      image: user.image,
      qualification: user.qualification,
      faculty: user.faculty,
      institution: user.institution,
      passedYear: user.passedYear,
      _id: user._id,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
      updatedBy: user.updatedBy,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(data) {
    try {
      const user = new UserModel(data);
      return await user.save();
    } catch (exception) {
      throw exception;
    }
  }

  getSingleUserByFilter = async (filter) => {
    try {
      const userData = await UserModel.findOne(filter);
      return userData;
    } catch (exception) {
      throw exception;
    }
  };

  updateSingleUserByFilter = async (filter, data) => {
    try {
      const userData = await UserModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true }
      );
      return userData;
    } catch (exception) {
      throw exception;
    }
  };

  updateSingleUserById = async (id, updateData) => {
    if (!updateData || typeof updateData !== "object") {
      throw { code: 400, message: "Invalid update data" };
    }
    // remove restricted fields
    const restrictedFields = ["email", "password"];
    restrictedFields.forEach((field) => {
      if (field in updateData) {
        delete updateData[field];
      }
    });

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw { code: 404, message: "User not found" };
    }

    return updatedUser;
  };
}

const userSvc = new UserService()
export default userSvc