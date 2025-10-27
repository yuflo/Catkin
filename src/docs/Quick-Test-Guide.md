# 快速测试指南 - Custom Policies 持久化

## 🎯 测试目标

验证 Custom Policies 可以：
1. 在 Settings 中创建并保存
2. 在 Fast Create Drop 中显示和使用
3. 页面刷新后数据保留

## 📝 测试步骤

### 第一步：创建 Custom Policy

1. **进入 Settings**
   - 点击左侧导航 `Settings`
   - 确认进入 "Access Policies" 标签页

2. **创建自定义策略**
   - 在 "Standard Policies" 区域，**hover** 任一策略卡片（如 "Lead Capture"）
   - 点击出现的 `Duplicate & Edit` 按钮
   - 会弹出配置对话框

3. **配置策略**
   ```
   策略名称: "My Test Policy"
   
   可选修改项（示例）:
   - Required Lead Fields: 勾选 "Phone"
   - Download Policy: 选择 "Guarded"
   - Link Validity: 改为 30 天
   ```

4. **保存策略**
   - 点击对话框底部的保存按钮
   - 应看到 toast 提示 "Custom policy created"
   - 在 "Your Custom Policies" 区域应看到新创建的策略

5. **验证控制台日志**
   - 打开浏览器 DevTools (F12)
   - Console 标签页应显示:
     ```
     💾 Custom Policies saved to localStorage: [...]
     ```

### 第二步：在 Fast Create Drop 中使用

1. **进入 Fast Create Drop**
   - 点击左侧导航 `Fast Create Drop`
   - 或使用快捷键 `F`

2. **查找 Custom Policies**
   - 滚动到左侧面板的 `AUDIENCE & AUTH` 区域
   - 在 "Standard Policies" 下方，应该看到:
     ```
     Your Custom Policies
     Policies you've created in Settings
     [下拉选择框]
     ```

3. **选择自定义策略**
   - 点击下拉框
   - 应该看到 "My Test Policy"（带图标）
   - 选择它

4. **查看详细配置**
   - 选中后，下拉框下方应展示详细配置卡片
   - 显示内容应包括：
     - 策略名称和来源
     - Access Mode
     - Required Fields (应该包含你勾选的 Phone)
     - Content Levels
     - Download Policy (应为 Guarded)
     - Watermark
     - Link Validity (应为 30 days)

5. **查看预览面板**
   - 右侧预览区域底部的策略信息卡
   - 应显示紫色背景 + 星标图标
   - 文本: "Access: My Test Policy"
   - 副标题: "Custom policy • Based on '...'"

### 第三步：验证持久化

1. **刷新页面**
   - 按 F5 或点击刷新按钮
   - 等待页面完全加载

2. **检查数据保留**
   - Console 应显示:
     ```
     📂 Custom Policies loaded from localStorage: [...]
     ```
   - Settings → Access Policies 中仍然显示 "My Test Policy"
   - Fast Create Drop 中下拉框仍然包含 "My Test Policy"

3. **跨页面验证**
   - 在 Settings 和 Fast Create Drop 之间切换多次
   - 每次都应该能看到自定义策略

### 第四步：使用 Dev Tools 验证

1. **打开 Dev Tools 面板**
   - 点击页面右下角的 `Dev Tools` 按钮
   - 查看 Data Statistics

2. **检查统计数字**
   - "Custom Policies" 应显示 `1` (或你创建的数量)
   - 点击 "Refresh Statistics" 按钮确认

3. **导出数据验证**
   - 点击 "Export All Data (Backup)"
   - 会下载一个 JSON 文件
   - 打开文件，搜索 `"customPolicies"`
   - 应该看到你创建的策略数据

4. **查看 localStorage**
   - 浏览器 DevTools (F12) → Application → Local Storage
   - 找到 `distribute_v3_custom_policies`
   - 点击查看值，应该是 JSON 数组

## ✅ 成功标准

所有以下条件都满足即为成功：

- [x] 在 Settings 中创建自定义策略成功
- [x] "Your Custom Policies" 区域显示新策略
- [x] Fast Create Drop 的下拉框中出现自定义策略
- [x] 选择后显示正确的详细配置
- [x] 刷新页面后数据仍然存在
- [x] Console 显示保存/加载日志
- [x] Dev Tools 显示正确的统计数字
- [x] localStorage 中有对应数据

## ❌ 故障排除

### 问题：创建后没有显示

**检查：**
1. Console 是否有错误信息？
2. localStorage 是否被浏览器禁用？
3. 是否在隐私/无痕模式？

**解决：**
- 切换到普通浏览模式
- 检查浏览器设置允许 localStorage

### 问题：刷新后数据丢失

**检查：**
1. Console 是否显示 "Custom Policies loaded" 日志？
2. localStorage 中是否有数据？
3. 是否清除了浏览器数据？

**解决：**
- 查看 Console 的错误信息
- 使用 Dev Tools 重新导入之前导出的数据

### 问题：Fast Create Drop 中看不到下拉框

**检查：**
1. customPolicies 数组是否为空？
2. 是否创建了至少一个自定义策略？

**解决：**
- 确保在 Settings 中至少创建一个策略
- 查看 Dev Tools 的统计数字

### 问题：下拉框是空的

**检查：**
1. App.tsx 是否正确传递 customPolicies prop？
2. Console 是否显示加载日志？

**解决：**
- 检查 Console 错误信息
- 使用 React DevTools 查看 FastCreateDrop 组件的 props

## 🔍 调试技巧

### 1. Console 日志
```javascript
// 应该看到这些日志:
💾 Custom Policies saved to localStorage: [...]
📂 Custom Policies loaded from localStorage: [...]
```

### 2. React DevTools
- 安装 React DevTools 浏览器扩展
- 查看 FastCreateDrop 组件
- 检查 `customPolicies` prop 的值

### 3. localStorage Inspector
```javascript
// 在 Console 中运行:
JSON.parse(localStorage.getItem('distribute_v3_custom_policies'))
```

### 4. 手动清空数据
```javascript
// 在 Console 中运行:
localStorage.removeItem('distribute_v3_custom_policies')
```

## 📊 测试数据示例

创建多个策略进行更全面的测试：

```
策略 1: "Marketing Campaign"
- 基于: Public Promo
- 修改: 添加 Email 必填字段

策略 2: "Partner Portal"
- 基于: Lead Capture
- 修改: 添加 Company 必填字段, 链接有效期 60 天

策略 3: "Executive Review"
- 基于: Private Share
- 修改: 访问模式改为 Email Gated
```

## 📅 完成清单

完成所有测试后，确认：

- [ ] 创建了至少 1 个自定义策略
- [ ] 在 Fast Create Drop 中成功使用
- [ ] 刷新页面后数据保留
- [ ] 导出了数据备份
- [ ] 理解了持久化机制
- [ ] 知道如何使用 Dev Tools

---

**测试完成时间：** _____________

**测试结果：** ✅ 通过 / ❌ 失败

**备注：** _______________________________________
