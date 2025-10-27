# Scene Template System - 使用指南

## 概述

Drop Scene Template 系统提供了一套完整的模板管理解决方案，包括类型定义、标准模板、持久化存储和CRUD操作。

## 架构设计

### 1. 类型定义 (`/types/sceneTemplate.ts`)

所有Scene Template相关的TypeScript类型定义都集中在这个文件中：

- `SceneTemplate` - 主要的模板数据结构
- `TemplateType` - 模板类型枚举
- `PricePresentation` - 价格展示方式
- `GridDensity` - 网格密度配置

**辅助函数：**
- `createSceneTemplate()` - 创建新模板，自动填充默认值
- `validateSceneTemplate()` - 验证模板数据完整性
- `cloneSceneTemplate()` - 克隆现有模板

### 2. 标准模板 (`/data/standardSceneTemplates.ts`)

预定义的四个标准Scene Template：

1. **Simple Catalog** - 简单目录浏览
2. **Catalog + Quote** - 目录+询价
3. **Product Updates** - 产品更新
4. **Page Embed** - 页面嵌入

这些标准模板：
- 总是可用
- 不能被删除
- 可以被克隆为自定义模板
- `isDefault: true`

### 3. 持久化存储 (`/lib/storage.ts`)

提供完整的CRUD操作：

```typescript
// 加载
loadSceneTemplates(defaultTemplates: ScenePreset[]): ScenePreset[]

// 保存
saveSceneTemplates(templates: ScenePreset[]): void

// 新增
addSceneTemplate(template: ScenePreset): void

// 更新
updateSceneTemplate(templateId: string, updatedTemplate: ScenePreset): void

// 删除
deleteSceneTemplate(templateId: string): void

// 查询
getSceneTemplateById(templateId: string): ScenePreset | undefined

// 复制
duplicateSceneTemplate(templateId: string, newName: string): ScenePreset | null
```

### 4. 全局状态管理 (`/App.tsx`)

Scene Templates在App.tsx中作为全局状态管理：

```typescript
const [sceneTemplates, setSceneTemplates] = useState<ScenePreset[]>(
  () => storage.loadSceneTemplates(initialScenePresets)
);

// 自动持久化
useEffect(() => {
  storage.saveSceneTemplates(sceneTemplates);
}, [sceneTemplates]);
```

## 使用示例

### 在组件中引用 Scene Template

```typescript
import { SceneTemplate } from '../types/sceneTemplate';

interface MyComponentProps {
  templates: SceneTemplate[];
  onTemplateChange?: (templates: SceneTemplate[]) => void;
}

function MyComponent({ templates, onTemplateChange }: MyComponentProps) {
  // 使用模板数据
  const selectedTemplate = templates.find(t => t.id === selectedId);
  
  // 更新模板
  const handleUpdate = (updatedTemplate: SceneTemplate) => {
    const newTemplates = templates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    );
    onTemplateChange?.(newTemplates);
  };
  
  // ...
}
```

### 创建新模板

```typescript
import { createSceneTemplate } from '../types/sceneTemplate';
import * as storage from '../lib/storage';

const newTemplate = createSceneTemplate({
  name: 'My Custom Template',
  template: 'simple-catalog',
  stage: 'Custom Stage',
  intent: 'Custom intent description',
  // 其他配置会自动使用默认值
});

// 保存到存储
storage.addSceneTemplate(newTemplate);
```

### 克隆模板

```typescript
import { cloneSceneTemplate } from '../types/sceneTemplate';
import * as storage from '../lib/storage';

const originalTemplate = storage.getSceneTemplateById('template-123');
if (originalTemplate) {
  const cloned = cloneSceneTemplate(originalTemplate, 'Cloned Template Name');
  storage.addSceneTemplate(cloned);
}

// 或使用storage提供的快捷方法
const cloned = storage.duplicateSceneTemplate('template-123', 'New Name');
```

### 在 Fast Create Drop 中使用

