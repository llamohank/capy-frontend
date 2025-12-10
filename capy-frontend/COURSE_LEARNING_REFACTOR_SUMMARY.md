# Course Learning Page 重構總結

## 📋 完成項目

### 1. ✅ Global State Management (Pinia)
**檔案**: `src/stores/courseStore.js`

- ✅ 新增 `isSidebarCollapsed` 狀態（預設 false）
- ✅ 新增 `toggleSidebar()` 切換動作
- ✅ 新增 `setSidebarCollapsed(collapsed)` 設定動作
- ✅ 用於控制 Theater Mode 佈局

### 2. ✅ Layout & Sidebar (Theater Mode)
**檔案**: `src/views/student/CourseLearning/CourseLearningPage.vue`

#### Header
- ✅ 動態顯示 `course.title`（在 Info Bar 中）

#### Main Container (Flexbox Layout)
- ✅ **左側內容區**: `flex: 1`，側邊欄收合時擴展至全寬
- ✅ **右側側邊欄**: 
  - 展開時寬度 `400px`
  - 收合時寬度 `0px`
  - ✅ CSS transitions 平滑動畫效果

#### 側邊欄控制
- ✅ 側邊欄頭部內建「收合」按鈕（圓形圖示按鈕）
- ✅ 浮動「展開」按鈕（側邊欄收合時顯示在影片區右側）
- ✅ 使用 `transition` 和 `v-show` 實現平滑動畫

### 3. ✅ Video Player & Info Bar
**檔案**: `src/views/student/CourseLearning/CourseLearningPage.vue`

#### Video Player
- ✅ 保留現有 `VideoPlayerShaka` 組件
- ✅ 16:9 黑色容器

#### Info Bar（新增）
- ✅ 位於影片播放器正下方（Tabs 上方）
- ✅ 白色背景
- ✅ **左側**: 
  - `currentLesson.title` (H2 標題)
  - `course.title` (小字副標題)
- ✅ **右側**: Rating CTA 區塊
  - 5 顆星評分（Element Plus `el-rate`，disabled/read-only）
  - 文字：「評價此課程」或「我的評分」
  - 點擊開啟評分對話框

### 4. ✅ Tabs 重構
**檔案**: `src/views/student/CourseLearning/CourseLearningPage.vue`

#### Tab 1: 課程詳情（混合內容）
- ✅ **單元介紹**: 
  - 顯示 `lesson.description`
  - 使用高亮盒子樣式（淺藍色漸層背景）
  - 如果為空則完全隱藏此區塊
- ✅ **課程介紹**: 
  - 顯示 `course.description`（HTML 內容）
  - 使用 DOMPurify 清理 HTML
- ✅ **講師資訊**: 
  - 顯示頭像、姓名、簡介
  - 卡片式佈局（淺灰背景）

#### Tab 2: Q&A（論壇風格）
- ✅ **篩選器**: Radio Group
  - 「當前單元」（預設）
  - 「全部課程」
- ✅ **佈局**: Stacked Layout（非聊天氣泡）
  - 上方：學生問題（白色背景）
  - 下方（縮排）：講師回答（淺灰背景 `#F5F7FA`）
- ✅ **邏輯**: 根據 `lessonId` 或 `courseId` 篩選問題

#### Tab 3: 我的提問（新增）
- ✅ 重用 Q&A 佈局
- ✅ 僅顯示 `user_id === current_user.id` 的問題
- ✅ 顯示等待回覆狀態

#### Tab 4: 附件下載
- ✅ 簡單的檔案列表
- ✅ 保留原有功能

### 5. ✅ Rating Dialog（互動功能）
**檔案**: `src/views/student/CourseLearning/CourseLearningPage.vue`

- ✅ 使用 `el-dialog` 實作「評價此課程」對話框
- ✅ **輸入元件**:
  - `el-rate`（可編輯，5 顆星）
  - `el-input` (textarea，評論內容，選填)
- ✅ **提交**: Mock 提交動作，更新用戶評分狀態
- ✅ **樣式**: 使用 Warning 色彩 (`#FB8C00`) 作為星星顏色

### 6. ✅ 樣式指南遵循
**所有檔案**

