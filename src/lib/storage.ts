/**
 * 全局数据持久化存储
 * 使用 localStorage 模拟后端数据存储
 * 提供统一的数据访问和更新接口
 */

import { MaterialPool, ProductLibrary, Attachment } from '../components/PayloadsTab';
import { ScenePreset, AuthPreset } from '../components/SettingsTab';
import { Policy } from '../types/policy';
import { STANDARD_POLICIES } from '../data/standardPolicies';
import { DropSceneTemplate } from '../types/dropSceneTemplate';

// 存储键名常量
const STORAGE_KEYS = {
  MATERIAL_POOLS: 'distribute_v3_material_pools',
  PRODUCT_LIBRARIES: 'distribute_v3_product_libraries',
  GLOBAL_ATTACHMENTS: 'distribute_v3_global_attachments',
  SCENE_TEMPLATES: 'distribute_v3_scene_templates',
  AUTH_POLICIES: 'distribute_v3_auth_policies',
  CUSTOM_POLICIES: 'distribute_v3_custom_policies',
  DROP_SCENE_TEMPLATES: 'distribute_v3_drop_scene_templates',
  DROP_SCENE_WORK_STATE: 'distribute_v3_drop_scene_work_state',
  CONNECTED_CRM: 'distribute_v3_connected_crm',
} as const;

// ============= 通用存储方法 =============

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
  }
  return defaultValue;
}

function clearStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error);
  }
}

// ============= Material Pools =============

export function saveMaterialPools(pools: MaterialPool[]): void {
  saveToStorage(STORAGE_KEYS.MATERIAL_POOLS, pools);
}

export function loadMaterialPools(): MaterialPool[] {
  return loadFromStorage<MaterialPool[]>(STORAGE_KEYS.MATERIAL_POOLS, []);
}

export function addMaterialPool(pool: MaterialPool): void {
  const pools = loadMaterialPools();
  pools.push(pool);
  saveMaterialPools(pools);
}

export function updateMaterialPool(poolId: string, updatedPool: MaterialPool): void {
  const pools = loadMaterialPools();
  const index = pools.findIndex(p => p.id === poolId);
  if (index !== -1) {
    pools[index] = updatedPool;
    saveMaterialPools(pools);
  }
}

export function deleteMaterialPool(poolId: string): void {
  const pools = loadMaterialPools();
  const filtered = pools.filter(p => p.id !== poolId);
  saveMaterialPools(filtered);
}

// ============= Product Libraries =============

export function saveProductLibraries(libraries: ProductLibrary[]): void {
  saveToStorage(STORAGE_KEYS.PRODUCT_LIBRARIES, libraries);
}

export function loadProductLibraries(): ProductLibrary[] {
  return loadFromStorage<ProductLibrary[]>(STORAGE_KEYS.PRODUCT_LIBRARIES, []);
}

export function addProductLibrary(library: ProductLibrary): void {
  const libraries = loadProductLibraries();
  libraries.push(library);
  saveProductLibraries(libraries);
}

export function updateProductLibrary(libraryId: string, updatedLibrary: ProductLibrary): void {
  const libraries = loadProductLibraries();
  const index = libraries.findIndex(l => l.id === libraryId);
  if (index !== -1) {
    libraries[index] = updatedLibrary;
    saveProductLibraries(libraries);
  }
}

export function deleteProductLibrary(libraryId: string): void {
  const libraries = loadProductLibraries();
  const filtered = libraries.filter(l => l.id !== libraryId);
  saveProductLibraries(filtered);
}

// ============= Global Attachments =============

export function saveGlobalAttachments(attachments: Attachment[]): void {
  saveToStorage(STORAGE_KEYS.GLOBAL_ATTACHMENTS, attachments);
}

export function loadGlobalAttachments(): Attachment[] {
  return loadFromStorage<Attachment[]>(STORAGE_KEYS.GLOBAL_ATTACHMENTS, []);
}

export function addGlobalAttachment(attachment: Attachment): void {
  const attachments = loadGlobalAttachments();
  attachments.push(attachment);
  saveGlobalAttachments(attachments);
}

export function updateGlobalAttachment(attachmentId: string, updatedAttachment: Attachment): void {
  const attachments = loadGlobalAttachments();
  const index = attachments.findIndex(a => a.id === attachmentId);
  if (index !== -1) {
    attachments[index] = updatedAttachment;
    saveGlobalAttachments(attachments);
  }
}

