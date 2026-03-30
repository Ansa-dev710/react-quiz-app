'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Confetti from 'react-confetti';
import { FiRefreshCcw, FiAward, FiZap, FiAlertTriangle, FiCheck, FiTrendingUp } from 'react-icons/fi';

interface Props {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export default function ScoreCard({ score, totalQuestions, onReset }: Props) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Scoring Logic: Max 200 points per question (with multipliers)
  const maxPossibleScore = totalQuestions * 200; 
  const accuracyPercentage = Math.min((score / maxPossibleScore) * 100, 100);
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Smooth score increment animation
    const controls = animate(count, score, { 
      duration: 2, 
      ease: [0.16, 1, 0.3, 1] 
    });

    return () => controls.stop();
  }, [score, count]);

  const getRank = () => {
    if (accuracyPercentage >= 85) return { title: "ELITE ARCHITECT", color: "text-lime-400", bg: "bg-lime-400/10", border: "border-lime-400/20", icon: <FiZap /> };
    if (accuracyPercentage >= 60) return { title: "SENIOR DEVELOPER", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: <FiAward /> };
    return { title: "JUNIOR STACK", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: <FiCheck /> };
  };

  const rank = getRank();

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-black p-6 overflow-hidden">
      {/* Background Glow - Using Hex to avoid 'lab' color errors */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[100px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: accuracyPercentage >= 60 ? '#a3e635' : '#ef4444' }}
      />

      {accuracyPercentage >= 70 && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={150} 
          gravity={0.12} 
          colors={['#a3e635', '#ffffff']} 
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 md:p-10 text-center z-10 shadow-2xl"
      >
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${rank.border} ${rank.bg} ${rank.color}`}>
            <span className="text-[10px]">{rank.icon}</span>
            <span className="text-[8px] font-black tracking-[0.2em] uppercase">{rank.title}</span>
          </div>
        </div>

        {/* Scaled Title */}
        <h2 className="text-4xl font-black text-white mb-8 tracking-tighter italic uppercase leading-none">
          {accuracyPercentage >= 85 ? 'God_Mode' : 'Sync_Complete'}
        </h2>

        {/* Results Data Box */}
        <div className="bg-black/60 border border-white/5 rounded-[2rem] p-8 mb-8 relative">
          <div className="flex justify-between items-center mb-4 opacity-20">
            <span className="text-[7px] font-black tracking-[0.4em] uppercase italic">Diagnostic_Data</span>
            <FiTrendingUp size={10} />
          </div>

          <div className="flex flex-col items-center">
            <motion.span className="text-7xl font-black text-white italic tracking-tighter drop-shadow-sm">
              {rounded}
            </motion.span>
            <span className="text-[8px] text-zinc-700 font-bold mt-2 tracking-[0.5em] uppercase">Total_Points</span>
          </div>
          
          {/* Progress Metrics */}
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[7px] font-black tracking-widest text-zinc-500 uppercase italic">
              <span>Accuracy_Rate</span>
              <span>{accuracyPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${accuracyPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${accuracyPercentage >= 60 ? 'bg-lime-400 shadow-[0_0_8px_#a3e635]' : 'bg-red-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Buttons - Fixed Hex Colors for Animation */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: "#a3e635", 
              color: "#000000" 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full py-4 border border-lime-400/40 text-lime-400 font-black rounded-2xl text-[9px] tracking-[0.3em] uppercase italic flex items-center justify-center gap-3 transition-colors duration-300"
          >
            <FiRefreshCcw size={12} /> Re-Initialize
          </motion.button>
          
          <button 
            onClick={onReset}
            className="w-full py-2 text-zinc-700 font-bold text-[8px] tracking-[0.3em] uppercase hover:text-zinc-400 transition-colors italic"
          >
            Return_to_Core
          </button>
        </div>
      </motion.div>
    </div>
  );
}