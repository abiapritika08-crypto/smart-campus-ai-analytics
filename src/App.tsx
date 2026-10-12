import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { Student, InterventionRecord, MentorNote, InterventionStatus, SegmentType } from './types/student';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { RosterView } from './components/RosterView';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { SegmentationView } from './components/SegmentationView';
import { PlacementHubView } from './components/PlacementHubView';
import { InterventionsView } from './components/InterventionsView';
import { CopilotView } from './components/CopilotView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ExportReportModal } from './components/ExportReportModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'campuscare_students_data_v1';

export default function App() {
  // Students state with localStorage hydration
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics calculations
  const highRiskCount = students.filter(s => s.riskAnalysis.riskTier === 'high').length;
  const activeInterventionsCount = students.reduce(
    (acc, s) => acc + s.interventions.filter(i => i.status === 'in_progress' || i.status === 'scheduled').length,
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
        interventions: [created, ...s.interventions],
      };
    }));
    
    // Also update selected student if open
    setSelectedStudent(prev => {
      if (!prev || prev.id !== studentId) return prev;
      const created: InterventionRecord = {
        ...newIntervention,
        id: `int-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...prev,
        interventions: [created, ...prev.interventions],
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
        mentorNotes: [noteRecord, ...s.mentorNotes],
      };
    }));

    setSelectedStudent(prev => {
      if (!prev || prev.id !== studentId) return prev;
      return {
        ...prev,
        mentorNotes: [noteRecord, ...prev.mentorNotes],
      };
    });

    showToast('Confidential mentor note recorded.');
  };

  const handleUpdateInterventionStatus = (studentId: string, interventionId: string, status: InterventionStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        interventions: s.interventions.map(i => i.id === interventionId ? { ...i, status } : i),
      };
    }));
    showToast(`Intervention status updated to ${status.toUpperCase()}.`);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Enrolled ${newStudent.name} into cohort.`);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all student data to the default university benchmark cohort?')) {
      setStudents(INITIAL_STUDENTS);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Cohort data reset to initial benchmark records.');
    }
  };

  const handleBatchAction = (actionType: string, selectedIds: string[]) => {
    if (actionType === 'remedial_session') {
      showToast(`Group remedial session scheduled for ${selectedIds.length} students.`);
    } else if (actionType === 'attendance_warning') {
      showToast(`Statutory attendance warning letters queued for ${selectedIds.length} students.`);
    } else if (actionType === 'export_selected') {
      showToast(`Exported roster data for ${selectedIds.length} selected students.`);
    }
  };

  const handleLaunchGroupIntervention = (segment: SegmentType, segmentStudents: Student[]) => {
    showToast(`Batch intervention plan initiated for ${segmentStudents.length} students in "${segment.replace('_', ' ')}".`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Platform Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onOpenExportReport={() => setIsExportReportOpen(true)}
        onOpenCopilot={() => setActiveTab('copilot')}
        onResetData={handleResetData}
        totalStudents={students.length}
        highRiskCount={highRiskCount}
      />

      {/* Navigation Sub-header Bar */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        highRiskCount={highRiskCount}
        activeInterventionsCount={activeInterventionsCount}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Strip (visible across all views) */}
        <MetricCards
          students={students}
          onSelectRiskFilter={(tier) => {
            setActiveTab('risk');
          }}
          onSelectPlacementFilter={(tier) => {
            setActiveTab('placement');
          }}
          onSelectAttendanceFilter={(filter) => {
            setActiveTab('roster');
          }}
        />

        {/* View Routing */}
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            onSelectStudent={setSelectedStudent}
            onNavigateToRisk={() => setActiveTab('risk')}
            onNavigateToInterventions={() => setActiveTab('interventions')}
            onQuickAction={(action, student) => setSelectedStudent(student)}
          />
        )}

        {activeTab === 'roster' && (
          <RosterView
            students={students}
            onSelectStudent={setSelectedStudent}
            onOpenEmailModal={(student) => {
              setSelectedStudent(student);
            }}
            onOpenInterventionModal={(student) => {
              setSelectedStudent(student);
            }}
            onBatchAction={handleBatchAction}
          />
        )}

        {activeTab === 'risk' && (
          <RiskAnalysisView
            students={students}
            onSelectStudent={setSelectedStudent}
            onOpenInterventionModal={(student) => setSelectedStudent(student)}
          />
        )}

        {activeTab === 'segmentation' && (
          <SegmentationView
            students={students}
            onSelectStudent={setSelectedStudent}
            onLaunchGroupIntervention={handleLaunchGroupIntervention}
          />
        )}

        {activeTab === 'placement' && (
          <PlacementHubView
            students={students}
            onSelectStudent={setSelectedStudent}
            onOpenInterventionModal={(student) => setSelectedStudent(student)}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionsView
            students={students}
            onSelectStudent={setSelectedStudent}
            onOpenNewInterventionModal={() => {
              if (students.length > 0) setSelectedStudent(students[0]);
            }}
            onUpdateInterventionStatus={handleUpdateInterventionStatus}
          />
        )}

        {activeTab === 'copilot' && (
          <CopilotView
            students={students}
            onSelectStudent={setSelectedStudent}
            onOpenExportReport={() => setIsExportReportOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            CampusCare AI &middot; Institutional Academic Success & Early Warning System
          </p>
          <p className="text-[11px] text-slate-400">
            Compliant with University Statutory Attendance Regulations &middot; Fall 2026 Term
          </p>
        </div>
      </footer>

      {/* Deep-Dive Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAddIntervention={handleAddIntervention}
        onAddMentorNote={handleAddMentorNote}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        students={students}
      />

      {/* Toast Notification Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
