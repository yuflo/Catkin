/**
 * Standard Drop Scene Templates
 * 预定义的标准 Drop Scene 模板库
 * 这些是系统内置的 4 个核心模板
 */

import { DropSceneTemplate } from '../types/dropSceneTemplate';
import { Layout, FileText, Zap, Share2 } from 'lucide-react';

export const STANDARD_DROP_SCENE_TEMPLATES: DropSceneTemplate[] = [
  {
    id: 'simple-catalog',
    name: 'Simple Catalog',
    subtitle: 'Quick browse + with instant capture',
    icon: Layout,
    iconBg: 'bg-blue-500',
    dna: ['Catalog Grid', 'Product Cards', 'Instant Capture CTA'],
    tags: ['lead_gen', 'nurturing'],
    availableAddons: [
      {
        id: 'lead-form-enhancements',
        label: 'Lead Form Enhancements',
        description: 'Adds custom fields section before CTA',
        impact: 'Shows additional qualification fields in the contact form.'
      }
    ],
    createdBy: 'System',
    createdAt: '2024-01-01T00:00:00.000Z',
    usageCount: 0,
    isDefault: true
  },
  {
    id: 'catalog-quote',
    name: 'Catalog + Quote',
    subtitle: 'Follow-up focused w/lead capture',
    icon: FileText,
    iconBg: 'bg-purple-500',
    dna: ['Quote List', 'Item Selection', 'Summary Panel'],
    tags: ['sales', 'nurturing'],
    availableAddons: [
      {
        id: 'lead-form-enhancements-quote',
        label: 'Lead Form Enhancements',
        description: 'Adds custom fields section before CTA',
        impact: 'Shows additional qualification fields in the contact form.'
      },
      {
        id: 'quote-summary',
        label: 'Quote Summary Panel',
        description: 'Fixed footer with selected items + subtotal',
        impact: 'Shows sticky bottom bar with selection count and subtotal.'
      },
      {
        id: 'moq-disclosure',
        label: 'MOQ & Lead-time Disclosure',
        description: 'Shows minimum order quantities and delivery estimates',
        impact: 'Displays ordering information panel above selection summary.'
      }
    ],
    createdBy: 'System',
    createdAt: '2024-01-01T00:00:00.000Z',
    usageCount: 0,
    isDefault: true
  },
  {
    id: 'directory-nate-show',
    name: 'Directory / Nate Show',
    subtitle: 'List-view with lead capture',
    icon: Zap,
    iconBg: 'bg-emerald-500',
    dna: ['Spec Blocks', 'Contents Panel', 'Dual CTA'],
    tags: ['sales'],
    availableAddons: [
      {
        id: 'lead-form-enhancements-directory',
        label: 'Lead Form Enhancements',
        description: 'Adds custom fields section before CTA',
        impact: 'Shows additional qualification fields in the contact form.'
      },
      {
        id: 'download-center',
        label: 'Download Center',
        description: 'Adds files block under specs',
        impact: 'Shows document library section with PDFs, specs, and CAD files.'
      }
    ],
    createdBy: 'System',
    createdAt: '2024-01-01T00:00:00.000Z',
    usageCount: 0,
    isDefault: true
  },
  {
    id: 'discovery-nate-show',
    name: 'Discovery / Nate Show',
    subtitle: 'Multi-item browsing with chat',
    icon: Share2,
    iconBg: 'bg-emerald-500',
    dna: ['Chat Shortcuts', 'Greeting Bubble', 'Action Rows'],
    tags: ['lead_gen'],
    availableAddons: [
      {
        id: 'lead-form-enhancements-discovery',
        label: 'Lead Form Enhancements',
        description: 'Adds custom fields section before CTA',
        impact: 'Shows additional qualification fields in the contact form.'
      },
      {
        id: 'live-chat-widget',
        label: 'Live Chat Widget',
        description: 'Embeds real-time chat',
        impact: 'Floating chat bubble in bottom-right corner.'
      }
    ],
    createdBy: 'System',
    createdAt: '2024-01-01T00:00:00.000Z',
    usageCount: 0,
    isDefault: true
  }
];

/**
 * Get a template by ID
 */
export function getDropSceneTemplateById(id: string): DropSceneTemplate | undefined {
  return STANDARD_DROP_SCENE_TEMPLATES.find(t => t.id === id);
}

/**
 * Get default enabled addons for a template
 */
export function getDefaultEnabledAddons(templateId: string): string[] {
  switch (templateId) {
    case 'catalog-quote':
      return ['moq-disclosure'];
    case 'directory-nate-show':
      return ['download-center'];
    default:
      return [];
  }
}
