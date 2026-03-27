export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which React hook is used to handle side effects?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "What is the primary purpose of Tailwind CSS?",
    options: ["Backend Logic", "Utility-first Styling", "Database Management", "State Management"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which command is used to create a new Next.js app?",
    options: ["npx create-next-app", "npm install next", "npx start-next", "git clone next"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "What does Framer Motion primarily handle?",
    options: ["API Requests", "Database connection", "Animations", "Form Validation"],
    correctAnswer: 2,
  }
];