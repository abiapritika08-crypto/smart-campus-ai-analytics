import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { Student, InterventionRecord, MentorNote, InterventionStatus, SegmentType } from './types/student';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RosterView } from './components/RosterView';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { SegmentationView } from './components/SegmentationView';
import { PlacementHubView } from './components/PlacementHubView';
import { InterventionsView } from './components/InterventionsView';
import { CopilotView } from './components/CopilotView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ExportReportModal } from './components/ExportReportModal';
import { CheckCircle2, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'campuscare_students_data_v3';

// Bulletproof sanitizer to guarantee no undefined/null properties crash the app
function sanitizeStudent(s: any, fallbackIdx = 0): Student {
  const fallback = INITIAL_STUDENTS[fallbackIdx % INITIAL_STUDENTS.length] || INITIAL_STUDENTS[0];
  if (!s || typeof s !== 'object') return fallback;

  return {
    id: s.id || `stu-${Date.now()}-${fallbackIdx}`,
    rollNo: s.rollNo || fallback.rollNo,
    name: s.name || fallback.name,
    email: s.email || fallback.email,
    avatar: s.avatar || fallback.avatar,
    department: s.department || fallback.department,
    semester: typeof s.semester === 'number' ? s.semester : fallback.semester,
    section: s.section || fallback.section,
    batch: s.batch || fallback.batch,
    advisor: s.advisor || fallback.advisor,
    cgpa: typeof s.cgpa === 'number' ? s.cgpa : fallback.cgpa,
    currentGpa: typeof s.currentGpa === 'number' ? s.currentGpa : fallback.currentGpa,
    creditsCompleted: typeof s.creditsCompleted === 'number' ? s.creditsCompleted : fallback.creditsCompleted,
    totalCredits: typeof s.totalCredits === 'number' ? s.totalCredits : fallback.totalCredits,
    overallAttendance: typeof s.overallAttendance === 'number' ? s.overallAttendance : fallback.overallAttendance,
    attendanceHistory: Array.isArray(s.attendanceHistory) && s.attendanceHistory.length > 0 ? s.attendanceHistory : fallback.attendanceHistory,
    coursePerformances: Array.isArray(s.coursePerformances) && s.coursePerformances.length > 0 ? s.coursePerformances : fallback.coursePerformances,
    assignments: Array.isArray(s.assignments) ? s.assignments : fallback.assignments,
    riskAnalysis: {
      overallRiskScore: typeof s.riskAnalysis?.overallRiskScore === 'number' ? s.riskAnalysis.overallRiskScore : fallback.riskAnalysis.overallRiskScore,
      riskTier: s.riskAnalysis?.riskTier || fallback.riskAnalysis.riskTier,
      primaryFactors: Array.isArray(s.riskAnalysis?.primaryFactors) ? s.riskAnalysis.primaryFactors : fallback.riskAnalysis.primaryFactors,
      attendanceRisk: s.riskAnalysis?.attendanceRisk || fallback.riskAnalysis.attendanceRisk,
      academicTrend: s.riskAnalysis?.academicTrend || fallback.riskAnalysis.academicTrend,
      scoreDropPercent: typeof s.riskAnalysis?.scoreDropPercent === 'number' ? s.riskAnalysis.scoreDropPercent : fallback.riskAnalysis.scoreDropPercent,
      assignmentCompletionRate: typeof s.riskAnalysis?.assignmentCompletionRate === 'number' ? s.riskAnalysis.assignmentCompletionRate : fallback.riskAnalysis.assignmentCompletionRate,
      consecutiveAbsences: typeof s.riskAnalysis?.consecutiveAbsences === 'number' ? s.riskAnalysis.consecutiveAbsences : fallback.riskAnalysis.consecutiveAbsences,
    },
    segmentation: {
      primarySegment: s.segmentation?.primarySegment || fallback.segmentation.primarySegment,
      secondaryTags: Array.isArray(s.segmentation?.secondaryTags) ? s.segmentation.secondaryTags : fallback.segmentation.secondaryTags,
    },
    placementReadiness: {
      overallScore: typeof s.placementReadiness?.overallScore === 'number' ? s.placementReadiness.overallScore : fallback.placementReadiness.overallScore,
      tier: s.placementReadiness?.tier || fallback.placementReadiness.tier,
      technicalProficiency: typeof s.placementReadiness?.technicalProficiency === 'number' ? s.placementReadiness.technicalProficiency : fallback.placementReadiness.technicalProficiency,
      mockInterviewScore: typeof s.placementReadiness?.mockInterviewScore === 'number' ? s.placementReadiness.mockInterviewScore : fallback.placementReadiness.mockInterviewScore,
      codingSkillScore: typeof s.placementReadiness?.codingSkillScore === 'number' ? s.placementReadiness.codingSkillScore : fallback.placementReadiness.codingSkillScore,
      softSkillsScore: typeof s.placementReadiness?.softSkillsScore === 'number' ? s.placementReadiness.softSkillsScore : fallback.placementReadiness.softSkillsScore,
      resumeStatus: s.placementReadiness?.resumeStatus || fallback.placementReadiness.resumeStatus,
      internshipsCount: typeof s.placementReadiness?.internshipsCount === 'number' ? s.placementReadiness.internshipsCount : fallback.placementReadiness.internshipsCount,
      activeBacklogs: typeof s.placementReadiness?.activeBacklogs === 'number' ? s.placementReadiness.activeBacklogs : fallback.placementReadiness.activeBacklogs,
      strengths: Array.isArray(s.placementReadiness?.strengths) ? s.placementReadiness.strengths : fallback.placementReadiness.strengths,
      growthAreas: Array.isArray(s.placementReadiness?.growthAreas) ? s.placementReadiness.growthAreas : fallback.placementReadiness.growthAreas,
    },
    interventions: Array.isArray(s.interventions) ? s.interventions : [],
    mentorNotes: Array.isArray(s.mentorNotes) ? s.mentorNotes : [],
  };
}

export default function App() {
  // Students state with resilient localStorage hydration
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('campuscare_students_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => sanitizeStudent(s, idx));
        }
      }
    } catch (e) {
      console.error('Failed to load students from localStorage:', e);
    }
    return INITIAL_STUDENTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage:', e);
    }
  }, [students]);

  // Sidebar navigation and layout states
  const [currentTab, setCurrentTab] = useState<SidebarTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Search & Modals state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics calculations
  const highRiskCount = students.filter(s => s.riskAnalysis?.riskTier === 'high').length;
  const activeInterventionsCount = students.reduce(
    (acc, s) => acc + (s.interventions || []).filter(i => i.status === 'in_progress' || i.status === 'scheduled').length,
    0
  );

  // Handlers for student data mutations
  const handleAddIntervention = (studentId: string, newIntervention: Omit<InterventionRecord, 'id' | 'createdAt'>) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const created: InterventionRecord = {
        ...newIntervention,
        id: `int-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...s,
        interventions: [created, ...(s.interventions || [])],
      };
    }));
    
    setSelectedStudent(prev => {
      if (!prev || prev.id !== studentId) return prev;
      const created: InterventionRecord = {
        ...newIntervention,
        id: `int-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...prev,
        interventions: [created, ...(prev.interventions || [])],
      };
    });

    showToast('Intervention action logged successfully.');
  };

  const handleAddMentorNote = (studentId: string, newNote: Omit<MentorNote, 'id' | 'date'>) => {
    const noteRecord: MentorNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        mentorNotes: [noteRecord, ...(s.mentorNotes || [])],
      };
    }));

    setSelectedStudent(prev => {
      if (!prev || prev.id !== studentId) return prev;
      return {
        ...prev,
        mentorNotes: [noteRecord, ...(prev.mentorNotes || [])],
      };
    });

    showToast('Confidential mentor note recorded.');
  };

  const handleUpdateInterventionStatus = (studentId: string, interventionId: string, status: InterventionStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        interventions: (s.interventions || []).map(i => i.id === interventionId ? { ...i, status } : i),
      };
    }));
    showToast(`Intervention status updated to ${status.toUpperCase()}.`);
  };

  const handleAddStudent = (newStudent: Student) => {
    const safeStudent = sanitizeStudent(newStudent);
    setStudents(prev => [safeStudent, ...prev]);
    showToast(`Enrolled ${safeStudent.name} into cohort.`);
  };

  const handleResetDataConfirmed = () => {
    setStudents(INITIAL_STUDENTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('campuscare_students_data_v2');
      localStorage.removeItem('campuscare_students_data_v1');
    } catch (e) {}
    setShowResetConfirmModal(false);
    showToast('Cohort data reset to initial benchmark records.');
  };

  const handleBatchAction = (actionType: string, selectedIds: string[]) => {
    if (actionType === 'remedial_session') {
      showToast(`Group remedial session scheduled for ${selectedIds.length} students.`);
    } else if (actionType === 'attendance_warning') {
      showToast(`Statutory attendance warning notices queued for ${selectedIds.length} students.`);
    } else if (actionType === 'export_selected') {
      showToast(`Exported roster data for ${selectedIds.length} selected students.`);
    }
  };

  const handleLaunchGroupIntervention = (segment: SegmentType, segmentStudents: Student[]) => {
    showToast(`Batch intervention plan initiated for ${segmentStudents.length} students in "${segment.replace('_', ' ')}".`);
  };

  // Compute Page Title and Breadcrumbs based on active tab
  const getPageMeta = () => {
    switch (currentTab) {
      case 'overview':
        return { title: 'Student Success Overview', breadcrumbs: ['CampusCare AI', 'Dashboard', 'Overview'] };
      case 'roster':
        return { title: 'Student Directory', breadcrumbs: ['CampusCare AI', 'Academics', 'Directory'] };
      case 'risk':
        return { title: 'Risk Early Warning System', breadcrumbs: ['CampusCare AI', 'Analytics', 'Early Warning'] };
      case 'interventions':
        return { title: 'Interventions & Action Plans', breadcrumbs: ['CampusCare AI', 'Remediation', 'Interventions'] };
      case 'segmentation':
        return { title: 'Cohort Segmentation', breadcrumbs: ['CampusCare AI', 'Clustering', 'Segments'] };
      case 'placement':
        return { title: 'Placement Readiness Hub', breadcrumbs: ['CampusCare AI', 'Corporate Relations', 'Placement'] };
      case 'reports':
        return { title: 'Academic Reports & Exports', breadcrumbs: ['CampusCare AI', 'Compliance', 'Reports'] };
      case 'settings':
        return { title: 'Institutional Settings & Policies', breadcrumbs: ['CampusCare AI', 'System', 'Settings'] };
      case 'copilot':
        return { title: 'Faculty AI Copilot', breadcrumbs: ['CampusCare AI', 'Assistance', 'Copilot'] };
      default:
        return { title: 'Dashboard', breadcrumbs: ['CampusCare AI', 'Dashboard'] };
    }
  };

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex relative selection:bg-blue-600/20 selection:text-blue-900">
      
      {/* 1. Fixed, Collapsible Deep Navy Sidebar (Left) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        highRiskCount={highRiskCount}
        activeInterventionsCount={activeInterventionsCount}
      />

      {/* 2. Main Content Area (Offset by sidebar width on desktop) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        
        {/* Top Navigation Bar */}
        <Header
          pageTitle={pageMeta.title}
          breadcrumbs={pageMeta.breadcrumbs}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectStudent={setSelectedStudent}
          students={students}
          onOpenCopilot={() => setCurrentTab('copilot')}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          onOpenExportReport={() => setIsExportReportOpen(true)}
          onOpenSettings={() => setCurrentTab('settings')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          highRiskCount={highRiskCount}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Active View Routing */}
          {currentTab === 'overview' && (
            <DashboardView
              students={students}
              onSelectStudent={setSelectedStudent}
              onNavigateToRisk={() => setCurrentTab('risk')}
              onNavigateToInterventions={() => setCurrentTab('interventions')}
              onNavigateToPlacement={() => setCurrentTab('placement')}
              onNavigateToRoster={() => setCurrentTab('roster')}
              onNavigateToCopilot={() => setCurrentTab('copilot')}
              onOpenInterventionWithStudent={(student) => setSelectedStudent(student)}
            />
          )}

          {currentTab === 'roster' && (
            <RosterView
              students={students}
              onSelectStudent={setSelectedStudent}
              onOpenEmailModal={(student) => setSelectedStudent(student)}
              onOpenInterventionModal={(student) => setSelectedStudent(student)}
              onBatchAction={handleBatchAction}
            />
          )}

          {currentTab === 'risk' && (
            <RiskAnalysisView
              students={students}
              onSelectStudent={setSelectedStudent}
              onOpenInterventionModal={(student) => setSelectedStudent(student)}
            />
          )}

          {currentTab === 'segmentation' && (
            <SegmentationView
              students={students}
              onSelectStudent={setSelectedStudent}
              onLaunchGroupIntervention={handleLaunchGroupIntervention}
            />
          )}

          {currentTab === 'placement' && (
            <PlacementHubView
              students={students}
              onSelectStudent={setSelectedStudent}
              onOpenInterventionModal={(student) => setSelectedStudent(student)}
            />
          )}

          {currentTab === 'interventions' && (
            <InterventionsView
              students={students}
              onSelectStudent={setSelectedStudent}
              onOpenNewInterventionModal={() => {
                if (students.length > 0) setSelectedStudent(students[0]);
              }}
              onUpdateInterventionStatus={handleUpdateInterventionStatus}
            />
          )}

          {currentTab === 'copilot' && (
            <CopilotView
              students={students}
              onSelectStudent={setSelectedStudent}
              onOpenExportReport={() => setIsExportReportOpen(true)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              students={students}
              onOpenExportModal={() => setIsExportReportOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onResetData={() => setShowResetConfirmModal(true)}
            />
          )}

        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="font-semibold text-slate-700">CampusCare AI</span>
              <span>&middot;</span>
              <span>AI-Powered Student Analytics and Success Platform</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Fall 2026 Academic Term</span>
              <span>&bull;</span>
              <span>Benchmark Attendance Target: 75%</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Deep-Dive Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onAddIntervention={handleAddIntervention}
          onAddMentorNote={handleAddMentorNote}
        />
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {/* Export Report Modal */}
      {isExportReportOpen && (
        <ExportReportModal
          isOpen={isExportReportOpen}
          onClose={() => setIsExportReportOpen(false)}
          students={students}
        />
      )}

      {/* In-App Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Reset Cohort Data to Default?</h3>
            <p className="text-xs text-center text-slate-500 mt-2 leading-relaxed">
              This will restore all student records, risk scores, attendance logs, and mock benchmark datasets to their verified institutional starting state.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDataConfirmed}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
