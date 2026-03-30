"use client";
import { motion } from "framer-motion";

interface UserRank {
  name: string;
  score: number;
  rank: "Pro" | "Intermediate" | "Beginner";
}


const MOCK_LEADERBOARD: UserRank[] = [
  { name: "Ansa Asghar", score: 95, rank: "Pro" },
  { name: "Sarah Dev", score: 82, rank: "Intermediate" },
  { name: "John Smith", score: 45, rank: "Beginner" },
];

export default function Leaderboard() {
  return (
    <div className="w-full max-w-xl mx-auto mt-12 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">
          Global Rankings
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Top Performers
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_LEADERBOARD.map((user, index) => {
          const isPro = user.rank === "Pro";
          const isIntermediate = user.rank === "Intermediate";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-5">
        
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                  index === 0 ? "bg-yellow-100 text-yellow-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  #{index + 1}
                </div>

                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </p>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    isPro ? "border-yellow-500/30 text-yellow-600 bg-yellow-50/50" :
                    isIntermediate ? "border-blue-500/30 text-blue-600 bg-blue-50/50" :
                    "border-slate-300 text-slate-500"
                  }`}>
                    {user.rank}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                  {user.score}
                </p>
                <p className="text-[9px] font-bold text-slate-400 italic">POINTS</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}