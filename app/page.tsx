'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';
import { saveQuizScore, getQuizHistory, QuizHistory } from '@/utils/storage';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [history, setHistory] = useState<QuizHistory[]>([]);

  const quizData = QUIZ_QUESTIONS;
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  useEffect(() => {
    if (!isStarted) setHistory(getQuizHistory());
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted || showScore || timeLeft <= 0 || selectedAnswerIndex !== null) return;
    const timer = setTimeout(() => {
      if (timeLeft === 1) handleNextQuestion();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex, isStarted]);

  // --- UPDATED HANDLE ANSWER CLICK ---
  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;
    
    setSelectedAnswerIndex(index);
    const isCorrect = index === quizData[currentQuestion].correctAnswer;
    setIsAnswerCorrect(isCorrect);

    // Play Sound Logic
    const soundEffect = new Audio(isCorrect ? '/correct.mp3' : '/wrong.mp3');
    soundEffect.volume = 0.3; // Volume set to 30%
    soundEffect.play().catch(e => console.log("Sound play error:", e));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    // Thora extra delay taake user sound aur feedback mehsoos kar sake
    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Final result save karne ke liye hum check karte hain score latest hai
      saveQuizScore(score, quizData.length);
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

  // --- Start Screen ---
  if (!isStarted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic">DEV<span className="text-blue-600">QUIZ</span></h1>
            <p className="text-gray-500 font-medium">Test your skills in real-time.</p>
          </div>

          {history.length > 0 && (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4">Recent Scores</p>
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <span className="text-gray-400">{item.date}</span>
                    <span className="font-bold">{item.score}/{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setIsStarted(true)} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-bold shadow-xl active:scale-95 transition-all">
            Start Quiz
          </button>
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

  // --- Quiz UI ---
  const { question, options } = quizData[currentQuestion];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-background flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <header className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">QUIZ IN PROGRESS</span>
            <span className={`px-4 py-1 rounded-xl font-bold text-xs ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-14 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-12 tracking-tight leading-tight">
              {question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {options.map((option: string, index: number) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrect = index === quizData[currentQuestion].correctAnswer;
                const isWrong = isSelected && !isAnswerCorrect;

                let style = "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500";
                if (selectedAnswerIndex !== null) {
                  if (isCorrect) style = "border-green-500 bg-green-500 text-white scale-[1.02] shadow-lg shadow-green-500/20";
                  else if (isWrong) style = "border-red-500 bg-red-500 text-white scale-[0.98] shadow-lg shadow-red-500/20";
                  else style = "opacity-30 grayscale blur-[1px]";
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