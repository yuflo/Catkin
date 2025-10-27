# Drop Records 页面 - 快速测试指南

## 🚀 快速开始

1. **打开应用**
   - 在侧边栏点击 "Drops"
   - 页面显示新的 Drop Records 界面

2. **查看默认状态**
   - ✅ 页面标题："Drop Records"
   - ✅ 副标题："评估与探查 - 快速定位高价值 Drop，深度洞察参与情报"
   - ✅ 右上角："Create Drop" 按钮
   - ✅ Smart Insight Bar 显示洞察（琥珀色/紫色/蓝色背景）
   - ✅ Intent Switcher 显示4个按钮：全部/获客/销售跟进/客户维护
   - ✅ Active Filter Pills 显示："负责人: 我" 和 "阶段: 活跃"
   - ✅ 搜索框：placeholder "搜索或筛选... (点击查看快捷筛选)"
   - ✅ 数据表格显示筛选后的 Drop 记录
   - ✅ 右下角显示 Deep Link Demo 提示卡片

## ✅ 测试清单

### 1. Intent Switcher（意图切换）
- [ ] 点击"全部"按钮 - 显示所有 Drop
- [ ] 点击"获客"按钮 - 只显示 lead_gen 类型
- [ ] 点击"销售跟进"按钮 - 只显示 sales_follow_up 类型
- [ ] 点击"客户维护"按钮 - 只显示 customer_nurturing 类型
- [ ] 切换 Intent 时，Smart Insight Bar 内容改变

### 2. Smart Insight Bar（智能洞察）
- [ ] Intent = "全部" 时显示跨意图对比洞察（琥珀色）
- [ ] Intent = "销售跟进" 时显示销售建议（紫色）
- [ ] Intent = "获客" 时显示获客建议（紫色）
- [ ] Intent = "客户维护" 时显示观察（蓝色）
- [ ] 点击 X 按钮可关闭洞察栏
- [ ] 关闭后不再显示

### 3. Active Filter Pills（筛选条件展示）
- [ ] 默认显示："负责人: 我" 和 "阶段: 活跃"
- [ ] 点击 "负责人: 我" 的 X 按钮移除筛选
- [ ] 点击 "阶段: 活跃" 的 X 按钮移除筛选
- [ ] 移除筛选后表格数据更新
- [ ] 所有筛选移除后 Pills 区域消失

### 4. Unified Filter Bar（统一筛选）

**即时筛选菜单：**
- [ ] 点击搜索框（空状态）- 弹出即时筛选菜单
- [ ] 菜单包含3个部分：快捷筛选/按阶段/按负责人
- [ ] 点击"我负责的活跃 Drop" - 应用筛选
- [ ] 点击"需要关注的 Drop" - 应用筛选
- [ ] 点击"即将过期 (7天内)" - 应用筛选
- [ ] 点击任一阶段（Active/Draft/Expired）- 应用筛选
- [ ] 点击任一负责人 - 应用筛选
- [ ] 点击菜单外部 - 菜单关闭

**智能搜索：**
- [ ] 输入 "expired" - 显示智能建议 "筛选: 状态为 Expired"
- [ ] 按 Enter - 应用筛选，搜索框清空
- [ ] 输入 "draft" - 显示智能建议 "筛选: 状态为 Draft"
- [ ] 输入 "sam" - 显示智能建议 "筛选: 负责人为 Sam Rodriguez"
- [ ] 输入 "active drops by emily" - 显示智能建议
- [ ] 输入普通 Drop 名称 - 搜索表格内容（无智能建议）

### 5. Drop Records Table（数据表格）

**Health 列：**
- [ ] 显示 Emoji（🟢🟡🔴）
- [ ] Hover 🟢 - Tooltip 显示"表现优秀"原因
- [ ] Hover 🟡 - Tooltip 显示"表现正常"原因
- [ ] Hover 🔴 - Tooltip 显示"需要关注"原因 + 3个快捷操作按钮
- [ ] 点击"一键归档"按钮 - Toast 提示"已归档"
- [ ] 点击"复制并重启"按钮 - Toast 提示
- [ ] 点击"延长 TTL"按钮 - Toast 提示

