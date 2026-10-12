export type RiskTier = 'high' | 'moderate' | 'low' | 'high_achiever';

export type SegmentType = 
  | 'urgent_mentoring' 
  | 'concept_remediation' 
  | 'assignment_recovery' 
  | 'placement_coaching' 
  | 'honors_research';

export type PlacementTier = 'tier1_dream' | 'tier2_core' | 'needs_coaching' | 'not_eligible';

export type InterventionType = 
  | 'mentoring_1on1' 
  | 'remedial_tutoring' 
  | 'assignment_extension' 
  | 'parent_conference' 
  | 'placement_coaching' 
  | 'peer_study_group';

export type InterventionStatus = 'scheduled' | 'in_progress' | 'completed' | 'resolved';

export interface AttendanceWeek {
  week: number;
  date: string;
  rate: number; // percentage
  classesAttended: number;
  totalClasses: number;
}

export interface CoursePerformance {
  courseCode: string;
  courseName: string;
  credits: number;
  faculty: string;
  attendance: number;
  internal1: number; // scored
  internal1Max: number;
  internal2: number;
  internal2Max: number;
  quizAvg: number;
  assignmentScore: number;
  currentGradeEstimate: string;
  status: 'on_track' | 'needs_attention' | 'critical';
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  dueDate: string;
  submittedDate?: string;
  status: 'submitted_on_time' | 'submitted_late' | 'pending' | 'missing';
  score?: number;
  maxScore: number;
}

export interface InterventionRecord {
  id: string;
  createdAt: string;
  facultyName: string;
  type: InterventionType;
  status: InterventionStatus;
  title: string;
  notes: string;
  actionPlan: string[];
  nextFollowUpDate: string;
  outcomeMetric?: {
    metricName: string;
    beforeValue: number | string;
    afterValue: number | string;
  };
}

export interface MentorNote {
  id: string;
  date: string;
  author: string;
  content: string;
  category: 'academic' | 'behavioral' | 'personal' | 'placement';
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  semester: number;
  section: string;
  batch: string;
  advisor: string;
  
  // Academic Metrics
  cgpa: number; // scale of 10.0
  currentGpa: number;
  creditsCompleted: number;
  totalCredits: number;
  overallAttendance: number; // %
  attendanceHistory: AttendanceWeek[];
  coursePerformances: CoursePerformance[];
  assignments: AssignmentItem[];

  // Risk Engine
  riskAnalysis: {
    overallRiskScore: number; // 0 - 100
    riskTier: RiskTier;
    primaryFactors: string[];
    attendanceRisk: 'critical' | 'warning' | 'normal';
    academicTrend: 'declining' | 'stagnant' | 'improving';
    assignmentCompletionRate: number; // %
    consecutiveAbsences: number;
    scoreDropPercent?: number; // e.g. 24% drop from int1 to int2
  };

  // Segmentation
  segmentation: {
    primarySegment: SegmentType;
    secondaryTags: string[];
  };

  // Placement Readiness
  placementReadiness: {
    overallScore: number; // 0-100
    tier: PlacementTier;
    technicalProficiency: number;
    mockInterviewScore: number;
    codingSkillScore: number;
    softSkillsScore: number;
    resumeStatus: 'approved' | 'under_review' | 'needs_revision';
    internshipsCount: number;
    activeBacklogs: number;
    strengths: string[];
    growthAreas: string[];
  };

  // Interventions & Notes
  interventions: InterventionRecord[];
  mentorNotes: MentorNote[];
}

export interface CohortFilters {
  department: string;
  semester: string; // 'all' or number
  section: string;
  riskTier: string; // 'all' or RiskTier
  segment: string; // 'all' or SegmentType
  placementTier: string; // 'all' or PlacementTier
  attendanceFilter: string; // 'all', 'below75', 'below60'
  searchQuery: string;
}
