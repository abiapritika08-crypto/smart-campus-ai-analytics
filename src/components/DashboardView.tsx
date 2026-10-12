import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  ArrowUpRight, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  UserCheck, 
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  Zap,
  BookOpen,
  Sparkles,
  Search,
  Mail,
  Calendar,
  MessageSquare,
  Award,
  Filter,
  CheckCircle2,
  ExternalLink,
  Target
} from 'lucide-react';
import { Student } from '../types/student';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigateToRisk: () => void;
  onNavigateToInterventions: () => void;
  onNavigateToPlacement?: () => void;
  onNavigateToCopilot?: () => void;
  onQuickAction: (actionType: string, student: Student) => void;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onNavigateToRisk,
  onNavigateToInterventions,
  onNavigateToPlacement,
  onNavigateToCopilot,
  onQuickAction,
  isDarkMode = true,
}) => {
  // Quick Filter Tab on Dashboard
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'debarment' | 'test_drop' | 'missing_asg' | 'placement' | 'honors'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Filtered students for the quick access queue
  const queueStudents = useMemo(() => {
    return students.filter(s => {
      // Dept filter
      if (selectedDeptFilter !== 'all' && s.department !== selectedDeptFilter) return false;

      // Quick filter
      if (activeQuickFilter === 'debarment' && s.overallAttendance >= 75) return false;
      if (activeQuickFilter === 'test_drop' && (s.riskAnalysis.scoreDropPercent || 0) < 20) return false;
      if (activeQuickFilter === 'missing_asg' && !s.assignments.some(a => a.status === 'missing')) return false;
      if (activeQuickFilter === 'placement' && s.placementReadiness.tier !== 'tier1_dream' && s.placementReadiness.tier !== 'tier2_core') return false;
      if (activeQuickFilter === 'honors' && s.riskAnalysis.riskTier !== 'high_achiever' && s.cgpa < 8.5) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchRoll = s.rollNo.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        if (!matchName && !matchRoll && !matchDept) return false;
      }

      return true;
    }).sort((a, b) => b.riskAnalysis.overallRiskScore - a.riskAnalysis.overallRiskScore);
  }, [students, activeQuickFilter, selectedDeptFilter, searchQuery]);

  // Counts for quick filter pills
  const debarmentCount = students.filter(s => s.overallAttendance < 75).length;
  const testDropCount = students.filter(s => (s.riskAnalysis.scoreDropPercent || 0) >= 20).length;
  const missingAsgCount = students.filter(s => s.assignments.some(a => a.status === 'missing')).length;
  const placementCount = students.filter(s => s.placementReadiness.tier === 'tier1_dream' || s.placementReadiness.tier === 'tier2_core').length;
  const honorsCount = students.filter(s => s.riskAnalysis.riskTier === 'high_achiever' || s.cgpa >= 8.5).length;

  // Group by risk tier
  const riskGroups = {
    high: students.filter(s => s.riskAnalysis.riskTier === 'high'),
    moderate: students.filter(s => s.riskAnalysis.riskTier === 'moderate'),
    low: students.filter(s => s.riskAnalysis.riskTier === 'low'),
    high_achiever: students.filter(s => s.riskAnalysis.riskTier === 'high_achiever'),
  };

  // Department breakdown
  const departments = Array.from(new Set(students.map(s => s.department)));
  const deptStats = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const avgAtt = Math.round(deptStudents.reduce((a, b) => a + b.overallAttendance, 0) / deptStudents.length);
    const highRisk = deptStudents.filter(s => s.riskAnalysis.riskTier === 'high').length;
    return {
      department: dept,
      count: deptStudents.length,
      avgAttendance: avgAtt,
      highRiskCount: highRisk,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Hero AI Daily Intelligence Briefing & Launchpad */}
      <div className={`rounded-2xl p-5 border relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border-slate-800 shadow-xl shadow-black/20' 
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800 shadow-md'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                CampusCare AI Daily Intelligence Pulse
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                Updated Today &middot; Fall 2026
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
              {debarmentCount} Students Require Immediate Attendance Action &middot; 4 Test Drop Divergences Detected
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Noticeable performance divergences observed in <strong>Algorithms (CS301)</strong> and <strong>Signals & Systems (EC301)</strong>. 
              Students receiving 1-on-1 counseling within 7 days of initial flag show a <strong>73% remediation recovery rate</strong>.
            </p>
          </div>

          {/* Quick Action Launchpad */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 self-stretch lg:self-center justify-start lg:justify-end">
            <button
              onClick={onNavigateToRisk}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Review Early Warning Radar</span>
            </button>

            <button
              onClick={onNavigateToInterventions}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Launch Batch Interventions</span>
            </button>
          </div>

        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Interactive Cohort Quick Access Bar */}
      <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-800/80 shadow-md shadow-black/10' 
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Segmented Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveQuickFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>All Students</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'all' ? 'bg-white/20 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>{students.length}</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('debarment')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'debarment'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-rose-400 hover:text-rose-300' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <span>🚨 Debarment Risk (&lt;75%)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'debarment' ? 'bg-white/20 text-white' : 'bg-rose-200/50 text-rose-700'
              }`}>{debarmentCount}</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('test_drop')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'test_drop'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-amber-400 hover:text-amber-300' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <span>📉 Midterm Drop (&gt;20%)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'test_drop' ? 'bg-white/20 text-white' : 'bg-amber-200/50 text-amber-700'
              }`}>{testDropCount}</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('missing_asg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'missing_asg'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-indigo-400 hover:text-indigo-300' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span>⚠️ Deliverable Backlog</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'missing_asg' ? 'bg-white/20 text-white' : 'bg-indigo-200/50 text-indigo-700'
              }`}>{missingAsgCount}</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('placement')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'placement'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-teal-400 hover:text-teal-300' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              <span>💼 Placement Ready</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'placement' ? 'bg-white/20 text-white' : 'bg-teal-200/50 text-teal-700'
              }`}>{placementCount}</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('honors')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'honors'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDarkMode ? 'bg-slate-800/80 text-emerald-400 hover:text-emerald-300' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span>🌟 Honors & TAs</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeQuickFilter === 'honors' ? 'bg-white/20 text-white' : 'bg-emerald-200/50 text-emerald-700'
              }`}>{honorsCount}</span>
            </button>
          </div>

          {/* Quick Search in Queue */}
          <div className="relative max-w-xs w-full shrink-0">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search in active view..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl pl-8 pr-3 py-1.5 border transition-all focus:outline-none ${
                isDarkMode 
                  ? 'bg-slate-800/80 text-slate-100 placeholder-slate-400 border-slate-700 focus:border-emerald-500' 
                  : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200 focus:border-emerald-500'
              }`}
            />
          </div>

        </div>
      </div>

      {/* 3. Main Operational Center: Priority Student Queue & Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Action Queue (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl border p-5 transition-all shadow-xs ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800/80' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Student Advisory Queue
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  {queueStudents.length} Active
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                1-click access to AI dossiers, supportive email drafts, and intervention plans
              </p>
            </div>

            {selectedDeptFilter !== 'all' && (
              <button
                onClick={() => setSelectedDeptFilter('all')}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Clear Dept Filter ({selectedDeptFilter})
              </button>
            )}
          </div>

          {/* Student Rows */}
          <div className="space-y-3">
            {queueStudents.length === 0 ? (
              <div className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                No students match this specific filter condition.
              </div>
            ) : (
              queueStudents.slice(0, 5).map((student) => {
                const weakSubject = student.coursePerformances.find(c => c.status === 'critical');
                const isUnderAttendance = student.overallAttendance < 75;
                const hasDrop = (student.riskAnalysis.scoreDropPercent || 0) >= 20;

                return (
                  <div 
                    key={student.id} 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group ${
                      isDarkMode 
                        ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40' 
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    {/* Left: Student Identity & Academic Details */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/10 shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className={`font-bold text-sm hover:text-emerald-400 cursor-pointer text-left truncate transition-colors ${
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {student.name}
                          </button>
                          <span className="text-[11px] font-mono text-slate-400">
                            {student.rollNo}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            student.riskAnalysis.riskTier === 'high' 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : student.riskAnalysis.riskTier === 'moderate'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            Risk {student.riskAnalysis.overallRiskScore}/100
                          </span>
                        </div>

                        {/* Department & Indicators */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                            {student.department} &middot; Sem {student.semester}
                          </span>
                          <span className="text-slate-600">&middot;</span>
                          <span className={`font-semibold ${isUnderAttendance ? 'text-rose-500' : 'text-emerald-400'}`}>
                            {student.overallAttendance}% Att.
                          </span>
                          <span className="text-slate-600">&middot;</span>
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                            CGPA {student.cgpa.toFixed(2)}
                          </span>

                          {hasDrop && (
                            <span className="text-[10px] font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              -{student.riskAnalysis.scoreDropPercent}% Midterm Drop
                            </span>
                          )}
                        </div>

                        {/* Primary Factor note */}
                        <p className={`text-[11px] italic line-clamp-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          &quot;{student.riskAnalysis.primaryFactors[0]}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onQuickAction('email', student)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          isDarkMode 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title="Draft supportive email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectStudent(student)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                        <span>AI Dossier</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Showing top flagged students in active queue</span>
            <button
              onClick={onNavigateToRisk}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Deep-dive into full Risk Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Advisory Calendar & Risk Distribution */}
        <div className="space-y-6">
          
          {/* Faculty Weekly Agenda & Follow-ups */}
          <div className={`rounded-2xl border p-5 transition-all shadow-xs ${
            isDarkMode 
              ? 'bg-slate-900/80 border-slate-800/80' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Calendar className="w-4 h-4" />
                </span>
                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Advisor Weekly Docket
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                3 Pending
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-amber-400">Wednesday &middot; 3:00 PM</span>
                  <span>Office 304</span>
                </div>
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  1-on-1 Advising &middot; Marcus Chen
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Algorithms Midterm review & attendance recovery plan
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-rose-400">Thursday &middot; 10:30 AM</span>
                  <span>HOD Conference Rm</span>
                </div>
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Academic Review Committee &middot; Dev Patel
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Official attendance shortage letter review
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-400">Friday &middot; 4:00 PM</span>
                  <span>Lab 4A</span>
                </div>
                <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Peer Study Circle &middot; Lead: Aisha Patel
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Discrete Math problem set clinic for 5 sophomores
                </p>
              </div>
            </div>
          </div>

          {/* Risk Classification Distribution */}
          <div className={`rounded-2xl border p-5 transition-all shadow-xs ${
            isDarkMode 
              ? 'bg-slate-900/80 border-slate-800/80' 
              : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Cohort Risk Tiers
            </h3>
            <p className={`text-xs mb-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Composite early warning categorization
            </p>

            <div className="space-y-3 text-xs">
              {/* High Risk */}
              <div 
                onClick={onNavigateToRisk}
                className="cursor-pointer group"
              >
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-rose-500">High Risk (&gt;65)</span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{riskGroups.high.length} students</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${(riskGroups.high.length / students.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Moderate Risk */}
              <div 
                onClick={onNavigateToRisk}
                className="cursor-pointer group"
              >
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-amber-500">Moderate Risk (40-65)</span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{riskGroups.moderate.length} students</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(riskGroups.moderate.length / students.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* On Track */}
              <div 
                onClick={onNavigateToRisk}
                className="cursor-pointer group"
              >
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-400">On Track (20-39)</span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{riskGroups.low.length} students</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-500 rounded-full transition-all"
                    style={{ width: `${(riskGroups.low.length / students.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* High Achievers */}
              <div 
                onClick={onNavigateToRisk}
                className="cursor-pointer group"
              >
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-emerald-400">High Achievers (&lt;20)</span>
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{riskGroups.high_achiever.length} students</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(riskGroups.high_achiever.length / students.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToCopilot}
              className="w-full mt-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Ask AI Copilot for Recommendations</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. Interactive Department Performance Grid (Click to Filter!) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-800/80' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Departmental Risk & Compliance Matrix
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Click any department to instantly filter the student queue above
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-medium">
            Active Fall 2026 Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {deptStats.map(stat => {
            const isSelected = selectedDeptFilter === stat.department;
            return (
              <div 
                key={stat.department} 
                onClick={() => setSelectedDeptFilter(isSelected ? 'all' : stat.department)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : isDarkMode 
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className={`font-bold text-xs ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    {stat.department}
                  </h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-500 text-white font-bold' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stat.count} enr.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">Attendance</span>
                    <span className={`font-bold ${stat.avgAttendance < 75 ? 'text-amber-400' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {stat.avgAttendance}%
                    </span>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">High Risk</span>
                    <span className={`font-bold ${stat.highRiskCount > 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                      {stat.highRiskCount} cases
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 text-right">
                  {isSelected ? '✓ Filter applied' : 'Click to filter'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
