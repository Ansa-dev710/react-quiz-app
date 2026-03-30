'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS, Question } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import Leaderboard from '@/components/leaderbord'; 
import { saveQuizScore } from '@/utils/storage';

// Icons
import { FaChevronLeft, FaArrowRight } from "react-icons/fa"; 
import { FiCpu, FiCheck, FiActivity, FiVolume2, FiVolumeX, FiZap, FiBarChart2 } from "react-icons/fi"; 

const shuffleQuestions = (array: Question[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shuffledData, setShuffledData] = useState<Question[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  const progress = shuffledData.length > 0 ? ((currentQuestion + 1) / shuffledData.length) * 100 : 0;

  useEffect(() => {
    if (timeLeft > 10) setMultiplier(2);
    else if (timeLeft > 5) setMultiplier(1.5);
    else setMultiplier(1);
  }, [timeLeft]);

  const playSound = (type: 'correct' | 'wrong') => {
    if (isMuted) return;
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.4;
    audio.play().catch(() => {}); 
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion + 1 < shuffledData.length) {
      setSelectedAnswerIndex(null);
      setIsAnswerCorrect(null);
      setTimeLeft(15);
      setCurrentQuestion(prev => prev + 1);
    } else {
      saveQuizScore(score, shuffledData.length);
      setShowScore(true);
    }
  }, [currentQuestion, shuffledData.length, score]);

  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null || showExitModal || showLeaderboard) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          playSound('wrong');
          setTimeout(() => handleNextQuestion(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted, showScore, selectedAnswerIndex, showExitModal, handleNextQuestion, timeLeft, showLeaderboard]);

  const handleStartQuiz = (cat: string) => {
    const data = QUIZ_SECTIONS[cat];
    if (!data || data.length === 0) return;
    setShowExitModal(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(15);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setShowScore(false);
    setShowLeaderboard(false);
    setShuffledData(shuffleQuestions(data));
    setSelectedCategory(cat);
    setIsStarted(true);
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);
    const isCorrect = index === shuffledData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
        playSound('correct');
        setScore((prev) => prev + Math.floor(100 * multiplier));
    } else {
        playSound('wrong');
    }
    setTimeout(() => handleNextQuestion(), 1500);
  };

  // 1. LEADERBOARD VIEW
  if (showLeaderboard) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center py-12 px-6">
        <Leaderboard />
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setIsStarted(false);
            setShowScore(false);
            setShowLeaderboard(false);
          }}
          className="mt-12 flex items-center gap-3 px-8 py-4 border border-white/5 text-zinc-500 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:text-white hover:border-white/10 transition-all italic"
        >
          <FaChevronLeft size={10} /> Back_to_Menu
        </motion.button>
      </main>
    );
  }

  // 2. SCORE VIEW
  if (showScore) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <ScoreCard 
          score={score} 
          totalQuestions={shuffledData.length} 
          onReset={() => setIsStarted(false)} 
        />
        {/* Navigation to Leaderboard */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={() => setShowLeaderboard(true)}
          className="z-50 -mt-16 mb-20 flex items-center gap-3 px-8 py-4 bg-zinc-900/50 border border-white/5 text-lime-400 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-lime-400 hover:text-black transition-all italic shadow-2xl"
        >
          <FiBarChart2 size={16} /> View_Global_Rankings
        </motion.button>
      </main>
    );
  }

  // 3. MENU VIEW
  if (!isStarted) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all">
          {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-5xl text-center px-4">
          <header className="mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-lime-400/20 rounded-full mb-6">
              <FiActivity className="text-lime-400 text-[10px]" />
              <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">System_Core_v5.0</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 italic leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">
              DEV<span className="text-lime-400">.</span>CORE
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm max-w-md font-bold tracking-widest uppercase opacity-80 italic">
              Quantum diagnostics for full-stack architects.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(QUIZ_SECTIONS).map((cat, idx) => (
              <motion.button 
                key={cat} 
                onClick={() => handleStartQuiz(cat)}
                whileHover={{ y: -8 }}
                className="group relative bg-zinc-950/40 hover:bg-lime-400 backdrop-blur-xl border border-white/5 transition-all duration-500 rounded-[2.5rem] p-8 text-left overflow-hidden shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-zinc-900 group-hover:bg-black rounded-xl flex items-center justify-center mb-8 transition-all border border-white/5">
                     <span className="text-lime-400 group-hover:text-white font-mono text-[10px] italic">0{idx+1}</span>
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-black transition-colors uppercase italic leading-none tracking-tighter">{cat}</h3>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 group-hover:text-black transition-all">
                    <span className="text-[8px] font-black tracking-widest uppercase italic">Initialize</span>
                    <FaArrowRight size={10} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
                <span className="absolute -bottom-6 -right-4 text-8xl font-black text-white/[0.03] group-hover:text-black/5 transition-colors pointer-events-none italic">
                  {idx+1}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  // 4. QUIZ VIEW
  const currentData = shuffledData[currentQuestion];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center font-sans overflow-hidden relative">
      <div className="w-full max-w-6xl relative z-10">
        <header className="flex justify-between items-center mb-16 border-b border-zinc-900 pb-8">
          <button onClick={() => setShowExitModal(true)} className="flex items-center gap-3 text-[10px] font-black text-zinc-600 hover:text-red-500 transition-all uppercase tracking-[0.3em] italic">
            <FaChevronLeft size={12} /> Abort_Session
          </button>
          
          <div className="flex items-center gap-8 md:gap-16">
            <div className="hidden md:flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-zinc-700 tracking-widest uppercase italic">Multiplier</span>
                <div className="text-xl font-black italic flex items-center gap-2">
                    <FiZap className={multiplier > 1 ? "text-lime-400" : "text-zinc-800"} size={16} />
                    <span className={multiplier > 1 ? "text-white" : "text-zinc-800"}>{multiplier}x</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-lime-400 uppercase tracking-[0.5em] mb-2 italic">{selectedCategory}</span>
              <div className="w-40 md:w-64 h-1 bg-zinc-900 overflow-hidden rounded-full">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-lime-400 shadow-[0_0_15px_#a3e635]" />
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[50px]">
              <span className={`text-4xl font-black italic tracking-tighter ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentData && (
            <motion.section 
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start"
            >
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3 text-zinc-700">
                  <FiCpu className="text-lime-400" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono italic">Seq_Protocol_{currentQuestion + 1}</span>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-white uppercase italic break-words">
                  {currentData.question}
                </h3>
              </div>

              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="lg:col-span-7 grid gap-4 w-full">
                {currentData.options.map((option, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrect = index === currentData.correctAnswer;
                  const isWrong = isSelected && !isAnswerCorrect;

                  let style = "bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:border-lime-400/50 hover:text-white";
                  if (selectedAnswerIndex !== null) {
                    if (isCorrect) style = "bg-lime-400 border-lime-400 text-black shadow-[0_0_40px_#a3e635]";
                    else if (isWrong) style = "bg-red-600 border-red-600 text-white shadow-[0_0_40px_#dc2626]";
                    else style = "opacity-10 scale-95 blur-[2px]";
                  }

                  return (
                    <motion.button 
                      variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={selectedAnswerIndex !== null}
                      whileHover={selectedAnswerIndex === null ? { x: 10 } : {}}
                      className={`group w-full p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 text-left flex justify-between items-center relative ${style}`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${isSelected ? 'bg-black/20 text-black' : 'bg-zinc-900 text-zinc-600 group-hover:text-lime-400'}`}>
                          {index + 1}
                        </span>
                        <span className="text-lg md:text-xl font-black uppercase italic tracking-tight">{option}</span>
                      </div>
                      {isSelected && isCorrect && <FiCheck size={24} />}
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-xs w-full bg-zinc-950 p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl">
              <h3 className="text-2xl font-black mb-2 text-white italic tracking-tighter uppercase">Abort?</h3>
              <p className="text-zinc-500 mb-8 text-[9px] font-black uppercase tracking-widest opacity-60">System memory will be cleared.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setIsStarted(false); setShowExitModal(false); }} className="py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-red-500 transition-all">Confirm_Abort</button>
                <button onClick={() => setShowExitModal(false)} className="py-5 bg-zinc-900 text-zinc-500 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:text-white transition-all">Resume</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}