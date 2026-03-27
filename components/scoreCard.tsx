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

  useEffect(() => {
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full">
      
      {percentage >= 70 && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
      )}

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full p-12 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl text-center border border-gray-100 dark:border-gray-800 z-10"
      >
        <div className="text-7xl mb-6">{percentage >= 70 ? '🏆' : '📚'}</div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          {percentage >= 70 ? 'Congrats!' : 'Good Try!'}
        </h2>
        
        <div className="my-8 py-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-1">Your Score</p>
          <div className="text-6xl font-black text-gray-900 dark:text-white italic">
            {score}<span className="text-2xl text-gray-400 not-italic">/{totalQuestions}</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}