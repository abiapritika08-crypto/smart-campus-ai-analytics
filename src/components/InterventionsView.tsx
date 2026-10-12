import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  User, 
  BookOpen, 
  ArrowRight,
  Filter,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Student, InterventionRecord, InterventionStatus } from '../types/student';

interface InterventionsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenNewInterventionModal: () => void;
  onUpdateInterventionStatus: (studentId: string, interventionId: string, status: InterventionStatus) => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({
  students,
  onSelectStudent,
  onOpenNewInterventionModal,
  onUpdateInterventionStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Flatten all interventions with student context
  const allInterventions: {
    student: Student;
    record: InterventionRecord;
  }[] = [];

  students.forEach(student => {
    student.interventions.forEach(rec => {
      allInterventions.push({
        student,
        record: rec,
      });
    });
  });

  // Filtered interventions
  const filtered = allInterventions.filter(item => {
    if (statusFilter !== 'all' && item.record.status !== statusFilter) return false;
    if (typeFilter !== 'all' && item.record.type !== typeFilter) return false;
    return true;
  });

  // Measure outcome impact counts
  const resolvedCount = allInterventions.filter(i => i.record.status === 'resolved' || i.record.status === 'completed').length;
  const inProgressCount = allInterventions.filter(i => i.record.status === 'in_progress').length;
  const scheduledCount = allInterventions.filter(i => i.record.status === 'scheduled').length;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'mentoring_1on1':
        return '1-on-1 Advising';
      case 'remedial_tutoring':
        return 'Remedial Tutoring';
      case 'assignment_extension':
        return 'Assignment Contract';
      case 'parent_conference':
        return 'Parent Conference';
      case 'placement_coaching':
        return 'Career Coaching';
      case 'peer_study_group':
        return 'Peer Study Group';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Intervention Tracking & Longitudinal Progress</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor institutional support initiatives, peer tutoring appointments, attendance milestone contracts, and measurable before-and-after recovery outcomes.
          </p>
        </div>

        <button
          onClick={onOpenNewInterventionModal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Schedule New Intervention</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>In Progress Actions</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-1">Active faculty & peer mentoring cases</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Successfully Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Demonstrated academic metric rebounds</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Upcoming / Scheduled</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{scheduledCount}</p>
          <p className="text-xs text-slate-500 mt-1">Advisory committee & hearings pending</p>
        </div>
      </div>

      {/* Before / After Impact Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Before vs. After Intervention Rebound Telemetry</h3>
        </div>
        <p className="text-xs text-slate-300 mb-4 max-w-3xl leading-relaxed">
          Measuring longitudinal improvement confirms that students receiving targeted peer pairing or early grace agreements show significant grade and attendance stabilization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-xs">
            <span className="text-[10px] uppercase text-emerald-300 block">Marcus Chen &middot; Attendance Recovery</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-slate-300 line-through">48%</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-base font-bold text-emerald-400">52% (+4%)</span>
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">Weekly attendance rising post-counseling</span>
          </div>

          <div className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-xs">
            <span className="text-[10px] uppercase text-emerald-300 block">Aisha Patel &middot; Peer Study Cohort</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-slate-300 line-through">54%</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-base font-bold text-emerald-400">68% (+14%)</span>
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">Tutee cohort average midterm score rebound</span>
          </div>

          <div className="bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-xs">
            <span className="text-[10px] uppercase text-emerald-300 block">Priya Sharma &middot; Mock Tech Screen</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-slate-300 line-through">74%</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-base font-bold text-emerald-400">84% (+10%)</span>
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">Prepared for Tier 1 Research Recruitment</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed / Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="mentoring_1on1">1-on-1 Advising</option>
            <option value="remedial_tutoring">Remedial Tutoring</option>
            <option value="assignment_extension">Assignment Contract</option>
            <option value="peer_study_group">Peer Study Group</option>
            <option value="placement_coaching">Career Coaching</option>
            <option value="parent_conference">Parent Conference</option>
          </select>
        </div>
      </div>

      {/* Active Interventions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No interventions match the selected criteria.
          </div>
        ) : (
          filtered.map(({ student, record }) => (
            <div 
              key={record.id} 
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 
                      onClick={() => onSelectStudent(student)}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-600 cursor-pointer"
                    >
                      {student.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">({student.rollNo})</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {getTypeBadge(record.type)}
                    </span>
                  </div>

                  <h5 className="font-semibold text-xs text-slate-800 mt-1">
                    {record.title}
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                    {record.notes}
                  </p>

                  {/* Action Plan steps */}
                  {record.actionPlan && record.actionPlan.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {record.actionPlan.map((step, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                          &bull; {step}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>Supervisor: <strong className="text-slate-600">{record.facultyName}</strong></span>
                    <span>&middot;</span>
                    <span>Logged: {record.createdAt}</span>
                    <span>&middot;</span>
                    <span>Next Review: <strong className="text-slate-700">{record.nextFollowUpDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                <select
                  value={record.status}
                  onChange={(e) => onUpdateInterventionStatus(student.id, record.id, e.target.value as any)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold border cursor-pointer ${
                    record.status === 'completed' || record.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : record.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="resolved">Resolved</option>
                </select>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