export function deleteGlobalAttachment(attachmentId: string): void {
  const attachments = loadGlobalAttachments();
  const filtered = attachments.filter(a => a.id !== attachmentId);
  saveGlobalAttachments(filtered);
}

// ============= Scene Templates =============

/**
 * Save Scene Templates to localStorage
 */
export function saveSceneTemplates(templates: ScenePreset[]): void {
  saveToStorage(STORAGE_KEYS.SCENE_TEMPLATES, templates);
  console.log('💾 Scene Templates saved to localStorage:', templates.length);
}

/**
 * Load Scene Templates from localStorage
 * Returns stored templates or default templates if none exist
 */
export function loadSceneTemplates(defaultTemplates: ScenePreset[]): ScenePreset[] {
  const stored = loadFromStorage<ScenePreset[]>(STORAGE_KEYS.SCENE_TEMPLATES, []);
  // 如果没有存储的数据，返回默认模板
  const result = stored.length > 0 ? stored : defaultTemplates;
  console.log('📂 Scene Templates loaded:', result.length);
  return result;
}

/**
 * Update an existing Scene Template
 */
export function updateSceneTemplate(templateId: string, updatedTemplate: ScenePreset): void {
  const templates = loadSceneTemplates([]);
  const index = templates.findIndex(t => t.id === templateId);
  if (index !== -1) {
    templates[index] = {
      ...updatedTemplate,
      updatedAt: new Date().toISOString()
    };
    saveSceneTemplates(templates);
    console.log('✏️ Scene Template updated:', templateId);
  }
}

/**
 * Add a new Scene Template
 */
export function addSceneTemplate(template: ScenePreset): void {
  const templates = loadSceneTemplates([]);
  templates.push({
    ...template,
    createdAt: template.createdAt || new Date().toISOString()
  });
  saveSceneTemplates(templates);
  console.log('➕ Scene Template added:', template.id);
}

/**
 * Delete a Scene Template
 */
export function deleteSceneTemplate(templateId: string): void {
  const templates = loadSceneTemplates([]);
  const filtered = templates.filter(t => t.id !== templateId);
  saveSceneTemplates(filtered);
  console.log('🗑️ Scene Template deleted:', templateId);
}

/**
 * Get Scene Template by ID
 */
export function getSceneTemplateById(templateId: string): ScenePreset | undefined {
  const templates = loadSceneTemplates([]);
  return templates.find(t => t.id === templateId);
}

/**
 * Duplicate a Scene Template
 */
export function duplicateSceneTemplate(templateId: string, newName: string): ScenePreset | null {
  const templates = loadSceneTemplates([]);
  const template = templates.find(t => t.id === templateId);
  if (!template) return null;
  
  const duplicated: ScenePreset = {
    ...template,
    id: `scene-${Date.now()}`,
    name: newName,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
    usageCount: 0,
    isDefault: false
  };
  
  addSceneTemplate(duplicated);
  return duplicated;
}

// ============= Auth Policies =============

export function saveAuthPolicies(policies: AuthPreset[]): void {
  saveToStorage(STORAGE_KEYS.AUTH_POLICIES, policies);
}

export function loadAuthPolicies(defaultPolicies: AuthPreset[]): AuthPreset[] {
  const stored = loadFromStorage<AuthPreset[]>(STORAGE_KEYS.AUTH_POLICIES, []);
  // 如果没有存储的数据，返回默认策略
  return stored.length > 0 ? stored : defaultPolicies;
}

export function updateAuthPolicy(policyId: string, updatedPolicy: AuthPreset): void {
  const policies = loadAuthPolicies([]);
  const index = policies.findIndex(p => p.id === policyId);
  if (index !== -1) {
    policies[index] = updatedPolicy;
    saveAuthPolicies(policies);
  }
}

// ============= Policies (统一管理：标准策略 + 自定义策略) =============

/**
 * 获取所有策略（标准 + 自定义）
 * 标准策略总是包含在内，自定义策略从 localStorage 加载
 */
export function loadAllPolicies(): Policy[] {
  const customPolicies = loadFromStorage<Policy[]>(STORAGE_KEYS.CUSTOM_POLICIES, []);
  const allPolicies = [...STANDARD_POLICIES, ...customPolicies];
  console.log('📂 All Policies loaded:', {
    standard: STANDARD_POLICIES.length,
    custom: customPolicies.length,
    total: allPolicies.length
  });
  return allPolicies;
}

