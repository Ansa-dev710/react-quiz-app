"use client";
import { motion } from "framer-motion";

interface QuizCardProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
}

export default function QuizCard({ question, options, currentQuestion, totalQuestions, onAnswer }: QuizCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          Question {currentQuestion + 1} / {totalQuestions}
        </span>
        <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight italic">
        {question}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(index)}
            className="group flex items-center justify-between p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 hover:shadow-xl transition-all text-left"
          >
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {option}
            </span>
            <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition-colors">
               <div className="h-3 w-3 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}