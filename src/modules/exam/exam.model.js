import mongoose from "mongoose";
import { EXAM_STATUS, EXAM_TYPE } from "../../config/constants";

const examSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { type: String },
  examType: { 
    type: String, 
    enum: Object.values(EXAM_TYPE), 
    required: true 
  },
  totalQuestions: { 
    type: Number ,
    required: true
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  passingMarks: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  }, // in minutes
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isPublished: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: Object.values(EXAM_STATUS), 
    default: EXAM_STATUS.DRAFT
  },
  createdBy: { 
    type: mongoose.Types.ObjectId, 
    ref: "User",
    default: null
  },
  updatedBy: { 
    type: mongoose.Types.ObjectId, 
    ref: "User",
    default: null
  },
}, { 
  autoCreate: true,
  autoIndex: true,
  timestamps: true 
});
  
const ExamModel =  mongoose.model("Exam", examSchema);
export default ExamModel