```typescript
import { SceneTemplate } from '../types/sceneTemplate';

interface FastCreateDropProps {
  sceneTemplates: SceneTemplate[];
  // ...
}

export function FastCreateDrop({ sceneTemplates }: FastCreateDropProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    sceneTemplates[0]?.id || null
  );
  
  const selectedTemplate = sceneTemplates.find(
    t => t.id === selectedTemplateId
  );
  
  // 使用模板配置
  const { gridConfig, features, primaryCTA } = selectedTemplate || {};
  
  // ...
}
```

## 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                      localStorage                            │
│              (distribute_v3_scene_templates)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    /lib/storage.ts                           │
│     (loadSceneTemplates / saveSceneTemplates)                │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       App.tsx                                │
│         useState<SceneTemplate[]>(sceneTemplates)            │
│              useEffect(() => save on change)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Components                                 │
│  SettingsTab / FastCreateDrop / UnibodyDropComposer         │
│         (receive via props, update via callbacks)            │
└─────────────────────────────────────────────────────────────┘
```

## 最佳实践

### 1. 类型安全
始终使用 TypeScript 类型，避免使用 `any`：
```typescript
import { SceneTemplate } from '../types/sceneTemplate';
```

### 2. 默认值处理
使用 `createSceneTemplate()` 确保所有字段都有正确的默认值：
```typescript
const template = createSceneTemplate({
  name: 'My Template',
  template: 'simple-catalog'
  // 其他字段自动填充
});
```

### 3. 验证数据
在保存前验证模板数据：
```typescript
import { validateSceneTemplate } from '../types/sceneTemplate';

if (validateSceneTemplate(template)) {
  storage.addSceneTemplate(template);
} else {
  console.error('Invalid template data');
}
```

### 4. 避免直接修改
使用不可变更新模式：
```typescript
// ✅ 正确
const updated = { ...template, name: 'New Name' };
setTemplates(templates.map(t => t.id === id ? updated : t));

// ❌ 错误
template.name = 'New Name'; // 直接修改
```

### 5. 使用辅助函数
优先使用 storage.ts 提供的辅助函数：
```typescript
// ✅ 推荐
storage.updateSceneTemplate(id, updatedTemplate);

// ❌ 不推荐
const templates = storage.loadSceneTemplates([]);
const index = templates.findIndex(t => t.id === id);
templates[index] = updatedTemplate;
storage.saveSceneTemplates(templates);
```

## 扩展指南

### 添加新的模板类型

1. 更新 `TemplateType` 类型：
```typescript
// /types/sceneTemplate.ts
export type TemplateType = 
  | 'simple-catalog' 
  | 'catalog-quote' 
  | 'product-updates' 
  | 'page-embed'
  | 'your-new-type'; // 添加新类型
```

2. 在 `standardSceneTemplates.ts` 中添加标准模板

3. 更新相关组件以支持新类型

### 添加新的配置字段

1. 更新 `SceneTemplate` 接口：
```typescript
export interface SceneTemplate {
  // 现有字段...
  newField?: YourNewType; // 添加新字段
}
```

2. 更新 `createSceneTemplate()` 的默认值

3. 更新现有标准模板数据

## 故障排查

### 模板丢失
检查 localStorage 是否被清空：
```typescript
// 在浏览器控制台
localStorage.getItem('distribute_v3_scene_templates')
```

### 模板数据不一致
使用 DevTools 组件重置所有数据：
```typescript
import * as storage from '../lib/storage';
storage.clearAllData();
```

### 类型错误
确保导入正确的类型：
```typescript
// ✅ 正确
import { SceneTemplate } from '../types/sceneTemplate';

// ❌ 错误
import { ScenePreset } from '../components/SettingsTab';
```

## 总结

Scene Template 系统提供了：
- ✅ 完整的类型定义
- ✅ 标准模板库
- ✅ 持久化存储
- ✅ CRUD 操作
- ✅ 全局状态管理
- ✅ 组件间数据共享

所有组件都应该通过 props 接收 Scene Templates，并通过回调函数更新它们，确保数据流的单向性和可预测性。
