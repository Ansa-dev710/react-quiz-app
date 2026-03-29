"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuizCard from "./quiz-card";
import Leaderboard from "./leaderbord"; 

const QUESTIONS = [
  { id: 1, question: "Which hook is used for side effects?", options: ["useRef", "useState", "useEffect", "useMemo"], correctAnswer: 2 },
  { id: 2, question: "Default display of a <div>?", options: ["inline", "flex", "block", "inline-block"], correctAnswer: 2 },
];

export default function QuizContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Logic to determine rank
  const getRank = (s: number) => {
    if (s === QUESTIONS.length) return "Pro";
    if (s >= QUESTIONS.length / 2) return "Intermediate";
    return "Beginner";
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === QUESTIONS[currentStep].correctAnswer) setScore((prev) => prev + 1);
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
      <div className="max-w-2xl mx-auto py-20 px-6">
        {/* User's Personal Result Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-blue-600 rounded-[3rem] shadow-2xl shadow-blue-500/20 text-white"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Quiz Results</span>
          <h2 className="text-5xl font-black italic mt-2 mb-6">You are a {getRank(score)}!</h2>
          
          <div className="flex justify-center gap-12 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-black">{score}/{QUESTIONS.length}</p>
              <p className="text-[10px] font-bold uppercase opacity-60">Final Score</p>
            </div>
            <div>
              <p className="text-3xl font-black">{Math.round((score / QUESTIONS.length) * 100)}%</p>
              <p className="text-[10px] font-bold uppercase opacity-60">Accuracy</p>
            </div>
          </div>
        </motion.div>

        {/* Global Leaderboard Section */}
        <Leaderboard />

        <button 
          onClick={() => window.location.reload()}
          className="w-full mt-10 py-5 border-2 border-slate-200 dark:border-slate-800 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all dark:text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-20 px-6">
      <AnimatePresence mode="wait">
        <QuizCard
          key={QUESTIONS[currentStep].id}
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
          onClick={nextQuestion}
          className="mt-8 w-full py-5 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl"
        >
          {currentStep === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
        </motion.button>
      )}
    </div>
  );
}