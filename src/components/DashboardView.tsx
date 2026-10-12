import React from 'react';
import { 
  AlertOctagon, 
  ArrowUpRight, 
  Clock, 
  TrendingDown, 
  UserCheck, 
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  Zap,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Student } from '../types/student';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigateToRisk: () => void;
  onNavigateToInterventions: () => void;
  onQuickAction: (actionType: string, student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onNavigateToRisk,
  onNavigateToInterventions,
  onQuickAction,
}) => {
  // Urgent students: High Risk or Attendance < 65%
  const urgentStudents = students
    .filter(s => s.riskAnalysis.riskTier === 'high' || s.overallAttendance < 65)
    .sort((a, b) => b.riskAnalysis.overallRiskScore - a.riskAnalysis.overallRiskScore);

  // Group by risk tier
  const riskGroups = {
    high: students.filter(s => s.riskAnalysis.riskTier === 'high'),
    moderate: students.filter(s => s.riskAnalysis.riskTier === 'moderate'),
    low: students.filter(s => s.riskAnalysis.riskTier === 'low'),
    high_achiever: students.filter(s => s.riskAnalysis.riskTier === 'high_achiever'),
  };

  // Department distribution
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
      
      {/* Top Banner Alert for High Risk */}
      {urgentStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Early Warning Notice: {urgentStudents.length} Students Require Immediate Faculty Action
              </p>
              <p className="text-xs text-amber-800">
                Trigger factors include attendance falling below the statutory 75% limit and &gt;25% drops in Midterm assessments.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToRisk}
            className="text-xs font-semibold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Review Risk Matrix
          </button>
        </div>
      )}

      {/* Main Grid: Urgent Queue & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Action Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Priority Intervention Queue</h2>
              <p className="text-xs text-slate-500">Students flagged by multi-factor early warning algorithms</p>
            </div>
            <span className="text-xs font-mono font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              {urgentStudents.length} Flagged Cases
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {urgentStudents.slice(0, 4).map((student) => {
              const weakSubject = student.coursePerformances.find(c => c.status === 'critical');
              return (
                <div 
                  key={student.id} 
                  className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="font-medium text-sm text-slate-900 hover:text-emerald-600 truncate cursor-pointer text-left"
                        >
                          {student.name}
                        </button>
                        <span className="text-xs text-slate-400 font-mono">
                          {student.rollNo}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{student.department} &middot; Sem {student.semester}</span>
                        <span>&middot;</span>
                        <span className={`font-medium ${student.overallAttendance < 75 ? 'text-amber-600 font-semibold' : 'text-slate-600'}`}>
                          {student.overallAttendance}% Att.
                        </span>
                        {weakSubject && (
                          <>
                            <span>&middot;</span>
                            <span className="text-rose-600 truncate max-w-[150px]">
                              Lag in {weakSubject.courseName}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Flag reason */}
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                        &quot;{student.riskAnalysis.primaryFactors[0]}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Risk {student.riskAnalysis.overallRiskScore}/100
                    </span>
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Diagnose</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing top priority students needing immediate intervention
            </span>
            <button
              onClick={onNavigateToRisk}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View full risk radar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Risk Distribution Matrix (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Risk Classification</h2>
            <p className="text-xs text-slate-500 mb-4">Calculated early warning categorization across cohort</p>

            <div className="space-y-3">
              {/* High Risk */}
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-800">High Risk (Score &gt; 65)</span>
                  <span className="font-bold text-rose-700">{riskGroups.high.length} students</span>
                </div>
                <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all" 
                    style={{ width: `${(riskGroups.high.length / students.length) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-rose-600 mt-1">Severe attendance/grade drops; mandatory 1-on-1 counseling</p>
              </div>

              {/* Moderate Risk */}
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-800">Moderate Risk (40 - 65)</span>
                  <span className="font-bold text-amber-700">{riskGroups.moderate.length} students</span>
                </div>
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all" 
                    style={{ width: `${(riskGroups.moderate.length / students.length) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-amber-700 mt-1">Assignment backlogs or single course bottleneck; monitor</p>
              </div>

              {/* On Track */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">On Track (20 - 39)</span>
                  <span className="font-bold text-slate-700">{riskGroups.low.length} students</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-500 h-full rounded-full transition-all" 
                    style={{ width: `${(riskGroups.low.length / students.length) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Consistent progress; standard academic mentorship</p>
              </div>

              {/* High Achievers */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-800">High Achievers (&lt; 20)</span>
                  <span className="font-bold text-emerald-700">{riskGroups.high_achiever.length} students</span>
                </div>
                <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${(riskGroups.high_achiever.length / students.length) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">Eligible for honors, TA roles, and peer-mentorship leads</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToInterventions}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Batch Intervention Plan</span>
            </button>
          </div>
        </div>

      </div>

      {/* Departmental Performance & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department Health Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Departmental Risk Distribution</h2>
          <p className="text-xs text-slate-500 mb-4">Attendance compliance & high risk concentration by department</p>

          <div className="space-y-3">
            {deptStats.map(stat => (
              <div key={stat.department} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-900 mb-1.5">
                  <span>{stat.department}</span>
                  <span className="text-slate-500">{stat.count} students</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-500 block text-[10px] uppercase">Avg Attendance</span>
                    <span className={`font-semibold ${stat.avgAttendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {stat.avgAttendance}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-500 block text-[10px] uppercase">High Risk Alerts</span>
                    <span className={`font-semibold ${stat.highRiskCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {stat.highRiskCount} cases
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Early Warning Indicators */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">CampusCare Predictive Indicators</h2>
            <p className="text-xs text-slate-500 mb-4">How CampusCare AI detects friction before semester failure</p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Attendance Velocity Slip</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Identifies downward velocity over 3 consecutive weeks, flagging students before they breach statutory 75% thresholds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-lg shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Internal Assessment Divergence</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Measures percentage score drops between Midterm 1 and Midterm 2, highlighting topic-specific conceptual barriers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Assignment Backlog Index</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tracks late or missing continuous evaluations, signaling executive burnout or lab environment friction early.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span className="font-medium">Continuous telemetry updated for Fall 2026</span>
            <span className="text-[11px] font-mono font-semibold text-emerald-700">Audit Active</span>
          </div>
        </div>

      </div>

    </div>
  );
};
