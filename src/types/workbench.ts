// AI Growth Workbench Type Definitions

export type BusinessStage = 'lead' | 'opportunity' | 'customer';

export type LeadTag = 
  | 'precise_match'
  | 'key_signal'
  | 'quality_source'
  | 'data_incomplete';

export type OpportunityTag = 
  | 'advancing'
  | 'stall_risk'
  | 'decision_maker'
  | 'competitor'
  | 'budget_confirmed';

export type CustomerTag = 
  | 'upsell_opportunity'
  | 'churn_warning'
  | 'health_declining'
  | 'power_user'
  | 'renewal_soon';

export type StageTag = LeadTag | OpportunityTag | CustomerTag;

export type PipelineStage = 
  | 'Discovery'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type Source = 
  | 'Website'
  | 'LinkedIn'
  | 'Email Campaign'
  | 'Referral'
  | 'Trade Show'
  | 'Cold Outreach'
  | 'Partner'
  | 'Direct';

export interface PriorityMatrix {
  value: 'high' | 'medium' | 'low';
  intent: 'high' | 'medium' | 'low';
  score: number; // 0-100
}

export type NextStepPrimitive = 
  | 'send_drop'
  | 'schedule_call'
  | 'send_proposal'
  | 'follow_up'
  | 'technical_session'
  | 'demo'
  | 'contract_review'
  | 'check_in'
  | 'upsell_pitch'
  | 'renewal_discussion';

export interface NextStep {
  primitive: NextStepPrimitive;
  label: string;
  description: string;
  materialPoolHint?: string;
}

export interface Suggestion {
  primary: NextStep;
  alternatives?: NextStep[];
}

export interface LeadLite {
  id: string;
  name: string;
  org?: string;
  role?: string;
  source: Source;
  
  businessStage: BusinessStage;
  priority: PriorityMatrix;
  tags: StageTag[];
  
  createdAt: string;
  lastActivityAt?: string;
  
  // Opportunity fields
  dealValue?: number;
  pipelineStage?: PipelineStage;
  
  // Customer fields
  customerSince?: string;
  
  aiInsight?: string;
  nextStep: NextStep;
  
  lastTouch?: { type: string; at: string };
  owner?: { id: string; name: string };
}

// Smart View Types
export type LeadSmartView = 
  | 'ai_recommended'
  | 'recent_activity'
  | 'new_leads'
  | 'key_signals'
  | 'pending_triage'
  | 'all';

export type OpportunitySmartView = 
  | 'ai_recommended'
  | 'ready_to_close'
  | 'stalled'
  | 'high_value'
  | 'all';

export type CustomerSmartView = 
  | 'ai_recommended'
  | 'at_risk'
  | 'expansion'
  | 'renewal_due'
  | 'all';

export type SmartView = LeadSmartView | OpportunitySmartView | CustomerSmartView;

// Drop Integration Types
export type DropIntent = 
  | 'sales_follow_up'
  | 'onboarding'
  | 'retention'
  | 'upsell'
  | 'general';

export interface MaterialPool {
  id: string;
  name: string;
  intent: DropIntent;
  description?: string;
  templateCount: number;
}

export interface DropConfig {
  intent: DropIntent;
  recipient: {
    id: string;
    name: string;
    email?: string;
  };
  materialPool?: MaterialPool;
  prefilledSubject?: string;
  prefilledContent?: string;
}

export type ViewMode = 'work' | 'table';

export interface Activity {
  id: string;
  type: 'email_sent' | 'email_opened' | 'link_clicked' | 'meeting_scheduled' | 'call_completed' | 'note_added';
  description: string;
  timestamp: string;
  actor?: string;
}
