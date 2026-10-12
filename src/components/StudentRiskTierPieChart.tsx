import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  PieChart as PieChartIcon,
  ChevronRight,
} from 'lucide-react';
import { Student } from '../types/student';

interface StudentRiskTierPieChartProps {
  students: Student[];
  onSelectTier?: (tier: 'all' | 'high' | 'moderate' | 'low') => void;
  activeTierFilter?: 'all' | 'high' | 'moderate' | 'low';
  onNavigateToRisk?: () => void;
}

export const StudentRiskTierPieChart: React.FC<StudentRiskTierPieChartProps> = ({
  students,
  onSelectTier,
  activeTierFilter = 'all',
  onNavigateToRisk,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartStyle, setChartStyle] = useState<'donut' | 'pie'>('donut');

  // Compute student counts per risk tier
  const riskStats = useMemo(() => {
    let lowCount = 0;
    let moderateCount = 0;
    let highCount = 0;

    students.forEach((s) => {
      const tier = s.riskAnalysis?.riskTier;
      const score = s.riskAnalysis?.overallRiskScore ?? 0;

      if (tier === 'high' || score >= 65) {
        highCount++;
      } else if (tier === 'moderate' || (score >= 35 && score < 65)) {
        moderateCount++;
      } else {
        lowCount++;
      }
    });

    const total = students.length || 1;

    return {
      total: students.length,
      low: {
        count: lowCount,
        percentage: Math.round((lowCount / total) * 1000) / 10,
      },
      moderate: {
        count: moderateCount,
        percentage: Math.round((moderateCount / total) * 1000) / 10,
      },
      high: {
        count: highCount,
        percentage: Math.round((highCount / total) * 1000) / 10,
      },
    };
  }, [students]);

  // Data formatted for Recharts Pie
  const chartData = useMemo(() => {
    return [
      {
        name: 'Low Risk',
        key: 'low',
        tierKey: 'low',
        value: riskStats.low.count,
        percentage: riskStats.low.percentage,
        color: '#10B981', // Emerald 500
        hoverColor: '#059669',
        borderClass: 'border-emerald-200',
        bgClass: 'bg-emerald-50 text-emerald-800',
        dotColor: 'bg-emerald-500',
        threshold: 'Risk Score < 35',
        description: 'Consistent attendance (≥75%) & steady grade trajectory',
        actionLabel: 'Standard Monitoring',
      },
      {
        name: 'Medium Risk',
        key: 'moderate',
        tierKey: 'moderate',
        value: riskStats.moderate.count,
        percentage: riskStats.moderate.percentage,
        color: '#F59E0B', // Amber 500
        hoverColor: '#D97706',
        borderClass: 'border-amber-200',
        bgClass: 'bg-amber-50 text-amber-800',
        dotColor: 'bg-amber-500',
        threshold: 'Risk Score 35–64',
        description: 'Attendance borderline (65%–74%) or minor assignment backlog',
        actionLabel: 'Advising Recommended',
      },
      {
        name: 'High Risk',
        key: 'high',
        tierKey: 'high',
        value: riskStats.high.count,
        percentage: riskStats.high.percentage,
        color: '#EF4444', // Rose 500
        hoverColor: '#DC2626',
        borderClass: 'border-rose-200',
        bgClass: 'bg-rose-50 text-rose-800',
        dotColor: 'bg-rose-500',
        threshold: 'Risk Score ≥ 65',
        description: 'Critical attendance (<65%) or severe multi-course drop',
        actionLabel: 'Immediate Intervention',
      },
    ];
  }, [riskStats]);

  // Active slice data (for hover center callout)
  const activeData = activeIndex !== null ? chartData[activeIndex] : null;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs min-w-[220px] pointer-events-none">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-bold">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: data.color }}
              />
              <span className="text-sm text-white">{data.name}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
              {data.threshold}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 py-1 bg-slate-800/60 rounded-lg px-2 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Students</p>
              <p className="text-base font-extrabold text-white">{data.value}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Share</p>
              <p className="text-base font-extrabold text-white">{data.percentage}%</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
            {data.description}
          </p>

          <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Status</span>
            <span style={{ color: data.color }}>{data.actionLabel}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />

      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <PieChartIcon className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Risk Tier Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-level cohort distribution across Low, Medium, and High risk tiers
            </p>
          </div>

          {/* Controls: Chart Style Toggle & Quick Risk Link */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setChartStyle('donut')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  chartStyle === 'donut'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Donut
              </button>
              <button
                onClick={() => setChartStyle('pie')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  chartStyle === 'pie'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Solid Pie
              </button>
            </div>

            {onNavigateToRisk && (
              <button
                onClick={onNavigateToRisk}
                title="Open Risk Early Warning Engine"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Recharts Pie Chart Section */}
        <div className="py-4 relative flex flex-col items-center justify-center">
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={chartStyle === 'donut' ? 62 : 0}
                  outerRadius={88}
                  paddingAngle={chartStyle === 'donut' ? 4 : 1}
                  dataKey="value"
                  animationDuration={800}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(entry: any) => {
                    if (onSelectTier) {
                      const target = (entry?.payload?.tierKey || entry?.tierKey) as 'high' | 'moderate' | 'low';
                      if (activeTierFilter === target) {
                        onSelectTier('all');
                      } else {
                        onSelectTier(target);
                      }
                    }
                  }}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => {
                    const isHovered = activeIndex === index;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#FFFFFF"
                        strokeWidth={isHovered ? 3 : 2}
                        opacity={activeIndex === null || isHovered ? 1 : 0.65}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Overlay Text */}
            {chartStyle === 'donut' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {activeData ? (
                  <div className="animate-in fade-in duration-150">
                    <span
                      className="text-2xl font-extrabold tracking-tight"
                      style={{ color: activeData.color }}
                    >
                      {activeData.value}
                    </span>
                    <span className="block text-[11px] font-semibold text-slate-600">
                      {activeData.name}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {activeData.percentage}% of cohort
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {riskStats.total}
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Monitored
                    </span>
                    <span className="block text-[10px] font-bold text-rose-600 mt-0.5">
                      {riskStats.high.count} High Risk
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center -mt-1">
            Click any segment or badge below to filter students needing attention
          </p>
        </div>

        {/* Tiers Breakdown Cards / Interactive Legend */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {chartData.map((tier, idx) => {
            const isSelected = activeTierFilter === tier.tierKey;

            return (
              <button
                key={tier.name}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => {
                  if (onSelectTier) {
                    const target = tier.tierKey as 'high' | 'moderate' | 'low';
                    if (activeTierFilter === target) {
                      onSelectTier('all');
                    } else {
                      onSelectTier(target);
                    }
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeIndex === idx
                    ? 'ring-2 ring-blue-500 shadow-xs'
                    : 'hover:bg-slate-50'
                } ${
                  isSelected
                    ? `${tier.borderClass} ${tier.bgClass} shadow-xs`
                    : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${tier.dotColor}`} />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {tier.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {tier.percentage}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-extrabold text-slate-900">
                    {tier.value}
                  </span>
                  <span className="text-[10px] text-slate-500">students</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Level Risk Overview Status Banner */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            {riskStats.high.count > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-slate-800">
                {riskStats.high.count > 0
                  ? `${riskStats.high.count} Students Need Immediate Attention`
                  : 'Cohort Risk Levels Normal'}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                {riskStats.low.percentage}% of cohort is currently on track. High-risk accounts for{' '}
                {riskStats.high.percentage}% of students monitored.
              </p>
            </div>
          </div>

          {onNavigateToRisk && (
            <button
              onClick={onNavigateToRisk}
              className="shrink-0 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              <span>Audit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
