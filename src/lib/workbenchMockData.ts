// Mock Data for AI Growth Workbench

import type { LeadLite, Activity } from '../types/workbench';

export const MOCK_LEADS: LeadLite[] = [
  // High-Priority Leads
  {
    id: 'lead-001',
    name: 'Sarah Chen',
    org: 'TechVision Inc',
    role: 'VP of Engineering',
    source: 'LinkedIn',
    businessStage: 'lead',
    priority: {
      value: 'high',
      intent: 'high',
      score: 92
    },
    tags: ['precise_match', 'key_signal', 'quality_source'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Strong ICP match with recent high-intent activity. Engaged with technical content.',
    nextStep: {
      primitive: 'technical_session',
      label: 'Schedule Technical Q&A',
      description: 'Based on recent engagement with technical documentation, propose a deep-dive session.',
      materialPoolHint: 'pool-tech-qa'
    },
    owner: { id: 'user-1', name: 'Alex Rivera' }
  },
  {
    id: 'lead-002',
    name: 'Michael Torres',
    org: 'DataFlow Systems',
    role: 'CTO',
    source: 'Website',
    businessStage: 'lead',
    priority: {
      value: 'high',
      intent: 'high',
      score: 88
    },
    tags: ['precise_match', 'key_signal'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Decision maker engaged with pricing page multiple times.',
    nextStep: {
      primitive: 'demo',
      label: 'Send Product Demo',
      description: 'Follow up on pricing inquiry with personalized product demonstration.',
      materialPoolHint: 'pool-intro-demo'
    },
    lastTouch: { type: 'Email opened', at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
  },
  {
    id: 'lead-003',
    name: 'Jennifer Wu',
    org: 'CloudScale',
    role: 'Director of Operations',
    source: 'Trade Show',
    businessStage: 'lead',
    priority: {
      value: 'medium',
      intent: 'high',
      score: 78
    },
    tags: ['quality_source', 'key_signal'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Met at booth, expressed strong interest in automation features.',
    nextStep: {
      primitive: 'follow_up',
      label: 'Trade Show Follow-up',
      description: 'Send follow-up materials from trade show conversation about automation.',
      materialPoolHint: 'pool-intro-demo'
    }
  },
  {
    id: 'lead-004',
    name: 'Robert Kim',
    org: 'FinTech Solutions',
    role: 'Product Manager',
    source: 'Email Campaign',
    businessStage: 'lead',
    priority: {
      value: 'medium',
      intent: 'medium',
      score: 65
    },
    tags: ['quality_source'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Opened multiple campaign emails, no direct engagement yet.',
    nextStep: {
      primitive: 'send_drop',
      label: 'Send Introduction',
      description: 'Introduce product value proposition based on campaign interest.',
      materialPoolHint: 'pool-intro-demo'
    }
  },
  {
    id: 'lead-005',
    name: 'Amanda Foster',
    org: 'RetailCorp',
    role: 'IT Director',
    source: 'Referral',
    businessStage: 'lead',
    priority: {
      value: 'high',
      intent: 'medium',
      score: 82
    },
    tags: ['quality_source', 'precise_match'],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    aiInsight: 'Referred by existing customer with similar use case.',
    nextStep: {
      primitive: 'demo',
      label: 'Schedule Demo',
      description: 'Leverage referral relationship to schedule personalized demo.',
      materialPoolHint: 'pool-intro-demo'
    }
  },

  // Opportunities
  {
    id: 'opp-001',
    name: 'David Martinez',
    org: 'GlobalTech Enterprises',
    role: 'VP of Sales',
    source: 'LinkedIn',
    businessStage: 'opportunity',
    priority: {
      value: 'high',
      intent: 'high',
      score: 95
    },
    tags: ['advancing', 'decision_maker', 'budget_confirmed'],
    dealValue: 125000,
    pipelineStage: 'Negotiation',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Strong momentum, budget approved. Near close.',
    nextStep: {
      primitive: 'contract_review',
      label: 'Send Final Proposal',
      description: 'Send contract for final review and signature.',
      materialPoolHint: 'pool-proposal-followup'
    },
    lastTouch: { type: 'Meeting completed', at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  },
  {
    id: 'opp-002',
    name: 'Lisa Anderson',
    org: 'MedHealth Systems',
    role: 'CFO',
    source: 'Direct',
    businessStage: 'opportunity',
    priority: {
      value: 'high',
      intent: 'medium',
      score: 72
    },
    tags: ['stall_risk', 'decision_maker'],
    dealValue: 89000,
    pipelineStage: 'Proposal',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'No activity for 2 weeks. Risk of stalling.',
    nextStep: {
      primitive: 'follow_up',
      label: 'Re-engagement Outreach',
      description: 'Check in on proposal status and address any concerns.',
      materialPoolHint: 'pool-reengagement'
    },
    lastTouch: { type: 'Email sent', at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() }
  },
  {
    id: 'opp-003',
    name: 'Thomas Brown',
    org: 'AutoMotive Plus',
    role: 'Operations Director',
    source: 'Partner',
    businessStage: 'opportunity',
    priority: {
      value: 'medium',
      intent: 'high',
      score: 76
    },
    tags: ['advancing'],
    dealValue: 45000,
    pipelineStage: 'Qualification',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Progressing well through qualification.',
    nextStep: {
      primitive: 'send_proposal',
      label: 'Send Initial Proposal',
      description: 'Move forward with custom proposal based on discovery.',
      materialPoolHint: 'pool-proposal-followup'
    }
  },
  {
    id: 'opp-004',
    name: 'Jessica Taylor',
    org: 'EduTech Corp',
    role: 'Head of IT',
    source: 'Trade Show',
    businessStage: 'opportunity',
    priority: {
      value: 'high',
      intent: 'high',
      score: 91
    },
    tags: ['advancing', 'decision_maker'],
    dealValue: 156000,
    pipelineStage: 'Negotiation',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Active engagement, near closing. Excellent fit.',
    nextStep: {
      primitive: 'technical_session',
      label: 'Final Technical Review',
      description: 'Address final technical questions before contract.',
      materialPoolHint: 'pool-tech-qa'
    }
  },

  // Customers
  {
    id: 'cust-001',
    name: 'Patricia White',
    org: 'Enterprise Solutions LLC',
    role: 'VP of Technology',
    source: 'Direct',
    businessStage: 'customer',
    priority: {
      value: 'high',
      intent: 'high',
      score: 94
    },
    tags: ['upsell_opportunity', 'power_user'],
    customerSince: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Heavy product usage, perfect for enterprise tier upgrade.',
    nextStep: {
      primitive: 'upsell_pitch',
      label: 'Propose Enterprise Upgrade',
      description: 'Present enterprise features based on current usage patterns.',
      materialPoolHint: 'pool-upsell'
    },
    lastTouch: { type: 'Support ticket resolved', at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  },
  {
    id: 'cust-002',
    name: 'James Wilson',
    org: 'Manufacturing Pro',
    role: 'CEO',
    source: 'Referral',
    businessStage: 'customer',
    priority: {
      value: 'high',
      intent: 'low',
      score: 85
    },
    tags: ['churn_warning', 'health_declining'],
    customerSince: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Usage declining significantly. Immediate attention required.',
    nextStep: {
      primitive: 'check_in',
      label: 'Urgent Health Check',
      description: 'Schedule call to understand concerns and prevent churn.',
      materialPoolHint: 'pool-retention'
    },
    lastTouch: { type: 'Last login', at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() }
  },
  {
    id: 'cust-003',
    name: 'Maria Garcia',
    org: 'LogiChain Inc',
    role: 'COO',
    source: 'Website',
    businessStage: 'customer',
    priority: {
      value: 'medium',
      intent: 'high',
      score: 78
    },
    tags: ['renewal_soon', 'power_user'],
    customerSince: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Contract renewal in 15 days. Strong usage signals.',
    nextStep: {
      primitive: 'renewal_discussion',
      label: 'Initiate Renewal Discussion',
      description: 'Start renewal conversation with multi-year proposal.',
      materialPoolHint: 'pool-renewal'
    }
  },
  {
    id: 'cust-004',
    name: 'Kevin Zhang',
    org: 'SmartRetail Co',
    role: 'CTO',
    source: 'LinkedIn',
    businessStage: 'customer',
    priority: {
      value: 'medium',
      intent: 'medium',
      score: 68
    },
    tags: ['upsell_opportunity'],
    customerSince: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    aiInsight: 'Approaching usage limits, good expansion opportunity.',
    nextStep: {
      primitive: 'upsell_pitch',
      label: 'Discuss Plan Upgrade',
      description: 'Present higher tier options before hitting limits.',
      materialPoolHint: 'pool-upsell'
    }
  }
];

export const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  'lead-001': [
    {
      id: 'act-001-1',
      type: 'link_clicked',
      description: 'Clicked technical documentation link',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'act-001-2',
      type: 'email_opened',
      description: 'Opened "Product Overview" email',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'act-001-3',
      type: 'note_added',
      description: 'Note: Strong technical interest, decision maker confirmed',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actor: 'Alex Rivera'
    }
  ],
  'opp-001': [
    {
      id: 'act-opp-001-1',
      type: 'meeting_scheduled',
      description: 'Final negotiation meeting scheduled',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'act-opp-001-2',
      type: 'email_sent',
      description: 'Sent updated contract terms',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  'cust-001': [
    {
      id: 'act-cust-001-1',
      type: 'call_completed',
      description: 'Discussed enterprise features',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actor: 'Alex Rivera'
    },
    {
      id: 'act-cust-001-2',
      type: 'note_added',
      description: 'Interest in API access and SSO features',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actor: 'Alex Rivera'
    }
  ]
};
