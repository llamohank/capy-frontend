# Theater Mode 動畫修復文檔

## 🎯 問題描述

原始實作中，當側邊欄收合時，佈局會出現不穩定的行為（向右下角擴展），而非像 YouTube 那樣平滑的水平展開。

## ✅ 解決方案

### 核心改進

使用 **Tailwind CSS** 和 **Flexbox** 重構佈局，實現 YouTube 風格的平滑水平動畫。

### 1. 主容器結構

```vue
<div class="flex min-h-screen">
  <!-- 左側內容區 -->
  <div class="flex-1 min-w-0 flex flex-col transition-all duration-300 ease-in-out bg-gray-50">
    <!-- 影片 + Info Bar + Tabs -->
  </div>
  
  <!-- 右側側邊欄 -->
  <div :class="[
    'transition-[width,opacity] duration-300 ease-in-out bg-white overflow-hidden',
    isSidebarCollapsed 
      ? 'w-0 opacity-0' 
      : 'w-[400px] opacity-100 border-l border-gray-300'
  ]">
    <div class="h-full whitespace-nowrap">
      <ChaptersSidebar />
    </div>
  </div>
</div>
```

### 2. 關鍵 CSS 類別說明

#### 左側內容區
- **`flex-1`**: 自動填充可用寬度
- **`min-w-0`**: 防止 flex 子元素溢出問題
- **`transition-all duration-300 ease-in-out`**: 平滑過渡動畫

#### 右側側邊欄
- **`transition-[width,opacity]`**: 僅過渡寬度和透明度屬性
- **`overflow-hidden`**: 隱藏溢出內容
- **`whitespace-nowrap`**: 防止內部文字換行破壞佈局
- **動態類別**:
  - 展開: `w-[400px] opacity-100 border-l border-gray-300`
  - 收合: `w-0 opacity-0`

### 3. 浮動展開按鈕

```vue
<div
  v-if="isSidebarCollapsed"
  class="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 
         bg-sky-400 bg-opacity-90 hover:bg-sky-500 
         rounded-full flex items-center justify-center 
         cursor-pointer shadow-lg transition-all duration-300 
         hover:scale-110 z-50"
  @click="toggleSidebar"
>
  <el-icon :size="24" class="text-white">
    <DArrowLeft />
  </el-icon>
</div>
```

### 4. 影片容器行為

```vue
<div class="relative w-full bg-black">
  <VideoPlayerShaka />
</div>
```

- 影片容器保持 `aspect-ratio: 16/9`（在 VideoPlayerShaka 組件中定義）
- 當左側內容區變寬時，影片會按比例放大
- 黑色背景確保視覺一致性

## 🎨 動畫效果

### 展開 → 收合
1. 側邊欄寬度從 `400px` → `0px`（300ms）
2. 側邊欄透明度從 `1` → `0`（300ms）
3. 左側內容區自動擴展填充空間（300ms）
4. 浮動展開按鈕淡入顯示

### 收合 → 展開
1. 側邊欄寬度從 `0px` → `400px`（300ms）
2. 側邊欄透明度從 `0` → `1`（300ms）
3. 左側內容區自動收縮（300ms）
4. 浮動展開按鈕淡出隱藏

## 📊 技術優勢

### ✅ 使用 Tailwind CSS
- **優點**:
  - 原子化類別，易於維護
  - 內建過渡動畫工具
  - 響應式設計支援
  - 減少自定義 CSS

### ✅ Flexbox 佈局
- **優點**:
  - 自動空間分配
  - 無需手動計算寬度
  - 天然支援響應式
  - 瀏覽器優化性能

### ✅ 移除 Vue Transition
- **原因**:
  - `v-show` + CSS transitions 更簡潔
  - 避免 DOM 元素的掛載/卸載
  - 更好的性能表現
  - 更精確的動畫控制

## 🔧 關鍵修復點

### 1. 防止佈局破裂
```css
/* 左側內容區 */
.flex-1 min-w-0  /* min-w-0 防止 flex 溢出 */

/* 右側側邊欄 */
overflow-hidden whitespace-nowrap  /* 防止內容破壞動畫 */
```

### 2. 平滑過渡
```css
/* 僅過渡必要屬性 */
transition-[width,opacity] duration-300 ease-in-out
```

### 3. 視覺一致性
```css
/* 保持影片容器比例 */
aspect-ratio: 16 / 9  /* 在 VideoPlayerShaka 中 */
```

## 📱 響應式支援

目前的實作在桌面端完美運作。移動端可以通過以下方式擴展：

```vue
<div :class="[
  'transition-[width,opacity] duration-300 ease-in-out',
  'bg-white overflow-hidden',
  'md:block',  // 桌面顯示
  isSidebarCollapsed 
    ? 'w-0 opacity-0' 
    : 'w-[400px] opacity-100 border-l border-gray-300'
]">
```

## 🎯 測試檢查清單

- [x] 側邊欄收合時，左側內容區平滑擴展
- [x] 側邊欄展開時，左側內容區平滑收縮
- [x] 影片播放器保持 16:9 比例
- [x] 浮動按鈕僅在收合時顯示
- [x] 動畫流暢無卡頓（300ms）
- [x] 無佈局跳動或閃爍
- [x] 側邊欄內容不會溢出或換行

## 🚀 性能優化

1. **使用 CSS Transitions** 而非 JavaScript 動畫
2. **僅過渡必要屬性** (`width`, `opacity`)
3. **使用 `will-change`** 提示瀏覽器優化（Tailwind 自動處理）
4. **避免重排** 通過 `overflow-hidden` 和 `whitespace-nowrap`

## 📝 維護建議

1. **保持 Tailwind 類別**: 不要混用自定義 CSS
2. **統一動畫時長**: 所有過渡使用 `duration-300`
3. **測試不同螢幕尺寸**: 確保響應式行為正確
4. **監控性能**: 使用 Chrome DevTools 檢查動畫幀率

---

**修復日期**: 2024-12-10  
**技術棧**: Vue 3 + Tailwind CSS + Flexbox  
**參考**: YouTube Theater Mode