import React from 'react';
import { 
  GraduationCap, 
  Search, 
  UserPlus, 
  FileText, 
  Bot, 
  ShieldAlert, 
  Sparkles,
  School,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddStudent: () => void;
  onOpenExportReport: () => void;
  onOpenCopilot: () => void;
  onResetData: () => void;
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
  totalStudents,
  highRiskCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Institution */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CampusCare <span className="text-emerald-400 font-semibold">AI</span>
                </span>
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  Faculty Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                St. Jude Institute of Technology &middot; Fall 2026 Academic Advisory
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, roll number, course..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 rounded-lg pl-9 pr-4 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
              title="Launch Faculty AI Copilot"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Export Summary Report */}
            <button
              onClick={onOpenExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Generate Audit & Committee Report"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Academic Report</span>
            </button>

            {/* Add Student */}
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden lg:inline">Add Student</span>
            </button>

            {/* Reset sample data */}
            <button
              onClick={onResetData}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reload sample cohort data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Faculty Avatar badge */}
            <div className="pl-2 border-l border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold text-slate-200">
                EV
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-medium text-slate-200">Dr. Eleanor Vance</p>
                <p className="text-slate-400 text-[10px]">Senior Advisor &middot; CS</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
