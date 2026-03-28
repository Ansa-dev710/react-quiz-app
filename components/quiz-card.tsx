"use client";
import { motion } from "framer-motion";

interface QuizCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  selectedAnswerIndex: number | null; // Naya prop
  correctAnswer: number; // Naya prop
}

export default function QuizCard({ 
  question, 
  options, 
  currentQuestion, 
  totalQuestions, 
  onAnswer,
  selectedAnswerIndex,
  correctAnswer 
}: QuizCardProps) {
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Progress Section */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          Question {currentQuestion + 1} / {totalQuestions}
        </span>
        <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight italic">
        {question}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => {
          const isSelected = selectedAnswerIndex === index;
          const isCorrect = index === correctAnswer;
          const isWrong = isSelected && index !== correctAnswer;
          const hasAnswered = selectedAnswerIndex !== null;

          // Dynamic Styles based on selection
          let borderStyle = "border-slate-200 dark:border-slate-800";
          let bgStyle = "bg-white dark:bg-slate-900/50";
          let textStyle = "text-slate-700 dark:text-slate-300";

          if (hasAnswered) {
            if (isCorrect) {
              borderStyle = "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
              bgStyle = "bg-green-50 dark:bg-green-900/20";
              textStyle = "text-green-700 dark:text-green-400";
            } else if (isWrong) {
              borderStyle = "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
              bgStyle = "bg-red-50 dark:bg-red-900/20";
              textStyle = "text-red-700 dark:text-red-400";
            } else {
              borderStyle = "border-slate-100 dark:border-slate-800 opacity-40";
            }
          }

          return (
            <motion.button
              key={index}
              disabled={hasAnswered}
              whileHover={!hasAnswered ? { scale: 1.02, x: 8 } : {}}
              whileTap={!hasAnswered ? { scale: 0.98 } : {}}
              onClick={() => onAnswer(index)}
              className={`group flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 text-left ${borderStyle} ${bgStyle}`}
            >
              <span className={`text-sm font-bold ${textStyle}`}>
                {option}
              </span>

              {/* Status Icon */}
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isCorrect && hasAnswered ? "border-green-500 bg-green-500" : 
                isWrong ? "border-red-500 bg-red-500" : "border-slate-200 dark:border-slate-700"
              }`}>
                {hasAnswered && (isCorrect || isWrong) ? (
                  <span className="text-white text-[10px]">{isCorrect ? "✓" : "✕"}</span>
                ) : (
                  <div className="h-3 w-3 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}