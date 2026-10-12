import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  SlidersHorizontal,
  Calendar,
  Lock,
  UserCheck
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(75);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(65);
  const [riskSensitivity, setRiskSensitivity] = useState<'standard' | 'high' | 'sensitive'>('standard');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [parentNotif, setParentNotif] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Settings className="w-4 h-4" />
            <span>Institutional Policy & AI Config</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings & Thresholds
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Configure statutory attendance benchmarks, risk scoring parameters, and notification protocols.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Institutional configurations updated successfully.</span>
        </div>
      )}

      {/* 1. Statutory Attendance Benchmarks */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Attendance Policies & Thresholds</h3>
            <p className="text-xs text-slate-500">Statutory minimum requirements enforced by the Academic Council.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Minimum Statutory Target ({attendanceThreshold}%)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Students falling below this percentage trigger "At Risk" warning badges.
            </p>
            <input
              type="range"
              min="65"
              max="85"
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>65% (Lenient)</span>
              <span className="font-bold text-blue-600">{attendanceThreshold}% Current</span>
              <span>85% (Strict)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Critical Exam Barring Limit ({criticalThreshold}%)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Students below this line are automatically flagged for Dean intervention.
            </p>
            <input
              type="range"
              min="50"
              max="70"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50%</span>
              <span className="font-bold text-rose-600">{criticalThreshold}% Critical Limit</span>
              <span>70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Early Warning Scoring Weights */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Predictive Risk Engine Sensitivity</h3>
            <p className="text-xs text-slate-500">Fine-tune the weights for GPA trend, attendance drops, and backlog counts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            { id: 'standard', title: 'Balanced (Standard)', desc: 'Equal weight to academic drops and attendance fluctuations.' },
            { id: 'high', title: 'Attendance-Weighted', desc: 'Prioritizes unexcused absences and lab attendance lapses.' },
            { id: 'sensitive', title: 'High Early Warning', desc: 'Flags minor score decelerations after Internal Assessment 1.' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRiskSensitivity(item.id as any)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                riskSensitivity === item.id 
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                {riskSensitivity === item.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Notifications & Communication */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Automated Communications</h3>
            <p className="text-xs text-slate-500">Manage automated notices dispatched on threshold breaches.</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-800">Faculty Digest Email</p>
              <p className="text-[11px] text-slate-500">Receive a weekly summary of students crossing into High Risk tiers.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-800">Auto-Draft Parent Advisory Notices</p>
              <p className="text-[11px] text-slate-500">Pre-fill letter drafts when attendance stays below 65% for 3 consecutive weeks.</p>
            </div>
            <input
              type="checkbox"
              checked={parentNotif}
              onChange={(e) => setParentNotif(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Reset Data & System Diagnostics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Database className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Benchmark Data Management</h3>
            <p className="text-xs text-slate-500">Reset or reload institutional mock datasets for testing and demonstration.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
          <div>
            <p className="text-xs font-bold text-rose-900">Restore Benchmark Cohort Records</p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Reset all modifications, attendance adjustments, and newly added students to the initial 12 curated profiles.
            </p>
          </div>

          <button
            onClick={onResetData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Cohort Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
