'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Confetti from 'react-confetti';
import { FiRefreshCcw, FiAward, FiZap, FiAlertTriangle, FiCheck } from 'react-icons/fi';

interface Props {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function ScoreCard({ score, totalQuestions, onReset }: Props) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const percentage = (score / totalQuestions) * 100;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });

    
    if (percentage >= 70) {
      const victorySound = new Audio('/correct.mp3'); 
      victorySound.volume = 0.5;
      victorySound.play().catch(() => console.log("Sound blocked"));
    }

    return () => controls.stop();
  }, [score, count, percentage]);

  const getRank = () => {
    if (percentage === 100) return { title: "Grand Master", color: "text-lime-400", glow: "shadow-lime-500/50", icon: <FiZap className="text-lime-400" /> };
    if (percentage >= 80) return { title: "Pro Developer", color: "text-lime-400", glow: "shadow-lime-500/30", icon: <FiAward className="text-lime-400" /> };
    if (percentage >= 50) return { title: "Intermediate", color: "text-zinc-400", glow: "shadow-zinc-500/20", icon: <FiCheck className="text-zinc-400" /> };
    return { title: "Beginner", color: "text-red-500", glow: "shadow-red-500/30", icon: <FiAlertTriangle className="text-red-500" /> };
  };

  const rank = getRank();

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-black font-sans overflow-hidden">
      {/* Matrix Background Glow */}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${percentage >= 80 ? 'bg-lime-500' : 'bg-red-500'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />

      {percentage >= 70 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          colors={['#a3e635', '#ffffff', '#166534']}
        />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full p-12 bg-zinc-950 rounded-[3.5rem] border border-zinc-800/50 text-center z-10 shadow-2xl relative"
      >
        {/* Animated Icon Badge */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className={`w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl shadow-2xl ${rank.glow}`}>
            {rank.icon}
          </div>
        </motion.div>

        <div className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-4 bg-zinc-900 border border-zinc-800 ${rank.color}`}>
          SYSTEM_RANK: {rank.title}
        </div>

        <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase italic">
          {percentage >= 80 ? 'Optimized' : percentage >= 50 ? 'Stable' : 'Failure'}
        </h2>

        {/* Score Display */}
        <div className="mb-10 p-10 bg-black rounded-[2.5rem] border border-zinc-900 relative overflow-hidden group">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mb-4">Diagnostic_Result</p>
          <div className="text-8xl font-black text-white italic tracking-tighter flex items-center justify-center gap-2">
            <motion.span>{rounded}</motion.span>
            <span className="text-3xl text-zinc-800 not-italic">/ {totalQuestions}</span>
          </div>
          
          {/* Neon Progress Bar */}
          <div className="mt-8 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 2, ease: "circOut" }}
              className={`h-full shadow-[0_0_15px_rgba(163,230,53,0.8)] ${percentage >= 50 ? 'bg-lime-400' : 'bg-red-600'}`}
            />
          </div>
          <p className="mt-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Accuracy: {percentage.toFixed(1)}%</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#a3e635', color: '#000' }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full py-5 bg-transparent border-2 border-lime-400 text-lime-400 font-black rounded-2xl transition-all text-xs tracking-[0.2em] flex items-center justify-center gap-3 uppercase italic"
          >
            <FiRefreshCcw /> Re-Run Diagnostic
          </motion.button>
          
          <button 
            onClick={onReset}
            className="w-full py-4 text-zinc-600 font-bold text-[10px] tracking-widest uppercase hover:text-zinc-400 transition-colors"
          >
            Return to Core
          </button>
        </div>
      </motion.div>
    </div>
  );
}