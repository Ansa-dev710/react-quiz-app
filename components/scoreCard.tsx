'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

interface Props {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function ScoreCard({ score, totalQuestions, onReset }: Props) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const percentage = (score / totalQuestions) * 100;

  // --- RANK LOGIC ---
  const getRank = () => {
    if (percentage === 100) return { title: "Grand Master", color: "text-purple-500", bg: "bg-purple-500/10", icon: "👑" };
    if (percentage >= 80) return { title: "Pro Developer", color: "text-green-500", bg: "bg-green-500/10", icon: "🔥" };
    if (percentage >= 50) return { title: "Intermediate", color: "text-blue-500", bg: "bg-blue-500/10", icon: "🚀" };
    return { title: "Beginner", color: "text-orange-500", bg: "bg-orange-500/10", icon: "🌱" };
  };

  const rank = getRank();

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[400px]">
      {percentage >= 70 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl text-center border border-gray-100 dark:border-gray-800 z-10"
      >
        {/* Rank Icon & Badge */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-7xl mb-4">{rank.icon}</div>
          <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${rank.bg} ${rank.color} border border-current/20`}>
            Rank: {rank.title}
          </div>
        </div>

        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic">
          {percentage >= 80 ? 'EXCEPTIONAL!' : percentage >= 50 ? 'GOOD JOB!' : 'TRY AGAIN!'}
        </h2>

        <div className="my-8 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Quiz Performance</p>
          <div className="text-6xl font-black text-gray-900 dark:text-white italic">
            {score}<span className="text-2xl text-gray-400 not-italic">/{totalQuestions}</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-2">Accuracy: {Math.round(percentage)}%</p>
        </div>

        <button
          onClick={onReset}
          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95"
        >
          Retake Challenge
        </button>
      </motion.div>
    </div>
  );
}