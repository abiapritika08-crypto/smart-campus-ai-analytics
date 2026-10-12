import React, { useState } from 'react';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  FileSpreadsheet, 
  Sliders, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { Student } from '../types/student';

interface RiskAnalysisViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
}) => {
  // Interactive Simulator Weights
  const [attendanceWeight, setAttendanceWeight] = useState<number>(30);
  const [testDropWeight, setTestDropWeight] = useState<number>(35);
  const [assignmentLagWeight, setAssignmentLagWeight] = useState<number>(20);
  const [historicalCgpaWeight, setHistoricalCgpaWeight] = useState<number>(15);

  // Identify students with specific risk factors
  const attendanceSlippingStudents = students.filter(s => {
    // Check if attendance is under 75% or has consecutive drops
    return s.overallAttendance < 75 || s.riskAnalysis.consecutiveAbsences >= 3;
  });

  const testDropStudents = students.filter(s => {
    return (s.riskAnalysis.scoreDropPercent || 0) >= 20;
  });

  const assignmentLagStudents = students.filter(s => {
    return s.assignments.some(a => a.status === 'missing');
  });

  // Calculate dynamically simulated risk scores
  const simulatedStudents = students.map(s => {
    // Normalization factors
    const attScore = Math.max(0, 100 - s.overallAttendance); // lower attendance = higher risk
    const dropScore = Math.min(100, (s.riskAnalysis.scoreDropPercent || 0) * 2.5);
    const assignScore = 100 - s.riskAnalysis.assignmentCompletionRate;
    const cgpaScore = Math.max(0, (10 - s.cgpa) * 10);

    const totalWeight = attendanceWeight + testDropWeight + assignmentLagWeight + historicalCgpaWeight;
    const computedScore = Math.round(
      (attScore * attendanceWeight +
       dropScore * testDropWeight +
       assignScore * assignmentLagWeight +
       cgpaScore * historicalCgpaWeight) / (totalWeight || 1)
    );

    return {
      ...s,
      simulatedRiskScore: computedScore,
      isSimulatedHighRisk: computedScore >= 65,
    };
  }).sort((a, b) => b.simulatedRiskScore - a.simulatedRiskScore);

  const simulatedHighRiskCount = simulatedStudents.filter(s => s.isSimulatedHighRisk).length;

  return (
    <div className="space-y-6">
      
      {/* Risk Engine Architecture Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Academic Risk & Early Warning Engine</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              CampusCare AI combines continuous evaluation telemetry, multi-week attendance velocity, and assignment completion backlogs to isolate learning impediments before end-of-semester failure.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Active Formula</span>
              <span className="font-semibold text-slate-800">Composite Multi-Index</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">High Risk Cutoff</span>
              <span className="font-semibold text-rose-600">&ge; 65 / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Risk Weight Simulator */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Interactive Early Warning Risk Simulator</h3>
              <p className="text-xs text-slate-300">
                Adjust indicator weights to calibrate risk thresholds for your department&apos;s academic policy
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold">
            {simulatedHighRiskCount} Flagged at Current Sensitivity
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance Weight */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Attendance Velocity</span>
              <span className="font-bold text-emerald-400">{attendanceWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={attendanceWeight}
              onChange={(e) => setAttendanceWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Penalizes slips under 75%</span>
          </div>

          {/* Test Drop Weight */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Midterm Score Drop</span>
              <span className="font-bold text-emerald-400">{testDropWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={testDropWeight}
              onChange={(e) => setTestDropWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Detects sharp internal exam drops</span>
          </div>

          {/* Assignment Lag */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Assignment Backlog</span>
              <span className="font-bold text-emerald-400">{assignmentLagWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={assignmentLagWeight}
              onChange={(e) => setAssignmentLagWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Tracks missing lab deliverables</span>
          </div>

          {/* Historical Baseline */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Historical CGPA Baseline</span>
              <span className="font-bold text-emerald-400">{historicalCgpaWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={historicalCgpaWeight}
              onChange={(e) => setHistoricalCgpaWeight(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Baseline academic momentum</span>
          </div>
        </div>
      </div>

      {/* 3 Key Friction Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category 1: Attendance Shortage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-sm text-slate-900">Attendance Deficit</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {attendanceSlippingStudents.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Students falling below the 75% regulatory requirement, creating immediate university debarment liability.
            </p>

            <div className="space-y-2.5">
              {attendanceSlippingStudents.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onSelectStudent(s)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50/50 border border-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-xs text-slate-900 block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.department} &middot; Sem {s.semester}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 block">{s.overallAttendance}%</span>
                    <span className="text-[10px] text-slate-500">{s.riskAnalysis.consecutiveAbsences} consec. absences</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Notice protocol: Issue advisory letters within 48h</span>
          </div>
        </div>

        {/* Category 2: Internal Assessment Crashes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-sm text-slate-900">Midterm Score Crashes</h3>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {testDropStudents.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Sudden &gt;20% drops between Midterm 1 and Midterm 2, exposing severe conceptual bottlenecks.
            </p>

            <div className="space-y-2.5">
              {testDropStudents.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => onSelectStudent(s)}
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50/50 border border-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-xs text-slate-900 block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.coursePerformances[0]?.courseName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 block">
                      -{s.riskAnalysis.scoreDropPercent}% Drop
                    </span>
                    <span className="text-[10px] text-slate-500">Midterm 1 &rarr; Midterm 2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Remedial protocol: Peer tutor pairing & tutorial clinics</span>
          </div>
        </div>

        {/* Category 3: Assignment Backlog */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-sm text-slate-900">Deliverable Backlog</h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {assignmentLagStudents.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Overdue or missing laboratory reports and programming assignments triggering continuous assessment penalties.
            </p>

            <div className="space-y-2.5">
              {assignmentLagStudents.map((s) => {
                const missingCount = s.assignments.filter(a => a.status === 'missing').length;
                return (
                  <div 
                    key={s.id} 
                    onClick={() => onSelectStudent(s)}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-xs text-slate-900 block">{s.name}</span>
                      <span className="text-[11px] text-slate-400">{s.assignments.find(a => a.status === 'missing')?.title || 'Lab Backlog'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 block">
                        {missingCount} Missing
                      </span>
                      <span className="text-[10px] text-slate-500">{s.riskAnalysis.assignmentCompletionRate}% completed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Recovery protocol: Structured 5-day grace submission contract</span>
          </div>
        </div>

      </div>

      {/* Simulated Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Calibrated Cohort Risk Ranking
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Real-time dynamic ranking re-computed based on current weight sensitivities
        </p>

        <div className="divide-y divide-slate-100">
          {simulatedStudents.slice(0, 6).map((student, idx) => (
            <div 
              key={student.id} 
              className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">
                  #{idx + 1}
                </span>
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="font-medium text-xs text-slate-900 hover:text-emerald-600 cursor-pointer text-left block"
                  >
                    {student.name}
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {student.rollNo} &middot; {student.department}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">Attendance</span>
                  <span className={`font-semibold ${student.overallAttendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {student.overallAttendance}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">CGPA</span>
                  <span className="font-semibold text-slate-800">{student.cgpa.toFixed(2)}</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">Computed Risk</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    student.simulatedRiskScore >= 65 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : student.simulatedRiskScore >= 40
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {student.simulatedRiskScore}/100
                  </span>
                </div>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="View diagnostic dossier"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
