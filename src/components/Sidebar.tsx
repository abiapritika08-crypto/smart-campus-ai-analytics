import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  HeartHandshake, 
  Layers, 
  Briefcase, 
  FileSpreadsheet, 
  Settings, 
  Bot, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  X,
  Sparkles
} from 'lucide-react';

export type SidebarTab = 
  | 'overview' 
  | 'roster' 
  | 'risk' 
  | 'interventions' 
  | 'segmentation' 
  | 'placement' 
  | 'reports' 
  | 'settings' 
  | 'copilot';

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  highRiskCount: number;
  activeInterventionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  highRiskCount,
  activeInterventionsCount,
}) => {
  const navItems = [
    {
      id: 'overview' as SidebarTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Executive Success Metrics',
    },
    {
      id: 'roster' as SidebarTab,
      label: 'Student Directory',
      icon: Users,
      description: 'Comprehensive Cohort Roster',
    },
    {
      id: 'risk' as SidebarTab,
      label: 'Risk Early Warning',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? highRiskCount : undefined,
      badgeClass: 'bg-rose-500/25 text-rose-300 border-rose-500/40',
      description: 'Predictive Dropout Alerts',
    },
    {
      id: 'interventions' as SidebarTab,
      label: 'Interventions',
      icon: HeartHandshake,
      badge: activeInterventionsCount > 0 ? activeInterventionsCount : undefined,
      badgeClass: 'bg-teal-500/25 text-teal-300 border-teal-500/40',
      description: 'Remediation Plans & Logs',
    },
    {
      id: 'segmentation' as SidebarTab,
      label: 'Segmentation',
      icon: Layers,
      description: 'Cohort Clustering & Traits',
    },
    {
      id: 'placement' as SidebarTab,
      label: 'Placement Readiness',
      icon: Briefcase,
      description: 'Corporate Placement Pipeline',
    },
    {
      id: 'reports' as SidebarTab,
      label: 'Reports',
      icon: FileSpreadsheet,
      description: 'Accreditation & CSV Exports',
    },
    {
      id: 'settings' as SidebarTab,
      label: 'Settings',
      icon: Settings,
      description: 'Thresholds & Configurations',
    },
  ];

  const handleItemClick = (tabId: SidebarTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b1329] text-slate-200 border-r border-slate-800/80 transition-all duration-300 shadow-2xl select-none ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/70 bg-[#080e1f]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-200 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white">CampusCare</span>
                  <span className="text-teal-400 font-extrabold text-sm tracking-wide">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">Faculty Analytics Suite</p>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Copilot Quick Callout */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="px-3 pt-3">
            <button
              onClick={() => handleItemClick('copilot')}
              className={`w-full p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer group ${
                currentTab === 'copilot'
                  ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-teal-500/50 text-white shadow-md shadow-teal-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">AI Copilot</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Ask query or draft notice</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="pt-3 px-2 flex justify-center">
            <button
              onClick={() => handleItemClick('copilot')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                currentTab === 'copilot'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-slate-900/80 text-teal-400 hover:bg-slate-800 border border-slate-800'
              }`}
              title="Faculty AI Copilot"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${
            isCollapsed && !isMobileOpen ? 'text-center' : ''
          }`}>
            {isCollapsed && !isMobileOpen ? '•' : 'Main Menu'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer group text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              >
                <div className={`shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {(!isCollapsed || isMobileOpen) && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Dot indicator when collapsed */}
                {isCollapsed && !isMobileOpen && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className="p-3 border-t border-slate-800/80 bg-[#080e1f]">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-xs shrink-0 border border-teal-500/30">
                SJ
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">St. Jude Tech</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse" />
                  <span className="truncate">Fall 2026 Live</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800/80 flex justify-center bg-[#080e1f]">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" title="System Live" />
          </div>
        )}
      </aside>
    </>
  );
};
