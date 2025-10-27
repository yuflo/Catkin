import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Timeline } from './Timeline';
import { ChevronRight, ChevronLeft, TrendingUp, AlertTriangle, Users, Activity } from 'lucide-react';
import type { LeadLite, Activity as ActivityType } from '../../types/workbench';

interface InsightsPanelProps {
  lead: LeadLite;
  activities: ActivityType[];
  isOpen: boolean;
  onToggle: () => void;
}

export function InsightsPanel({ lead, activities, isOpen, onToggle }: InsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'context' | 'risks'>('timeline');
  
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border-2 border-r-0 border-gray-200 rounded-l-lg p-2 hover:bg-gray-50 transition-colors shadow-md"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
    );
  }
  
  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Insights</h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="px-4 py-3 border-b flex gap-2">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`
            flex-1 px-3 py-2 rounded-lg text-sm transition-all
            ${activeTab === 'timeline' 
              ? 'bg-blue-50 text-blue-700 font-semibold' 
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <Activity className="w-4 h-4 inline mr-1" />
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('context')}
          className={`
            flex-1 px-3 py-2 rounded-lg text-sm transition-all
            ${activeTab === 'context' 
              ? 'bg-blue-50 text-blue-700 font-semibold' 
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <Users className="w-4 h-4 inline mr-1" />
          Context
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'timeline' && (
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Activity Timeline</div>
            <Timeline activities={activities} />
          </div>
        )}
        
        {activeTab === 'context' && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">Lead Context</div>
            
            {/* AI Insight */}
            {lead.aiInsight && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">AI Insight</div>
                    <div className="text-sm text-blue-800">{lead.aiInsight}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Source</div>
                <Badge variant="secondary">{lead.source}</Badge>
              </div>
              
              {lead.owner && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Owner</div>
                  <div className="text-sm font-medium text-gray-900">{lead.owner.name}</div>
                </div>
              )}
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Created</div>
                <div className="text-sm text-gray-900">
                  {new Date(lead.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              {lead.lastActivityAt && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Activity</div>
                  <div className="text-sm text-gray-900">
                    {new Date(lead.lastActivityAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              )}
              
              {lead.dealValue && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Deal Value</div>
                  <div className="text-lg font-semibold text-green-700">
                    ${lead.dealValue.toLocaleString()}
                  </div>
                </div>
              )}
              
              {lead.pipelineStage && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Pipeline Stage</div>
                  <Badge>{lead.pipelineStage}</Badge>
                </div>
              )}
              
              {lead.customerSince && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Customer Since</div>
                  <div className="text-sm text-gray-900">
                    {new Date(lead.customerSince).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
