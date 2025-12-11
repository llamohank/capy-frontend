# Admin Dashboard UI 美化記錄

> 📅 更新日期: 2025-12-11  
> 🎨 設計風格: Modern Clean SaaS Dashboard  
> 🎯 主色調: Indigo (`#4F46E5`)

---

## 📋 目錄

1. [概述](#概述)
2. [設計規範](#設計規範)
3. [修改的檔案清單](#修改的檔案清單)
4. [詳細修改說明](#詳細修改說明)
5. [關鍵技術細節](#關鍵技術細節)
6. [常見問題與解決方案](#常見問題與解決方案)

---

## 概述

### 修改目標
將 CapyCourse 管理後台的 UI 從原本的灰藍色調升級為現代化的 **Indigo 色系 SaaS 風格儀表板**，提升視覺層次感和使用者體驗。

### 修改範圍
- Element Plus 主題色覆蓋
- 側邊欄 (Sidebar) 重新設計
- 儀表板 (Dashboard) 卡片樣式優化
- 表格視圖樣式統一
- 狀態標籤改為柔和的 Pastel 色調

### 技術棧
- Vue 3
- Element Plus UI Framework
- CSS3 (使用 CSS 變數 + `:deep()` 選擇器)

---

## 設計規範

### 主色調 (Brand Colors)

| 名稱 | 色碼 | 用途 |
|------|------|------|
| Primary | `#4F46E5` | 主要按鈕、連結、強調色 |
| Primary Light | `#818CF8` | Hover 狀態、次要強調 |
| Primary Dark | `#3730A3` | Active 狀態 |
| Primary Extra Light | `#EEF2FF` | 選中背景、淡化區域 |

### 狀態標籤顏色 (Pastel 柔和色)

使用柔和的 Pastel 色調，避免高飽和度顏色造成視覺疲勞：

| 狀態 | 背景色 | 文字色 | 邊框色 | 使用場景 |
|------|--------|--------|--------|----------|
| Success/通過 | `#D1FAE5` | `#059669` | `#A7F3D0` | 已上架、已通過、正常 |
| Warning/待審 | `#FEF3C7` | `#D97706` | `#FDE68A` | 待審核、審核中 |
| Danger/拒絕 | `#FEE2E2` | `#DC2626` | `#FECACA` | 已下架、已拒絕、停權 |
| Info/一般 | `#F3F4F6` | `#4B5563` | `#E5E7EB` | 草稿、一般狀態 |

### 背景色系

| 名稱 | 色碼 | 用途 |
|------|------|------|
| 主內容區背景 | `#F5F7FA` | el-main 背景 |
| 卡片背景 | `#FFFFFF` | wrapper、el-card |
| 側邊欄深色 | `#1E1B4B` | 側邊欄漸層起止 |
| 側邊欄中間 | `#312E81` | 側邊欄漸層中間 |

### 文字色系

| 名稱 | 色碼 | 用途 |
|------|------|------|
| 主要文字 | `#1F2937` | 標題、重要內容 |
| 次要文字 | `#374151` | 正文內容 |
| 輔助文字 | `#6B7280` | 說明文字、時間戳 |
| 淡化文字 | `#9CA3AF` | 禁用狀態、佔位文字 |

---

## 修改的檔案清單

```
src/
├── styles/
│   ├── element-plus-override.css  ← 修改 (Element Plus 主題覆蓋)
│   ├── admin-dashboard.css        ← 新增 (管理後台專用樣式)
│   └── common.css                 ← 修改 (通用樣式)
├── main.js                        ← 修改 (引入新樣式)
└── views/admin/
    ├── layout/
    │   └── AdminLayout.vue        ← 修改 (側邊欄、Header 重設計)
    ├── dashboard/
    │   └── WorkSpace.vue          ← 修改 (儀表板卡片優化)
    ├── course/
    │   ├── CourseManagement.vue   ← 修改 (表格樣式)
    │   └── ApplicationList.vue    ← 修改 (表格樣式)
    ├── user/
    │   ├── UserManagement.vue     ← 修改 (表格樣式)
    │   └── InstructorList.vue     ← 修改 (表格樣式)
    ├── platform/
    │   └── Announcement.vue       ← 修改 (公告列表樣式)
    └── record/
        └── OperationRecord.vue    ← 修改 (操作紀錄樣式)
```

---

## 詳細修改說明

### 1. `src/styles/element-plus-override.css`

**目的**: 全局覆蓋 Element Plus 預設主題色

**修改前**:
```css
:root {
  --el-color-primary: #00BFA5; /* 青綠色 */
}
```

**修改後**:
```css
:root {
  /* 主色調 - Indigo */
  --el-color-primary: #4F46E5;
  --el-color-primary-light-3: #818CF8;
  --el-color-primary-light-5: #A5B4FC;
  --el-color-primary-light-7: #C7D2FE;
  --el-color-primary-light-8: #E0E7FF;
  --el-color-primary-light-9: #EEF2FF;
  --el-color-primary-dark-2: #3730A3;
  
  /* 狀態色 - Pastel */
  --el-color-success: #059669;
  --el-color-success-light-9: #D1FAE5;
  --el-color-warning: #D97706;
  --el-color-warning-light-9: #FEF3C7;
  --el-color-danger: #DC2626;
  --el-color-danger-light-9: #FEE2E2;
  
  /* 圓角 */
  --el-border-radius-base: 8px;
  --el-border-radius-small: 4px;
  --el-border-radius-round: 20px;
}
```

---

### 2. `src/styles/admin-dashboard.css` (新增檔案)

**目的**: 管理後台專用的進階樣式

**主要內容**:

```css
/* 數據統計卡片 */
.stat-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #F3F4F6;
  transition: all 0.25s ease;
}

.stat-card:hover {
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.1);
  border-color: #E0E7FF;
  transform: translateY(-2px);
}

/* Pastel 狀態標籤 */
.admin-tag--success {
  background-color: #D1FAE5 !important;
  color: #059669 !important;
  border-color: #A7F3D0 !important;
}

.admin-tag--pending {
  background-color: #FEF3C7 !important;
  color: #D97706 !important;
  border-color: #FDE68A !important;
}

.admin-tag--danger {
  background-color: #FEE2E2 !important;
  color: #DC2626 !important;
  border-color: #FECACA !important;
}
```

---

### 3. `src/styles/common.css`

**目的**: 更新全站通用樣式

**修改內容**:

```css
/* Wrapper 卡片 - 增加 padding 和 hover 效果 */
.wrapper {
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.08);
  padding: 32px;  /* 原本 24px */
  border-radius: 16px;
  transition: box-shadow 0.2s ease;
}

.wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Section Heading - 藍色圓點改為 Indigo */
.section-heading::before {
  background-color: #4F46E5;  /* 原本 #409eff */
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

/* Section Title - 左側條改為漸層 */
.section-title::before {
  background: linear-gradient(180deg, #4F46E5 0%, #818CF8 100%);
}
```

---

### 4. `src/main.js`

**目的**: 引入新的樣式檔案

```javascript
// 在其他樣式 import 後加入
import "./styles/admin-dashboard.css";
```

---

### 5. `src/views/admin/layout/AdminLayout.vue`

**目的**: 重新設計管理後台整體佈局

#### 5.1 側邊欄背景

**修改前**:
```css
.el-aside {
  background-color: #545c64;
}
```

**修改後**:
```css
.el-aside {
  background: linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}
```

#### 5.2 Logo 區域 (新增)

```html
<div v-if="isCollapse" class="sidebar-header">
  <div class="logo-area">
    <span class="logo-text">CapyCourse</span>
  </div>
</div>
```

```css
.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #E0E7FF 0%, #A5B4FC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### 5.3 切換按鈕 (重新設計)

**修改前**: 使用 `el-switch` 元件

**修改後**: 使用自訂圓形按鈕

```html
<button class="toggle-btn" @click="isCollapse = !isCollapse">
  <el-icon :size="18">
    <component :is="isCollapse ? 'DArrowLeft' : 'DArrowRight'" />
  </el-icon>
</button>
```

```css
.toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: #FFFFFF;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
}
```

#### 5.4 ⚠️ 收合選單圖示置中修復 (重要)

**問題描述**:  
Element Plus 的收合選單中，有子選單和無子選單的項目使用不同的 wrapper class，導致 padding 不一致，圖示無法對齊。

**受影響的項目**:
- 無子選單 (工作台、數據分析、操作紀錄): 使用 `.el-menu-tooltip__trigger`
- 有子選單 (課程管理、用戶管理、平台管理): 使用 `.el-sub-menu__title`

**解決方案**:

```css
/* 統一兩種 trigger 的 padding 和 flex 屬性 */
:deep(.el-menu--collapse .el-menu-tooltip__trigger) {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

:deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* 移除圖示的預設 margin */
:deep(.el-menu--collapse .el-menu-item .el-icon),
:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0 !important;
}
```

#### 5.5 Header 樣式

**修改前**:
```css
:deep(.el-header) {
  background-color: #6cf;
}
```

**修改後**:
```css
:deep(.el-header) {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
```

---

### 6. `src/views/admin/dashboard/WorkSpace.vue`

**目的**: 優化儀表板頁面視覺效果

#### 6.1 數據統計卡片

```html
<div class="stat-card">
  <span class="stat-card__label">今日新註冊用戶</span>
  <span class="stat-card__value">{{ data }}</span>
</div>
```

```css
.stat-card__label {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.stat-card__value {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
}

.stat-card__value--primary {
  color: #4F46E5;
}
```

#### 6.2 待處理項目脈動紅點

```html
<span v-if="count > 0" class="pending-dot"></span>
```

```css
.pending-dot {
  width: 10px;
  height: 10px;
  background-color: #EF4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

### 7. 表格視圖 (多個檔案共用樣式)

**適用檔案**:
- `CourseManagement.vue`
- `ApplicationList.vue`
- `UserManagement.vue`
- `InstructorList.vue`
- `OperationRecord.vue`

**共用表格樣式**:

```css
:deep(.el-table) {
  --el-table-header-bg-color: #F9FAFB;
  --el-table-row-hover-bg-color: #F5F3FF; /* 淡紫色 hover */
  border-radius: 12px;
  overflow: hidden;
}

:deep(.table-head .cell) {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #374151;
  padding: 16px 12px;
}

/* 行號 hover 效果 */
.index {
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
  color: #9CA3AF;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.table-row:hover .index {
  opacity: 1;
  color: #4F46E5;
}
```

**Pastel 狀態標籤**:

```css
:deep(.el-tag--success) {
  background-color: #D1FAE5;
  color: #059669;
  border-color: #A7F3D0;
}

:deep(.el-tag--warning) {
  background-color: #FEF3C7;
  color: #D97706;
  border-color: #FDE68A;
}

:deep(.el-tag--danger) {
  background-color: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}
```

---

### 8. `src/views/admin/platform/Announcement.vue`

**目的**: 優化公告頁面

#### 8.1 公告列表項目

```css
.message-list-item {
  padding: 20px 24px;
  border-radius: 12px;
  background-color: #FFFFFF;
  border-left: 4px solid #C7D2FE;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.message-list-item:hover {
  transform: translateX(4px);
  border-left-color: #4F46E5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}
```

#### 8.2 Radio Button 填充色

**修改前**:
```html
<el-radio-group fill="#6cf">
```

**修改後**:
```html
<el-radio-group fill="#4F46E5">
```

---

### 9. `src/views/admin/record/OperationRecord.vue`

**目的**: 優化操作紀錄頁面

#### 對話框 Header 樣式

```css
:deep(.el-dialog__header) {
  padding: 20px 24px;
  background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
  border-radius: 12px 12px 0 0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #FFFFFF;
}
```

---

## 關鍵技術細節

### 1. Element Plus 樣式覆蓋方法

由於 Vue 的 scoped CSS 限制，需要使用 `:deep()` 選擇器來穿透元件邊界：

```css
/* ✅ 正確寫法 */
:deep(.el-menu-item) {
  color: #fff;
}

/* ❌ 錯誤寫法 - 無法生效 */
.el-menu-item {
  color: #fff;
}
```

### 2. 使用 `!important` 的時機

當 Element Plus 的內聯樣式或高優先級選擇器覆蓋你的樣式時，可以使用 `!important`：

```css
:deep(.el-menu--collapse .el-menu-tooltip__trigger) {
  padding: 0 !important; /* 覆蓋 Element Plus 預設 padding */
}
```

### 3. CSS 變數系統

Element Plus 使用 CSS 變數系統，可以在 `:root` 層級全局覆蓋：

```css
:root {
  --el-color-primary: #4F46E5;
}
```

或在元件層級局部覆蓋：

```css
.my-component {
  --el-color-primary: #FF5733;
}
```

---

## 常見問題與解決方案

### Q1: 收合側邊欄時圖示沒有對齊？

**原因**: Element Plus 對有子選單和無子選單的項目使用不同的 wrapper class。

**解決方案**: 同時處理 `.el-menu-tooltip__trigger` 和 `.el-sub-menu__title`：

```css
:deep(.el-menu--collapse .el-menu-tooltip__trigger),
:deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
```

### Q2: 樣式修改沒有生效？

**可能原因**:
1. 忘記使用 `:deep()` 選擇器
2. Element Plus 的優先級更高，需要加 `!important`
3. CSS 檔案沒有正確引入到 `main.js`

### Q3: 如何快速修改主題色？

修改 `element-plus-override.css` 中的 CSS 變數即可全局生效。

---

## 📐 管理頁面排版一致性優化 (2025-12-11)

### 問題描述

在分析管理後台的 16 個 Vue 組件後，發現頁面之間存在多處排版不一致的問題：

| 問題類別 | 描述 |
|---------|------|
| 頁面標題結構 | 部分頁面使用 h3/section-title，而非統一的 h2/section-heading |
| 內容卡片使用 | 部分頁面沒有使用 .wrapper 卡片包裹內容 |
| 篩選器區塊結構 | 混用 el-form 和 flex div，造成高度不一致 |
| 分頁元件位置 | 部分靠右、部分置中，且 layout 設定不一致 |

### 解決方案 - 兩卡片佈局標準

將所有含有篩選器的管理頁面統一為「兩個 wrapper」的佈局模式：

```vue
<template>
  <!-- 頁面標題 -->
  <h2 class="section-heading">頁面標題</h2>
  
  <!-- 第一個 wrapper：篩選器卡片 -->
  <div class="wrapper" style="margin-bottom: 24px">
    <div class="filter-bar">
      <!-- 篩選器元件直接放置，不使用 el-form 包裹 -->
      <el-select ...>...</el-select>
      <el-input ...>...</el-input>
      <el-button ...>搜尋</el-button>
    </div>
  </div>
  
  <!-- 第二個 wrapper：內容卡片 -->
  <div class="wrapper">
    <el-table style="width: 100%">...</el-table>
    <div class="pagination-btn" style="justify-content: center">
      <el-pagination layout="total, prev, pager, next" ... />
    </div>
  </div>
</template>
```

### 修改的檔案清單

| 檔案 | 修改內容 |
|------|---------|
| `CateManagement.vue` | h3 → h2.section-heading；內容包入 .wrapper |
| `InstructorDetail.vue` | div.section-heading → h2.section-heading |
| `Announcement.vue` | 新增 .wrapper 卡片包裹篩選器和列表；新增 .filter-bar 樣式 |
| `CourseManagement.vue` | 拆分為兩個獨立 .wrapper；移除 filter-bar 的 padding-bottom |
| `UserManagement.vue` | 拆分為兩個獨立 .wrapper |
| `InstructorList.vue` | 拆分為兩個獨立 .wrapper |
| `ApplicationList.vue` | 移除 el-form 包裹；統一為直接放置元件 |
| `OperationRecord.vue` | margin-bottom: 32px → 24px；移除「共xx筆結果」顯示 |

### 分頁元件統一設定

所有表格頁面的分頁統一為：

```vue
<div class="pagination-btn" style="justify-content: center">
  <el-pagination
    size="large"
    background
    layout="total, prev, pager, next"
    :page-size="pageSize"
    :total="totalElements"
    :current-page="currentPage"
    @current-change="handlePageChange"
  />
</div>
```

**關鍵點**：
- `layout="total, prev, pager, next"` - 顯示總數
- `style="justify-content: center"` - 置中顯示
- 使用 `size="large"` 和 `background` 保持一致

### filter-bar 樣式規範

```css
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
```

**注意**：不要在 .filter-bar 內使用額外的 margin-bottom 或 padding-bottom，間距靠第一個 wrapper 的 `margin-bottom: 24px` 控制。

---

## 後續建議

1. **提取顏色變數**: 考慮將所有硬編碼的顏色值提取到統一的 CSS 變數檔案
2. **深色模式**: 可以新增深色模式支援
3. **響應式優化**: 為小螢幕裝置新增更多斷點處理
4. **動畫庫**: 考慮引入 `@vueuse/motion` 等動畫庫提升互動體驗

---

> 📝 文件維護者: AI Assistant  
> 📅 最後更新: 2025-12-11
