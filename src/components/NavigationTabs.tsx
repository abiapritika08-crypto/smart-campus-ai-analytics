import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Layers, 
  Briefcase, 
  HeartHandshake, 
  Bot 
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'roster' 
  | 'risk' 
  | 'segmentation' 
  | 'placement' 
  | 'interventions' 
  | 'copilot';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  highRiskCount: number;
  activeInterventionsCount: number;
  isDarkMode?: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  highRiskCount,
  activeInterventionsCount,
  isDarkMode = true,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'roster' as ActiveTab,
      label: 'Student Directory',
      icon: Users,
    },
    {
      id: 'risk' as ActiveTab,
      label: 'Risk Early Warning',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? highRiskCount : undefined,
      badgeColor: isDarkMode ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-100 text-rose-700',
    },
    {
      id: 'segmentation' as ActiveTab,
      label: 'Cohort Segments',
      icon: Layers,
    },
    {
      id: 'placement' as ActiveTab,
      label: 'Placement Hub',
      icon: Briefcase,
    },
    {
      id: 'interventions' as ActiveTab,
      label: 'Interventions & Outcomes',
      icon: HeartHandshake,
      badge: activeInterventionsCount > 0 ? activeInterventionsCount : undefined,
      badgeColor: isDarkMode ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-teal-100 text-teal-700',
    },
    {
      id: 'copilot' as ActiveTab,
      label: 'Faculty AI Copilot',
      icon: Bot,
      highlight: true,
    },
  ];

  return (
    <div className={`sticky top-16 z-20 backdrop-blur-md border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/70 border-slate-800/80' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? isDarkMode 
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' 
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? 'text-emerald-400' 
                    : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full border ${
                    isActive 
                      ? 'bg-white/20 text-white border-transparent' 
                      : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
