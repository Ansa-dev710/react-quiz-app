'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function ScoreCard({ score, totalQuestions, onReset }: ScoreCardProps) {
  const percentage = (score / totalQuestions) * 100;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl text-center border border-gray-100 dark:border-gray-800"
    >
      <div className="text-6xl mb-4">
        {percentage >= 70 ? '🎉' : percentage >= 40 ? '👍' : '😭'}
      </div>
      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Quiz Results</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
        {percentage >= 70 ? 'Excellent performance!' : 'Keep practicing, you can do it!'}
      </p>

      <div className="relative inline-flex items-center justify-center mb-8">
         <div className="text-5xl font-black text-blue-600 italic">
           {score}<span className="text-2xl text-gray-300 not-italic"> / {totalQuestions}</span>
         </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
      >
        Try Again
      </button>
    </motion.div>
  );
}