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
  const maxPossibleScore = totalQuestions * 200; 
  const accuracyPercentage = (score / maxPossibleScore) * 100;
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
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
      {/* Subtle Background Glow - Not overwhelming */}
      <div className={`absolute w-96 h-96 rounded-full blur-[120px] opacity-20 ${accuracyPercentage >= 60 ? 'bg-lime-500' : 'bg-red-500'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />

      {accuracyPercentage >= 70 && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.15} colors={['#a3e635', '#ffffff']} />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-950/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 p-8 md:p-10 text-center z-10 shadow-2xl"
      >
        {/* Compact Rank Badge */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${rank.border} ${rank.bg} ${rank.color}`}>
            <span className="text-xs">{rank.icon}</span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase">{rank.title}</span>
          </div>
        </div>

        {/* Scaled Down Title */}
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter italic uppercase">
          {accuracyPercentage >= 85 ? 'God_Mode' : 'Stable'}
        </h2>

        {/* Refined Score Display */}
        <div className="bg-black/50 border border-white/5 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 opacity-30">
            <span className="text-[8px] font-black tracking-widest uppercase italic">Diagnostic_Result</span>
            <FiTrendingUp size={12} />
          </div>

          <div className="flex flex-col items-center">
            <motion.span className="text-7xl font-black text-white italic tracking-tighter">
              {rounded}
            </motion.span>
            <span className="text-[8px] text-zinc-600 font-bold mt-2 tracking-[0.4em] uppercase">Points_Accumulated</span>
          </div>
          
          {/* Thin, Elegant Progress Bar */}
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[8px] font-black tracking-widest text-zinc-500 uppercase italic">
              <span>Accuracy</span>
              <span>{accuracyPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${accuracyPercentage}%` }}
                transition={{ duration: 2, ease: "circOut" }}
                className={`h-full ${accuracyPercentage >= 60 ? 'bg-lime-400 shadow-[0_0_10px_#a3e635]' : 'bg-red-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Clean Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#a3e635', color: '#000' }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full py-4 bg-transparent border border-lime-400/50 text-lime-400 font-black rounded-2xl text-[10px] tracking-[0.2em] uppercase italic flex items-center justify-center gap-3 transition-all"
          >
            <FiRefreshCcw size={14} /> Re-Initialize
          </motion.button>
          
          <button 
            onClick={onReset}
            className="w-full py-3 text-zinc-600 font-bold text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            Return_to_Core
          </button>
        </div>
      </motion.div>
    </div>
  );
}