import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  Bell, 
  Menu, 
  ChevronDown, 
  UserPlus, 
  FileSpreadsheet, 
  Settings, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  User, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { Student } from '../types/student';

interface HeaderProps {
  pageTitle: string;
  breadcrumbs?: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectStudent: (student: Student) => void;
  students: Student[];
  onOpenCopilot: () => void;
  onOpenAddStudent: () => void;
  onOpenExportReport: () => void;
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  highRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  breadcrumbs = ['CampusCare AI', 'Dashboard'],
  searchQuery,
  onSearchChange,
  onSelectStudent,
  students,
  onOpenCopilot,
  onOpenAddStudent,
  onOpenExportReport,
  onOpenSettings,
  onToggleMobileSidebar,
  highRiskCount,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
      }
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter students based on search query
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  // Generate notification items based on actual student data
  const urgentNotifications = students
    .filter(s => s.riskAnalysis?.riskTier === 'high' || (s.overallAttendance || 100) < 65)
    .slice(0, 4)
    .map(s => ({
      id: s.id,
      student: s,
      title: `${s.name} (${s.rollNo})`,
      message: (s.overallAttendance || 0) < 65 
        ? `Critical attendance at ${s.overallAttendance}% (below 65% limit)`
        : `High academic risk score (${s.riskAnalysis?.overallRiskScore}/100) - requires advising`,
      type: (s.overallAttendance || 0) < 65 ? 'attendance' : 'risk',
      time: 'Just now'
    }));

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs flex items-center justify-between px-4 sm:px-6 transition-all">
      {/* Left section: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Breadcrumbs */}
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-slate-600 font-semibold' : 'hover:text-slate-700'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Center section: Search Bar */}
      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search student, roll number, or department... (Press '/' to focus)"
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span>Matching Students ({searchResults.length})</span>
              <span className="text-[10px] text-slate-400">Click to view deep-dive profile</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectStudent(s);
                    setShowSearchDropdown(false);
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-blue-50/70 flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={s.avatar} 
                      alt={s.name} 
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {s.rollNo} &bull; {s.department} (Sem {s.semester})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.riskAnalysis?.riskTier === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : s.riskAnalysis?.riskTier === 'moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {s.riskAnalysis?.riskTier?.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {s.overallAttendance}% Att.
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right section: Action Buttons & Menus */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Student Button */}
        <button
          onClick={onOpenAddStudent}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          title="Add new student record"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Student</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer group"
          title="Faculty AI Copilot & Automated Diagnostics"
        >
          <Bot className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/20 font-mono tracking-wider font-bold">
            PRO
          </span>
        </button>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {urgentNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800">Faculty Priority Alerts</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    {urgentNotifications.length} Critical
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      onSelectStudent(notif.student);
                      setShowNotifications(false);
                    }}
                    className="w-full p-3 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer group"
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    onOpenExportReport();
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Generate Incident Audit Log &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              DR
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">Dr. Richard Vance</p>
              <p className="text-[10px] text-slate-400 leading-tight">Head of Academic Advisory</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Dr. Richard Vance, Ph.D.</p>
                <p className="text-[11px] text-slate-500">Dept. of Computer Science & Eng.</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Advisory Council Lead
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Platform Settings</span>
                </button>

                <button
                  onClick={() => {
                    onOpenExportReport();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <span>Executive Export Center</span>
                </button>
              </div>

              <div className="border-t border-slate-100 px-3 py-2">
                <p className="text-[10px] text-slate-400">
                  Connected: St. Jude Portal SIS v4.2
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
