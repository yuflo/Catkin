/**
 * Drop Scene Template Types
 * 定义 Drop Scene Template 的完整数据结构
 * 这是 DropSceneTemplatesOverview 组件使用的数据模型
 */

import { LucideIcon } from 'lucide-react';

/**
 * Template ID - 模板的唯一标识符
 */
export type TemplateId = 'simple-catalog' | 'catalog-quote' | 'directory-nate-show' | 'discovery-nate-show';

/**
 * Addon - 可选增强功能
 */
export interface Addon {
  id: string;
  label: string;
  description: string;
  impact: string;
}

/**
 * Intent Tags - 业务场景标签
 */
export type IntentTag = 'lead_gen' | 'sales' | 'nurturing';

/**
 * DropSceneTemplate - Drop Scene 模板完整配置
 */
export interface DropSceneTemplate {
  id: TemplateId;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  dna: string[]; // 模板的核心特性列表
  availableAddons: Addon[]; // 可用的增强功能
  tags?: IntentTag[]; // 业务场景标签（用于情景化推荐）
  createdBy?: string;
  createdAt?: string;
  usageCount?: number;
  isDefault?: boolean;
}

/**
 * TemplateConfiguration - 模板的运行时配置
 * 用于存储用户选择的模板和启用的 addons
 */
export interface TemplateConfiguration {
  templateId: TemplateId;
  enabledAddons: string[]; // Addon IDs
  customSettings?: Record<string, any>;
}
