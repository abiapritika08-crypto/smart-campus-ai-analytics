import React, { useState, useMemo } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Briefcase, 
  ArrowUpRight, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  HeartHandshake, 
  GraduationCap, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Info,
  ChevronDown,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Student, RiskTier } from '../types/student';
import { AcademicPerformanceTrend } from './AcademicPerformanceTrend';
import { StudentRiskTierPieChart } from './StudentRiskTierPieChart';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigateToRisk: () => void;
  onNavigateToInterventions: () => void;
  onNavigateToPlacement: () => void;
  onNavigateToRoster: () => void;
  onNavigateToCopilot: () => void;
  onOpenInterventionWithStudent?: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onNavigateToRisk,
  onNavigateToInterventions,
  onNavigateToPlacement,
  onNavigateToRoster,
  onNavigateToCopilot,
  onOpenInterventionWithStudent,
}) => {
  // Table search & filter states
  const [tableSearch, setTableSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [sortField, setSortField] = useState<'attendance' | 'riskScore' | 'name'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 1. Dynamic Calculations from existing student data
  const totalStudents = students.length;
  
  const highRiskStudents = useMemo(() => 
    students.filter(s => s.riskAnalysis?.riskTier === 'high'), 
    [students]
  );
  
  const moderateRiskStudents = useMemo(() => 
    students.filter(s => s.riskAnalysis?.riskTier === 'moderate'), 
    [students]
  );

  const lowRiskStudents = useMemo(() => 
    students.filter(s => 
      s.riskAnalysis?.riskTier === 'low' || 
      s.riskAnalysis?.riskTier === 'high_achiever' ||
      ((s.riskAnalysis?.overallRiskScore ?? 0) < 35 && s.riskAnalysis?.riskTier !== 'high' && s.riskAnalysis?.riskTier !== 'moderate')
    ), 
    [students]
  );

  const averageAttendance = useMemo(() => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (s.overallAttendance || 0), 0);
    return Math.round((sum / students.length) * 10) / 10;
  }, [students]);

  const placementReadyStudents = useMemo(() => 
    students.filter(s => 
      s.placementReadiness?.tier === 'tier1_dream' || 
      s.placementReadiness?.tier === 'tier2_core'
    ), 
    [students]
  );

  // Attendance Category Segmentation
  // On Track: >= 75% | At Risk: 65% - 74.9% | Critical: < 65%
  const attendanceBreakdown = useMemo(() => {
    const onTrack = students.filter(s => (s.overallAttendance || 0) >= 75);
    const atRisk = students.filter(s => (s.overallAttendance || 0) >= 65 && (s.overallAttendance || 0) < 75);
    const critical = students.filter(s => (s.overallAttendance || 0) < 65);

    return {
      onTrack: { count: onTrack.length, percent: Math.round((onTrack.length / (students.length || 1)) * 100) },
      atRisk: { count: atRisk.length, percent: Math.round((atRisk.length / (students.length || 1)) * 100) },
      critical: { count: critical.length, percent: Math.round((critical.length / (students.length || 1)) * 100) },
    };
  }, [students]);

  // Students Needing Attention (High and Moderate risk or critical attendance, or filtered tier)
  const studentsNeedingAttention = useMemo(() => {
    let list: Student[] = [];

    if (riskFilter === 'all') {
      list = students.filter(s => 
        s.riskAnalysis?.riskTier === 'high' || 
        s.riskAnalysis?.riskTier === 'moderate' || 
        (s.overallAttendance || 0) < 75
      );
    } else if (riskFilter === 'high') {
      list = students.filter(s => s.riskAnalysis?.riskTier === 'high');
    } else if (riskFilter === 'moderate') {
      list = students.filter(s => s.riskAnalysis?.riskTier === 'moderate');
    } else if (riskFilter === 'low') {
      list = students.filter(s => 
        s.riskAnalysis?.riskTier === 'low' || 
        s.riskAnalysis?.riskTier === 'high_achiever' ||
        ((s.riskAnalysis?.overallRiskScore ?? 0) < 35 && s.riskAnalysis?.riskTier !== 'high' && s.riskAnalysis?.riskTier !== 'moderate')
      );
    }

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.rollNo.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'attendance') {
        comparison = (a.overallAttendance || 0) - (b.overallAttendance || 0);
      } else if (sortField === 'riskScore') {
        comparison = (a.riskAnalysis?.overallRiskScore || 0) - (b.riskAnalysis?.overallRiskScore || 0);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return list;
  }, [students, riskFilter, tableSearch, sortField, sortOrder]);

  const toggleSort = (field: 'attendance' | 'riskScore' | 'name') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* C. Main Dashboard Heading */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-500" />
        
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Fall 2026 Academic Term
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Reporting Period: Oct 12, 2026 &bull; Mid-Semester Audit
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Success Overview
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Monitor academic progress, identify students needing support, and improve student outcomes.
          </p>
        </div>

        {/* Quick Summary Pill & Copilot Launch */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Health Status</p>
            <p className="text-sm font-bold text-slate-800 flex items-center md:justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active Early-Warning Monitoring
            </p>
          </div>
          <button
            onClick={onNavigateToCopilot}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-teal-200 group-hover:rotate-12 transition-transform" />
            <span>Launch AI Copilot</span>
          </button>
        </div>
      </section>

      {/* D. Analytics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Students */}
        <div 
          onClick={onNavigateToRoster}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalStudents}
              </span>
              <span className="text-xs font-medium text-slate-500">enrolled</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span>All active cohorts monitored across 4 depts</span>
            </p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:underline">
            <span>View Student Directory</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: High-Risk Alerts */}
        <div 
          onClick={onNavigateToRisk}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-slate-400 group-hover:text-rose-600 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High-Risk Alerts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                {highRiskStudents.length}
              </span>
              <span className="text-xs font-medium text-rose-500 font-semibold">Immediate attention</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Severe attendance & grade drops detected</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold group-hover:underline">
            <span>Explore Early Warnings</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Average Attendance */}
        <div 
          onClick={onNavigateToRoster}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-slate-400 group-hover:text-teal-600 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Attendance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {averageAttendance}%
              </span>
              <span className={`text-xs font-semibold ${averageAttendance >= 75 ? 'text-teal-600' : 'text-amber-600'}`}>
                {averageAttendance >= 75 ? '&ge; 75% Target' : 'Below benchmark'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Across lectures, labs, and tutorials</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-semibold group-hover:underline">
            <span>Analyze Attendance Log</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Placement Ready */}
        <div 
          onClick={onNavigateToPlacement}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Ready</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {placementReadyStudents.length}
              </span>
              <span className="text-xs font-medium text-indigo-600 font-semibold">
                ({Math.round((placementReadyStudents.length / (totalStudents || 1)) * 100)}% of cohort)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Tier 1 & Tier 2 interview qualified candidates</span>
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:underline">
            <span>Open Placement Hub</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </section>
      
      {/* High-Level Risk & Academic Progression Analytics (Recharts Powered) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Recharts Pie Chart of Student Risk Tiers (Low, Medium, High) */}
        <div className="lg:col-span-5 flex flex-col">
          <StudentRiskTierPieChart
            students={students}
            activeTierFilter={riskFilter}
            onSelectTier={(tier) => setRiskFilter(tier)}
            onNavigateToRisk={onNavigateToRisk}
          />
        </div>

        {/* Right: Academic Performance Trend Chart using Recharts (Last 4 Semesters) */}
        <div className="lg:col-span-7 flex flex-col">
          <AcademicPerformanceTrend students={students} />
        </div>
      </section>

      {/* E. Data Visualization Section (Two-Column Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left panel: Attendance Analytics (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Attendance Analytics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cohort breakdown against statutory thresholds
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Avg {averageAttendance}%
              </span>
            </div>

            {/* Circular / Doughnut Visual representation */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="12"
                  />
                  {/* On Track Segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={`${(attendanceBreakdown.onTrack.percent * 2.51).toFixed(1)} 251.2`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* At Risk Segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeDasharray={`${(attendanceBreakdown.atRisk.percent * 2.51).toFixed(1)} 251.2`}
                    strokeDashoffset={`-${(attendanceBreakdown.onTrack.percent * 2.51).toFixed(1)}`}
                  />
                  {/* Critical Segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="12"
                    strokeDasharray={`${(attendanceBreakdown.critical.percent * 2.51).toFixed(1)} 251.2`}
                    strokeDashoffset={`-${((attendanceBreakdown.onTrack.percent + attendanceBreakdown.atRisk.percent) * 2.51).toFixed(1)}`}
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {averageAttendance}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cohort Average
                  </span>
                  <span className="text-[10px] text-teal-600 font-medium mt-0.5">
                    {attendanceBreakdown.onTrack.count} students compliant
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance Category Breakdown */}
            <div className="space-y-3 pt-2">
              
              {/* On Track */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">On Track</p>
                    <p className="text-[10px] text-slate-500">&ge; 75% Institutional Standard</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{attendanceBreakdown.onTrack.count}</span>
                  <span className="text-xs text-slate-500 ml-1">({attendanceBreakdown.onTrack.percent}%)</span>
                </div>
              </div>

              {/* At Risk */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">At Risk</p>
                    <p className="text-[10px] text-amber-700">65% – 74.9% Warning Range</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-950">{attendanceBreakdown.atRisk.count}</span>
                  <span className="text-xs text-amber-800 ml-1">({attendanceBreakdown.atRisk.percent}%)</span>
                </div>
              </div>

              {/* Critical */}
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div>
                    <p className="text-xs font-bold text-rose-900">Critical Status</p>
                    <p className="text-[10px] text-rose-700">&lt; 65% Barred from Final Exams</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-rose-950">{attendanceBreakdown.critical.count}</span>
                  <span className="text-xs text-rose-800 ml-1">({attendanceBreakdown.critical.percent}%)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Threshold Clarification Note */}
          <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Institutional Policy:</strong> Students maintaining &lt;75% attendance receive statutory early warning notices. Below 65% triggers mandatory Dean endorsement and parental notification.
            </p>
          </div>
        </div>

        {/* Right panel: Students Needing Attention (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Students Needing Attention
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {studentsNeedingAttention.length} students requiring advisory review
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setRiskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    riskFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({totalStudents})
                </button>
                <button
                  onClick={() => setRiskFilter('high')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    riskFilter === 'high' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  High Risk ({highRiskStudents.length})
                </button>
                <button
                  onClick={() => setRiskFilter('moderate')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    riskFilter === 'moderate' ? 'bg-amber-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Moderate ({moderateRiskStudents.length})
                </button>
                <button
                  onClick={() => setRiskFilter('low')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    riskFilter === 'low' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Low Risk ({lowRiskStudents.length})
                </button>
              </div>
            </div>

            {/* Table Search & Sort Bar */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter by name, ID or dept..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">Sort:</span>
                <button
                  onClick={() => toggleSort('riskScore')}
                  className={`px-2 py-1 rounded border text-xs font-medium flex items-center gap-1 cursor-pointer ${
                    sortField === 'riskScore' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Risk {sortField === 'riskScore' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => toggleSort('attendance')}
                  className={`px-2 py-1 rounded border text-xs font-medium flex items-center gap-1 cursor-pointer ${
                    sortField === 'attendance' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Att. {sortField === 'attendance' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3 text-center">Attendance</th>
                    <th className="py-2.5 px-3 text-center">Risk Level</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsNeedingAttention.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No students matching the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    studentsNeedingAttention.slice(0, 6).map((student) => {
                      const isHigh = student.riskAnalysis?.riskTier === 'high';
                      const isMod = student.riskAnalysis?.riskTier === 'moderate';

                      return (
                        <tr 
                          key={student.id} 
                          className="hover:bg-blue-50/50 transition-colors group"
                        >
                          {/* Student Info */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={student.avatar} 
                                alt={student.name}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" 
                              />
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {student.name}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {student.department} &bull; Sem {student.semester}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Student ID */}
                          <td className="py-3 px-3 font-mono font-medium text-slate-700">
                            {student.rollNo}
                          </td>

                          {/* Attendance */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              (student.overallAttendance || 0) < 65
                                ? 'text-rose-600'
                                : (student.overallAttendance || 0) < 75
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}>
                              {student.overallAttendance}%
                            </span>
                          </td>

                          {/* Risk Level Badge */}
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isHigh 
                                ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                                : isMod 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isHigh ? 'bg-rose-600' : isMod ? 'bg-amber-600' : 'bg-teal-600'
                              }`} />
                              {student.riskAnalysis?.riskTier?.toUpperCase()} ({student.riskAnalysis?.overallRiskScore})
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => onSelectStudent(student)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-transparent rounded-lg transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                            >
                              <span>View Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer Navigation Link */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing top priority cases based on risk scores
            </span>
            <button
              onClick={onNavigateToRisk}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Risk Early Warnings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* F. Recommended Interventions Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              Recommended Interventions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Evidence-based faculty action plans mapped to student behavioral & academic risk patterns.
            </p>
          </div>

          <button
            onClick={onNavigateToInterventions}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>Manage All Interventions &rarr;</span>
          </button>
        </div>

        {/* 5 Distinct Cards for Recommended Interventions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Card 1: Academic Advising */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/70 to-white border border-blue-200/80 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Academic Advising</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                One-on-one sessions addressing course failure risks, backlogs, and customized study load balancing.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/80 text-blue-800">
                <span>{highRiskStudents.length} candidates suggested</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (highRiskStudents.length > 0) onSelectStudent(highRiskStudents[0]);
                else onNavigateToInterventions();
              }}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              Initiate Advising
            </button>
          </div>

          {/* Card 2: Attendance Improvement */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/70 to-white border border-amber-200/80 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Attendance Improvement</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Automated attendance warnings, parental consultation notices, and remedial attendance make-up labs.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/80 text-amber-800">
                <span>{attendanceBreakdown.critical.count + attendanceBreakdown.atRisk.count} below threshold</span>
              </div>
            </div>

            <button
              onClick={() => {
                const target = students.find(s => (s.overallAttendance || 0) < 65);
                if (target) onSelectStudent(target);
                else onNavigateToInterventions();
              }}
              className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              Issue Warnings
            </button>
          </div>

          {/* Card 3: Study Skills Support */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-teal-50/70 to-white border border-teal-200/80 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Study Skills Support</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Peer tutoring groups, exam prep workshops, and structured weekly submission milestone tracking.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100/80 text-teal-800">
                <span>Remediation groups ready</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToInterventions()}
              className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              Assign Peer Study
            </button>
          </div>

          {/* Card 4: Student Wellbeing Check-in */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/70 to-white border border-purple-200/80 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Student Wellbeing Check-in</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Supportive wellness outreach for students facing prolonged consecutive absences or severe sudden drops.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100/80 text-purple-800">
                <span>Holistic wellness protocol</span>
              </div>
            </div>

            <button
              onClick={() => {
                const target = students.find(s => (s.riskAnalysis?.consecutiveAbsences || 0) >= 3);
                if (target) onSelectStudent(target);
                else onNavigateToInterventions();
              }}
              className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              Schedule Check-in
            </button>
          </div>

          {/* Card 5: Placement Preparation */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-white border border-indigo-200/80 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Placement Preparation</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Mock technical interviews, coding bootcamps, and resume refinement for upcoming on-campus recruitment.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100/80 text-indigo-800">
                <span>{placementReadyStudents.length} eligible students</span>
              </div>
            </div>

            <button
              onClick={onNavigateToPlacement}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
            >
              Start Placement Track
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
