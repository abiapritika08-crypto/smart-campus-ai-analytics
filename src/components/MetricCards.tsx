import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Briefcase, 
  HeartHandshake,
  TrendingDown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Student } from '../types/student';

interface MetricCardsProps {
  students: Student[];
  onSelectRiskFilter: (tier: string) => void;
  onSelectPlacementFilter: (tier: string) => void;
  onSelectAttendanceFilter: (filter: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  students,
  onSelectRiskFilter,
  onSelectPlacementFilter,
  onSelectAttendanceFilter,
}) => {
  const total = students.length;
  const highRisk = students.filter(s => s.riskAnalysis.riskTier === 'high').length;
  const moderateRisk = students.filter(s => s.riskAnalysis.riskTier === 'moderate').length;
  
  const avgAttendance = total > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.overallAttendance, 0) / total) 
    : 0;

  const lowAttendanceCount = students.filter(s => s.overallAttendance < 75).length;
  const criticalAttendanceCount = students.filter(s => s.overallAttendance < 60).length;

  const placementReady = students.filter(
    s => s.placementReadiness.tier === 'tier1_dream' || s.placementReadiness.tier === 'tier2_core'
  ).length;

  const activeInterventions = students.reduce((acc, s) => {
    return acc + s.interventions.filter(i => i.status === 'in_progress' || i.status === 'scheduled').length;
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. Total Enrolled */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Cohort Size</span>
          <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">enrolled</span>
        </div>
        <p className="text-xs text-slate-500 mt-2 truncate">
          Active academic advisory tracking
        </p>
      </div>

      {/* 2. High Risk Early Warnings */}
      <div 
        onClick={() => onSelectRiskFilter('high')}
        className={`bg-white rounded-xl border p-4 shadow-xs transition-all cursor-pointer ${
          highRisk > 0 ? 'border-rose-200 hover:border-rose-300 hover:bg-rose-50/20' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-rose-700">High Risk Alerts</span>
          <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-600">{highRisk}</span>
          <span className="text-xs text-slate-500">of {total} ({total > 0 ? Math.round((highRisk/total)*100) : 0}%)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Needs Immediate Mentoring</span>
        </div>
      </div>

      {/* 3. Attendance Compliance */}
      <div 
        onClick={() => onSelectAttendanceFilter(lowAttendanceCount > 0 ? 'below75' : 'all')}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Avg Attendance</span>
          <span className={`p-1.5 rounded-lg ${avgAttendance >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${avgAttendance >= 75 ? 'text-slate-900' : 'text-amber-600'}`}>
            {avgAttendance}%
          </span>
          <span className="text-xs text-slate-500">cohort avg</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
          <span className={`inline-block w-2 h-2 rounded-full ${lowAttendanceCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>{lowAttendanceCount} below 75% cutoff</span>
        </div>
      </div>

      {/* 4. Placement Ready */}
      <div 
        onClick={() => onSelectPlacementFilter('tier1_dream')}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Placement Ready</span>
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Briefcase className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{placementReady}</span>
          <span className="text-xs text-slate-500">({total > 0 ? Math.round((placementReady/total)*100) : 0}%)</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tier 1 & 2 Eligible</span>
        </div>
      </div>

      {/* 5. Ongoing Interventions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Active Actions</span>
          <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
            <HeartHandshake className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{activeInterventions}</span>
          <span className="text-xs text-slate-500">cases</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-700 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Mentoring in progress</span>
        </div>
      </div>

    </div>
  );
};
