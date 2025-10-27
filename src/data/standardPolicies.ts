/**
 * 标准策略（Standard Policies）默认数据
 * 这些是系统预设的策略，不可删除但可以复制和修改
 */

import { Globe, Mail, Lock } from 'lucide-react';
import { Policy } from '../types/policy';

export const STANDARD_POLICIES: Policy[] = [
  {
    id: 'public-promo',
    name: 'Public Promo',
    tagline: 'Maximum Reach & Frictionless Access',
    description: 'Eliminate all barriers for maximum discoverability and viral potential. Perfect for launches, campaigns, and brand awareness.',
    icon: Globe,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    isStandard: true,
    isDefault: false,
    config: {
      accessMode: 'public',
      requiredFields: [],
      visibleContentLevels: ['public', 'authenticated'],
      downloadPolicy: 'unguarded',
      watermark: 'disabled',
      linkValidityDays: null // Never expires
    }
  },
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    tagline: 'Gated Access for Lead Generation',
    description: 'Balance accessibility with lead capture. Viewers provide contact info before accessing premium content. Ideal for demand gen and nurture campaigns.',
    icon: Mail,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    isStandard: true,
    isDefault: true,
    config: {
      accessMode: 'email-gated',
      requiredFields: ['email'],
      visibleContentLevels: ['public', 'authenticated'],
      downloadPolicy: 'guarded',
      watermark: 'disabled',
      linkValidityDays: 90
    }
  },
  {
    id: 'private-share',
    name: 'Private Share',
    tagline: 'Controlled Access for Sensitive Content',
    description: 'Maximum control for confidential materials. Password-protected with watermarks and download restrictions. Perfect for pre-release, NDA, and executive sharing.',
    icon: Lock,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    isStandard: true,
    isDefault: false,
    config: {
      accessMode: 'password-protected',
      requiredFields: [],
      visibleContentLevels: ['authenticated', 'internal'],
      downloadPolicy: 'disabled',
      watermark: 'enabled',
      linkValidityDays: 14
    }
  }
];

// 辅助函数：根据 ID 获取标准策略
export function getStandardPolicyById(id: string): Policy | undefined {
  return STANDARD_POLICIES.find(p => p.id === id);
}

// 辅助函数：获取默认策略
export function getDefaultPolicy(): Policy {
  return STANDARD_POLICIES.find(p => p.isDefault) || STANDARD_POLICIES[0];
}
