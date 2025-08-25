const Status = {
  ACTIVE: "active",
  INACTIVE: "inactive"
}

const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  EXAMINER: "examiner"
}

const Qualifications = {
  SCHOOL: "school",
  HIGH_SCHOOL: 'high-school',
  BACHELOR: 'bachelor'
}

const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
}

const DIFFICULTY_LEVEL = {
  EASY: "easy",
  MEDIUM: 'medium',
  HARD: "hard"
}

const EXAM_TYPE = {
  ENTRANCE: "entrance",
  MOCK: "mock",
  PRACTICE: "practice"
}

const EXAM_STATUS = {
  DRAFT: "draft", 
  SCHEDULED: "scheduled", 
  ONGOING: "ongoing", 
  COMPLETED: "completed"
}

export {
  Status,
  USER_ROLES,
  Qualifications,
  GENDER,
  DIFFICULTY_LEVEL,
  EXAM_TYPE,
  EXAM_STATUS
}