# 學生通知功能實作說明

## 概述

本文件說明學生通知頁面/功能的前端實作，包含 API 整合、SSE 即時推播、狀態管理等完整功能。

## 目錄

- [API 端點](#api-端點)
- [檔案結構](#檔案結構)
- [核心功能](#核心功能)
- [使用方式](#使用方式)
- [錯誤處理](#錯誤處理)
- [注意事項](#注意事項)

---

## API 端點

### 身分/權限
- **需登入**：所有 API 都需要 JWT 認證
- **未登入處理**：SSE 會立刻返回 401，REST API 會返回 401/403

### 主要 API

#### 1. SSE 即時推播
```
GET /api/notifications/stream
Content-Type: text/event-stream
```
- **事件類型**：
  - `connected`：初始握手
  - `notification`：新通知推送
  - `heartbeat`：心跳檢測（可選）

#### 2. 通用通知列表
```
GET /api/notifications
```
**Query 參數**：
- `types`：通知類型篩選（可多值，NotifyTypeEnum）
- `page`：頁碼（預設 0）
- `size`：每頁數量（預設 20）
- `sort`：排序方式（預設 `createdAt,DESC`）

**回應格式**：
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0
}
```

#### 3. 學生通知列表
```
GET /api/notifications/student
```
**Query 參數**：
- `announcementType`：公告類型（`platform` / `instructor` / `other` / 未填=全部）
- `page`：頁碼（預設 0）
- `size`：每頁數量（預設 5）
- `sort`：排序方式（預設 `createdAt,DESC`）

**回應格式**：
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "size": 5,
  "number": 0,
  "first": true,
  "last": false
}
```

#### 4. 未讀數量
```
GET /api/notifications/student-unread-count
```
**回應**：`Result<Long>`

#### 5. 標記已讀
- **單筆**：`PUT /api/notifications/{notificationId}/read`
- **全部（學生）**：`PUT /api/notifications/student-read-all`

#### 6. 刪除通知
```
DELETE /api/notifications/{notificationId}
```

---

## 檔案結構

```
capy-frontend/src/
├── api/student/
│   └── studentNotification.js          # 通知 API 模組
├── stores/
│   └── notification.js                 # 通知狀態管理 Store
├── utils/
│   ├── notificationSSE.js              # SSE 連線服務
│   └── notificationSound.js            # 通知音效管理
├── types/
│   └── notification.ts                 # 通知類型定義
├── views/student/StudentCenter/Notifications/
│   └── NotificationsPage.vue           # 通知頁面主組件
└── components/student/StudentCenter/MyNotification/
    ├── NotificationCard.vue            # 通知卡片組件
    ├── NotificationFilters.vue         # 篩選器組件
    └── NotificationSearchBar.vue       # 搜尋列組件
```

---

## 核心功能

### 1. API 模組 (`studentNotification.js`)

提供所有通知相關的 API 接口：

```javascript
import * as notificationApi from '@/api/student/studentNotification'

// 獲取學生通知列表
await notificationApi.getStudentNotifications({
  announcementType: 'platform',
  page: 0,
  size: 5
})

// 獲取未讀數量
const count = await notificationApi.getStudentUnreadCount()

// 標記已讀
await notificationApi.markNotificationAsRead(notificationId)
await notificationApi.markAllStudentNotificationsAsRead()

// 刪除通知
await notificationApi.deleteNotification(notificationId)
```

### 2. 狀態管理 Store (`notification.js`)

使用 Pinia 管理通知狀態：

```javascript
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

// 獲取通知列表
await notificationStore.fetchStudentNotifications({
  announcementType: 'platform',
  page: 0,
  size: 5
})

// 獲取未讀數量
await notificationStore.fetchUnreadCount()

// 標記已讀
await notificationStore.markAsRead(notificationId)
await notificationStore.markAllAsRead()

// 刪除通知
await notificationStore.deleteNotification(notificationId)

// SSE 連線管理
notificationStore.startSSE()
notificationStore.stopSSE()

// 音效管理
notificationStore.toggleSound()
notificationStore.setSoundVolume(0.5)
```

### 3. SSE 即時推播 (`notificationSSE.js`)

自動管理 SSE 連線，包含重連機制：

**特性**：
- ✅ 自動重連（最多 5 次）
- ✅ 網路狀態監聽
- ✅ 認證錯誤處理（401/403）
- ✅ 連線狀態追蹤
- ✅ 心跳檢測

**連線狀態**：
- `disconnected`：未連線
- `connecting`：連線中
- `connected`：已連線
- `error`：錯誤

### 4. 通知頁面 (`NotificationsPage.vue`)

完整的通知管理介面：

**功能**：
- ✅ 通知列表顯示（分頁）
- ✅ 篩選器（全部/平台/講師/其他）
- ✅ 搜尋功能（客戶端過濾）
- ✅ 標記已讀（單筆/全部）
- ✅ 刪除通知
- ✅ 載入狀態
- ✅ 空狀態顯示
- ✅ 響應式設計

---

## 使用方式

### 在組件中使用通知 Store

```vue
<script setup>
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

onMounted(async () => {
  // 載入通知列表
  await notificationStore.fetchStudentNotifications({
    page: 0,
    size: 5
  })
  
  // 載入未讀數量
  await notificationStore.fetchUnreadCount()
  
  // 啟動 SSE 連線
  notificationStore.startSSE()
})

// 清理
onUnmounted(() => {
  notificationStore.stopSSE()
})
</script>
```

### 通知資料結構 (`NotificationVo`)

```typescript
interface NotificationVo {
  id: number
  title: string
  content: string
  type: NotifyTypeEnum          // 通知類型
  isRead: boolean               // 是否已讀（0 或 1）
  createdAt: string             // ISO 時間字串
  relatedEntityType?: string    // 關聯實體類型（如 'course', 'question'）
  relatedEntityId?: number      // 關聯實體 ID
}
```

### 常見通知類型 (`NotifyTypeEnum`)

學生相關的通知類型：

```typescript
enum NotifyTypeEnum {
  // 公告類型
  PLATFORM_ANNOUNCEMENT = 'platform_announcement',
  INSTRUCTOR_ANNOUNCEMENT = 'instructor_announcement',
  
  // 帳號相關
  USER_SUSPENDED = 'user_suspended',
  USER_UNSUSPENDED = 'user_unsuspended',
  
  // 講師申請
  INSTRUCTOR_APPLICATION_APPROVED = 'instructor_application_approved',
  INSTRUCTOR_APPLICATION_REJECTED = 'instructor_application_rejected',
  
  // 其他業務型通知
  // 課程審核、轉檔、付款等（視後端推送）
}
```

---

## 錯誤處理

### 1. API 錯誤處理

所有 API 調用都包含錯誤處理：

```javascript
try {
  await notificationApi.getStudentNotifications(params)
} catch (error) {
  if (error.response?.status === 401) {
    // 未登入，導向登入頁
    router.push('/login')
  } else if (error.response?.status === 403) {
    // 無權限
    ElMessage.error('無權限存取')
  } else {
    // 其他錯誤
    ElMessage.error('載入通知失敗')
  }
}
```

### 2. SSE 錯誤處理

SSE 連線會自動處理各種錯誤情況：

- **401/403 認證錯誤**：停止重連，提示使用者重新登入
- **網路斷線**：暫停重連，等待網路恢復後自動重連
- **連線失敗**：自動重連（最多 5 次，遞增延遲）

### 3. 樂觀更新與回滾

標記已讀和刪除操作使用樂觀更新策略：

```javascript
// 先更新 UI
notification.is_read = true

try {
  // 呼叫 API
  await api.markAsRead(id)
} catch (error) {
  // 失敗時回滾
  notification.is_read = false
  ElMessage.error('操作失敗')
}
```

---

## 注意事項

### 1. 分頁處理

- **後端分頁**：page 從 0 開始
- **前端顯示**：currentPage 從 1 開始
- **轉換**：`loadNotifications(currentPage - 1)`

### 2. 欄位命名

後端回傳的欄位可能使用不同的命名規則：

```javascript
// 後端可能使用 snake_case
{
  is_read: true,
  notification_type: 'platform_announcement'
}

// 或 camelCase
{
  isRead: true,
  notificationType: 'platform_announcement'
}
```

請根據實際 API 回應調整欄位綁定。

### 3. SSE 連線管理

- **啟動時機**：使用者登入後
- **停止時機**：使用者登出或離開頁面
- **重連策略**：自動重連，但認證錯誤時停止

### 4. 音效管理

- **預設狀態**：從 localStorage 讀取
- **音量範圍**：0.0 - 1.0
- **音效類型**：default, success, warning, error

### 5. 效能優化

- **客戶端搜尋**：避免頻繁 API 請求
- **樂觀更新**：提升使用者體驗
- **分頁載入**：避免一次載入過多資料
- **SSE 心跳**：保持連線活躍

---

## 測試建議

### 1. 功能測試

- [ ] 通知列表載入
- [ ] 分頁切換
- [ ] 篩選器切換
- [ ] 搜尋功能
- [ ] 標記已讀（單筆/全部）
- [ ] 刪除通知
- [ ] SSE 即時推播
- [ ] 未讀數量更新

### 2. 錯誤場景測試

- [ ] 未登入訪問
- [ ] 網路斷線
- [ ] API 錯誤
- [ ] SSE 連線失敗
- [ ] 認證過期

### 3. 邊界測試

- [ ] 空列表
- [ ] 大量通知
- [ ] 長文字內容
- [ ] 特殊字元

---

## 相關文件

- [Element Plus 文件](https://element-plus.org/)
- [Pinia 文件](https://pinia.vuejs.org/)
- [Server-Sent Events (SSE) 規範](https://html.spec.whatwg.org/multipage/server-sent-events.html)

---

## 更新日誌

### 2024-12-09
- ✅ 新增學生通知列表 API (`getStudentNotifications`)
- ✅ 更新 notification store 支援學生列表 API
- ✅ 更新 NotificationsPage.vue 使用真實 API
- ✅ 增強 SSE 錯誤處理（401/403）
- ✅ 建立完整實作文件

---

## 聯絡資訊

如有問題或建議，請聯絡開發團隊。