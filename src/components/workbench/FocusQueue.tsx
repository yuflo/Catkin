import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { StageTagBadge } from '../StageTagBadge';
import { PriorityMatrix } from '../PriorityMatrix';
import { Sparkles, Zap, Star, Signal, Clock, List, Users, TrendingUp, DollarSign, AlertTriangle, Gift } from 'lucide-react';
import type { LeadLite, BusinessStage, SmartView, LeadSmartView, OpportunitySmartView, CustomerSmartView } from '../../types/workbench';

interface FocusQueueProps {
  items: LeadLite[];
  activeId: string;
  activeStage: BusinessStage;
  activeSmartView: SmartView;
  onSelect: (id: string) => void;
  onStageChange: (stage: BusinessStage) => void;
  onSmartViewChange: (view: SmartView) => void;
}

const STAGE_CONFIG = {
  lead: {
    label: 'Leads',
    color: 'blue',
    views: [
      { value: 'ai_recommended', label: 'AI Recommended', icon: Sparkles, description: 'Top priority leads' },
      { value: 'recent_activity', label: 'Recent Activity', icon: Zap, description: 'Hot leads (48h)' },
      { value: 'new_leads', label: 'New Leads', icon: Star, description: 'Last 24-48h' },
      { value: 'key_signals', label: 'Key Signals', icon: Signal, description: 'High-intent actions' },
      { value: 'pending_triage', label: 'Pending Triage', icon: Clock, description: 'Not yet actioned' },
      { value: 'all', label: 'All Leads', icon: List, description: 'Complete list' }
    ] as Array<{ value: LeadSmartView; label: string; icon: typeof Sparkles; description: string }>
  },
  opportunity: {
    label: 'Opportunities',
    color: 'green',
    views: [
      { value: 'ai_recommended', label: 'AI Recommended', icon: Sparkles, description: 'Top priority deals' },
      { value: 'ready_to_close', label: 'Ready to Close', icon: TrendingUp, description: 'Near closing' },
      { value: 'stalled', label: 'Stalled', icon: AlertTriangle, description: 'No recent activity' },
      { value: 'high_value', label: 'High Value', icon: DollarSign, description: '$50K+ deals' },
      { value: 'all', label: 'All Opportunities', icon: List, description: 'Complete list' }
    ] as Array<{ value: OpportunitySmartView; label: string; icon: typeof Sparkles; description: string }>
  },
  customer: {
    label: 'Customers',
    color: 'purple',
    views: [
      { value: 'ai_recommended', label: 'AI Recommended', icon: Sparkles, description: 'Needs attention' },
      { value: 'at_risk', label: 'At Risk', icon: AlertTriangle, description: 'Churn risk' },
      { value: 'expansion', label: 'Expansion', icon: Gift, description: 'Upsell opportunities' },
      { value: 'renewal_due', label: 'Renewal Due', icon: Clock, description: 'Approaching renewal' },
      { value: 'all', label: 'All Customers', icon: List, description: 'Complete list' }
    ] as Array<{ value: CustomerSmartView; label: string; icon: typeof Sparkles; description: string }>
  }
};

export function FocusQueue({ items, activeId, activeStage, activeSmartView, onSelect, onStageChange, onSmartViewChange }: FocusQueueProps) {
  const stageConfig = STAGE_CONFIG[activeStage];
  const views = stageConfig.views;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const formatTimeAgo = (isoDate: string) => {
    const hours = Math.floor((Date.now() - new Date(isoDate).getTime()) / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };
  
  return (
    <div className="w-96 border-r bg-gray-50 flex flex-col h-full overflow-hidden">
      {/* Stage Tabs */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex gap-2">
          {(['lead', 'opportunity', 'customer'] as BusinessStage[]).map((stage) => {
            const config = STAGE_CONFIG[stage];
            const count = items.filter(i => i.businessStage === stage).length;
            return (
              <button
                key={stage}
                onClick={() => onStageChange(stage)}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-sm transition-all
                  ${activeStage === stage 
                    ? `bg-${config.color}-50 text-${config.color}-700 font-semibold border-2 border-${config.color}-200` 
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }
                `}
              >
                {config.label}
                <Badge variant="secondary" className="ml-2 text-xs">{count}</Badge>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Smart Views */}
      <div className="p-4 border-b bg-gradient-to-br from-slate-50 to-white">
        {/* Primary AI Insight */}
        {(() => {
          const primaryView = views[0]; // AI Recommended (first view)
          const PrimaryIcon = primaryView.icon;
          const primaryCount = Math.floor(Math.random() * 8) + 3; // Mock count 3-10
          const isPrimaryActive = activeSmartView === primaryView.value;
          
          return (
            <button
              onClick={() => onSmartViewChange(primaryView.value)}
              className={`
                w-full px-5 py-3 rounded-xl mb-3 transition-all duration-200
                flex items-center justify-center gap-2.5
                ${isPrimaryActive
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 shadow-sm hover:shadow-md'
                }
              `}
            >
              <div className={`transition-transform duration-200 ${isPrimaryActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <PrimaryIcon className="w-5 h-5" />
              </div>
              <span className={isPrimaryActive ? 'font-semibold' : 'font-medium'}>
                {primaryView.label}
              </span>
              <span className={`
                ml-auto min-w-[24px] h-5 px-2 rounded-full text-[11px] font-medium
                flex items-center justify-center
                ${isPrimaryActive
                  ? 'bg-white/20 text-white backdrop-blur-sm'
                  : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
                }
              `}>
                {primaryCount}
              </span>
            </button>
          );
        })()}
        
        {/* Secondary Tactical Views */}
        <div className="flex flex-wrap gap-2">
          {views.slice(1).map((view) => {
            const Icon = view.icon;
            const isActive = activeSmartView === view.value;
            const count = Math.floor(Math.random() * 12) + 1; // Mock count 1-12
            
            return (
              <button
                key={view.value}
                onClick={() => onSmartViewChange(view.value)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-slate-800 text-white shadow-md hover:bg-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <Icon className="w-4 h-4 transition-transform hover:scale-110" />
                <span>{view.label}</span>
                <span className={`
                  min-w-[20px] h-4 px-1.5 rounded-md text-[10px] font-semibold
                  flex items-center justify-center
                  ${isActive
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Lead Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No items in this view</p>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${activeId === item.id 
                    ? 'bg-white border-blue-500 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                      {getInitials(item.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{item.name}</div>
                    {item.org && <div className="text-xs text-gray-500 truncate">{item.org}</div>}
                    {item.role && <div className="text-xs text-gray-400 truncate">{item.role}</div>}
                  </div>
                  <PriorityMatrix priority={item.priority} />
                </div>
                
                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.slice(0, 2).map((tag) => (
                      <StageTagBadge key={tag} tag={tag} compact />
                    ))}
                    {item.tags.length > 2 && (
                      <div className="text-xs text-gray-400 px-2 py-1">+{item.tags.length - 2}</div>
                    )}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.source}</span>
                  {item.lastActivityAt && <span>{formatTimeAgo(item.lastActivityAt)}</span>}
                </div>
                
                {/* Deal Value for Opportunities */}
                {item.businessStage === 'opportunity' && item.dealValue && (
                  <div className="mt-2 pt-2 border-t text-sm font-semibold text-green-700">
                    ${(item.dealValue / 1000).toFixed(0)}K
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
