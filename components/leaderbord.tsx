"use client";
import { motion } from "framer-motion";
import { FiTrendingUp, FiZap, FiStar, FiUser, FiTarget } from "react-icons/fi";

interface UserRank {
  name: string;
  score: number;
  rank: "Elite" | "Senior" | "Junior";
}

const MOCK_LEADERBOARD: UserRank[] = [
  { name: "Ansa Asghar", score: 2850, rank: "Elite" },
  { name: "Sarah Dev", score: 2420, rank: "Senior" },
  { name: "John Smith", score: 1150, rank: "Junior" },
];

// Current User's Stats (In a real app, these come from props or global state)
const CURRENT_USER = {
  name: "You",
  score: 1850,
  position: 5,
  rank: "Senior"
};

export default function Leaderboard() {
  return (
    <div className="w-full max-w-xl mx-auto mt-16 space-y-8 px-4 pb-32">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-lime-400 mb-1">
            <FiTrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node_Status</span>
          </div>
          <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">
            System_Rankings
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block italic">
            Global_Sync_Active
          </span>
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {MOCK_LEADERBOARD.map((user, index) => {
          const isElite = user.rank === "Elite";
          const isSenior = user.rank === "Senior";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex items-center justify-between p-6 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-lime-400/20 transition-all duration-500 overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black ${
                  index === 0 
                  ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]" 
                  : "bg-zinc-900 text-zinc-500 border border-white/5"
                }`}>
                  {index === 0 ? <FiStar size={18} /> : `#${index + 1}`}
                </div>

                <div className="space-y-1">
                  <p className="text-lg font-black text-white italic tracking-tight uppercase">
                    {user.name}
                  </p>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border ${
                    isElite ? "border-lime-400/30 text-lime-400 bg-lime-400/5" :
                    isSenior ? "border-blue-500/30 text-blue-400 bg-blue-400/5" :
                    "border-zinc-700 text-zinc-500"
                  }`}>
                    {user.rank}
                  </span>
                </div>
              </div>

              <div className="text-right relative z-10">
                <p className="text-2xl font-black italic text-white tracking-tighter">
                  {user.score.toLocaleString()}
                </p>
                <p className="text-[7px] font-black text-zinc-600 tracking-[0.3em] uppercase">Points</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* "Compare with Me" - Current User Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mt-12 p-1 bg-linear-to-r from-lime-400/20 via-transparent to-transparent rounded-[2.5rem]"
      >
        <div className="bg-zinc-950 p-8 rounded-[2.4rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-lime-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(163,230,53,0.2)]">
              <FiUser size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest italic">Personal_Node</span>
                <div className="h-1 w-1 rounded-full bg-lime-400 animate-ping" />
              </div>
              <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                {CURRENT_USER.name}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">Current_Pos</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <FiTarget size={14} className="text-lime-400" />
                <span className="text-xl font-black text-white italic">#{CURRENT_USER.position}</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">Personal_Best</p>
              <div className="flex items-center gap-2 justify-center md:justify-start text-white">
                <FiZap size={14} className="text-blue-400" />
                <span className="text-xl font-black italic">{CURRENT_USER.score.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Footer */}
      <div className="text-center pt-8">
        <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">
          Session_Archive // UID: 0x2A99B
        </p>
      </div>
    </div>
  );
}