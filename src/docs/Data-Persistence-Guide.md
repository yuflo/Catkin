# 数据持久化使用指南

## 概述

Distribute v3 现在使用 `localStorage` 实现前端数据持久化，模拟后端数据存储。所有数据在页面刷新后都会保留。

## 架构说明

### 存储模块 (`/lib/storage.ts`)

这是一个统一的数据访问层，提供了以下功能：

- ✅ **自动持久化**：所有数据变更自动保存到 localStorage
- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **统一接口**：标准化的 CRUD 操作
- ✅ **错误处理**：安全的错误捕获和日志记录

### 存储的数据类型

1. **Material Pools** - 产品池
2. **Product Libraries** - 产品库
3. **Global Attachments** - 全局附件
4. **Scene Templates** - 场景模板
5. **Auth Policies** - 认证策略
6. **Custom Policies** - 自定义策略（重要！）
7. **Connected CRM** - 已连接的CRM系统

## 使用方式

### 在 App.tsx 中的实现

```typescript
// 1. 初始化时从 localStorage 加载数据
const [customPolicies, setCustomPolicies] = useState<CustomPolicy[]>(() => 
  storage.loadCustomPolicies()
);

// 2. 数据变更时自动保存
useEffect(() => {
  storage.saveCustomPolicies(customPolicies);
}, [customPolicies]);
```

### 数据流程

```
用户操作 → React State 更新 → useEffect 触发 → 保存到 localStorage
                                                        ↓
页面刷新 ← React State 初始化 ← 从 localStorage 加载
```

## Custom Policies 完整流程

### 创建流程

1. **用户在 Settings → Access Policies 创建自定义策略**
   ```
   Settings (AudienceAuthSettings.tsx)
   → handleSaveCustomPolicy()
   → setCustomPolicies([...policies, newPolicy])
   → App.tsx useEffect 检测到变更
   → storage.saveCustomPolicies() 保存到 localStorage
   ```

2. **在 Fast Create Drop 中使用**
   ```
   Fast Create Drop (FastCreateDrop.tsx)
   → 接收 customPolicies prop
   → 显示在下拉列表中
   → 用户选择后可查看详细配置
   ```

### 验证步骤

1. **创建自定义策略**
   - 进入 Settings → Access Policies
   - Hover 任一标准策略，点击 "Duplicate & Edit"
   - 修改配置，点击保存
   - 查看 "Your Custom Policies" 区域确认创建成功

2. **在 Fast Create Drop 中使用**
   - 进入 Fast Create Drop 页面
   - 滚动到 "AUDIENCE & AUTH" 区域
   - 在 Standard Policies 下方看到 "Your Custom Policies" 下拉框
   - 选择你创建的策略，查看详细配置

3. **验证持久化**
   - 刷新页面（F5）
   - 重新进入 Fast Create Drop
   - 确认自定义策略仍然存在

## 开发工具面板

在页面右下角有一个 "Dev Tools" 按钮，提供以下功能：

### 功能列表

- **📊 Data Statistics** - 查看所有存储的数据数量
- **🔄 Refresh Statistics** - 刷新统计数据
- **💾 Export All Data** - 导出所有数据（JSON 备份文件）
- **📂 Import Data** - 导入数据（从备份恢复）
- **🗑️ Clear All Data** - 清空所有数据（慎用！）

### 使用场景

1. **调试数据问题**
   - 打开 Dev Tools
   - 查看 Custom Policies 数量
   - 如果为 0，说明数据未正确保存

2. **备份重要数据**
   - 在测试前导出数据
   - 测试后如需恢复，导入数据

3. **清理测试数据**
   - 测试完成后清空所有数据
   - 重新开始测试

## Console 日志

为了便于调试，存储模块会输出关键操作的日志：

```javascript
💾 Custom Policies saved to localStorage: [...]
📂 Custom Policies loaded from localStorage: [...]
🗑️ All data cleared from localStorage
📥 All data imported successfully
```

## 常见问题

### Q: 为什么刷新后数据丢失？

A: 检查以下几点：
1. 浏览器是否禁用了 localStorage
2. 是否处于隐私/无痕模式
3. 浏览器存储空间是否已满
4. 查看 Console 是否有错误信息

### Q: 如何确认数据已保存？

A: 
1. 打开浏览器开发者工具（F12）
2. 进入 Application/Storage → Local Storage
3. 查看以 `distribute_v3_` 开头的键
4. 或使用 Dev Tools 面板查看统计

### Q: 数据存储在哪里？

A: 
- 存储在浏览器的 localStorage 中
- 每个浏览器独立存储
- 清除浏览器数据会删除所有存储

### Q: 如何在不同浏览器间同步数据？

A:
1. 在源浏览器使用 Dev Tools 导出数据
2. 在目标浏览器使用 Dev Tools 导入数据

## 技术细节

### 存储键名

```typescript
const STORAGE_KEYS = {
  MATERIAL_POOLS: 'distribute_v3_material_pools',
  PRODUCT_LIBRARIES: 'distribute_v3_product_libraries',
  GLOBAL_ATTACHMENTS: 'distribute_v3_global_attachments',
  SCENE_TEMPLATES: 'distribute_v3_scene_templates',
  AUTH_POLICIES: 'distribute_v3_auth_policies',
  CUSTOM_POLICIES: 'distribute_v3_custom_policies',
  CONNECTED_CRM: 'distribute_v3_connected_crm',
};
```

### 数据格式

所有数据以 JSON 字符串形式存储：
```json
{
  "id": "custom-1234567890",
  "name": "My Custom Policy",
  "basedOn": "lead-capture",
  "config": {...}
}
```

## 最佳实践

1. **定期备份**：使用 Dev Tools 导出重要数据
2. **测试后清理**：避免测试数据污染实际使用
3. **查看日志**：出现问题时先查看 Console 日志
4. **使用 Dev Tools**：熟悉开发工具面板的各项功能

## 未来改进

- [ ] 添加数据版本控制
- [ ] 实现自动备份到云端
- [ ] 支持多用户数据隔离
- [ ] 添加数据迁移工具
- [ ] 实现数据压缩以节省空间
