### Data Identification
  * Core Features
    - Users
      - admin, student, examiner
    - Exams
      - examTitle, description, examType, duration, totalMarks, passMarks, startDate, endDate, status(scheduled, ongoing, completed), createdBy (admin, examiner)
    - Question Bank
      - questionText, options[], correctAnswer, difficultyLevel, category/subject, marks, weightage, explanation (optional), addedBy(examiner, admin)
    - Exam Module Setup
      - rules for auto-generation(no. of questions, difficulty ratio, subject distribution), randomization of questions
    - Exam Session/Attempt
      - studentId, examId, answer[], timeTaken, attemptStatus[in-progress, submitted, auto-submitted], score, rank, percentile
    - Results
      - studentId, examId, totalScore, correctCount, wrongCount, performance, resultStatus(pass, fail)
  
  * Addons Features
    - Notifications
      - exam reminders, result announcements, system updates
    - Audit Logs
      - login history, exam activity (tab switch warnings, cheating detection)
    - Analytics
      - student-wise performance trends, exam-wise difficulty analysis, examiner dashboard (which questions are most missed)
    - Communication / Support
      - student ↔ examiner chat (for queries before exams), system announcements
    - Certificates & Reports
      - downloadable scorecards,performance analytics reports (PDF/Excel)
    - Payment Module (if paid exams)
      - transactions (studentId, examId, amount, paymentMethod, status)