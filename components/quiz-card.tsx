"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface QuizCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (index: number, points: number) => void; // Added points parameter
  selectedAnswerIndex: number | null;
  correctAnswer: number;
}

export default function QuizCard({
  question,
  options,
  currentQuestion,
  totalQuestions,
  onAnswer,
  selectedAnswerIndex,
  correctAnswer,
}: QuizCardProps) {
  const hasAnswered = selectedAnswerIndex !== null;
  const [timeLeft, setTimeLeft] = useState(100);
  const [multiplier, setMultiplier] = useState(2);

  // Timer and Multiplier Logic
  useEffect(() => {
    if (!hasAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          // Calculate multiplier based on time left
          if (next > 70) setMultiplier(2);
          else if (next > 30) setMultiplier(1.5);
          else setMultiplier(1);
          return next;
        });
      }, 150); // Countdown speed
      return () => clearInterval(timer);
    }
  }, [hasAnswered, timeLeft]);

  const handleAnswerClick = (index: number) => {
    const basePoints = 100;
    const finalPoints = index === correctAnswer ? Math.floor(basePoints * multiplier) : 0;
    onAnswer(index, finalPoints);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 } 
    },
  };

  const buttonFeedbackVariants = {
    wrong: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } },
    correct: { scale: [1, 1.05, 1], transition: { duration: 0.3 } },
    pulse: { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.5 } }
  };

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 relative max-w-2xl mx-auto"
    >
      {/* Top Header: Progress & Multiplier */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Speed Bonus
          </span>
          <div className={`text-xs font-bold px-2 py-1 rounded-lg border transition-colors ${
            multiplier === 2 ? 'bg-orange-500 text-white border-orange-400' : 
            multiplier === 1.5 ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-200 text-slate-600'
          }`}>
            {multiplier}x Points
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Speed Timer Bar */}
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${timeLeft < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
          initial={{ width: "100%" }}
          animate={{ width: `${timeLeft}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight italic tracking-tight"
      >
        {question}
      </motion.h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4"
      >
        {options.map((option, index) => {
          const isSelected = selectedAnswerIndex === index;
          const isCorrect = index === correctAnswer;
          const isWrong = isSelected && index !== correctAnswer;

          let borderStyle = "border-slate-200 dark:border-slate-800";
          let bgStyle = "bg-white dark:bg-slate-900/50";
          let textStyle = "text-slate-700 dark:text-slate-300";

          if (hasAnswered) {
            if (isCorrect) {
              borderStyle = "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]";
              bgStyle = "bg-green-50 dark:bg-green-900/20";
              textStyle = "text-green-700 dark:text-green-400";
            } else if (isWrong) {
              borderStyle = "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]";
              bgStyle = "bg-red-50 dark:bg-red-900/20";
              textStyle = "text-red-700 dark:text-red-400";
            } else {
              borderStyle = "border-slate-100 dark:border-slate-800 opacity-30";
            }
          }

          return (
            <motion.button
              key={index}
              disabled={hasAnswered}
              variants={itemVariants}
              whileHover={!hasAnswered ? { scale: 1.02, x: 8 } : {}}
              whileTap={!hasAnswered ? { scale: 0.97 } : {}}
              onClick={() => handleAnswerClick(index)}
              className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 text-left ${borderStyle} ${bgStyle}`}
            >
              <motion.span 
                variants={buttonFeedbackVariants}
                animate={isWrong ? "wrong" : (isSelected && isCorrect) ? "correct" : (hasAnswered && isCorrect) ? "pulse" : ""}
                className={`text-lg font-bold ${textStyle}`}
              >
                {option}
              </motion.span>

              {/* Floating Score Indicator */}
              <AnimatePresence>
                {isSelected && isCorrect && (
                  <motion.span
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -50 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-12 font-black text-2xl text-orange-500 drop-shadow-md"
                  >
                    +{Math.floor(100 * multiplier)}
                  </motion.span>
                )}
              </AnimatePresence>

              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isCorrect && hasAnswered ? "border-green-500 bg-green-500 shadow-lg shadow-green-500/50" : 
                isWrong ? "border-red-500 bg-red-500 shadow-lg shadow-red-500/50" : "border-slate-200 dark:border-slate-700"
              }`}>
                {hasAnswered && (isCorrect || isWrong) ? (
                  <span className="text-white text-sm font-bold">{isCorrect ? "✓" : "✕"}</span>
                ) : (
                  <div className="h-3 w-3 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}