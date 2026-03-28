'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS, Question } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore, getQuizHistory, QuizHistory } from '@/utils/storage';

// Icons
import { FaReact, FaChevronLeft } from "react-icons/fa"; 
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { FiZap, FiClock, FiArrowRight, FiCheckCircle } from "react-icons/fi";

// --- Shuffle Algorithm ---
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

  const CategoryIcon = ({ cat, size, className }: { cat: string, size: number, className?: string }) => {
    if (cat === "React JS") return <FaReact size={size} className={className || "text-sky-500"} />;
    if (cat === "Next.js") return <SiNextdotjs size={size} className={className || "text-zinc-900"} />;
    if (cat === "Styling & UI") return <SiTailwindcss size={size} className={className || "text-teal-500"} />;
    return null;
  };

  // --- START SCREEN ---
  if (!isStarted) {
    return (
      <main className="min-h-screen bg-[#FAFAFB] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] flex items-center justify-center p-6 text-zinc-900">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-7 bg-white p-12 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiZap className="text-white" size={20} />
                </div>
                <span className="font-bold tracking-[0.2em] text-[10px] uppercase text-zinc-400">Assessment Engine</span>
              </div>
              <h1 className="text-7xl font-bold tracking-tight leading-[0.9] mb-8 text-zinc-900">
                Dev<span className="text-blue-600">Quiz.</span>
              </h1>
              <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed">Refine your technical stack through interactive, high-stakes evaluations.</p>
            </div>
            <div className="mt-16 flex items-center gap-4">
               <div className="px-4 py-2 bg-zinc-50 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-zinc-100 text-zinc-400">LTS Release 3.1</div>
            </div>
          </motion.div>

          <div className="md:col-span-5 grid grid-cols-1 gap-4">
            {Object.keys(QUIZ_SECTIONS).map((cat, idx) => (
              <motion.button key={cat} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} onClick={() => handleStartQuiz(cat as any)} className="group relative bg-white hover:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 transition-all duration-500 overflow-hidden text-left">
                <div className="relative z-10 flex flex-col gap-5">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                       <CategoryIcon cat={cat} size={24} className="group-hover:text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-500 mb-1 block">Module 0{idx+1}</span>
                      <h3 className="text-xl font-bold group-hover:text-white transition-colors tracking-tight">{cat}</h3>
                    </div>
                </div>
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <FiArrowRight className="text-white text-xl" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (showScore) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <ScoreCard score={score} totalQuestions={shuffledData.length} onReset={handleReset} />
      </main>
    );
  }

  const currentData = shuffledData[currentQuestion];

  return (
    <main className="min-h-screen bg-white text-zinc-900 p-6 md:p-12 flex flex-col items-center">
      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/10 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-sm w-full bg-white p-10 rounded-[3rem] border border-zinc-100 text-center shadow-2xl">
              <h3 className="text-xl font-bold mb-2 tracking-tight">Abort Session?</h3>
              <p className="text-zinc-400 mb-8 text-sm font-medium">Your current progress will be discarded.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleReset} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Confirm Exit</button>
                <button onClick={() => setShowExitModal(false)} className="w-full py-4 bg-zinc-50 text-zinc-400 rounded-2xl font-bold text-xs uppercase tracking-widest">Keep Going</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl w-full">
        {/* Modern Minimal Header */}
        <header className="flex justify-between items-center mb-24">
          <button onClick={() => setShowExitModal(true)} className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-300 hover:text-zinc-900 transition-colors uppercase">
            <FaChevronLeft size={8} /> Quit
          </button>
          
          <div className="flex items-center gap-8">
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{selectedCategory}</span>
                 <div className="w-32 h-0.5 bg-zinc-50 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
                 </div>
              </div>
              <div className={`text-xl font-bold tabular-nums w-12 text-right ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-900'}`}>
                 {timeLeft}s
              </div>
          </div>
        </header>

        {/* REFINED QUESTION SECTION */}
        <AnimatePresence mode="wait">
          {currentData && (
            <motion.section key={currentQuestion} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start min-h-[400px]">
              <div className="lg:col-span-7 pr-8 space-y-8">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="w-16 h-1 bg-blue-600 origin-left rounded-full" />
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] text-zinc-900">
                  {currentData.question}
                </h3>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em]">Select the most accurate response</p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                {currentData.options.map((option, index) => {
                   const isSelected = selectedAnswerIndex === index;
                   const isCorrect = index === currentData.correctAnswer;
                   const isWrong = isSelected && !isAnswerCorrect;

                   let style = "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900";
                   if (selectedAnswerIndex !== null) {
                     if (isCorrect) style = "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200 scale-[1.02]";
                     else if (isWrong) style = "bg-red-500 border-red-500 text-white shadow-2xl shadow-red-100 scale-[0.98]";
                     else style = "opacity-20 grayscale border-transparent";
                   }

                   return (
                     <button key={index} onClick={() => handleAnswerClick(index)} disabled={selectedAnswerIndex !== null} className={`w-full p-6 rounded-3xl border-2 transition-all duration-500 text-left font-bold text-base flex justify-between items-center group/btn ${style}`}>
                        <span className="flex items-center gap-5">
                           <span className={`text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-50 text-zinc-400 group-hover/btn:bg-zinc-900 group-hover/btn:text-white transition-colors'}`}>
                            {String.fromCharCode(65 + index)}
                           </span>
                           {option}
                        </span>
                        {selectedAnswerIndex !== null && isCorrect && <FiCheckCircle className="text-white" />}
                     </button>
                   );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}