"use client";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";

export default function ResultView({ score, total, onRestart }: { score: number, total: number, onRestart: () => void }) {
  const percentage = (score / total) * 100;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-10 space-y-8"
    >
      <div className="relative inline-block">
        <Sparkles className="absolute -top-6 -right-6 text-yellow-500 animate-bounce" size={32} />
        <h2 className="text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter">
          {percentage}%
        </h2>
      </div>
      
      <div className="space-y-2">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          You scored <span className="text-blue-600 font-black">{score}</span> out of <span className="text-slate-900 dark:text-white">{total}</span>
        </p>
        <p className="text-xs uppercase tracking-[0.3em] font-black text-slate-400">Quiz Completed</p>
      </div>

      <button 
        onClick={onRestart}
        className="flex items-center gap-2 mx-auto px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
      >
        <RotateCcw size={14} /> Restart Quiz
      </button>
    </motion.div>
  );
}