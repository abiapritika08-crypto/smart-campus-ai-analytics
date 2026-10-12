import React, { useState } from 'react';
import { 
  Layers, 
  AlertCircle, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Award, 
  ChevronRight, 
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Send
} from 'lucide-react';
import { Student, SegmentType } from '../types/student';

interface SegmentationViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onLaunchGroupIntervention: (segment: SegmentType, students: Student[]) => void;
}

export const SegmentationView: React.FC<SegmentationViewProps> = ({
  students,
  onSelectStudent,
  onLaunchGroupIntervention,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentType>('urgent_mentoring');

  const segmentsConfig: {
    id: SegmentType;
    title: string;
    description: string;
    icon: any;
    color: string;
    badgeBg: string;
    protocol: string;
  }[] = [
    {
      id: 'urgent_mentoring',
      title: 'Urgent Mentoring & Advising',
      description: 'Severe attendance shortages (<70%), debarment risk, or consecutive failing midterm assessments.',
      icon: AlertCircle,
      color: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      protocol: 'Mandatory 1-on-1 counseling, formal parent review letter, and weekly attendance sign-off.',
    },
    {
      id: 'concept_remediation',
      title: 'Core Concept & Math Remediation',
      description: 'Struggling in quantitative foundation courses (Discrete Math, Algorithms, Signals, Thermodynamics).',
      icon: BookOpen,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      protocol: 'Enrollment in weekly departmental problem-solving clinics and TA-led walkthroughs.',
    },
    {
      id: 'assignment_recovery',
      title: 'Assignment & Lab Catch-Up',
      description: 'Adequate lecture attendance but backlog of overdue coding assignments or lab reports.',
      icon: FileText,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      protocol: 'Structured 5-day grace resubmission window with progressive milestone checks.',
    },
    {
      id: 'placement_coaching',
      title: 'Placement & Career Fast-Track',
      description: 'Pre-final and final year candidates preparing for Tier 1 & Tier 2 campus recruitment rounds.',
      icon: Briefcase,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      protocol: 'Mock technical coding screens, system design workshops, and resume ATS optimization.',
    },
    {
      id: 'honors_research',
      title: 'Honors, TAs & Peer Mentors',
      description: 'Top-decile achievers with CGPA > 8.5, consistent attendance, and leadership potential.',
      icon: Award,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      protocol: 'Appointment as peer study circle leaders, undergraduate research fellowships, and honors track.',
    },
  ];

  const currentSegmentConfig = segmentsConfig.find(s => s.id === selectedSegment)!;
  const segmentStudents = students.filter(s => s.segmentation.primarySegment === selectedSegment);

  return (
    <div className="space-y-6">
      
      {/* Overview Intro */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </span>
          <h2 className="text-lg font-bold text-slate-900">Student Segmentation & Cohort Clustering</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Instead of applying generic academic assistance, CampusCare AI segments students by their primary behavioral and academic profiles, ensuring interventions are targeted, respectful, and pedagogically effective.
        </p>
      </div>

      {/* Segment Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {segmentsConfig.map((seg) => {
          const Icon = seg.icon;
          const count = students.filter(s => s.segmentation.primarySegment === seg.id).length;
          const isSelected = selectedSegment === seg.id;

          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(seg.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count} Students
                  </span>
                </div>
                <h3 className={`font-semibold text-xs leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {seg.title}
                </h3>
              </div>
              <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {seg.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Segment Detail & Students */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Header of Segment */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">
                {currentSegmentConfig.title}
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${currentSegmentConfig.badgeBg}`}>
                {segmentStudents.length} Students Assigned
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              <strong>Institutional Protocol:</strong> {currentSegmentConfig.protocol}
            </p>
          </div>

          <button
            onClick={() => onLaunchGroupIntervention(selectedSegment, segmentStudents)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Group Action Plan</span>
          </button>
        </div>

        {/* Student Cards Grid in this Segment */}
        {segmentStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No students currently classified in this segment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segmentStudents.map((student) => (
              <div
                key={student.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 
                        onClick={() => onSelectStudent(student)}
                        className="font-semibold text-xs text-slate-900 hover:text-emerald-600 cursor-pointer"
                      >
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">{student.rollNo}</p>
                      <p className="text-[11px] text-slate-500">{student.department} &middot; Sem {student.semester}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">Attendance</span>
                      <span className={`font-semibold ${student.overallAttendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {student.overallAttendance}%
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">CGPA</span>
                      <span className="font-semibold text-slate-800">{student.cgpa.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Secondary Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {student.segmentation.secondaryTags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-600 italic line-clamp-2 mt-1">
                    &quot;{student.riskAnalysis.primaryFactors[0]}&quot;
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Risk: <strong>{student.riskAnalysis.overallRiskScore}/100</strong>
                  </span>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Dossier</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
