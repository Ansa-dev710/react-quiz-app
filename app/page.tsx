'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS, Question } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore } from '@/utils/storage';

// Icons
import { FaChevronLeft, FaArrowRight } from "react-icons/fa"; 
import { FiCpu, FiCheck, FiActivity, FiVolume2, FiVolumeX } from "react-icons/fi"; 

// Helper for shuffling
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
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isMuted, setIsMuted] = useState(false);

  const progress = shuffledData.length > 0 ? ((currentQuestion + 1) / shuffledData.length) * 100 : 0;

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
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null || showExitModal) return;
    const timer = setTimeout(() => {
      if (timeLeft === 1) {
          playSound('wrong');
          handleNextQuestion();
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted, showExitModal, handleNextQuestion]);

  // FIX: Force modal to close when starting a new quiz
  const handleStartQuiz = (cat: string) => {
    const data = QUIZ_SECTIONS[cat];
    if (!data || data.length === 0) return;

    setShowExitModal(false); // Modal state reset
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(15);
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setShowScore(false);
    
    const shuffled = shuffleQuestions(data);
    setShuffledData(shuffled);
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
        setScore((prev) => prev + 1);
    } else {
        playSound('wrong.mp3');
    }
    
    setTimeout(() => handleNextQuestion(), 1200);
  };

  // --- START SCREEN ---
  if (!isStarted) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all">
          {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-5xl text-center">
          <header className="mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-lime-400/20 rounded-full mb-6">
              <FiActivity className="text-lime-400 text-[10px]" />
              <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-500 uppercase">System_Core_v4.2</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 italic leading-none text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-800">
              DEV<span className="text-lime-400">.</span>CORE
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-md font-medium tracking-tight opacity-80">
              High-frequency technical diagnostics for full-stack architects.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {Object.keys(QUIZ_SECTIONS).map((cat, idx) => (
              <motion.button 
                key={cat} 
                onClick={() => handleStartQuiz(cat)}
                whileHover={{ y: -5 }}
                className="group relative bg-zinc-950/40 hover:bg-lime-400 backdrop-blur-xl border border-white/5 transition-all duration-500 rounded-[2.5rem] p-8 text-left overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-zinc-900 group-hover:bg-black rounded-xl flex items-center justify-center mb-8 transition-all border border-white/5">
                     <span className="text-lime-400 group-hover:text-white font-mono text-[10px] italic">0{idx+1}</span>
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-black transition-colors uppercase italic leading-none tracking-tight">{cat}</h3>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 group-hover:text-black transition-all">
                    <span className="text-[8px] font-bold tracking-widest uppercase italic">Initialize</span>
                    <FaArrowRight size={10} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
                <span className="absolute -bottom-6 -right-4 text-8xl font-black text-white/3 group-hover:text-black/5 transition-colors pointer-events-none italic">
                  {idx+1}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  // --- SCORE SCREEN ---
  if (showScore) {
    return <ScoreCard score={score} totalQuestions={shuffledData.length} onReset={() => setIsStarted(false)} />;
  }

  // --- QUIZ INTERFACE & MODAL ---
  const currentData = shuffledData[currentQuestion];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center font-sans">
      <div className="w-full max-w-6xl relative z-10">
        <header className="flex justify-between items-center mb-20 border-b border-zinc-900 pb-8">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents bubbling
              setShowExitModal(true);
            }} 
            className="flex items-center gap-3 text-[9px] font-bold text-zinc-500 hover:text-red-500 transition-all uppercase tracking-[0.2em] italic"
          >
            <FaChevronLeft size={12} />
            Abort_Session
          </button>
          
          <div className="flex items-center gap-12">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.4em] mb-2 italic">{selectedCategory}</span>
              <div className="w-56 h-px bg-zinc-900 overflow-hidden rounded-full">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-lime-400 shadow-[0_0_20px_#a3e635]" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-3xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentData && (
            <motion.section 
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
            >
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3 text-zinc-600">
                  <FiCpu className="text-lime-400" size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] font-mono italic">Seq_{currentQuestion + 1}</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white uppercase italic">
                  {currentData.question}
                </h3>
              </div>

              <div className="lg:col-span-7 grid gap-4">
                {currentData.options.map((option, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrect = index === currentData.correctAnswer;
                  const isWrong = isSelected && !isAnswerCorrect;

                  let style = "bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white";
                  if (selectedAnswerIndex !== null) {
                    if (isCorrect) style = "bg-lime-400 border-lime-400 text-black shadow-[0_0_40px_rgba(163,230,53,0.2)]";
                    else if (isWrong) style = "bg-red-600 border-red-600 text-white";
                    else style = "opacity-20 scale-95 blur-[1px]";
                  }

                  return (
                    <button 
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={selectedAnswerIndex !== null}
                      className={`w-full p-8 rounded-3xl border transition-all duration-400 text-left flex justify-between items-center ${style}`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-lg ${isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                          {index + 1}
                        </span>
                        <span className="text-xl font-bold uppercase italic">{option}</span>
                      </div>
                      {selectedAnswerIndex !== null && isCorrect && <FiCheck size={24} />}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Exit Modal (Kept separate to avoid clash) */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-xs w-full bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-800 text-center shadow-2xl"
            >
              <h3 className="text-xl font-black mb-2 text-white italic tracking-tighter">ABORT?</h3>
              <p className="text-zinc-500 mb-8 text-[10px] font-bold uppercase tracking-widest opacity-60">Session data will be lost.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsStarted(false);
                    setShowExitModal(false);
                  }} 
                  className="py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-red-500 transition-colors"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setShowExitModal(false)} 
                  className="py-4 bg-zinc-900 text-zinc-500 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}