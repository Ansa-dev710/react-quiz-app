export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizSections {
  [key: string]: Question[];
}

export const QUIZ_SECTIONS: QuizSections = {
  "React JS": [
    {
      id: 1,
      question: "Which React hook is used to handle side effects?",
      options: ["useState", "useContext", "useEffect", "useReducer"],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "What is the purpose of 'key' prop in React lists?",
      options: ["To style elements", "To uniquely identify elements", "To bind data", "To handle clicks"],
      correctAnswer: 1,
    },
  ],
  "Next.js": [
    {
      id: 1,
      question: "Which command is used to create a new Next.js app?",
      options: ["npx create-next-app", "npm install next", "npx start-next", "git clone next"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which folder is used for App Router in Next.js 13+?",
      options: ["pages", "src", "app", "public"],
      correctAnswer: 2,
    },
  ],
  "Styling & UI": [
    {
      id: 1,
      question: "What is the primary purpose of Tailwind CSS?",
      options: ["Backend Logic", "Utility-first Styling", "Database Management", "State Management"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "What does Framer Motion primarily handle?",
      options: ["API Requests", "Database connection", "Animations", "Form Validation"],
      correctAnswer: 2,
    },
  ]
};