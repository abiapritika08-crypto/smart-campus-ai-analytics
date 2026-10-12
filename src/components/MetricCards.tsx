import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Briefcase, 
  HeartHandshake,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Student } from '../types/student';

interface MetricCardsProps {
  students: Student[];
  onSelectRiskFilter: (tier: string) => void;
  onSelectPlacementFilter: (tier: string) => void;
  onSelectAttendanceFilter: (filter: string) => void;
  isDarkMode?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  students,
  onSelectRiskFilter,
  onSelectPlacementFilter,
  onSelectAttendanceFilter,
  isDarkMode = true,
}) => {
  const total = students.length;
  const highRisk = students.filter(s => s.riskAnalysis.riskTier === 'high').length;
  const moderateRisk = students.filter(s => s.riskAnalysis.riskTier === 'moderate').length;
  
  const avgAttendance = total > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.overallAttendance, 0) / total) 
    : 0;

  const lowAttendanceCount = students.filter(s => s.overallAttendance < 75).length;

  const placementReady = students.filter(
    s => s.placementReadiness.tier === 'tier1_dream' || s.placementReadiness.tier === 'tier2_core'
  ).length;

  const activeInterventions = students.reduce((acc, s) => {
    return acc + s.interventions.filter(i => i.status === 'in_progress' || i.status === 'scheduled').length;
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      
      {/* 1. Total Enrolled Cohort */}
      <div className={`rounded-2xl p-4 border transition-all relative overflow-hidden group shadow-xs ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Cohort Size</span>
          <span className={`p-2 rounded-xl transition-colors ${
            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>{total}</span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>students</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>5 Depts monitored</span>
          <span className="text-emerald-400 font-semibold font-mono">100% active</span>
        </div>
      </div>

      {/* 2. High Risk Early Warnings (Clickable) */}
      <div 
        onClick={() => onSelectRiskFilter('high')}
        className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
          isDarkMode 
            ? 'bg-slate-900/80 border-rose-900/40 hover:border-rose-500/60 hover:bg-rose-950/20' 
            : 'bg-white border-rose-200 hover:border-rose-300 hover:bg-rose-50/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">High Risk Alerts</span>
          <span className={`p-2 rounded-xl transition-colors ${
            isDarkMode ? 'bg-rose-950/80 text-rose-400 border border-rose-800/40' : 'bg-rose-100 text-rose-700'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-500 tracking-tight">{highRisk}</span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ({total > 0 ? Math.round((highRisk/total)*100) : 0}%)
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-rose-500 font-medium">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Needs Action</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 3. Attendance Compliance (Clickable) */}
      <div 
        onClick={() => onSelectAttendanceFilter(lowAttendanceCount > 0 ? 'below75' : 'all')}
        className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800/80 hover:border-amber-500/60 hover:bg-amber-950/20' 
            : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Cohort Attendance</span>
          <span className={`p-2 rounded-xl transition-colors ${
            avgAttendance >= 75 
              ? isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-100 text-emerald-700'
              : isDarkMode ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40' : 'bg-amber-100 text-amber-700'
          }`}>
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            avgAttendance >= 75 
              ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
              : 'text-amber-500'
          }`}>
            {avgAttendance}%
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>avg</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-amber-500 font-medium">{lowAttendanceCount} under 75% cutoff</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 4. Placement Pipeline (Clickable) */}
      <div 
        onClick={() => onSelectPlacementFilter('tier1_dream')}
        className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800/80 hover:border-indigo-500/60 hover:bg-indigo-950/20' 
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Placement Ready</span>
          <span className={`p-2 rounded-xl transition-colors ${
            isDarkMode ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/40' : 'bg-indigo-100 text-indigo-700'
          }`}>
            <Briefcase className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}>{placementReady}</span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ({total > 0 ? Math.round((placementReady/total)*100) : 0}%)
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tier 1 & 2 Eligible</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 5. Ongoing Interventions */}
      <div className={`rounded-2xl p-4 border transition-all relative overflow-hidden group shadow-xs ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-800/80 hover:border-teal-500/60 hover:bg-teal-950/20' 
          : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-teal-50/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Active Mentoring</span>
          <span className={`p-2 rounded-xl transition-colors ${
            isDarkMode ? 'bg-teal-950/80 text-teal-400 border border-teal-800/40' : 'bg-teal-100 text-teal-700'
          }`}>
            <HeartHandshake className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-teal-400' : 'text-teal-700'
          }`}>{activeInterventions}</span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>cases</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-teal-400 font-medium">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% Rebound Avg</span>
          </span>
          <span className="text-[10px] text-slate-500">Tracked</span>
        </div>
      </div>

    </div>
  );
};