**Drop 名称列：**
- [ ] 显示 Drop 名称（较大字号）
- [ ] 显示物料池名称（较小字号，灰色）

**Stage 列：**
- [ ] Active 显示蓝色 Badge
- [ ] Draft 显示灰色 Badge
- [ ] Expired 显示红色 Badge

**TTL 列：**
- [ ] "3 days left" 显示红色
- [ ] "12 days left" 显示橙色
- [ ] "25 days left" 显示灰色
- [ ] "Draft" 显示灰色
- [ ] "Expired X days ago" 显示红色

**Engagement 列：**
- [ ] 显示大字号分数（如：85）
- [ ] 显示等级 Badge（高/中/低）
- [ ] 显示趋势 Sparkline（小图表）
- [ ] Hover - Tooltip 显示贡献因素详情

**Owner 列：**
- [ ] 显示 Avatar（带首字母缩写）
- [ ] 显示负责人名字

**Actions 列：**
- [ ] 点击三点菜单按钮 - 弹出菜单
- [ ] 菜单包含：打开 Drop/编辑/复制/归档
- [ ] 点击"打开 Drop" - Toast 提示
- [ ] 点击"编辑" - Toast 提示
- [ ] 点击"复制" - Toast 提示
- [ ] 点击"归档" - Toast 提示（红色文字）

**行交互：**
- [ ] Hover 任意行 - 背景变灰
- [ ] 点击任意行 - Feedback Panel 从右侧滑出

### 6. Feedback Panel（详情面板）

**Overview Tab：**
- [ ] 显示参与度分数卡片（大字号分数 + Badge）
- [ ] 显示关键成果（4个 Emoji 图标 + 文字）
- [ ] 显示最近活动时间轴（Avatar + 活动详情 + 时间戳）

**Materials Tab：**
- [ ] 切换到 Materials Tab
- [ ] 显示物料列表（图标 + 名称 + 类型 + 大小）
- [ ] 点击眼睛图标 - （占位功能）

**Leads Tab：**
- [ ] 切换到 Leads Tab
- [ ] 显示潜在客户列表（Avatar + 名字 + 公司 + 最后活动）
- [ ] 参与度 Badge 显示正确颜色：
  - 高 = 橙色
  - 中 = 绿色
  - 低 = 灰色

**面板操作：**
- [ ] 点击"复制链接"按钮 - Toast 提示"链接已复制到剪贴板"
- [ ] 点击"在新窗口打开"按钮 - Toast 提示
- [ ] 点击面板外部或关闭按钮 - 面板关闭

### 7. Deep Link（深度链接）

**准备工作：**
- [ ] 打开任意 Drop 的详情面板
- [ ] 点击"复制链接"按钮
- [ ] 链接格式：`...?highlight=drop_001`

**测试步骤：**
- [ ] 在新标签页粘贴链接并打开
- [ ] 页面自动滚动到对应 Drop 行
- [ ] 该行显示蓝色背景 + 左侧蓝色边框（高亮）
- [ ] 等待 3 秒 - 高亮消失
- [ ] Deep Link Demo 提示卡片不显示（因为有高亮）

**Deep Link Demo：**
- [ ] 正常打开页面（无 ?highlight 参数）
- [ ] 右下角显示 Deep Link Demo 卡片
- [ ] 卡片内容：标题 + 说明 + "查看示例"按钮
- [ ] 点击"查看示例"按钮 - 滚动到第一个 Drop

### 8. 综合场景测试

**场景 A：快速评估需要关注的 Drop**
1. [ ] 打开 Drops 页面
2. [ ] 扫描 Health 列，找到 🔴 图标
3. [ ] Hover 查看原因："低互动分且即将过期"
4. [ ] 点击"一键归档"或"延长 TTL"
5. [ ] Toast 提示操作成功

