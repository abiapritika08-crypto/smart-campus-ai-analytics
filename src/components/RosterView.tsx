import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  Mail, 
  Sparkles, 
  Download, 
  CheckSquare, 
  Square,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Grid,
  List,
  UserCheck
} from 'lucide-react';
import { Student, RiskTier, SegmentType, PlacementTier } from '../types/student';

interface RosterViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenEmailModal: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
  onBatchAction: (actionType: string, selectedIds: string[]) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  students,
  onSelectStudent,
  onOpenEmailModal,
  onOpenInterventionModal,
  onBatchAction,
}) => {
  // Local filter states
  const [department, setDepartment] = useState<string>('all');
  const [semester, setSemester] = useState<string>('all');
  const [riskTier, setRiskTier] = useState<string>('all');
  const [segment, setSegment] = useState<string>('all');
  const [attendanceCutoff, setAttendanceCutoff] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'risk' | 'attendance' | 'cgpa' | 'name'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Unique filters
  const departments = Array.from(new Set(students.map(s => s.department)));
  const semesters = Array.from(new Set(students.map(s => s.semester))).sort();

  // Filtered & sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        if (department !== 'all' && s.department !== department) return false;
        if (semester !== 'all' && s.semester.toString() !== semester) return false;
        if (riskTier !== 'all' && s.riskAnalysis.riskTier !== riskTier) return false;
        if (segment !== 'all' && s.segmentation.primarySegment !== segment) return false;
        if (attendanceCutoff === 'below75' && s.overallAttendance >= 75) return false;
        if (attendanceCutoff === 'below60' && s.overallAttendance >= 60) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchRoll = s.rollNo.toLowerCase().includes(q);
          const matchEmail = s.email.toLowerCase().includes(q);
          const matchCourse = s.coursePerformances.some(c => c.courseName.toLowerCase().includes(q) || c.courseCode.toLowerCase().includes(q));
          if (!matchName && !matchRoll && !matchEmail && !matchCourse) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === 'risk') {
          valA = a.riskAnalysis.overallRiskScore;
          valB = b.riskAnalysis.overallRiskScore;
        } else if (sortBy === 'attendance') {
          valA = a.overallAttendance;
          valB = b.overallAttendance;
        } else if (sortBy === 'cgpa') {
          valA = a.cgpa;
          valB = b.cgpa;
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [students, department, semester, riskTier, segment, attendanceCutoff, search, sortBy, sortOrder]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Helper labels
  const getRiskBadge = (tier: RiskTier, score: number) => {
    switch (tier) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High ({score})
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Moderate ({score})
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200">
            On Track ({score})
          </span>
        );
      case 'high_achiever':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            High Achiever ({score})
          </span>
        );
    }
  };

  const getSegmentLabel = (type: SegmentType) => {
    switch (type) {
      case 'urgent_mentoring':
        return 'Urgent Mentoring';
      case 'concept_remediation':
        return 'Concept Remediation';
      case 'assignment_recovery':
        return 'Assignment Recovery';
      case 'placement_coaching':
        return 'Placement Track';
      case 'honors_research':
        return 'Honors & Research';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        
        {/* Top Controls: Search, View Mode, Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, roll number, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-4 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Card grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="risk">Risk Score</option>
                <option value="attendance">Attendance</option>
                <option value="cgpa">CGPA</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 text-slate-700 cursor-pointer"
                title={`Order: ${sortOrder}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* Department */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Semesters</option>
              {semesters.map(s => (
                <option key={s} value={s.toString()}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Risk Category</label>
            <select
              value={riskTier}
              onChange={(e) => setRiskTier(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk (&gt; 65)</option>
              <option value="moderate">Moderate (40 - 65)</option>
              <option value="low">On Track (20 - 39)</option>
              <option value="high_achiever">High Achievers (&lt; 20)</option>
            </select>
          </div>

          {/* Attendance Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Attendance Cutoff</label>
            <select
              value={attendanceCutoff}
              onChange={(e) => setAttendanceCutoff(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Attendance</option>
              <option value="below75">Below 75% (Statutory Bar)</option>
              <option value="below60">Below 60% (Critical)</option>
            </select>
          </div>

          {/* Segmentation */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Segmentation</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Segments</option>
              <option value="urgent_mentoring">Urgent Mentoring</option>
              <option value="concept_remediation">Concept Remediation</option>
              <option value="assignment_recovery">Assignment Recovery</option>
              <option value="placement_coaching">Placement Track</option>
              <option value="honors_research">Honors & Research</option>
            </select>
          </div>

        </div>

        {/* Active Filters Reset & Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of {students.length} students
          </span>
          {(department !== 'all' || semester !== 'all' || riskTier !== 'all' || segment !== 'all' || attendanceCutoff !== 'all' || search) && (
            <button
              onClick={() => {
                setDepartment('all');
                setSemester('all');
                setRiskTier('all');
                setSegment('all');
                setAttendanceCutoff('all');
                setSearch('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

      </div>

      {/* Batch Action Bar if items selected */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
              {selectedStudentIds.length} Selected
            </span>
            <span className="text-slate-300">Choose batch action for cohort:</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onBatchAction('remedial_session', selectedStudentIds)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              Schedule Group Remedial Class
            </button>
            <button
              onClick={() => onBatchAction('attendance_warning', selectedStudentIds)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              Send Attendance Notice
            </button>
            <button
              onClick={() => onBatchAction('export_selected', selectedStudentIds)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              Export Selected
            </button>
            <button
              onClick={() => setSelectedStudentIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-8">
                    <button
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Select all"
                    >
                      {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Student Name & Roll No</th>
                  <th className="py-3 px-3">Dept & Sem</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">CGPA / GPA</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3">Primary Segment</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No students match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    const isDebarRisk = student.overallAttendance < 75;

                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleSelectStudent(student.id)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Student Name */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <button
                                onClick={() => onSelectStudent(student)}
                                className="font-semibold text-slate-900 hover:text-emerald-600 cursor-pointer text-left block"
                              >
                                {student.name}
                              </button>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {student.rollNo}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Dept & Sem */}
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800">{student.department}</span>
                          <span className="block text-[11px] text-slate-500">
                            Sem {student.semester} &middot; Sec {student.section}
                          </span>
                        </td>

                        {/* Attendance */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  student.overallAttendance >= 75
                                    ? 'bg-emerald-500'
                                    : student.overallAttendance >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${student.overallAttendance}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${isDebarRisk ? 'text-amber-700' : 'text-slate-800'}`}>
                              {student.overallAttendance}%
                            </span>
                          </div>
                          {isDebarRisk && (
                            <span className="text-[10px] text-amber-600 block mt-0.5 font-medium">
                              Below 75% limit
                            </span>
                          )}
                        </td>

                        {/* CGPA */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-900">{student.cgpa.toFixed(2)}</span>
                          <span className="text-slate-400 text-[11px] block">
                            Curr: {student.currentGpa.toFixed(2)}
                          </span>
                        </td>

                        {/* Risk Tier */}
                        <td className="py-3 px-3">
                          {getRiskBadge(student.riskAnalysis.riskTier, student.riskAnalysis.overallRiskScore)}
                        </td>

                        {/* Segment */}
                        <td className="py-3 px-3">
                          <span className="text-slate-700 font-medium">
                            {getSegmentLabel(student.segmentation.primarySegment)}
                          </span>
                          <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                            {student.segmentation.secondaryTags[0]}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenEmailModal(student)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Draft personalized empathetic email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectStudent(student)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            >
                              <span>Dossier</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 
                        onClick={() => onSelectStudent(student)}
                        className="font-semibold text-sm text-slate-900 hover:text-emerald-600 cursor-pointer"
                      >
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{student.rollNo}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{student.department} &middot; Sem {student.semester}</p>
                    </div>
                  </div>
                  <div>
                    {getRiskBadge(student.riskAnalysis.riskTier, student.riskAnalysis.overallRiskScore)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center mb-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Attendance</span>
                    <span className={`text-xs font-semibold ${student.overallAttendance < 75 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {student.overallAttendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">CGPA</span>
                    <span className="text-xs font-semibold text-slate-800">{student.cgpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Backlogs</span>
                    <span className={`text-xs font-semibold ${student.placementReadiness.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {student.placementReadiness.activeBacklogs}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic line-clamp-2 mb-3">
                  &quot;{student.riskAnalysis.primaryFactors[0]}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenEmailModal(student)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Email</span>
                </button>
                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
