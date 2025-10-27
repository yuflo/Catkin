/**
 * Intent-based Smart Recommendations
 * 基于业务场景的智能推荐配置模块
 */

import { IntentTag } from '../types/dropSceneTemplate';

export interface IntentRecommendation {
  intent: IntentTag;
  recommendedPolicyId: string;
  recommendedTemplateId: string;
  showRecipient: boolean;
  defaultRecipientSelected: boolean;
  description: string;
}

/**
 * 智能推荐配置表
 * 定义每个业务场景下的默认推荐策略
 */
export const INTENT_RECOMMENDATIONS: Record<IntentTag, IntentRecommendation> = {
  lead_gen: {
    intent: 'lead_gen',
    recommendedPolicyId: 'lead-capture',
    recommendedTemplateId: 'simple-catalog',
    showRecipient: false,
    defaultRecipientSelected: false,
    description: 'Optimized for maximum reach and lead capture'
  },
  sales: {
    intent: 'sales',
    recommendedPolicyId: 'private-share',
    recommendedTemplateId: 'catalog-quote',
    showRecipient: true,
    defaultRecipientSelected: false,
    description: 'Configured for personalized sales follow-up'
  },
  nurturing: {
    intent: 'nurturing',
    recommendedPolicyId: 'private-share',
    recommendedTemplateId: 'simple-catalog',
    showRecipient: true,
    defaultRecipientSelected: false,
    description: 'Tailored for customer relationship maintenance'
  }
};

/**
 * 获取指定业务场景的推荐配置
 */
export function getRecommendationForIntent(intent: IntentTag): IntentRecommendation {
  return INTENT_RECOMMENDATIONS[intent];
}

/**
 * 检查指定的策略是否是当前场景的推荐策略
 */
export function isPolicyRecommended(policyId: string, intent: IntentTag): boolean {
  return INTENT_RECOMMENDATIONS[intent].recommendedPolicyId === policyId;
}

/**
 * 检查指定的模板是否是当前场景的推荐模板
 */
export function isTemplateRecommended(templateId: string, intent: IntentTag): boolean {
  return INTENT_RECOMMENDATIONS[intent].recommendedTemplateId === templateId;
}
