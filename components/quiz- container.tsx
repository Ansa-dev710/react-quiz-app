"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuizCard from "./quiz-card"; // Fixed: Added closing quote and semicolon

const QUESTIONS = [
  {
    id: 1,
    question: "Which hook is used for side effects in React?",
    options: ["useRef", "useState", "useEffect", "useMemo"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "What is the default display value of a <div>?",
    options: ["inline", "flex", "block", "inline-block"],
    correctAnswer: 2,
  },
];

export default function QuizContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === QUESTIONS[currentStep].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">Quiz Complete!</h2>
        <p className="text-blue-600 font-bold text-xl">Score: {score} / {QUESTIONS.length}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl font-bold hover:scale-105 transition-transform"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-20 px-6">
      <AnimatePresence mode="wait">
        <QuizCard
          key={QUESTIONS[currentStep].id} // Key is vital for AnimatePresence to trigger animations
          question={QUESTIONS[currentStep].question}
          options={QUESTIONS[currentStep].options}
          currentQuestion={currentStep}
          totalQuestions={QUESTIONS.length}
          onAnswer={handleAnswer}
          selectedAnswerIndex={selectedAnswer}
          correctAnswer={QUESTIONS[currentStep].correctAnswer}
        />
      </AnimatePresence>

      {selectedAnswer !== null && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextQuestion}
          className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 uppercase tracking-wider text-sm"
        >
          {currentStep === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
        </motion.button>
      )}
    </div>
  );
}