'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Confetti from 'react-confetti';

interface Props {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function ScoreCard({ score, totalQuestions, onReset }: Props) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const percentage = (score / totalQuestions) * 100;

  // Count-up animation logic
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    // Animate from 0 to actual score over 2 seconds
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score]);

  const getRank = () => {
    if (percentage === 100) return { title: "Grand Master", color: "text-purple-500", bg: "bg-purple-500/10", icon: "👑" };
    if (percentage >= 80) return { title: "Pro Developer", color: "text-green-500", bg: "bg-green-500/10", icon: "🔥" };
    if (percentage >= 50) return { title: "Intermediate", color: "text-blue-500", bg: "bg-blue-500/10", icon: "🚀" };
    return { title: "Beginner", color: "text-orange-500", bg: "bg-orange-500/10", icon: "🌱" };
  };

  const rank = getRank();

  return (
    <div className="relative flex items-center justify-center w-full min-h-[400px]">
      {percentage >= 70 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="max-w-md w-full p-10 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl text-center border border-zinc-100 dark:border-zinc-800 z-10"
      >
        {/* Rank Badge Animation */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-7xl mb-4"
          >
            {rank.icon}
          </motion.div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${rank.bg} ${rank.color} border border-current/20`}>
            Rank: {rank.title}
          </div>
        </motion.div>

        <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tighter italic">
          {percentage >= 80 ? 'EXCEPTIONAL!' : percentage >= 50 ? 'GOOD JOB!' : 'KEEP PUSHING!'}
        </h2>

        {/* Animated Score Box */}
        <div className="my-8 py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-700 relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Final Score</p>
          <div className="text-7xl font-black text-zinc-900 dark:text-white italic flex items-center justify-center gap-1">
            <motion.span>{rounded}</motion.span>
            <span className="text-3xl text-zinc-300 dark:text-zinc-600 not-italic">/{totalQuestions}</span>
          </div>
          
          {/* Progress Mini-Bar inside ScoreCard */}
          <div className="mt-4 mx-auto w-32 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full ${rank.color.replace('text', 'bg')}`}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-colors text-lg"
        >
          RETAKE CHALLENGE
        </motion.button>
      </motion.div>
    </div>
  );
}