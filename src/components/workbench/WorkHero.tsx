import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { StageTagBadge } from '../StageTagBadge';
import { Rocket, FileText, HelpCircle } from 'lucide-react';
import type { LeadLite, NextStep } from '../../types/workbench';
import { selectMaterialPool } from '../../lib/dropIntegration';

interface WorkHeroProps {
  lead: LeadLite;
  onPrepareSmartDrop: (step: NextStep) => void;
  onPrepareDifferentDrop?: () => void;
  onWhy?: () => void;
}

export function WorkHero({ lead, onPrepareSmartDrop, onPrepareDifferentDrop, onWhy }: WorkHeroProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const getStageLabel = () => {
    if (lead.businessStage === 'opportunity' && lead.pipelineStage) {
      return `Opportunity • ${lead.pipelineStage}`;
    }
    if (lead.businessStage === 'customer') {
      return 'Customer';
    }
    return `Lead • ${lead.source}`;
  };
  
  const recommendedPool = selectMaterialPool(lead, lead.nextStep);
  
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{lead.name}</h2>
            {lead.role && lead.org && (
              <p className="text-sm text-gray-600 mb-2">{lead.role} • {lead.org}</p>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {lead.tags.map((tag) => (
                <StageTagBadge key={tag} tag={tag} />
              ))}
            </div>
            
            {/* Stage Info */}
            <div className="text-sm text-gray-500">{getStageLabel()}</div>
          </div>
        </div>
      </div>
      
      {/* AI Next Step */}
      <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">AI Next Step</div>
            {onWhy && (
              <button
                onClick={onWhy}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.nextStep.label}</h3>
          <p className="text-sm text-gray-600">{lead.nextStep.description}</p>
        </div>
        
        {lead.aiInsight && (
          <div className="text-xs text-blue-700 bg-blue-100/50 px-3 py-2 rounded-lg mt-3">
            <span className="font-semibold">Based on:</span> {lead.aiInsight}
          </div>
        )}
      </div>
      
      {/* AI-Recommended Material Pool */}
      {recommendedPool && (
        <div className="p-6 bg-white border-b">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-700 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">AI-Recommended Material Pool</span>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px]">
                    🌟 Recommended
                  </Badge>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{recommendedPool.name}</div>
                <div className="text-sm text-gray-600">
                  {recommendedPool.templateCount} templates • {recommendedPool.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="p-6 bg-white">
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            onClick={() => onPrepareSmartDrop(lead.nextStep)}
          >
            <Rocket className="w-5 h-5 mr-2" />
            {recommendedPool 
              ? `Prepare "${recommendedPool.name.split(' ')[0]}..." Drop` 
              : 'Prepare Smart Drop'
            }
          </Button>
          
          {onPrepareDifferentDrop && (
            <Button
              size="lg"
              variant="outline"
              onClick={onPrepareDifferentDrop}
            >
              Use Different
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
