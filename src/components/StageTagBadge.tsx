import type { StageTag } from '../types/workbench';
import { Target, Zap, Database, AlertCircle, TrendingUp, AlertTriangle, User, Building, CheckCircle, Sparkles, Clock, Users } from 'lucide-react';

interface TagConfig {
  label: string;
  icon: typeof Target;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const tagConfig: Record<StageTag, TagConfig> = {
  // Lead Tags
  precise_match: {
    label: 'Precise Match',
    icon: Target,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  },
  key_signal: {
    label: 'Key Signal',
    icon: Zap,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200'
  },
  quality_source: {
    label: 'Quality Source',
    icon: Sparkles,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  data_incomplete: {
    label: 'Data Incomplete',
    icon: Database,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200'
  },
  
  // Opportunity Tags
  advancing: {
    label: 'Advancing',
    icon: TrendingUp,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  stall_risk: {
    label: 'Stall Risk',
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  decision_maker: {
    label: 'Decision Maker',
    icon: User,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  competitor: {
    label: 'Competitor',
    icon: Building,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  budget_confirmed: {
    label: 'Budget Confirmed',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  
  // Customer Tags
  upsell_opportunity: {
    label: 'Upsell Opportunity',
    icon: TrendingUp,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  churn_warning: {
    label: 'Churn Warning',
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-300'
  },
  health_declining: {
    label: 'Health Declining',
    icon: AlertTriangle,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  power_user: {
    label: 'Power User',
    icon: Sparkles,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  renewal_soon: {
    label: 'Renewal Soon',
    icon: Clock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  }
};

interface StageTagBadgeProps {
  tag: StageTag;
  compact?: boolean;
}

export function StageTagBadge({ tag, compact = false }: StageTagBadgeProps) {
  const config = tagConfig[tag];
  const Icon = config.icon;
  
  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
      transition-all duration-200
      ${config.bgColor} ${config.borderColor} ${config.textColor}
    `}>
      <Icon className="w-3.5 h-3.5" />
      {!compact && (
        <span className="text-[11px] font-semibold">
          {config.label}
        </span>
      )}
    </div>
  );
}
