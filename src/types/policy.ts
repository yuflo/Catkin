/**
 * 统一的策略(Policy)数据类型定义
 * 用于 Settings 和 Fast Create Drop 的数据共享
 */

import { LucideIcon } from 'lucide-react';

// 策略 ID 类型
export type PolicyId = string;

// 策略配置接口
export interface PolicyConfig {
  // 访问模式
  accessMode?: 'public' | 'email-gated' | 'password-protected';
  
  // 必填字段
  requiredFields: string[];
  
  // 可见内容级别
  visibleContentLevels: ('public' | 'authenticated' | 'internal')[];
  
  // 下载策略
  downloadPolicy: 'unguarded' | 'guarded' | 'disabled';
  
  // 水印设置
  watermark: 'enabled' | 'disabled';
  
  // 链接有效期（天数）
  linkValidityDays: number | null; // null = 永不过期
  
  // 其他配置
  [key: string]: any;
}

// 完整的策略数据结构
export interface Policy {
  // 唯一标识
  id: PolicyId;
  
  // 策略名称
  name: string;
  
  // 标语（简短描述）
  tagline: string;
  
  // 详细描述
  description: string;
  
  // 图标组件
  icon: LucideIcon;
  
  // 图标背景色（Tailwind class）
  iconBg: string;
  
  // 图标颜色（Tailwind class）
  iconColor: string;
  
  // 是否为标准策略（标准策略不可删除，但可复制）
  isStandard: boolean;
  
  // 是否为默认策略
  isDefault?: boolean;
  
  // 策略配置
  config: PolicyConfig;
  
  // 如果是自定义策略，记录基于哪个策略创建
  basedOn?: PolicyId;
  basedOnName?: string;
  
  // 创建时间
  createdAt?: string;
  
  // 更新时间
  updatedAt?: string;
}

// 辅助函数：格式化内容级别显示
export function formatContentLevels(levels: string[]): string {
  if (levels.length === 3) return 'All levels';
  if (levels.length === 0) return 'None';
  
  const labelMap: Record<string, string> = {
    'public': 'Public',
    'authenticated': 'Auth',
    'internal': 'Internal'
  };
  
  return levels.map(l => labelMap[l] || l).join(', ');
}

// 辅助函数：创建自定义策略
export function createCustomPolicy(
  basePolicy: Policy,
  customName: string,
  customConfig: Partial<PolicyConfig>
): Policy {
  return {
    ...basePolicy,
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: customName,
    isStandard: false,
    isDefault: false,
    basedOn: basePolicy.id,
    basedOnName: basePolicy.name,
    config: {
      ...basePolicy.config,
      ...customConfig
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
