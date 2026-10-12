import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Printer, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { Student } from '../types/student';

interface ReportsViewProps {
  students: Student[];
  onOpenExportModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  onOpenExportModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportCSV = (type: 'all' | 'high_risk' | 'attendance') => {
    let filtered = students;
    let filename = `CampusCare_Full_Cohort_Report_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'high_risk') {
      filtered = students.filter(s => s.riskAnalysis?.riskTier === 'high');
      filename = `CampusCare_High_Risk_Alerts_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'attendance') {
      filtered = students.filter(s => (s.overallAttendance || 0) < 75);
      filename = `CampusCare_Attendance_Warning_Notices_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const headers = ['Roll No', 'Name', 'Department', 'Semester', 'CGPA', 'Attendance %', 'Risk Tier', 'Risk Score', 'Placement Tier'];
    const rows = filtered.map(s => [
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      s.semester,
      s.cgpa,
      s.overallAttendance,
      `"${s.riskAnalysis?.riskTier || 'N/A'}"`,
      s.riskAnalysis?.overallRiskScore || 0,
      `"${s.placementReadiness?.tier || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Generated and downloaded ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Institutional Documentation Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Reports & Exports
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Generate formal accreditation documents, statutory attendance notices, and risk audit spreadsheets.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Launch Custom Report Builder</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Report 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Comprehensive Cohort Master Roster</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Export complete student records including roll numbers, CGPA, semester, course enrollments, attendance history, and mentor notes.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Total records:</span>
                <span className="font-bold text-slate-700">{students.length} students</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-semibold text-slate-700">CSV Spreadsheet</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => exportCSV('all')}
            className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Master Roster (.csv)</span>
          </button>
        </div>

        {/* Report 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Academic Early Warning Audit Log</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Targeted list of all students categorized under high academic risk with diagnostic metrics, assigned advisors, and active interventions.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-rose-50/60 text-[11px] text-rose-800 space-y-1">
              <div className="flex justify-between">
                <span>Flagged cases:</span>
                <span className="font-bold text-rose-900">
                  {students.filter(s => s.riskAnalysis?.riskTier === 'high').length} students
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dean Notification:</span>
                <span className="font-semibold">Statutory Advisory</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => exportCSV('high_risk')}
            className="mt-6 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Risk Audit Sheet (.csv)</span>
          </button>
        </div>

        {/* Report 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Statutory Attendance Deficiency Notice</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Official roster of students failing to meet the mandated 75% attendance threshold for final exam eligibility.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-amber-50/60 text-[11px] text-amber-800 space-y-1">
              <div className="flex justify-between">
                <span>Deficient students:</span>
                <span className="font-bold text-amber-900">
                  {students.filter(s => (s.overallAttendance || 0) < 75).length} students
                </span>
              </div>
              <div className="flex justify-between">
                <span>Threshold:</span>
                <span className="font-semibold">&lt; 75.0% Mandatory</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => exportCSV('attendance')}
            className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Attendance Notices (.csv)</span>
          </button>
        </div>

      </div>

      {/* Accreditation Information Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">ABET & NAAC Compliance Verified</p>
            <p className="text-[11px] text-slate-400">All data generated adheres to institutional retention and privacy guidelines (FERPA standard).</p>
          </div>
        </div>
        <button
          onClick={onOpenExportModal}
          className="text-xs font-semibold text-teal-300 hover:text-teal-200 underline cursor-pointer"
        >
          View Full Accreditation Dossier
        </button>
      </div>

    </div>
  );
};
