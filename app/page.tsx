'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS, Question } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore, getQuizHistory, QuizHistory } from '@/utils/storage';

// Icons
import { FaReact, FaTerminal } from "react-icons/fa"; 
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { FiClock, FiCheck, FiArrowRight } from "react-icons/fi";

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
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof QUIZ_SECTIONS | null>(null);
  const [shuffledData, setShuffledData] = useState<Question[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [history, setHistory] = useState<QuizHistory[]>([]);

  const progress = shuffledData.length > 0 ? ((currentQuestion + 1) / shuffledData.length) * 100 : 0;

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);
    if (currentQuestion + 1 < shuffledData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveQuizScore(score, shuffledData.length);
      setShowScore(true);
    }
  }, [currentQuestion, shuffledData.length, score]);

  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null || showExitModal) return;
    const timer = setTimeout(() => {
      if (timeLeft === 1) handleNextQuestion();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted, showExitModal, handleNextQuestion]);

  useEffect(() => {
    if (!isStarted) setHistory(getQuizHistory());
  }, [isStarted]);

  const handleStartQuiz = (cat: keyof typeof QUIZ_SECTIONS) => {
    setShuffledData(shuffleQuestions(QUIZ_SECTIONS[cat]));
    setSelectedCategory(cat);
    setIsStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);
    const isCorrect = index === shuffledData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);
    new Audio(isCorrect ? '/correct.mp3' : '/wrong.mp3').play().catch(() => {});
    if (isCorrect) setScore((prev) => prev + 1);
    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleReset = () => {
    setIsStarted(false);
    setSelectedCategory(null);
    setShowExitModal(false);
    setShowScore(false);
    setShuffledData([]);
  };

  const CategoryIcon = ({ cat, size, isHovered }: { cat: string, size: number, isHovered: boolean }) => {
    const iconClass = isHovered ? "text-black" : "text-lime-400";
    if (cat === "React JS") return <FaReact size={size} className={iconClass} />;
    if (cat === "Next.js") return <SiNextdotjs size={size} className={isHovered ? "text-black" : "text-zinc-100"} />;
    if (cat === "Styling & UI") return <SiTailwindcss size={size} className={iconClass} />;
    return <FaTerminal size={size} className={iconClass} />;
  };

  // --- START SCREEN ---
  if (!isStarted) {
    return (
      <main className="min-h-screen bg-black text-lime-400 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-lime-950/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-950/20 blur-[150px] rounded-full" />
        
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 font-sans">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-8 bg-zinc-950/60 backdrop-blur-xl p-16 rounded-[3rem] border border-zinc-800/50 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-14">
                <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                  <span className="text-black font-black text-xs">█</span>
                </div>
                <span className="font-mono text-[10px] uppercase text-zinc-600 tracking-[0.3em]">[ SYSTEM_ACTIVE ]</span>
              </div>
              <h1 className="text-9xl font-black tracking-tighter leading-[0.8] mb-10 text-zinc-100 uppercase italic">
                DEV<span className="text-lime-400">/</span>QUIZ
              </h1>
              <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed">Benchmark your expertise with high-frequency technical diagnostics.</p>
            </div>
            <div className="mt-16">
               <span className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-lime-400/50">Terminal v4.2.0</span>
            </div>
          </motion.div>

          {/* Categories Grid - Neon Hover Update */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            {Object.keys(QUIZ_SECTIONS).map((cat, idx) => (
              <motion.button 
                key={cat} 
                whileHover={{ x: 12 }} 
                onClick={() => handleStartQuiz(cat as any)} 
                className="group relative bg-zinc-950/60 hover:bg-lime-400 p-8 rounded-[2rem] border border-zinc-800 transition-all duration-500 text-left overflow-hidden shadow-lg shadow-black/40"
              >
                <div className="flex flex-col gap-5 relative z-10">
                    <div className="w-12 h-12 bg-zinc-900 group-hover:bg-black rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-xl">
                       <CategoryIcon cat={cat} size={24} isHovered={false} /> {/* isHovered handling handled by Tailwind group-hover on parent if needed, but simple css works best */}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1 block group-hover:text-black/40 transition-colors">Module 0{idx+1}</span>
                      <h3 className="text-xl font-black text-zinc-100 group-hover:text-black transition-colors tracking-tight uppercase italic">{cat}</h3>
                    </div>
                </div>
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-black">
                   <FiArrowRight size={24} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (showScore) return <main className="min-h-screen bg-black flex items-center justify-center"><ScoreCard score={score} totalQuestions={shuffledData.length} onReset={handleReset} /></main>;

  const currentData = shuffledData[currentQuestion];

  return (
    <main className="min-h-screen bg-black text-lime-400 p-6 md:p-12 flex flex-col items-center overflow-hidden font-sans">
      <div className="max-w-6xl w-full relative z-10">
        <header className="flex justify-between items-center mb-24">
          <button onClick={() => setShowExitModal(true)} className="text-[10px] font-bold tracking-[0.2em] text-lime-900 hover:text-lime-400 transition-colors uppercase italic underline decoration-lime-900">
            [ ABORT_PROCESS ]
          </button>
          
          <div className="flex items-center gap-10">
              <div className="flex flex-col items-end gap-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{selectedCategory}</span>
                 <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-lime-400 shadow-[0_0_15px_#a3e635]" />
                 </div>
              </div>
              <div className={`text-3xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-100'}`}>
                 {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentData && (
            <motion.section key={currentQuestion} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7 pr-8 space-y-12">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="w-20 h-1 bg-lime-400 origin-left rounded-full shadow-[0_0_20px_#a3e635]" />
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.0] text-zinc-100 uppercase italic">
                  {currentData.question}
                </h3>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-lime-950/20 border border-lime-900/40 rounded-xl text-lime-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                    STATUS: WAITING_FOR_USER_INPUT...
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                {currentData.options.map((option, index) => {
                   const isSelected = selectedAnswerIndex === index;
                   const isCorrect = index === currentData.correctAnswer;
                   const isWrong = isSelected && !isAnswerCorrect;

                   let style = "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-lime-500 hover:text-white hover:bg-zinc-900";
                   if (selectedAnswerIndex !== null) {
                     if (isCorrect) style = "bg-lime-400 border-lime-400 text-black shadow-[0_0_50px_rgba(163,230,53,0.4)] scale-[1.05] z-20";
                     else if (isWrong) style = "bg-red-600 border-red-600 text-white shadow-[0_0_50px_rgba(220,38,38,0.3)] scale-[0.95]";
                     else style = "opacity-20 blur-[2px] border-transparent scale-90";
                   }

                   return (
                     <button key={index} onClick={() => handleAnswerClick(index)} disabled={selectedAnswerIndex !== null} className={`w-full p-7 rounded-2xl border transition-all duration-500 text-left font-bold text-lg flex justify-between items-center ${style}`}>
                        <span className="flex items-center gap-6">
                           <span className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                            {String.fromCharCode(65 + index)}
                           </span>
                           {option}
                        </span>
                        {selectedAnswerIndex !== null && isCorrect && <FiCheck className="text-black" size={20} />}
                     </button>
                   );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full bg-zinc-950 p-12 rounded-[3rem] border border-zinc-800 text-center shadow-[0_0_100px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-4 tracking-tighter text-white uppercase italic">KILL SESSION?</h3>
              <p className="text-zinc-500 mb-10 text-sm font-medium leading-relaxed">System state will be purged. All unsaved progress will be lost permanently.</p>
              <div className="flex flex-col gap-4">
                <button onClick={handleReset} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-900/20 hover:bg-red-700 transition-colors">TERMINATE</button>
                <button onClick={() => setShowExitModal(false)} className="w-full py-5 bg-zinc-900 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-colors border border-zinc-800">RESUME</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}