- ✅ 使用 **Tailwind CSS** 進行佈局和間距（部分使用）
- ✅ 使用 **Element Plus** UI 組件（Tabs, Dialog, Rate, Button, Avatar）
- ✅ **顏色規範**:
  - Primary: `#54CDF2` (Sky Blue) ✅
  - Warning/Stars: `#FB8C00` ✅
  - Text Primary: `#303133` ✅
  - Text Secondary: `#909399` ✅
  - Sidebar Selection: `#f0feff` (Light Blue) ✅

## 🎯 核心功能特色

### Theater Mode（劇院模式）
1. **狀態管理**: 使用 Pinia store 集中管理
2. **平滑動畫**: CSS transitions 實現流暢的展開/收合效果
3. **雙向控制**: 
   - 側邊欄內部收合按鈕
   - 影片區浮動展開按鈕
4. **響應式佈局**: 側邊欄收合時，內容區自動擴展

### 混合內容 Tab
1. **智能顯示**: 單元介紹僅在有內容時顯示
2. **層次分明**: 單元介紹 → 課程介紹 → 講師資訊
3. **視覺區隔**: 使用不同背景色和邊框區分區塊

### Q&A 系統
1. **論壇風格**: 堆疊式佈局，清晰的問答結構
2. **智能篩選**: 支援當前單元/全部課程切換
3. **個人化**: 獨立的「我的提問」標籤
4. **狀態顯示**: 等待回覆、已回覆狀態清楚標示

### 評分系統
1. **視覺化**: 星級評分系統
2. **互動友善**: 點擊即可評分
3. **完整反饋**: 支援評分 + 文字評論

## 📁 檔案結構

```
capy-frontend/
├── src/
│   ├── stores/
│   │   └── courseStore.js                    # 新增：Theater Mode 狀態管理
│   ├── views/
│   │   └── student/
│   │       └── CourseLearning/
│   │           └── CourseLearningPage.vue    # 重構：主頁面
│   └── components/
│       └── student/
│           └── CoursePlay/
│               ├── ChaptersSidebar.vue       # 重構：側邊欄
│               └── VideoPlayerShaka.vue      # 保持不變
```

## 🚀 使用方式

### 切換 Theater Mode
```javascript
// 在任何組件中
import { useCourseStore } from '@/stores/courseStore'

const courseStore = useCourseStore()

// 切換側邊欄
courseStore.toggleSidebar()

// 或直接設定
courseStore.setSidebarCollapsed(true)
```

### 評分功能
1. 點擊 Info Bar 右側的評分區域
2. 在對話框中選擇星級評分
3. 可選填寫評論內容
4. 點擊「提交評價」

### Q&A 篩選
1. 切換到 Q&A 標籤
2. 使用頂部 Radio Group 選擇：
   - 「當前單元」：僅顯示當前單元的問題
   - 「全部課程」：顯示整個課程的所有問題

## 🎨 設計亮點

1. **顏色系統**: 統一使用品牌色 `#54CDF2`，視覺一致性高
2. **動畫效果**: 所有互動都有平滑的過渡動畫
3. **響應式設計**: 支援桌面和移動裝置
4. **無障礙設計**: 使用語義化 HTML 和 ARIA 標籤
5. **性能優化**: 使用 computed 和 watch 減少不必要的計算

## 📝 注意事項

1. **Mock 資料**: 目前使用 Mock 資料，實際部署時需要連接真實 API
2. **權限控制**: Q&A 的「我的提問」需要實際的用戶認證系統
3. **評分持久化**: 評分資料需要後端 API 支援
4. **附件下載**: 下載功能需要實際的檔案伺服器

## ✨ 未來擴展建議

1. **即時通知**: Q&A 有新回覆時的即時通知
2. **進度同步**: 跨裝置學習進度同步
3. **筆記功能**: 在特定時間點添加學習筆記
4. **字幕支援**: 影片字幕顯示和切換
5. **播放速度**: 自訂影片播放速度

---

**重構完成日期**: 2024-12-10
**技術棧**: Vue 3 (Composition API) + Pinia + Element Plus + Tailwind CSS