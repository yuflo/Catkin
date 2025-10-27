/**
 * Drop Scene Template Type Definitions
 * 统一管理Drop Scene Template的数据结构
 */

export type TemplateType = 'simple-catalog' | 'catalog-quote' | 'product-updates' | 'page-embed';
export type PricePresentation = 'visible' | 'reference' | 'blurred' | 'hidden';
export type GridDensity = 'compact' | 'comfortable';

export interface SceneTemplate {
  id: string;
  name: string;
  version: number;
  template: TemplateType;
  stage: string;
  intent: string;
  
  // Field visibility configuration
  fieldVisibility: {
    price: boolean;
    stock: boolean;
    moq: boolean;
    category: boolean;
    shortDescription: boolean;
    docsTab: boolean;
  };
  
  // Price display configuration
  pricePresentation: PricePresentation;
  
  // Grid layout configuration
  gridConfig: {
    density: GridDensity;
    columns: number;
    showPriceBadge: boolean;
  };
  
  // CTA configuration
  primaryCTA: {
    label: string;
    action: string;
  };
  secondaryCTA?: {
    label: string;
    action: string;
  };
  
  // Feature toggles
  features: {
    itemSelection: boolean;
    notesField: boolean;
    wishList: boolean;
    followUpdates: boolean;
    quickActions: boolean;
    faq: boolean;
  };
  
  // Analytics signals
  signals: string[];
  
  // Optional disclaimer text
  disclaimerText?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  usageCount: number;
  isDefault: boolean;
}

/**
 * Helper function to create a new Scene Template with default values
 */
export function createSceneTemplate(partial: Partial<SceneTemplate> & { name: string; template: TemplateType }): SceneTemplate {
  return {
    id: partial.id || `scene-${Date.now()}`,
    name: partial.name,
    version: partial.version || 1,
    template: partial.template,
    stage: partial.stage || 'General',
    intent: partial.intent || '',
    fieldVisibility: {
      price: true,
      stock: true,
      moq: true,
      category: true,
      shortDescription: true,
      docsTab: false,
      ...partial.fieldVisibility
    },
    pricePresentation: partial.pricePresentation || 'visible',
    gridConfig: {
      density: 'comfortable',
      columns: 3,
      showPriceBadge: true,
      ...partial.gridConfig
    },
    primaryCTA: partial.primaryCTA || {
      label: 'Contact Sales',
      action: 'cta_contact'
    },
    secondaryCTA: partial.secondaryCTA,
    features: {
      itemSelection: false,
      notesField: false,
      wishList: true,
      followUpdates: false,
      quickActions: false,
      faq: false,
      ...partial.features
    },
    signals: partial.signals || ['view_start', 'identify_success'],
    disclaimerText: partial.disclaimerText,
    createdBy: partial.createdBy || 'User',
    createdAt: partial.createdAt || new Date().toISOString(),
    updatedAt: partial.updatedAt,
    usageCount: partial.usageCount || 0,
    isDefault: partial.isDefault || false
  };
}

/**
 * Validate if a Scene Template has all required fields
 */
export function validateSceneTemplate(template: Partial<SceneTemplate>): boolean {
  return !!(
    template.name &&
    template.template &&
    template.fieldVisibility &&
    template.gridConfig &&
    template.primaryCTA &&
    template.features &&
    template.signals
  );
}

/**
 * Clone a Scene Template with a new name and ID
 */
export function cloneSceneTemplate(template: SceneTemplate, newName: string): SceneTemplate {
  return {
    ...template,
    id: `scene-${Date.now()}`,
    name: newName,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
    usageCount: 0,
    isDefault: false
  };
}
