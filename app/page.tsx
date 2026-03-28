'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_SECTIONS } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore, getQuizHistory, QuizHistory } from '@/utils/storage';
// Icons import karna mat bhooliye ga (react-icons install honi chahiye)
import { FaReact } from "react-icons/fa"; 
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof QUIZ_SECTIONS | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [history, setHistory] = useState<QuizHistory[]>([]);

  const quizData = selectedCategory ? QUIZ_SECTIONS[selectedCategory] : [];
  const progress = quizData.length > 0 ? ((currentQuestion + 1) / quizData.length) * 100 : 0;

  useEffect(() => {
    if (!isStarted) setHistory(getQuizHistory());
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null || showExitModal) return;
    const timer = setTimeout(() => {
      if (timeLeft === 1) handleNextQuestion();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted, showExitModal]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);
    const isCorrect = index === quizData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);
    const soundPath = isCorrect ? '/correct.mp3' : '/wrong.mp3';
    new Audio(soundPath).play().catch(() => {});
    if (isCorrect) setScore((prev) => prev + 1);
    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveQuizScore(score, quizData.length);
      setShowScore(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setIsStarted(false);
    setSelectedCategory(null);
    setShowExitModal(false);
    setTimeLeft(15);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "React JS": return <FaReact className="text-4xl text-sky-400" />;
      case "Next.js": return <SiNextdotjs className="text-4xl text-white" />;
      case "Styling & UI": return <SiTailwindcss className="text-4xl text-teal-400" />;
      default: return null;
    }
  };

  // --- START SCREEN (Inline Fixed) ---
  if (!isStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic">DEV<span className="text-blue-600">QUIZ</span></h1>
            <p className="text-gray-500 font-medium italic">Select a category to begin</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.keys(QUIZ_SECTIONS).map((cat) => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat as any); setIsStarted(true); }}
                className="group w-full p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center gap-6 shadow-sm hover:border-blue-500 transition-all active:scale-95 text-left"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    {getCategoryIcon(cat)}
                </div>
                <span className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest italic">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  if (showScore) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ScoreCard score={score} totalQuestions={quizData.length} onReset={handleReset} />
      </main>
    );
  }

  const { question, options } = quizData[currentQuestion];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-background flex flex-col items-center">
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-sm w-full bg-white dark:bg-zinc-900 p-8 rounded-[3rem] text-center border dark:border-zinc-800">
              <h3 className="text-2xl font-black mb-2 italic">QUIT QUIZ?</h3>
              <p className="text-zinc-500 mb-8 text-sm">Progress in {selectedCategory} will be lost.</p>
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
        <header className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setShowExitModal(true)} className="text-[10px] font-black tracking-widest text-zinc-400 hover:text-blue-600 transition-colors">
              ← BACK TO SECTIONS
            </button>
            <span className={`px-4 py-1 rounded-xl font-bold text-xs ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
          </div>
        </header>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.section key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-14 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-12 tracking-tight italic">
              {question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {options.map((option: string, index: number) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrect = index === quizData[currentQuestion].correctAnswer;
                const isWrong = isSelected && !isAnswerCorrect;

                let style = "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900";
                if (selectedAnswerIndex !== null) {
                  if (isCorrect) style = "border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/20";
                  else if (isWrong) style = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20";
                  else style = "opacity-30 blur-[0.5px]";
                }

                return (
                  <button key={index} onClick={() => handleAnswerClick(index)} disabled={selectedAnswerIndex !== null} className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-300 font-bold text-lg ${style}`}>
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}