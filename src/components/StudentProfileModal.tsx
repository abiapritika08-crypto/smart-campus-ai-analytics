import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  BookOpen, 
  FileText, 
  Briefcase, 
  HeartHandshake, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  User, 
  Plus, 
  Copy, 
  Check, 
  Loader2,
  ChevronRight,
  Send
} from 'lucide-react';
import { Student, CoursePerformance, AssignmentItem, InterventionRecord, MentorNote } from '../types/student';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onAddIntervention: (studentId: string, intervention: Omit<InterventionRecord, 'id' | 'createdAt'>) => void;
  onAddMentorNote: (studentId: string, note: Omit<MentorNote, 'id' | 'date'>) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onAddIntervention,
  onAddMentorNote,
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'ai_dossier' | 'courses' | 'attendance' | 'assignments' | 'placement' | 'interventions' | 'email'>('ai_dossier');
  
  // AI Diagnostic Dossier State
  const [dossierLoading, setDossierLoading] = useState<boolean>(false);
  const [dossierData, setDossierData] = useState<any>(null);

  // Email Generator State
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // New Intervention Form State
  const [showNewInterventionForm, setShowNewInterventionForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<any>('mentoring_1on1');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newFollowUp, setNewFollowUp] = useState<string>('2026-10-24');

  // New Note Form State
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<any>('academic');

  // Trigger AI analysis on open
  useEffect(() => {
    fetchAiDossier();
    fetchEmailDraft();
  }, [student.id]);

  const fetchAiDossier = async () => {
    setDossierLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });
      const result = await response.json();
      if (result.success) {
        setDossierData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch AI dossier:', err);
    } finally {
      setDossierLoading(false);
    }
  };

  const fetchEmailDraft = async () => {
    setEmailLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setEmailSubject(result.data.emailSubject);
        setEmailBody(result.data.emailBody);
      }
    } catch (err) {
      console.error('Failed to fetch email draft:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSendEmailSimulation = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddIntervention(student.id, {
      facultyName: student.advisor || 'Dr. Eleanor Vance',
      type: newType,
      status: 'scheduled',
      title: newTitle,
      notes: newNotes,
      actionPlan: ['Mandatory check-in with advisor', 'Submit initial milestone review'],
      nextFollowUpDate: newFollowUp,
    });

    setNewTitle('');
    setNewNotes('');
    setShowNewInterventionForm(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddMentorNote(student.id, {
      author: 'Dr. Eleanor Vance',
      content: newNoteContent,
      category: newNoteCategory,
    });

    setNewNoteContent('');
  };

  const isDebarredRisk = student.overallAttendance < 75;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-sm shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">{student.name}</h2>
                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {student.rollNo}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  student.riskAnalysis.riskTier === 'high' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : student.riskAnalysis.riskTier === 'moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  Risk Score: {student.riskAnalysis.overallRiskScore}/100
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{student.department} &middot; Semester {student.semester} (Sec {student.section})</span>
                <span>&middot;</span>
                <span>Advisor: <strong className="text-slate-200">{student.advisor}</strong></span>
                <span>&middot;</span>
                <span className="text-slate-300">{student.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Overall Attendance</span>
            <span className={`font-bold ${isDebarredRisk ? 'text-rose-600' : 'text-slate-900'}`}>
              {student.overallAttendance}% {isDebarredRisk ? '(Under 75% Cutoff)' : ''}
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">CGPA / Predicted</span>
            <span className="font-bold text-slate-900">
              {student.cgpa.toFixed(2)} / {student.currentGpa.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Placement Readiness</span>
            <span className="font-bold text-indigo-700 capitalize">
              {student.placementReadiness.tier.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Active Backlogs</span>
            <span className={`font-bold ${student.placementReadiness.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {student.placementReadiness.activeBacklogs === 0 ? 'None (Clear)' : `${student.placementReadiness.activeBacklogs} Backlogs`}
            </span>
          </div>
        </div>

        {/* Attendance Statutory Warning Banner */}
        {isDebarredRisk && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2 text-xs text-rose-800 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Statutory Warning: Attendance is {student.overallAttendance}%. Debarred from Endterm exam unless remediated.
            </span>
            <button
              onClick={() => setActiveTab('email')}
              className="font-bold underline text-rose-900 hover:text-rose-700 cursor-pointer"
            >
              Draft Official Notice
            </button>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="border-b border-slate-200 bg-white px-6 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex space-x-4 py-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('ai_dossier')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'ai_dossier'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Diagnostic Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Course Performance ({student.coursePerformances.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Attendance History</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'assignments'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Assignments & Backlogs ({student.assignments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('placement')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'placement'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Placement Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveTab('interventions')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'interventions'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-slate-400" />
              <span>Action Plan & Logs ({student.interventions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`pb-2 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'email'
                  ? 'border-emerald-600 text-emerald-800 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Empathetic Outreach</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: AI Diagnostic Dossier */}
          {activeTab === 'ai_dossier' && (
            <div className="space-y-5">
              {dossierLoading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-sm font-medium">CampusCare AI is analyzing {student.name}&apos;s academic footprint...</p>
                  <p className="text-xs text-slate-400">Synthesizing attendance trends, assessment delta, and assignment completion</p>
                </div>
              ) : dossierData ? (
                <>
                  {/* Executive Diagnostic Summary */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                        Diagnostic Assessment & Clinical Findings
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-normal">
                      {dossierData.diagnosticSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Root Causes */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Root Causes of Academic Friction</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {dossierData.rootCauses?.map((cause: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">&bull;</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Attendance Trajectory */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Attendance Trajectory & Debarment Risk</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed mb-3">
                        {dossierData.attendanceTrajectory}
                      </p>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Recommended Faculty Tone</span>
                        <p className="text-slate-800 text-[11px] mt-0.5">{dossierData.facultyToneAdvice}</p>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Action Plan */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md">
                    <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Recommended 3-Phase Remediation Roadmap</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {dossierData.immediateActionPlan?.map((step: string, i: number) => (
                        <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                            Phase {i + 1}
                          </span>
                          <p className="text-xs text-slate-200 leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interventions Shortcut */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Primary Recommended Action: <strong>{dossierData.recommendedIntervention}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('interventions')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Log Intervention Action</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* TAB 2: Course Performance */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Detailed course-by-course performance breakdown for Semester {student.semester}</span>
                <span className="font-semibold text-slate-700">Max Midterm Marks: 30</span>
              </div>

              <div className="space-y-3">
                {student.coursePerformances.map((c) => (
                  <div key={c.courseCode} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {c.courseCode}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{c.courseName}</h4>
                          <span className="text-xs text-slate-400">({c.credits} Credits)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Faculty: {c.faculty}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
                          c.status === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : c.status === 'needs_attention'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          Grade Est: {c.currentGradeEstimate}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Course Attendance</span>
                        <span className={`font-semibold ${c.attendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {c.attendance}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Midterm 1 Score</span>
                        <span className="font-semibold text-slate-900">{c.internal1} / {c.internal1Max}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Midterm 2 Score</span>
                        <span className={`font-semibold ${c.internal2 < c.internal1 - 5 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {c.internal2} / {c.internal2Max}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Quiz & Lab Score</span>
                        <span className="font-semibold text-slate-900">{c.quizAvg}% Avg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Attendance History */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Weekly lecture & lab attendance tracker</span>
                <span className="text-amber-700 font-semibold">Statutory Cutoff: 75%</span>
              </div>

              {/* Visual Weekly Timeline Bars */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-end justify-between h-44 gap-2 pt-6 pb-2 px-2 border-b border-slate-200 relative">
                  {/* Statutory 75% Reference Line */}
                  <div 
                    className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 pointer-events-none"
                    style={{ bottom: '75%' }}
                  >
                    <span className="absolute right-2 -top-4 text-[10px] font-bold text-rose-600 bg-white px-1 rounded">
                      75% Mandatory Cutoff
                    </span>
                  </div>

                  {student.attendanceHistory.map((week) => (
                    <div key={week.week} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {week.rate}%
                      </span>
                      <div 
                        className={`w-full max-w-[36px] rounded-t-md transition-all ${
                          week.rate >= 75 ? 'bg-emerald-500' : week.rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ height: `${week.rate}%` }}
                      />
                      <span className="text-[10px] text-slate-500 mt-2 font-mono">
                        W{week.week}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-2">
                  <span>Start of Semester (Week 1)</span>
                  <span>Mid-Term Evaluation (Week 8)</span>
                </div>
              </div>

              {/* Table of Weeks */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Week</th>
                      <th className="py-2.5 px-3">Date Range</th>
                      <th className="py-2.5 px-3">Classes Attended</th>
                      <th className="py-2.5 px-3">Weekly Rate</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.attendanceHistory.map((w) => (
                      <tr key={w.week}>
                        <td className="py-2 px-3 font-semibold">Week {w.week}</td>
                        <td className="py-2 px-3 text-slate-500">{w.date}</td>
                        <td className="py-2 px-3">{w.classesAttended} / {w.totalClasses}</td>
                        <td className="py-2 px-3 font-bold">{w.rate}%</td>
                        <td className="py-2 px-3">
                          {w.rate >= 75 ? (
                            <span className="text-emerald-700 font-medium">Compliant</span>
                          ) : (
                            <span className="text-rose-600 font-semibold">Shortage Alert</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Assignments */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Continuous Internal Evaluation & Laboratory Deliverables</span>
                <span className="font-semibold text-slate-800">
                  Completion Rate: {student.riskAnalysis.assignmentCompletionRate}%
                </span>
              </div>

              <div className="space-y-2.5">
                {student.assignments.map((asg) => (
                  <div key={asg.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {asg.courseCode}
                        </span>
                        <h4 className="font-semibold text-slate-900">{asg.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Due Date: {asg.dueDate} {asg.submittedDate ? `&middot; Submitted: ${asg.submittedDate}` : ''}
                      </span>
                    </div>

                    <div className="text-right">
                      {asg.status === 'submitted_on_time' && (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          On-Time ({asg.score}/{asg.maxScore})
                        </span>
                      )}
                      {asg.status === 'submitted_late' && (
                        <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                          Late ({asg.score}/{asg.maxScore})
                        </span>
                      )}
                      {asg.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                          Pending Submission
                        </span>
                      )}
                      {asg.status === 'missing' && (
                        <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          Missing Deliverable (0/{asg.maxScore})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Placement Diagnostics */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Technical Proficiency</span>
                  <span className="text-base font-bold text-slate-900">
                    {student.placementReadiness.technicalProficiency}%
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Mock Interview Screen</span>
                  <span className="text-base font-bold text-slate-900">
                    {student.placementReadiness.mockInterviewScore}%
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Coding Assessment</span>
                  <span className="text-base font-bold text-slate-900">
                    {student.placementReadiness.codingSkillScore}%
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Soft Skills Rigor</span>
                  <span className="text-base font-bold text-slate-900">
                    {student.placementReadiness.softSkillsScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px] mb-2">Key Core Strengths</h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {student.placementReadiness.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-amber-800 uppercase text-[11px] mb-2">Growth & Remediation Areas</h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {student.placementReadiness.growthAreas.map((g, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Interventions & Faculty Logbook */}
          {activeTab === 'interventions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Interventions & Mentoring Record</h4>
                <button
                  onClick={() => setShowNewInterventionForm(!showNewInterventionForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{showNewInterventionForm ? 'Cancel Form' : 'Log New Intervention'}</span>
                </button>
              </div>

              {/* Form to log intervention */}
              {showNewInterventionForm && (
                <form onSubmit={handleCreateIntervention} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h5 className="font-semibold text-slate-800">New Faculty Support Action</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Intervention Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Remedial Algorithms Clinic"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Action Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                      >
                        <option value="mentoring_1on1">1-on-1 Academic Counseling</option>
                        <option value="remedial_tutoring">Remedial Tutoring</option>
                        <option value="assignment_extension">Assignment Extension Contract</option>
                        <option value="peer_study_group">Peer Study Pairing</option>
                        <option value="parent_conference">Parent Conference</option>
                        <option value="placement_coaching">Placement Coaching</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Advisor Notes & Agreed Action Plan</label>
                    <textarea
                      rows={2}
                      placeholder="Outline discussion points and student obligations..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer"
                    >
                      Save Intervention
                    </button>
                  </div>
                </form>
              )}

              {/* Past Interventions list */}
              <div className="space-y-3">
                {student.interventions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No active interventions logged for this student yet.</p>
                ) : (
                  student.interventions.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{item.notes}</p>
                      {item.outcomeMetric && (
                        <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 font-medium">
                          Metric: {item.outcomeMetric.metricName} changed from {item.outcomeMetric.beforeValue} to {item.outcomeMetric.afterValue}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                        <span>Advisor: {item.facultyName}</span>
                        <span>Next Follow-up: {item.nextFollowUpDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Faculty Mentor Notes Stream */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Internal Advisory Notes</h4>
                
                {/* Add note input */}
                <form onSubmit={handleCreateNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add quick confidential advisor note..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-2">
                  {student.mentorNotes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <p className="text-slate-700 leading-snug">{n.content}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{n.author} &middot; {n.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: Empathetic Email Generator */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950">
                <h4 className="font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-700" />
                  <span>AI-Generated Supportive Faculty Outreach</span>
                </h4>
                <p className="leading-relaxed">
                  CampusCare AI crafts empathetic, professional emails that invite students to office hours without inducing panic, shame, or defensiveness.
                </p>
              </div>

              {emailLoading ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-xs font-medium">Composing personalized email for {student.name}...</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Message Body</label>
                    <textarea
                      rows={9}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-sans leading-relaxed focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Editable before sending &middot; Recipient: {student.email}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyEmail}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{emailCopied ? 'Copied!' : 'Copy Text'}</span>
                      </button>

                      <button
                        onClick={handleSendEmailSimulation}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{emailSent ? 'Sent to Student!' : 'Send Official Email'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
