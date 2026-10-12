import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { Student } from '../types/student';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState(5);
  const [section, setSection] = useState('A');
  const [cgpa, setCgpa] = useState(7.5);
  const [attendance, setAttendance] = useState(78);
  const [primaryBottleneck, setPrimaryBottleneck] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;

    // Compute automatic risk score based on attendance and CGPA
    const attRisk = Math.max(0, 100 - attendance);
    const cgpaRisk = Math.max(0, (10 - cgpa) * 10);
    const riskScore = Math.round(attRisk * 0.5 + cgpaRisk * 0.5);

    let riskTier: any = 'low';
    if (riskScore >= 65) riskTier = 'high';
    else if (riskScore >= 40) riskTier = 'moderate';
    else if (riskScore <= 15 && cgpa >= 8.5) riskTier = 'high_achiever';

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      rollNo,
      name,
      email: email || `${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      department,
      semester: Number(semester),
      section,
      batch: '2023-2027',
      advisor: 'Dr. Eleanor Vance',
      cgpa: Number(cgpa),
      currentGpa: Number(cgpa),
      creditsCompleted: 60,
      totalCredits: 160,
      overallAttendance: Number(attendance),
      attendanceHistory: [
        { week: 1, date: 'Aug 10', rate: attendance, classesAttended: 20, totalClasses: 25 },
        { week: 2, date: 'Aug 17', rate: attendance, classesAttended: 20, totalClasses: 25 },
        { week: 3, date: 'Aug 24', rate: attendance, classesAttended: 20, totalClasses: 25 },
      ],
      coursePerformances: [
        {
          courseCode: 'CS301',
          courseName: 'Core Engineering Fundamentals',
          credits: 4,
          faculty: 'Dr. Eleanor Vance',
          attendance: Number(attendance),
          internal1: Math.round(cgpa * 2.5),
          internal1Max: 30,
          internal2: Math.round(cgpa * 2.4),
          internal2Max: 30,
          quizAvg: Math.round(cgpa * 8.5),
          assignmentScore: 75,
          currentGradeEstimate: cgpa >= 8.5 ? 'A' : cgpa >= 7 ? 'B' : 'C',
          status: attendance < 75 ? 'critical' : 'on_track',
        },
      ],
      assignments: [
        {
          id: `asg-${Date.now()}`,
          courseCode: 'CS301',
          courseName: 'Core Fundamentals',
          title: 'Laboratory Problem Set 1',
          dueDate: '2026-10-15',
          status: 'submitted_on_time',
          score: 85,
          maxScore: 100,
        },
      ],
      riskAnalysis: {
        overallRiskScore: riskScore,
        riskTier,
        primaryFactors: [
          attendance < 75 ? `Attendance below 75% limit (${attendance}%)` : 'Normal course progression',
          primaryBottleneck ? `Student focus area: ${primaryBottleneck}` : 'No immediate backlogs recorded',
        ],
        attendanceRisk: attendance < 70 ? 'critical' : attendance < 75 ? 'warning' : 'normal',
        academicTrend: 'stagnant',
        assignmentCompletionRate: 85,
        consecutiveAbsences: attendance < 75 ? 2 : 0,
      },
      segmentation: {
        primarySegment: attendance < 70 ? 'urgent_mentoring' : cgpa >= 8.5 ? 'honors_research' : 'placement_coaching',
        secondaryTags: ['New Cohort Enrollee'],
      },
      placementReadiness: {
        overallScore: Math.round(cgpa * 8.5),
        tier: cgpa >= 8.0 ? 'tier1_dream' : cgpa >= 6.5 ? 'tier2_core' : 'needs_coaching',
        technicalProficiency: Math.round(cgpa * 8),
        mockInterviewScore: 65,
        codingSkillScore: Math.round(cgpa * 8.2),
        softSkillsScore: 75,
        resumeStatus: 'under_review',
        internshipsCount: 0,
        activeBacklogs: 0,
        strengths: ['Enthusiastic new enrollee'],
        growthAreas: ['Continuous evaluation pacing'],
      },
      interventions: [],
      mentorNotes: [],
    };

    onAddStudent(newStudent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-slate-900">Enroll New Student in CampusCare AI</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Lee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Roll Number / ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS2023-099"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Comm.">Electronics & Comm.</option>
                <option value="Mechanical">Mechanical</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={3}>Semester 3</option>
                <option value={5}>Semester 5</option>
                <option value={7}>Semester 7</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Cumulative GPA (out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Current Attendance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Initial Advisor Observation (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Struggles with early morning classes, interested in robotics"
              value={primaryBottleneck}
              onChange={(e) => setPrimaryBottleneck(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
            >
              Add to Cohort Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
