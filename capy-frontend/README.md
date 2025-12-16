# CapyCourse 前端專案

## 環境設定

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
**重要：** 專案需要 Cloudflare Turnstile Site Key 才能正常運作。

1. 複製 `.env.example` 檔案並重新命名為 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，將 `your_site_key_here` 替換為實際的 Turnstile Site Key：
   ```
   VITE_TURNSTILE_SITE_KEY=你的實際site_key
   ```

3. **注意事項：**
   - `.env` 檔案不會被提交到 Git（已在 `.gitignore` 中）
   - 修改 `.env` 後必須重新啟動開發伺服器
   - 如果看不到 Turnstile 驗證框，請檢查瀏覽器 Console 是否有錯誤訊息

### 3. 啟動開發伺服器
```bash
npm run dev
```

## 開發說明

### Vue 自動引入
不需要再額外引入 vue 函數例如 ref 或 computed 已經配置自動引入了 組件酷的代碼直接貼上就好 也不需要在頁面中另外引入 自己封裝的 component 也一樣 不需要寫 import MyComponent from '@/component/MyComponent.vue'

### 使用圖標的方式
(1)到 Iconify 選擇要引入的 icon 複製 component 代碼到.vue 文件 例如:<Icon icon="bxs:cart-add" width="24" height="24" />
(2)直接使用組件庫提供的圖標 使用方式:<el-icon><Male /></el-icon>
可以根據 api 簡化使用方式 例如 button 結合 icon <el-button icon="Edit" type="success">Success</el-button>

## 常見問題

### Q: 登入頁面看不到 Turnstile 驗證框？
A: 請檢查：
1. 專案根目錄是否有 `.env` 檔案（不是 `.env.example`）
2. `.env` 檔案中的 `VITE_TURNSTILE_SITE_KEY` 是否已設定正確的值
3. 修改 `.env` 後是否有重新啟動開發伺服器（`npm run dev`）
4. 瀏覽器 Console 是否有相關錯誤訊息
