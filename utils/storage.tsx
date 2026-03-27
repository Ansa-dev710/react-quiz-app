export interface QuizHistory {
  score: number;
  total: number;
  date: string;
}

const STORAGE_KEY = 'dev_quiz_results';

export const saveQuizScore = (score: number, total: number) => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  const history: QuizHistory[] = existing ? JSON.parse(existing) : [];
  
  const newEntry: QuizHistory = {
    score,
    total,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  };

  const updated = [newEntry, ...history].slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getQuizHistory = (): QuizHistory[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};