'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const quizData = QUIZ_QUESTIONS;
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  // Timer Logic
  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null) return;

    const timer = setTimeout(() => {
      if (timeLeft === 1) handleNextQuestion();
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(index);
    const isCorrect = index === quizData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);
    if (isCorrect) setScore(score + 1);
    setTimeout(() => handleNextQuestion(), 1200);
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setIsStarted(false);
    setTimeLeft(15);
  };

  // --- 1. Splash / Start Screen ---
  if (!isStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-10"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            <span className="relative text-8xl">⚡</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter">DEV<span className="text-blue-600">QUIZ</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Test your development knowledge with our speed challenge. 15 seconds per question.
            </p>
          </div>

          <button 
            onClick={() => setIsStarted(true)}
            className="group relative w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Challenge <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            Powered by Next.js 15 & Tailwind v4
          </p>
        </motion.div>
      </main>
    );
  }

  // --- 2. Score Screen ---
  if (showScore) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ScoreCard score={score} totalQuestions={quizData.length} onReset={handleReset} />
      </main>
    );
  }

  // --- 3. Main Quiz Interface ---
  const { question, options } = quizData[currentQuestion];

  return (
    <main className="min-h-screen p-4 md:p-12 bg-background flex flex-col items-center">
      <div className="max-w-3xl w-full">
        
        {/* Progress Bar & Timer */}
        <header className="mb-10 p-6 bg-card rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Question {currentQuestion + 1}</h2>
             <div className={`px-4 py-1.5 rounded-xl font-black text-xs tabular-nums border ${timeLeft <= 5 ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent'}`}>
               {timeLeft}s
             </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 md:p-14 bg-card rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-12 leading-[1.1] tracking-tight">
              {question}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option: string, index: number) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrect = index === quizData[currentQuestion].correctAnswer;
                const isWrong = isSelected && !isAnswerCorrect;

                let btnStyle = "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 hover:shadow-lg";
                if (selectedAnswerIndex !== null) {
                  if (isCorrect) btnStyle = "border-green-500 bg-green-500 text-white shadow-green-200 dark:shadow-none";
                  else if (isWrong) btnStyle = "border-red-500 bg-red-500 text-white shadow-red-200 dark:shadow-none";
                  else btnStyle = "opacity-30 border-gray-100 dark:border-gray-800 grayscale";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswerIndex !== null}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-300 font-bold text-lg ${btnStyle}`}
                  >
                    <span>{option}</span>
                    <span className="text-sm opacity-50 font-mono">0{index + 1}</span>
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