**场景 B：查看获客类 Drop 表现**
1. [ ] 点击 Intent Switcher 的"获客"按钮
2. [ ] Smart Insight 显示："工作日下午2-4点的互动率最高"
3. [ ] 表格只显示 lead_gen 类型的 Drop
4. [ ] 对比不同 Drop 的 Engagement 分数
5. [ ] 点击高分 Drop 查看详情

**场景 C：搜索并探查特定 Drop**
1. [ ] 点击搜索框
2. [ ] 输入 "春季" 搜索 Drop
3. [ ] 点击搜索结果中的 Drop 行
4. [ ] Feedback Panel 打开
5. [ ] 切换 Materials Tab 查看物料
6. [ ] 切换 Leads Tab 查看潜在客户
7. [ ] 点击"复制链接"
8. [ ] Toast 显示"链接已复制"

**场景 D：筛选条件管理**
1. [ ] 应用多个筛选（Intent + Stage + Owner）
2. [ ] Active Filter Pills 显示所有条件
3. [ ] 点击 Pill 上的 X 逐个移除
4. [ ] 表格实时更新数据
5. [ ] 结果摘要显示正确的数量

**场景 E：深度链接分享**
1. [ ] 打开 Drop "春季新品预览 - VIP 专享"
2. [ ] 在 Feedback Panel 点击"复制链接"
3. [ ] 在新标签页打开链接
4. [ ] 页面自动定位到该 Drop
5. [ ] 该行高亮显示（蓝色背景）
6. [ ] 3 秒后高亮消失

## 🐛 常见问题排查

### 问题：Smart Insight Bar 不显示
- 检查是否已被关闭（点击 X 按钮）
- 刷新页面重置状态

### 问题：搜索框智能建议不出现
- 确保输入了触发关键词（expired/draft/sam 等）
- 检查搜索框是否处于焦点状态

### 问题：深度链接不工作
- 检查 URL 是否包含 ?highlight=drop_xxx 参数
- 确保 drop_xxx 是有效的 Drop ID
- 刷新页面重试

### 问题：Toast 通知不显示
- 检查 Toaster 组件是否在 App.tsx 中正确引入
- 检查浏览器控制台是否有错误

### 问题：表格数据为空
- 检查当前筛选条件是否过于严格
- 移除所有 Active Filter Pills 重试
- 切换 Intent 到"全部"

## 📊 数据说明

### Mock Drops 数量
- 总共：12 个 Drop
- Active：8 个
- Draft：2 个
- Expired：2 个

### 默认筛选结果
- Owner = "Sam Rodriguez"（我）
- Stage = "Active"
- 预期结果：3 个 Drop

### Intent 分布
- lead_gen（获客）：5 个
- sales_follow_up（销售跟进）：3 个
- customer_nurturing（客户维护）：3 个
- all（全部）：12 个

## ✨ 彩蛋功能

1. **键盘快捷键**（继承自原系统）
   - `c` - 快速创建 Drop
   - `f` - Fast Create Drop
   - `l` - Growth Panel - Leads
   - `g` - Growth Panel - Grid

2. **响应式设计**
   - 最大内容宽度 1600px
   - 自动居中显示
   - 适配不同屏幕尺寸

3. **颜色编码**
   - Health: 🟢绿色=好，🟡黄色=中，🔴红色=差
   - TTL: 红色=紧急，橙色=注意，灰色=正常
   - Engagement: 绿色=高，蓝色=中，灰色=低

---

**测试完成后，请在下方勾选：**

- [ ] 所有功能测试通过
- [ ] 界面显示正常
- [ ] 交互流畅无卡顿
- [ ] Toast 通知正常工作
- [ ] 深度链接功能正常

**测试日期**: _____________  
**测试人员**: _____________  
**问题记录**: _____________
