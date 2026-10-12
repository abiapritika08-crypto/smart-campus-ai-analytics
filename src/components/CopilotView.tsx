import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileText,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Student } from '../types/student';

interface CopilotViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenExportReport: () => void;
}

interface QueryResult {
  query: string;
  answer: string;
  matchedStudents: Student[];
  highlight?: string;
  recommendedAction?: string;
  source: 'gemini' | 'heuristic';
  timestamp: string;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  students,
  onSelectStudent,
  onOpenExportReport,
}) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<QueryResult[]>([
    {
      query: 'Identify all students currently at critical risk of semester debarment due to attendance shortages.',
      answer: `Found 3 students whose overall attendance has breached the statutory 75% university bar: Marcus Chen (61.5%), Dev Patel (57.0%), and Lucas Silva (63.0%). All three have had downward velocity across 4+ consecutive lecture weeks.`,
      matchedStudents: students.filter(s => s.overallAttendance < 70),
      highlight: '3 students below 70%',
      recommendedAction: 'Issue immediate 48-hour attendance warning notices and schedule 1-on-1 counseling.',
      source: 'gemini',
      timestamp: 'Just now',
    }
  ]);

  const quickQuestions = [
    'Which students had a drop > 20% between Midterm 1 and Midterm 2?',
    'Show me high-achievers qualified to be Peer Tutors for Algorithms & Math',
    'Which 7th-semester students need urgent mock interview coaching for campus placements?',
    'Who has multiple missing core assignment submissions?',
    'Summarize Computer Science Dept Section A risk indicators for Dean review'
  ];

  const handleRunQuery = async (queryToRun: string) => {
    const q = queryToRun.trim();
    if (!q || loading) return;

    setLoading(true);
    setInputQuery('');

    try {
      const response = await fetch('/api/ai/query-cohort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, students }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const matchingIds: string[] = resData.data.matchingStudentIds || [];
        const matched = students.filter(s => matchingIds.includes(s.id));

        setHistory(prev => [
          {
            query: q,
            answer: resData.data.answer,
            matchedStudents: matched,
            highlight: resData.data.keyMetrics?.highlight,
            recommendedAction: resData.data.recommendedAction,
            source: resData.source || 'gemini',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Error running AI cohort query:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Faculty AI Copilot & Natural Language Cohort Query</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Ask any question across the entire academic dataset. CampusCare AI scans continuous evaluation scores, attendance history, assignment backlogs, and placement milestones to generate instant analytical clarity.
          </p>
        </div>

        <button
          onClick={onOpenExportReport}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Generate Full Audit Report</span>
        </button>
      </div>

      {/* Query Input Box */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md">
        <label className="block text-xs font-semibold text-slate-200 mb-2">
          Ask CampusCare AI about your students:
        </label>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. Which students have fallen below 75% attendance and failed a midterm test?"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunQuery(inputQuery);
            }}
            className="flex-1 bg-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-lg px-4 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            onClick={() => handleRunQuery(inputQuery)}
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Ask Copilot</span>
          </button>
        </div>

        {/* Quick query recommendation chips */}
        <div className="mt-3.5 pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-2">
            Suggested diagnostic inquiries for advisors:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleRunQuery(q)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-left cursor-pointer"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Answers & Session History */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>Diagnostic Responses</span>
          <span className="text-xs font-normal text-slate-500">({history.length} answered)</span>
        </h3>

        {history.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-start gap-2.5">
                <span className="p-1 bg-slate-100 text-slate-700 rounded-md mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    &ldquo;{item.query}&rdquo;
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Advisor Query &middot; {item.timestamp}
                  </span>
                </div>
              </div>

              {item.source === 'gemini' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md shrink-0">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Gemini Flash 3.8
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md shrink-0">
                  CampusCare Heuristic Engine
                </span>
              )}
            </div>

            {/* Answer prose */}
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-lg border border-slate-100">
              <p className="whitespace-pre-line">{item.answer}</p>

              {item.recommendedAction && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-start gap-2 text-indigo-950 font-medium">
                  <span className="p-1 bg-indigo-100 text-indigo-700 rounded shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-indigo-600 font-bold block">
                      Recommended Faculty Action:
                    </span>
                    <span className="text-xs text-slate-800">{item.recommendedAction}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Matched Students Grid if any */}
            {item.matchedStudents.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Flagged Cohort Members ({item.matchedStudents.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {item.matchedStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{student.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{student.rollNo} &middot; {student.department}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold ${student.overallAttendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {student.overallAttendance}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
