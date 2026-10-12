import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Code, 
  MessageSquare, 
  Building, 
  ChevronRight, 
  Search,
  Sparkles,
  ExternalLink,
  Target
} from 'lucide-react';
import { Student, PlacementTier } from '../types/student';

interface PlacementHubViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenInterventionModal: (student: Student) => void;
}

export const PlacementHubView: React.FC<PlacementHubViewProps> = ({
  students,
  onSelectStudent,
  onOpenInterventionModal,
}) => {
  const [targetCompany, setTargetCompany] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Sample company criteria presets
  const companyPresets = [
    {
      id: 'tier1_tech',
      name: 'Tier 1 Tech (Google, Microsoft, Amazon)',
      minCgpa: 8.0,
      maxBacklogs: 0,
      minCoding: 80,
      tier: 'tier1_dream',
    },
    {
      id: 'tier1_core',
      name: 'Core Engineering (Qualcomm, Bosch, L&T)',
      minCgpa: 7.5,
      maxBacklogs: 0,
      minCoding: 70,
      tier: 'tier1_dream',
    },
    {
      id: 'tier2_product',
      name: 'Product & FinTech (Razorpay, Cisco, Oracle)',
      minCgpa: 7.0,
      maxBacklogs: 0,
      minCoding: 65,
      tier: 'tier2_core',
    },
    {
      id: 'mass_recruiter',
      name: 'IT Services & Consulting (TCS, Infosys, Cognizant)',
      minCgpa: 6.0,
      maxBacklogs: 1,
      minCoding: 50,
      tier: 'tier2_core',
    },
  ];

  // Distribution counts
  const tierCounts = {
    tier1_dream: students.filter(s => s.placementReadiness.tier === 'tier1_dream').length,
    tier2_core: students.filter(s => s.placementReadiness.tier === 'tier2_core').length,
    needs_coaching: students.filter(s => s.placementReadiness.tier === 'needs_coaching').length,
    not_eligible: students.filter(s => s.placementReadiness.tier === 'not_eligible').length,
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    if (tierFilter !== 'all' && student.placementReadiness.tier !== tierFilter) return false;
    
    // Check company preset criteria if selected
    if (targetCompany !== 'all') {
      const preset = companyPresets.find(p => p.id === targetCompany);
      if (preset) {
        if (student.cgpa < preset.minCgpa) return false;
        if (student.placementReadiness.activeBacklogs > preset.maxBacklogs) return false;
        if (student.placementReadiness.codingSkillScore < preset.minCoding) return false;
      }
    }

    if (search) {
      const q = search.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchRoll = student.rollNo.toLowerCase().includes(q);
      const matchDept = student.department.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchDept) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Placement Hub Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Placement Readiness & Career Diagnostic Hub</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Assesses technical coding benchmarks, mock interview rigor, resume ATS health, and backlogs to ensure maximum conversion during on-campus recruitment cycles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-lg font-medium">
              Campus Drives Open
            </span>
          </div>
        </div>
      </div>

      {/* Tier Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier 1 Dream */}
        <div 
          onClick={() => setTierFilter('tier1_dream')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === 'tier1_dream' ? 'bg-indigo-900 text-white border-indigo-900 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tier 1 Dream Ready</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tierFilter === 'tier1_dream' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {tierCounts.tier1_dream}
            </span>
          </div>
          <p className={`text-2xl font-bold ${tierFilter === 'tier1_dream' ? 'text-white' : 'text-slate-900'}`}>
            {tierCounts.tier1_dream}
          </p>
          <p className={`text-xs mt-1 ${tierFilter === 'tier1_dream' ? 'text-indigo-200' : 'text-slate-500'}`}>
            CGPA &gt; 8.0 &middot; LeetCode 2000+ &middot; Zero Backlogs
          </p>
        </div>

        {/* Tier 2 Core */}
        <div 
          onClick={() => setTierFilter('tier2_core')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === 'tier2_core' ? 'bg-teal-900 text-white border-teal-900 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tier 2 Core Engineering</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tierFilter === 'tier2_core' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
            }`}>
              {tierCounts.tier2_core}
            </span>
          </div>
          <p className={`text-2xl font-bold ${tierFilter === 'tier2_core' ? 'text-white' : 'text-slate-900'}`}>
            {tierCounts.tier2_core}
          </p>
          <p className={`text-xs mt-1 ${tierFilter === 'tier2_core' ? 'text-teal-200' : 'text-slate-500'}`}>
            CGPA &gt; 6.5 &middot; Core Hardware/Software Ready
          </p>
        </div>

        {/* Needs Coaching */}
        <div 
          onClick={() => setTierFilter('needs_coaching')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === 'needs_coaching' ? 'bg-amber-900 text-white border-amber-900 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Needs Mock Coaching</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tierFilter === 'needs_coaching' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              {tierCounts.needs_coaching}
            </span>
          </div>
          <p className={`text-2xl font-bold ${tierFilter === 'needs_coaching' ? 'text-white' : 'text-slate-900'}`}>
            {tierCounts.needs_coaching}
          </p>
          <p className={`text-xs mt-1 ${tierFilter === 'needs_coaching' ? 'text-amber-200' : 'text-slate-500'}`}>
            Interview anxiety or resume formatting hurdles
          </p>
        </div>

        {/* Not Eligible / Backlogs */}
        <div 
          onClick={() => setTierFilter('not_eligible')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === 'not_eligible' ? 'bg-rose-900 text-white border-rose-900 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Debarred / Backlog Lag</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tierFilter === 'not_eligible' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
            }`}>
              {tierCounts.not_eligible}
            </span>
          </div>
          <p className={`text-2xl font-bold ${tierFilter === 'not_eligible' ? 'text-white' : 'text-slate-900'}`}>
            {tierCounts.not_eligible}
          </p>
          <p className={`text-xs mt-1 ${tierFilter === 'not_eligible' ? 'text-rose-200' : 'text-slate-500'}`}>
            Active backlogs &gt; 1 or severe attendance loss
          </p>
        </div>

      </div>

      {/* Target Recruiter Filter & Candidate Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulate Recruiter Cutoff:</span>
            </span>
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Recruiters (No Cutoff Filter)</option>
              {companyPresets.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (Min CGPA {c.minCgpa})
                </option>
              ))}
            </select>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

        </div>

        {tierFilter !== 'all' && (
          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
            <span>Filtered by tier: <strong>{tierFilter.replace('_', ' ').toUpperCase()}</strong></span>
            <button
              onClick={() => setTierFilter('all')}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Dept & Sem</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Coding Benchmark</th>
                <th className="py-3 px-3">Mock Screen</th>
                <th className="py-3 px-3">Resume Status</th>
                <th className="py-3 px-3">Active Backlogs</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No candidates match this placement filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const pr = student.placementReadiness;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
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
                            <span className="text-[11px] text-slate-400 font-mono">{student.rollNo}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{student.department}</span>
                        <span className="block text-[11px] text-slate-500">Sem {student.semester}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900">{student.cgpa.toFixed(2)}</span>
                      </td>

                      {/* Coding Benchmark */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                pr.codingSkillScore >= 80 ? 'bg-emerald-500' : pr.codingSkillScore >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${pr.codingSkillScore}%` }}
                            />
                          </div>
                          <span className="font-semibold">{pr.codingSkillScore}%</span>
                        </div>
                      </td>

                      {/* Mock Screen */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                pr.mockInterviewScore >= 80 ? 'bg-emerald-500' : pr.mockInterviewScore >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${pr.mockInterviewScore}%` }}
                            />
                          </div>
                          <span className="font-semibold">{pr.mockInterviewScore}%</span>
                        </div>
                      </td>

                      {/* Resume Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium ${
                          pr.resumeStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : pr.resumeStatus === 'under_review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {pr.resumeStatus === 'approved' ? 'ATS Approved' : pr.resumeStatus === 'under_review' ? 'In Review' : 'Needs Polish'}
                        </span>
                      </td>

                      {/* Backlogs */}
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${pr.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {pr.activeBacklogs === 0 ? 'Clear (0)' : `${pr.activeBacklogs} Backlogs`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer text-[11px]"
                        >
                          Career Profile
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

    </div>
  );
};
