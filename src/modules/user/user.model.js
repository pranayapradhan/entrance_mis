import mongoose from "mongoose";
import {GENDER,Qualifications,Status,USER_ROLES} from "../../config/constants.js";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 2, max: 30 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  gender: { type: String, enum: Object.values(GENDER), default: null },
  dob: Date,
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.STUDENT,
  },
  image: {
    publicId: String,
    secureUrl: String,
    optimizedUrl: String,
  },
  qualification: {
    type: String,
    enum: Object.values(Qualifications),
    default: null,
  },
  faculty: String,
  institution: String,
  passedYear: { type: String, max: 4, default: null },
  address: {
    permanentAddress: String,
    temporaryAddress: String,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  activationToken: String,
  forgetPasswordToken: String,
  expiryTime: Date,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, {
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;