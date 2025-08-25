import mongoose from "mongoose";
import { DIFFICULTY_LEVEL, Status } from "../../config/constants";

const questionSchema = new mongoose.Schema({
  // examId: { 
  //   type: mongoose.Types.ObjectId, 
  //   ref: "Exam" 
  // },
  questionText: { 
    type: String, 
    required: true 
  },
  options: [
    {
      optionId: String,
      text: String,
      isCorrect: { type: Boolean, default: false }
    }
  ],
  correctAnswer: { 
    optionId: String,
    type: String,
    required: true
  },
  marks: { 
    type: Number, 
    required: true 
  },
  difficultyLevel: { 
    type: String, 
    enum: Object.values(DIFFICULTY_LEVEL), 
    default: DIFFICULTY_LEVEL.EASY 
  },
  subject: { 
    type: String, 
    required: true 
  }, // subject like Math, Physics
  explanation: { 
    type: String, 
    default: null 
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.ACTIVE,
  },
  createdBy: { 
    type: mongoose.Types.ObjectId, 
    ref: "User",
    default: null 
  },
  updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
}, { 
  autoCreate: true,
  autoIndex: true,
  timestamps: true 
});

const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;