/**
 * 获取标准策略列表
 */
export function getStandardPolicies(): Policy[] {
  return STANDARD_POLICIES;
}

/**
 * 获取自定义策略列表
 */
export function loadCustomPolicies(): Policy[] {
  const policies = loadFromStorage<Policy[]>(STORAGE_KEYS.CUSTOM_POLICIES, []);
  
  // Restore icon components from basedOn policy
  const restoredPolicies = policies.map(policy => {
    if (policy.basedOn) {
      const basePolicy = STANDARD_POLICIES.find(p => p.id === policy.basedOn);
      if (basePolicy) {
        return {
          ...policy,
          icon: basePolicy.icon,
          iconBg: basePolicy.iconBg,
          iconColor: basePolicy.iconColor
        };
      }
    }
    return policy;
  });
  
  console.log('📂 Custom Policies loaded from localStorage:', restoredPolicies);
  return restoredPolicies;
}

/**
 * 保存自定义策略列表
 */
export function saveCustomPolicies(policies: Policy[]): void {
  // 只保存自定义策略（isStandard: false）
  const customOnly = policies.filter(p => !p.isStandard);
  
  // Remove icon component before saving (can't be serialized)
  const serializablePolicies = customOnly.map(({ icon, ...policy }) => policy);
  
  saveToStorage(STORAGE_KEYS.CUSTOM_POLICIES, serializablePolicies);
  console.log('💾 Custom Policies saved to localStorage:', serializablePolicies);
}

/**
 * 添加新的自定义策略
 */
