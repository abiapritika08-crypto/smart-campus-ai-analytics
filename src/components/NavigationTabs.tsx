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
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  highRiskCount,
  activeInterventionsCount,
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
      label: 'Risk & Early Warning',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? highRiskCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'segmentation' as ActiveTab,
      label: 'Student Segmentation',
      icon: Layers,
    },
    {
      id: 'placement' as ActiveTab,
      label: 'Placement Readiness',
      icon: Briefcase,
    },
    {
      id: 'interventions' as ActiveTab,
      label: 'Interventions & Outcomes',
      icon: HeartHandshake,
      badge: activeInterventionsCount > 0 ? activeInterventionsCount : undefined,
      badgeColor: 'bg-teal-100 text-teal-700',
    },
    {
      id: 'copilot' as ActiveTab,
      label: 'Faculty AI Copilot',
      icon: Bot,
      highlight: true,
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 text-[11px] font-semibold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
