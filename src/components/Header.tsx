import React from 'react';
import { 
  GraduationCap, 
  Search, 
  UserPlus, 
  FileText, 
  Bot, 
  RefreshCw,
  Sun,
  Moon,
  Command,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddStudent: () => void;
  onOpenExportReport: () => void;
  onOpenCopilot: () => void;
  onResetData: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  totalStudents: number;
  highRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddStudent,
  onOpenExportReport,
  onOpenCopilot,
  onResetData,
  isDarkMode,
  onToggleDarkMode,
  totalStudents,
  highRiskCount
}) => {
  return (
    <header className={`sticky top-0 z-30 transition-colors backdrop-blur-md border-b ${
      isDarkMode 
        ? 'bg-slate-950/85 border-slate-800/80 text-white shadow-xl shadow-black/20' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Brand & Institution */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-1 ring-white/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight flex items-center gap-1.5">
                  <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>CampusCare</span>
                  <span className="text-emerald-400 font-bold tracking-normal">AI</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                  isDarkMode 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Live Portal
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                St. Jude Institute of Technology &middot; Fall 2026 Academic Advisory
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search students, roll no, courses, or risk tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 border transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-slate-900/90 text-slate-100 placeholder-slate-400 border-slate-700/80 focus:ring-emerald-500/40 focus:border-emerald-500' 
                    : 'bg-slate-50 text-slate-900 placeholder-slate-400 border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-500'
                }`}
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              ) : (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                  <span>/</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-600/20 cursor-pointer hover:shadow-emerald-500/30 active:scale-95"
              title="Launch Faculty AI Copilot"
            >
              <Bot className="w-4 h-4 text-emerald-100" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Academic Report Modal */}
            <button
              onClick={onOpenExportReport}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title="Generate Audit & Committee Report"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Report</span>
            </button>

            {/* Add Student */}
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer active:scale-95"
              title="Enroll New Student"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Add Student</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700/80 hover:text-amber-300' 
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-xs'
              }`}
              title={isDarkMode ? 'Switch to Crisp Light Mode' : 'Switch to Command Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset sample data */}
            <button
              onClick={onResetData}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/80' 
                  : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200 shadow-xs'
              }`}
              title="Reload sample cohort benchmark data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Faculty Advisor Avatar */}
            <div className={`pl-2 border-l flex items-center gap-2.5 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/40 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                EV
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Dr. Eleanor Vance</p>
                <p className={isDarkMode ? 'text-slate-400 text-[10px]' : 'text-slate-500 text-[10px]'}>Senior Advisor &middot; CS</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
