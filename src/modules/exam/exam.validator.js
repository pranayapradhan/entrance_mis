import Joi from "joi";
import { EXAM_STATUS, EXAM_TYPE } from "../../config/constants.js";

// Exam validation schema
const ExamCreateDTO = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("", null), // optional
  examType: Joi.string()
    .valid(...Object.values(EXAM_TYPE))
    .required(),
  totalQuestions: Joi.number().integer().min(1).required(),
  totalMarks: Joi.number().min(1).required(),
  passingMarks: Joi.number()
    .min(1)
    .less(Joi.ref("totalMarks")) // passingMarks must be less than totalMarks
    .required(),
  duration: Joi.number().integer().min(1).required(), // duration in minutes
  startDate: Joi.date().iso().required(),
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref("startDate")) // endDate must be after startDate
    .required(),
  isPublished: Joi.boolean().default(false),
  status: Joi.string()
    .valid(...Object.values(EXAM_STATUS))
    .default(EXAM_STATUS.DRAFT)
});

const ExamUpdateDTO = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("", null), // optional
  examType: Joi.string()
    .valid(...Object.values(EXAM_TYPE))
    .required(),
  totalQuestions: Joi.number().integer().min(1).required(),
  totalMarks: Joi.number().min(1).required(),
  passingMarks: Joi.number()
    .min(1)
    .less(Joi.ref("totalMarks")) // passingMarks must be less than totalMarks
    .required(),
  duration: Joi.number().integer().min(1).required(), // duration in minutes
  startDate: Joi.date().iso().required(),
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref("startDate")) // endDate must be after startDate
    .required(),
  isPublished: Joi.boolean().default(false),
  status: Joi.string()
    .valid(...Object.values(EXAM_STATUS))
    .default(EXAM_STATUS.DRAFT)
});

export {
  ExamCreateDTO,
  ExamUpdateDTO
}