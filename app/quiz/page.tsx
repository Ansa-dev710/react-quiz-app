"use client";
import { useState } from "react";
import { QUIZ_QUESTIONS } from "@/data/quiz-data";
import QuizCard from "@/components/quiz-card";
import ResultView from "@/components/result-view";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function QuizPage() {
  const [step, setStep] = useState<"start" | "playing" | "result">("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);


  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === QUIZ_QUESTIONS[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < QUIZ_QUESTIONS.length) {
      setCurrentIndex(nextIndex);
    } else {
      setStep("result");
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentIndex(0);
    setStep("start");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step === "start" && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 bg-white dark:bg-slate-900 p-12 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <div className="inline-flex p-4 rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-600">
                <Sparkles size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">React Master</h1>
                <p className="text-slate-500 dark:text-slate-400">Test your knowledge with {QUIZ_QUESTIONS.length} high-level questions.</p>
              </div>
              <button 
                onClick={() => setStep("playing")}
                className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-3xl font-black uppercase text-[12px] tracking-widest hover:shadow-2xl transition-all active:scale-95"
              >
                Start Journey
              </button>
            </motion.div>
          )}

          {step === "playing" && (
            <div key="playing" className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-xl">
            
              <QuizCard 
                question={QUIZ_QUESTIONS[currentIndex].question}
                options={QUIZ_QUESTIONS[currentIndex].options}
                currentQuestion={currentIndex}
                totalQuestions={QUIZ_QUESTIONS.length}
                onAnswer={handleAnswer}
              />
            </div>
          )}

          {step === "result" && (
            <div key="result" className="bg-white dark:bg-slate-900 p-12 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-xl">
            
              <ResultView 
                score={score} 
                total={QUIZ_QUESTIONS.length} 
                onRestart={restartQuiz} 
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}