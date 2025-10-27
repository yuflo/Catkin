import { useState, useEffect } from 'react';
import { CommandBar } from './workbench/CommandBar';
import { FocusQueue } from './workbench/FocusQueue';
import { WorkHero } from './workbench/WorkHero';
import { QuickActions } from './workbench/QuickActions';
import { DropCreator } from './workbench/DropCreator';
import { SnoozePicker } from './workbench/SnoozePicker';
import { InsightsPanel } from './workbench/InsightsPanel';
import { toast } from 'sonner@2.0.3';
import type { 
  LeadLite, 
  BusinessStage, 
  SmartView, 
  LeadSmartView,
  OpportunitySmartView,
  CustomerSmartView,
  ViewMode, 
  DropConfig,
  NextStep,
  NextStepPrimitive
} from '../types/workbench';
import { MOCK_LEADS, MOCK_ACTIVITIES } from '../lib/workbenchMockData';
import { createSmartDropConfig } from '../lib/dropIntegration';

export function AIGrowthWorkbench() {
  // State
  const [items, setItems] = useState<LeadLite[]>(MOCK_LEADS);
  const [activeId, setActiveId] = useState<string>(MOCK_LEADS[0]?.id);
  const [viewMode, setViewMode] = useState<ViewMode>('work');
  const [activeStage, setActiveStage] = useState<BusinessStage>('lead');
  const [activeSmartView, setActiveSmartView] = useState<SmartView>('ai_recommended');
  const [showDropCreator, setShowDropCreator] = useState(false);
  const [showSnoozePicker, setShowSnoozePicker] = useState(false);
  const [currentDropConfig, setCurrentDropConfig] = useState<DropConfig | null>(null);
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(true);
  
  // Get filtered items based on stage and smart view
  const getFilteredItems = (): LeadLite[] => {
    let filtered = items.filter(item => item.businessStage === activeStage);
    
    // Apply Smart View logic
    if (activeStage === 'lead') {
      switch (activeSmartView as LeadSmartView) {
        case 'ai_recommended':
          filtered = filtered
            .filter(l => l.priority.score >= 75)
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
          
        case 'recent_activity':
          filtered = filtered
            .filter(l => {
              if (!l.lastActivityAt) return false;
              const hoursSince = (Date.now() - new Date(l.lastActivityAt).getTime()) / 3600000;
              return hoursSince <= 48;
            })
            .sort((a, b) => {
              const timeA = new Date(a.lastActivityAt!).getTime();
              const timeB = new Date(b.lastActivityAt!).getTime();
              return timeB - timeA;
            });
          break;
          
        case 'new_leads':
          filtered = filtered
            .filter(l => {
              const hoursSince = (Date.now() - new Date(l.createdAt).getTime()) / 3600000;
              return hoursSince <= 48;
            })
            .sort((a, b) => {
              const timeA = new Date(a.createdAt).getTime();
              const timeB = new Date(b.createdAt).getTime();
              return timeB - timeA;
            });
          break;
          
        case 'key_signals':
          filtered = filtered
            .filter(l => l.tags.includes('key_signal'))
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
          
        case 'pending_triage':
          filtered = filtered
            .filter(l => !l.lastActivityAt)
            .sort((a, b) => {
              const timeA = new Date(a.createdAt).getTime();
              const timeB = new Date(b.createdAt).getTime();
              return timeB - timeA;
            });
          break;
      }
    }
    
    if (activeStage === 'opportunity') {
      switch (activeSmartView as OpportunitySmartView) {
        case 'ai_recommended':
          filtered = filtered
            .filter(o => o.priority.score >= 70)
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
          
        case 'ready_to_close':
          filtered = filtered
            .filter(o => 
              o.pipelineStage === 'Negotiation' && 
              !o.tags.includes('stall_risk')
            )
            .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0));
          break;
          
        case 'stalled':
          filtered = filtered
            .filter(o => o.tags.includes('stall_risk'))
            .sort((a, b) => {
              const timeA = new Date(a.lastActivityAt || a.createdAt).getTime();
              const timeB = new Date(b.lastActivityAt || b.createdAt).getTime();
              return timeA - timeB;
            });
          break;
          
        case 'high_value':
          filtered = filtered
            .filter(o => (o.dealValue || 0) >= 50000)
            .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0));
          break;
      }
    }
    
    if (activeStage === 'customer') {
      switch (activeSmartView as CustomerSmartView) {
        case 'ai_recommended':
          filtered = filtered
            .filter(c => 
              c.tags.includes('churn_warning') || 
              c.tags.includes('upsell_opportunity') ||
              c.tags.includes('renewal_soon')
            )
            .sort((a, b) => {
              const scoreA = a.tags.includes('churn_warning') ? 100 : 
                            a.tags.includes('renewal_soon') ? 80 : 60;
              const scoreB = b.tags.includes('churn_warning') ? 100 : 
                            b.tags.includes('renewal_soon') ? 80 : 60;
              return scoreB - scoreA;
            });
          break;
          
        case 'at_risk':
          filtered = filtered
            .filter(c => 
              c.tags.includes('churn_warning') || 
              c.tags.includes('health_declining')
            )
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
          
        case 'expansion':
          filtered = filtered
            .filter(c => c.tags.includes('upsell_opportunity'))
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
          
        case 'renewal_due':
          filtered = filtered
            .filter(c => c.tags.includes('renewal_soon'))
            .sort((a, b) => b.priority.score - a.priority.score);
          break;
      }
    }
    
    return filtered;
  };
  
  const filteredItems = getFilteredItems();
  const activeLead = filteredItems.find(item => item.id === activeId) || filteredItems[0];
  const activities = activeLead ? (MOCK_ACTIVITIES[activeLead.id] || []) : [];
  
  // Handle stage change - reset smart view
  const handleStageChange = (stage: BusinessStage) => {
    setActiveStage(stage);
    setActiveSmartView('ai_recommended');
    // Auto-select first item in new stage
    const newFiltered = items.filter(item => item.businessStage === stage);
    if (newFiltered.length > 0) {
      setActiveId(newFiltered[0].id);
    }
  };
  
  // Handle smart view change
  const handleSmartViewChange = (view: SmartView) => {
    setActiveSmartView(view);
  };
  
  // Update active ID when filtered items change
  useEffect(() => {
    if (!filteredItems.find(item => item.id === activeId) && filteredItems.length > 0) {
      setActiveId(filteredItems[0].id);
    }
  }, [filteredItems, activeId]);
  
  // Navigation
  const navigatePrev = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === activeId);
    if (currentIndex > 0) {
      setActiveId(filteredItems[currentIndex - 1].id);
    }
  };
  
  const navigateNext = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === activeId);
    if (currentIndex < filteredItems.length - 1) {
      setActiveId(filteredItems[currentIndex + 1].id);
    }
  };
  
  const advance = () => {
    setTimeout(() => {
      navigateNext();
    }, 500);
  };
  
  // Drop Integration
  const handlePrepareSmartDrop = (step: NextStep) => {
    if (!activeLead) return;
    const config = createSmartDropConfig(activeLead, step);
    setCurrentDropConfig(config);
    setShowDropCreator(true);
  };
  
  const handlePrepareDifferentDrop = () => {
    if (!activeLead) return;
    const config = createSmartDropConfig(activeLead, activeLead.nextStep);
    config.materialPool = undefined; // Allow user to choose
    setCurrentDropConfig(config);
    setShowDropCreator(true);
  };
  
  const handleCreateDrop = (config: DropConfig) => {
    toast.success(`Drop created for ${config.recipient.name}`, {
      description: `Material Pool: ${config.materialPool?.name || 'Custom'}`,
      action: {
        label: 'View',
        onClick: () => console.log('View drop')
      }
    });
    setShowDropCreator(false);
    advance();
  };
  
  // Quick Actions
  const handleQuickAction = (type: NextStepPrimitive | 'log_activity' | 'snooze' | 'ignore') => {
    if (!activeLead) return;
    
    switch (type) {
      case 'snooze':
        setShowSnoozePicker(true);
        break;
        
      case 'ignore':
        toast.success(`Archived ${activeLead.name}`, {
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo archive')
          }
        });
        advance();
        break;
        
      case 'log_activity':
        toast.success(`Activity logged for ${activeLead.name}`);
        advance();
        break;
        
      case 'send_drop':
        handlePrepareDifferentDrop();
        break;
        
      case 'schedule_call':
        toast.success(`Meeting scheduled with ${activeLead.name}`);
        advance();
        break;
        
      default:
        toast.success(`Action: ${type}`);
        advance();
    }
  };
  
  const handleSnooze = (whenISO: string) => {
    if (!activeLead) return;
    const date = new Date(whenISO);
    toast.success(`Reminder set for ${activeLead.name}`, {
      description: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo snooze')
      }
    });
    setShowSnoozePicker(false);
    advance();
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'j') {
        navigateNext();
      } else if (e.key === 'k') {
        navigatePrev();
      } else if (e.key === 's') {
        setShowSnoozePicker(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, activeId]);
  
  if (viewMode === 'table') {
    return (
      <div className="h-screen flex flex-col">
        <CommandBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenCommandPalette={() => {}}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-xl text-gray-600 mb-2">Table View</h3>
            <p className="text-sm text-gray-500">Coming soon - switch to Work view to use the workbench</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!activeLead) {
    return (
      <div className="h-screen flex flex-col">
        <CommandBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenCommandPalette={() => {}}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-xl text-gray-600 mb-2">No items in queue</h3>
            <p className="text-sm text-gray-500">All caught up!</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      <CommandBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCommandPalette={() => toast.info('Command palette coming soon')}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Focus Queue */}
        <FocusQueue
          items={filteredItems}
          activeId={activeId}
          activeStage={activeStage}
          activeSmartView={activeSmartView}
          onSelect={setActiveId}
          onStageChange={handleStageChange}
          onSmartViewChange={handleSmartViewChange}
        />
        
        {/* Work Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Work Hero */}
            <WorkHero
              lead={activeLead}
              onPrepareSmartDrop={handlePrepareSmartDrop}
              onPrepareDifferentDrop={handlePrepareDifferentDrop}
              onWhy={() => toast.info('AI reasoning coming soon')}
            />
            
            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />
            
            {/* Keyboard Shortcuts Hint */}
            <div className="text-center py-4 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-white rounded border mx-1">J</kbd> Next •
              <kbd className="px-2 py-1 bg-white rounded border mx-1">K</kbd> Previous •
              <kbd className="px-2 py-1 bg-white rounded border mx-1">S</kbd> Snooze
            </div>
          </div>
        </div>
        
        {/* Insights Panel */}
        <InsightsPanel
          lead={activeLead}
          activities={activities}
          isOpen={insightsPanelOpen}
          onToggle={() => setInsightsPanelOpen(!insightsPanelOpen)}
        />
      </div>
      
      {/* Dialogs */}
      {currentDropConfig && (
        <DropCreator
          isOpen={showDropCreator}
          onClose={() => setShowDropCreator(false)}
          dropConfig={currentDropConfig}
          onCreateDrop={handleCreateDrop}
        />
      )}
      
      <SnoozePicker
        isOpen={showSnoozePicker}
        onClose={() => setShowSnoozePicker(false)}
        onSnooze={handleSnooze}
      />
    </div>
  );
}
