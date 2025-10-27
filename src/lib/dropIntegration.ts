// Drop Framework Integration Logic

import type { LeadLite, NextStep, MaterialPool, DropConfig, DropIntent } from '../types/workbench';

// Mock Material Pools
export const MATERIAL_POOLS: MaterialPool[] = [
  {
    id: 'pool-intro-demo',
    name: 'Product Introduction & Demo',
    intent: 'sales_follow_up',
    description: 'Initial product overview and demo materials',
    templateCount: 8
  },
  {
    id: 'pool-tech-qa',
    name: 'Technical Q&A Session',
    intent: 'sales_follow_up',
    description: 'Technical deep-dive and FAQ materials',
    templateCount: 5
  },
  {
    id: 'pool-proposal-followup',
    name: 'Proposal Follow-up',
    intent: 'sales_follow_up',
    description: 'Proposal review and clarification materials',
    templateCount: 6
  },
  {
    id: 'pool-reengagement',
    name: 'Re-engagement Campaign',
    intent: 'sales_follow_up',
    description: 'Materials to re-engage stalled opportunities',
    templateCount: 7
  },
  {
    id: 'pool-onboarding',
    name: 'Customer Onboarding',
    intent: 'onboarding',
    description: 'Welcome and getting started materials',
    templateCount: 10
  },
  {
    id: 'pool-retention',
    name: 'Customer Retention',
    intent: 'retention',
    description: 'Health check and retention materials',
    templateCount: 8
  },
  {
    id: 'pool-upsell',
    name: 'Upsell & Expansion',
    intent: 'upsell',
    description: 'Growth and expansion opportunity materials',
    templateCount: 6
  },
  {
    id: 'pool-renewal',
    name: 'Contract Renewal',
    intent: 'retention',
    description: 'Renewal discussion and materials',
    templateCount: 5
  }
];

export function selectMaterialPool(lead: LeadLite, nextStep: NextStep): MaterialPool | undefined {
  const { businessStage, tags, pipelineStage } = lead;
  const stepLabel = nextStep.label.toLowerCase();
  const stepPrimitive = nextStep.primitive;
  
  // Lead stage
  if (businessStage === 'lead') {
    if (tags.includes('key_signal') || tags.includes('precise_match')) {
      if (stepLabel.includes('technical') || stepLabel.includes('q&a') || stepPrimitive === 'technical_session') {
        return MATERIAL_POOLS.find(p => p.id === 'pool-tech-qa');
      }
      return MATERIAL_POOLS.find(p => p.id === 'pool-intro-demo');
    }
    return MATERIAL_POOLS.find(p => p.id === 'pool-intro-demo');
  }
  
  // Opportunity stage
  if (businessStage === 'opportunity') {
    if (tags.includes('stall_risk')) {
      return MATERIAL_POOLS.find(p => p.id === 'pool-reengagement');
    }
    if (pipelineStage === 'Negotiation' || pipelineStage === 'Proposal') {
      if (stepLabel.includes('technical') || stepLabel.includes('q&a') || stepPrimitive === 'technical_session') {
        return MATERIAL_POOLS.find(p => p.id === 'pool-tech-qa');
      }
      return MATERIAL_POOLS.find(p => p.id === 'pool-proposal-followup');
    }
    return MATERIAL_POOLS.find(p => p.id === 'pool-proposal-followup');
  }
  
  // Customer stage
  if (businessStage === 'customer') {
    if (tags.includes('churn_warning') || tags.includes('health_declining')) {
      return MATERIAL_POOLS.find(p => p.id === 'pool-retention');
    }
    if (tags.includes('upsell_opportunity')) {
      return MATERIAL_POOLS.find(p => p.id === 'pool-upsell');
    }
    if (tags.includes('renewal_soon')) {
      return MATERIAL_POOLS.find(p => p.id === 'pool-renewal');
    }
    return MATERIAL_POOLS.find(p => p.id === 'pool-onboarding');
  }
  
  return undefined;
}

export function determineDropIntent(lead: LeadLite): DropIntent {
  const { businessStage, tags } = lead;
  
  if (businessStage === 'customer') {
    if (tags.includes('churn_warning') || tags.includes('health_declining') || tags.includes('renewal_soon')) {
      return 'retention';
    }
    if (tags.includes('upsell_opportunity')) {
      return 'upsell';
    }
    return 'onboarding';
  }
  
  if (businessStage === 'opportunity' || businessStage === 'lead') {
    return 'sales_follow_up';
  }
  
  return 'general';
}

export function generateEmail(lead: LeadLite): string {
  const firstName = lead.name.split(' ')[0].toLowerCase();
  const orgSlug = lead.org?.toLowerCase().replace(/\s+/g, '') || 'example';
  return `${firstName}@${orgSlug}.com`;
}

export function generateSubject(lead: LeadLite, nextStep: NextStep): string {
  const firstName = lead.name.split(' ')[0];
  return `${nextStep.label} - ${firstName}`;
}

export function generatePreview(lead: LeadLite, nextStep: NextStep): string {
  const firstName = lead.name.split(' ')[0];
  return `Hi ${firstName},\n\n${nextStep.description}\n\nLooking forward to connecting!\n\nBest regards`;
}

export function createSmartDropConfig(lead: LeadLite, nextStep: NextStep): DropConfig {
  const intent = determineDropIntent(lead);
  const materialPool = selectMaterialPool(lead, nextStep);
  
  return {
    intent,
    recipient: {
      id: lead.id,
      name: lead.name,
      email: generateEmail(lead)
    },
    materialPool,
    prefilledSubject: generateSubject(lead, nextStep),
    prefilledContent: generatePreview(lead, nextStep)
  };
}