export function addCustomPolicy(policy: Policy): void {
  const policies = loadCustomPolicies();
  policies.push({
    ...policy,
    isStandard: false, // 确保是自定义策略
    createdAt: policy.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  saveCustomPolicies(policies);
}

/**
 * 更新自定义策略
 */
export function updateCustomPolicy(policyId: string, updatedPolicy: Policy): void {
  const policies = loadCustomPolicies();
  const index = policies.findIndex(p => p.id === policyId);
  if (index !== -1) {
    policies[index] = {
      ...updatedPolicy,
      isStandard: false, // 确保是自定义策略
      updatedAt: new Date().toISOString()
    };
    saveCustomPolicies(policies);
  }
}

/**
 * 删除自定义策略
 */
export function deleteCustomPolicy(policyId: string): void {
  const policies = loadCustomPolicies();
  const filtered = policies.filter(p => p.id !== policyId);
  saveCustomPolicies(filtered);
}

/**
 * 根据 ID 获取策略（标准 + 自定义）
 */
export function getPolicyById(policyId: string): Policy | undefined {
  const allPolicies = loadAllPolicies();
  return allPolicies.find(p => p.id === policyId);
}

// ============= Drop Scene Templates =============

/**
 * Save Drop Scene Templates to localStorage
 */
export function saveDropSceneTemplates(templates: DropSceneTemplate[]): void {
  // Remove icon components before saving (can't be serialized)
  const serializableTemplates = templates.map(({ icon, ...template }) => template);
  saveToStorage(STORAGE_KEYS.DROP_SCENE_TEMPLATES, serializableTemplates);
  console.log('💾 Drop Scene Templates saved to localStorage:', templates.length);
}

/**
 * Load Drop Scene Templates from localStorage
 * Returns stored templates or default templates if none exist
 */
export function loadDropSceneTemplates(defaultTemplates: DropSceneTemplate[]): DropSceneTemplate[] {
  const stored = loadFromStorage<any[]>(STORAGE_KEYS.DROP_SCENE_TEMPLATES, []);
  
  if (stored.length === 0) {
    console.log('📂 Drop Scene Templates loaded (using defaults):', defaultTemplates.length);
    return defaultTemplates;
  }
  
  // Restore icon components from default templates
  const restoredTemplates = stored.map(template => {
    const defaultTemplate = defaultTemplates.find(t => t.id === template.id);
    if (defaultTemplate) {
      return {
        ...template,
        icon: defaultTemplate.icon,
        iconBg: defaultTemplate.iconBg
      };
    }
    return template;
  });
  
  console.log('📂 Drop Scene Templates loaded:', restoredTemplates.length);
  return restoredTemplates;
}

/**
 * Update an existing Drop Scene Template
 */
export function updateDropSceneTemplate(templateId: string, updatedTemplate: DropSceneTemplate): void {
  const templates = loadDropSceneTemplates([]);
  const index = templates.findIndex(t => t.id === templateId);
  if (index !== -1) {
    templates[index] = {
      ...updatedTemplate,
      usageCount: templates[index].usageCount // Preserve usage count
    };
    saveDropSceneTemplates(templates);
    console.log('✏️ Drop Scene Template updated:', templateId);
  }
}

/**
 * Increment usage count for a Drop Scene Template
 */
export function incrementDropSceneTemplateUsage(templateId: string): void {
  const templates = loadDropSceneTemplates([]);
  const template = templates.find(t => t.id === templateId);
  if (template) {
    template.usageCount = (template.usageCount || 0) + 1;
    saveDropSceneTemplates(templates);
    console.log('📈 Drop Scene Template usage incremented:', templateId, template.usageCount);
  }
}

// ============= Drop Scene Templates Work State =============

export interface DropSceneWorkState {
  selectedTemplateId: string;
  // Store configuration for each template separately
  templateConfigs: {
    [templateId: string]: {
      enabledAddons: string[];
    };
  };
  deviceMode: 'desktop' | 'mobile';
  lastModified: string;
}

/**
 * Save the current work state of Drop Scene Templates Overview
 */
export function saveDropSceneWorkState(state: DropSceneWorkState): void {
  const stateWithTimestamp = {
    ...state,
    lastModified: new Date().toISOString()
  };
  saveToStorage(STORAGE_KEYS.DROP_SCENE_WORK_STATE, stateWithTimestamp);
  console.log('💾 Drop Scene work state saved');
}

/**
 * Load the saved work state of Drop Scene Templates Overview
 */
export function loadDropSceneWorkState(): DropSceneWorkState | null {
  const state = loadFromStorage<DropSceneWorkState | null>(STORAGE_KEYS.DROP_SCENE_WORK_STATE, null);
  if (state) {
    console.log('📂 Drop Scene work state loaded:', state.selectedTemplateId);
  }
  return state;
}

/**
 * Clear the work state
 */
export function clearDropSceneWorkState(): void {
  clearStorage(STORAGE_KEYS.DROP_SCENE_WORK_STATE);
  console.log('🗑️ Drop Scene work state cleared');
}

// ============= CRM Connection =============

export function saveConnectedCRM(crm: 'salesforce' | 'hubspot' | null): void {
  saveToStorage(STORAGE_KEYS.CONNECTED_CRM, crm);
}

export function loadConnectedCRM(): 'salesforce' | 'hubspot' | null {
  return loadFromStorage<'salesforce' | 'hubspot' | null>(STORAGE_KEYS.CONNECTED_CRM, null);
}

// ============= 清空所有数据 =============

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    clearStorage(key);
  });
  console.log('🗑️ All data cleared from localStorage');
}

// ============= 导出/导入数据（用于备份） =============

export function exportAllData() {
  return {
    materialPools: loadMaterialPools(),
    productLibraries: loadProductLibraries(),
    globalAttachments: loadGlobalAttachments(),
    sceneTemplates: loadSceneTemplates([]),
    authPolicies: loadAuthPolicies([]),
    customPolicies: loadCustomPolicies(), // 只导出自定义策略
    dropSceneTemplates: loadDropSceneTemplates([]),
    connectedCRM: loadConnectedCRM(),
    exportDate: new Date().toISOString(),
    version: '3.4.0' // 添加版本号
  };
}

export function importAllData(data: ReturnType<typeof exportAllData>): void {
  if (data.materialPools) saveMaterialPools(data.materialPools);
  if (data.productLibraries) saveProductLibraries(data.productLibraries);
  if (data.globalAttachments) saveGlobalAttachments(data.globalAttachments);
  if (data.sceneTemplates) saveSceneTemplates(data.sceneTemplates);
  if (data.authPolicies) saveAuthPolicies(data.authPolicies);
  if (data.customPolicies) {
    // 确保导入的都是自定义策略
    const customOnly = data.customPolicies.filter(p => !p.isStandard);
    saveCustomPolicies(customOnly);
  }
  if (data.dropSceneTemplates) saveDropSceneTemplates(data.dropSceneTemplates);
  if (data.connectedCRM !== undefined) saveConnectedCRM(data.connectedCRM);
  console.log('📥 All data imported successfully');
}
