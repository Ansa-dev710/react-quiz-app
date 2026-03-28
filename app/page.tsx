'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS, Question } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore, getQuizHistory, QuizHistory } from '@/utils/storage';

// Icons
import { FaReact } from "react-icons/fa"; 
import { SiNextdotjs, SiTailwindcss, SiFramer } from "react-icons/si";

// --- Shuffle Algorithm (Fisher-Yates) ---
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

  // Load History
  useEffect(() => {
    if (!isStarted) setHistory(getQuizHistory());
  }, [isStarted]);

  // Handle Category Selection & Shuffle
  const handleStartQuiz = (cat: keyof typeof QUIZ_SECTIONS) => {
    const data = QUIZ_SECTIONS[cat];
    setShuffledData(shuffleQuestions(data));
    setSelectedCategory(cat);
    setIsStarted(true);
    setCurrentQuestion(0);
    setScore(0);
  };

  // Timer Logic
  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null || showExitModal) return;
    const timer = setTimeout(() => {
      if (timeLeft === 1) handleNextQuestion();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted, showExitModal]);

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

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    
    setSelectedAnswerIndex(index);
    const isCorrect = index === shuffledData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);

    const soundPath = isCorrect ? '/correct.mp3' : '/wrong.mp3';
    new Audio(soundPath).play().catch(() => {});

    if (isCorrect) setScore((prev) => prev + 1);
    
    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleReset = () => {
    setIsStarted(false);
    setSelectedCategory(null);
    setShowExitModal(false);
    setShowScore(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setShuffledData([]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "React JS": return <FaReact className="text-4xl text-sky-400" />;
      case "Next.js": return <SiNextdotjs className="text-4xl text-white" />;
      case "Styling & UI": return <SiTailwindcss className="text-4xl text-teal-400" />;
      default: return <SiFramer className="text-4xl text-purple-400" />;
    }
  };

  // --- START SCREEN ---
  if (!isStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic">DEV<span className="text-blue-600">QUIZ</span></h1>
            <p className="text-zinc-500 font-medium italic">Test your skills in real-time.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left">
            {Object.keys(QUIZ_SECTIONS).map((cat) => (
              <button 
                key={cat}
                onClick={() => handleStartQuiz(cat as any)}
                className="group w-full p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center gap-6 shadow-sm hover:border-blue-500 transition-all active:scale-95"
              >
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    {getCategoryIcon(cat)}
                </div>
                <span className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest italic">{cat}</span>
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 opacity-60">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">Recent History</p>
              {history.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <span className="text-zinc-400">{item.date}</span>
                  <span className="font-bold">{item.score}/{item.total}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    );
  }

  // --- SCORE SCREEN ---
  if (showScore) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background text-center">
        <ScoreCard score={score} totalQuestions={shuffledData.length} onReset={handleReset} />
      </main>
    );
  }

  const currentData = shuffledData[currentQuestion];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-background flex flex-col items-center">
      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border dark:border-zinc-800 text-center shadow-2xl">
              <h3 className="text-2xl font-black mb-2 italic">QUIT QUIZ?</h3>
              <p className="text-zinc-500 mb-8 text-sm">Your progress in {selectedCategory} will be lost.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitModal(false)} className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-bold">Cancel</button>
                <button onClick={handleReset} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20">Yes, Quit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl w-full">
        {/* Header */}
        <header className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setShowExitModal(true)} className="text-[10px] font-black tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">
              ← BACK TO CATEGORIES
            </button>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-zinc-400 uppercase">{selectedCategory}</span>
               <span className={`px-4 py-1 rounded-xl font-bold text-xs ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                {timeLeft}s
               </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
          </div>
        </header>

        {/* Quiz Card */}
        <AnimatePresence mode="wait">
          {currentData && (
            <motion.section 
              key={currentQuestion} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              className="p-8 md:p-14 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <h2 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white mb-12 tracking-tight leading-tight italic">
                {currentData.question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {currentData.options.map((option, index) => {
                  const isSelected = selectedAnswerIndex === index;
                  const isCorrect = index === currentData.correctAnswer;
                  const isWrong = isSelected && !isAnswerCorrect;

                  let style = "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500";
                  if (selectedAnswerIndex !== null) {
                    if (isCorrect) style = "border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/20 scale-[1.02]";
                    else if (isWrong) style = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20 scale-[0.98]";
                    else style = "opacity-30 blur-[0.5px]";
                  }

                  return (
                    <button 
                      key={index} 
                      onClick={() => handleAnswerClick(index)} 
                      disabled={selectedAnswerIndex !== null} 
                      className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-300 font-bold text-lg ${style}`}
                    >
                      {option}
                      {selectedAnswerIndex !== null && isCorrect && <span className="ml-2">✓</span>}
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