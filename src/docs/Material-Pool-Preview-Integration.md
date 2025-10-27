# Material Pool Live Preview Integration

## 功能概述

Fast Create Drop 现在支持在 Live Preview 中实时显示 Material Pool 的真实产品数据！

## 实现细节

### 数据流架构

```
FastCreateDrop
  ├─ materialPools: MaterialPool[]     (Pool引用列表)
  ├─ libraries: ProductLibrary[]       (实际产品数据源)
  │
  └─ resolvePoolProducts() 🔧
     │
     ├─ 1. 遍历 selectedPool.items (PoolItem[])
     ├─ 2. 通过 masterId 在 libraries 中查找 LibraryItem
     ├─ 3. 应用 overrides (name, price, description)
     ├─ 4. 格式化为 PreviewProduct[]
     │
     └─ products[] → DropScenePreview
```

### 字段映射

| Preview字段 | 数据源 | 处理逻辑 |
|------------|--------|---------|
| `id` | `LibraryItem.id` | 直接映射 |
| `name` | `LibraryItem.name` | 优先使用 `overrides.name` |
| `sku` | `LibraryItem.sku` | 直接映射 |
| `price` | `LibraryItem.price` | 应用 `overrides.price`，格式化为 `$XX.XX` |
| `imageUrl` | `LibraryItem.imageUrl` | 可选字段（未来可用） |
| `description` | `LibraryItem.description` | 优先使用 `overrides.description` |
| `category` | `LibraryItem.category` | 额外数据（未来扩展） |

## 测试步骤

### 前置条件
1. 确保已创建至少一个 Product Library（通过 Payloads → Import Library）
2. 创建至少一个 Material Pool（包含若干产品）

### 测试流程

#### 场景1：正常数据显示
1. 进入 **Fast Create Drop**
2. 选择一个 **Material Pool**
3. 选择 **Simple Catalog** 模板
4. **预期结果**：
   - ✅ Preview 显示 Material Pool 的真实产品
   - ✅ 产品数量与 Pool 中一致
   - ✅ 产品名称、SKU、价格正确显示
   - ✅ 绿色提示框显示 "✓ Live Data: [Pool Name]"

#### 场景2：Price Override 验证
1. 在 Payloads 中编辑 Material Pool
2. 对某个产品设置 Price Override
3. 返回 Fast Create Drop
4. **预期结果**：
   - ✅ Preview 中该产品显示覆写后的价格
   - ✅ 其他产品显示原始价格

#### 场景3：Mock数据降级
1. 进入 Fast Create Drop
2. **不选择** Material Pool（或选择空Pool）
3. 选择 Simple Catalog 模板
4. **预期结果**：
   - ✅ Preview 显示 Mock 示例产品（12个Widget）
   - ✅ 黄色提示框显示 "Mock Data Preview"

#### 场景4：移动端预览
1. 选择 Material Pool 和模板
2. 切换到 **Mobile** 设备模式
3. **预期结果**：
   - ✅ Mobile Preview 显示真实产品（分页显示）
   - ✅ 每页6个产品
   - ✅ 分页器正常工作

## 视觉指示器

### 🟢 Live Data Indicator（绿色）
```
✓ Live Data: [Material Pool Name]
Displaying X products from your material pool
```
- 显示条件：成功解析到真实产品数据
- 位置：Preview 区域下方

### 🟡 Mock Data Indicator（黄色）
```
Mock Data Preview
Using sample products for template preview
```
- 显示条件：无可用真实数据，使用 fallback
- 位置：Preview 区域下方

## 技术实现

### 核心函数：resolvePoolProducts

```typescript
const resolvedProducts = useMemo<PreviewProduct[] | undefined>(() => {
  if (!selectedPool || !selectedPoolId) return undefined;
  
  const products: PreviewProduct[] = [];
  
  for (const poolItem of selectedPool.items) {
    // 1. 通过 masterId 查找 LibraryItem
    let libraryItem: LibraryItem | undefined;
    for (const library of libraries) {
      libraryItem = library.items.find(item => item.id === poolItem.masterId);
      if (libraryItem) break;
    }
    
    if (!libraryItem) {
      console.warn(`Library item not found for masterId: ${poolItem.masterId}`);
      continue;
    }
    
    // 2. 应用 overrides 并格式化
    products.push({
      id: libraryItem.id,
      name: poolItem.overrides?.name || libraryItem.name,
      sku: libraryItem.sku,
      price: `$${(poolItem.overrides?.price ?? libraryItem.price).toFixed(2)}`,
      imageUrl: libraryItem.imageUrl,
      description: poolItem.overrides?.description || libraryItem.description,
      category: libraryItem.category
    });
  }
  
  return products.length > 0 ? products : undefined;
}, [selectedPool, selectedPoolId, libraries]);
```

### Fallback 机制

```typescript
// 在 SimpleCatalogDesktop 和 SimpleCatalogMobile 中
const displayProducts = products || simpleCatalogProducts;
```

## 已知限制

1. **图片显示**：当前 `imageUrl` 字段已传递但未在 UI 中渲染（使用灰色占位符）
2. **模板支持**：仅 Simple Catalog 模板支持真实数据，其他模板仍使用 Mock 数据
3. **实时更新**：修改 Material Pool 后需重新进入 Fast Create Drop 才能刷新

## 未来扩展

### Phase 2
- [ ] 在 Desktop Preview 中显示产品图片
- [ ] 在 Mobile Preview 中显示产品图片
- [ ] 支持 Catalog + Quote 模板的真实数据

### Phase 3
- [ ] 支持 Directory 和 Discovery 模板
- [ ] 实时监听 Material Pool 变化
- [ ] 支持 Attachment 文件预览

## 相关文件

- `/components/FastCreateDrop.tsx` - 主要集成逻辑
- `/components/DropScenePreview.tsx` - Preview 组件（支持 products prop）
- `/components/PayloadsTab.tsx` - 数据类型定义
- `/App.tsx` - 顶层数据传递

## 更新日志

**2025-10-16** - v1.0 初始实现
- ✅ 实现 Material Pool → Preview 数据解析
- ✅ 支持 Price/Name Override
- ✅ Desktop 和 Mobile 预览支持
- ✅ 添加数据源视觉指示器
