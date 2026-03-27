'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '@/data/quiz-data'; 
import ScoreCard from '@/components/scoreCard';

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const quizData = QUIZ_QUESTIONS;
  const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;

  // Timer Logic
  useEffect(() => {
    if (showScore || timeLeft <= 0 || selectedAnswerIndex !== null) return;

    const timer = setTimeout(() => {
      if (timeLeft === 1) {
        handleNextQuestion(); // Time khatam hone par auto-next
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showScore, selectedAnswerIndex]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return;

    setSelectedAnswerIndex(index);
    const correctIndex = quizData[currentQuestion].correctAnswer;
    const isCorrect = index === correctIndex;
    
    setIsAnswerCorrect(isCorrect);
    if (isCorrect) setScore(score + 1);
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(15);
  };

  if (showScore) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <ScoreCard score={score} totalQuestions={quizData.length} onReset={handleResetQuiz} />
      </main>
    );
  }

  const { question, options } = quizData[currentQuestion];

  return (
    <main className="min-h-screen p-4 md:p-12 bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header: Progress & Title */}
        <header className="mb-8 flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
               <span className="bg-blue-600 text-white p-1 rounded-lg text-sm">JS</span> Quiz Master
             </h1>
             <div className={`px-4 py-1 rounded-full text-sm font-bold border ${timeLeft <= 5 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
               {timeLeft}s Left
             </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Question {currentQuestion + 1} of {quizData.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} className="h-full bg-blue-600" />
            </div>
          </div>
        </header>

        {/* Main Quiz Area */}
        <AnimatePresence mode="wait">
          <motion.section
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
              {question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option: string, index: number) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrect = index === quizData[currentQuestion].correctAnswer;
                const isWrong = isSelected && !isAnswerCorrect;

                let stateClass = "border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800";
                if (selectedAnswerIndex !== null) {
                  if (isCorrect) stateClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm shadow-green-100";
                  else if (isWrong) stateClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                  else stateClass = "opacity-50 border-gray-100 dark:border-gray-800 grayscale";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswerIndex !== null}
                    className={`flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all duration-200 group ${stateClass}`}
                  >
                    <span className="text-lg font-medium">{option}</span>
                    {selectedAnswerIndex !== null && isCorrect && <span className="text-xl">✅</span>}
                    {selectedAnswerIndex !== null && isWrong && <span className="text-xl">❌</span>}
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