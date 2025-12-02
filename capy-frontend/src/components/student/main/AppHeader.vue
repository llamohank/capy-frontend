<template>
  <el-header class="header" :class="{ 'header-minimal': isApplicationPage }">
    <div class="header-content">
      <router-link to="/" class="logo">
        <el-icon :size="24" color="#fff"><Reading /></el-icon>
        <span class="logo-text">CapyCourse</span>
      </router-link>

      <!-- 只在非申請頁面顯示 Explore 按鈕 -->
      <div v-if="!isApplicationPage" class="explore">
        <router-link to="/explore">
          <el-button class="btn-glass" >explore</el-button>
        </router-link>
      </div>

      <!-- 只在非申請頁面顯示搜尋框 -->
      <div v-if="!isApplicationPage" class="header-center">
        <el-autocomplete
          v-model="searchText"
          :fetch-suggestions="querySearch"
          placeholder="搜尋課程或標籤..."
          :prefix-icon="Search"
          class="search-input"
          size="large"
          @select="handleSelect"
          clearable
        >
          <template #default="{ item }">
            <div class="autocomplete-item">
              <el-icon class="item-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="item-label">{{ item.value }}</span>
              <el-tag v-if="item.type" size="small" class="item-type">
                {{ item.type }}
              </el-tag>
            </div>
          </template>
        </el-autocomplete>
      </div>

      <!-- 在申請頁面時顯示佔位元素，保持 Logo 和使用者選單的間距 -->
      <div v-if="isApplicationPage" class="header-spacer"></div>

      <div class="header-actions">
        <!-- 未登入時顯示按鈕 -->
        <template v-if="!userStore.isAuthenticated">
          <!-- 只在非申請頁面顯示 Become a Teacher 按鈕 -->
          <router-link v-if="!isApplicationPage" to="/instructor/landing">
            <el-button class="btn-glass" plain>Become a Teacher</el-button>
          </router-link>
          <router-link to="/login">
            <el-button class="btn-white-pop">Log In</el-button>
          </router-link>
        </template>

        <!-- 已登入時顯示使用者資訊和登出按鈕 -->
        <template v-else>
          <!-- 只在非申請頁面顯示 Become a Teacher 按鈕（僅對非講師顯示） -->
          <router-link
            v-if="!isApplicationPage && !isInstructor"
            to="/instructor/landing"
          >
            <el-button class="btn-ghost-teacher">Become a Teacher</el-button>
          </router-link>

          <!-- 只在非申請頁面顯示購物車、收藏、通知按鈕 -->
          <template v-if="!isApplicationPage">
            <!-- 交易組 (購物車 + 願望清單) -->
            <div class="icon-group transaction-group">
              <el-badge :value="cartStore.itemCount" :hidden="cartStore.isEmpty" class="icon-badge">
                <el-button circle class="icon-button" @click="handleCart">
                  <el-icon><ShoppingCart /></el-icon>
                </el-button>
              </el-badge>
              <el-badge :value="wishlistStore.itemCount" :hidden="wishlistStore.isEmpty" class="icon-badge">
                <TheWishlistPopover>
                  <template #trigger>
                    <el-button circle class="icon-button">
                      <el-icon><Star /></el-icon>
                    </el-button>
                  </template>
                </TheWishlistPopover>
              </el-badge>
            </div>

            <!-- 分隔線 -->
            <div class="icon-divider"></div>

            <!-- 通知組 -->
            <div class="icon-group notification-group">
              <el-badge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0" class="icon-badge">
                <TheNotificationPopover>
                  <template #trigger>
                    <el-button circle class="icon-button">
                      <el-icon><Bell /></el-icon>
                    </el-button>
                  </template>
                </TheNotificationPopover>
              </el-badge>
            </div>
          </template>

          <TheUserDropdown />
        </template>
      </div>
    </div>

    <!-- 購物車抽屜 -->
    <TheCartDrawer v-model="showCartDrawer" />
  </el-header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Reading, ShoppingCart, Star, Bell, Document, PriceTag } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotificationStore } from '@/stores/notification'
import TheCartDrawer from '@/components/student/cart/TheCartDrawer.vue'
import TheWishlistPopover from '@/components/student/wishlist/TheWishlistPopover.vue'
import TheNotificationPopover from '@/components/student/notifications/TheNotificationPopover.vue'
import TheUserDropdown from '@/components/student/main/TheUserDropdown.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const searchText = ref('')
const showCartDrawer = ref(false)

// 模擬搜尋建議資料（課程標題和標籤）
const searchSuggestions = [
  { value: 'Vue 3 完整開發指南', type: '課程', icon: Document },
  { value: 'Python 數據分析實戰', type: '課程', icon: Document },
  { value: 'Spring Boot 微服務架構', type: '課程', icon: Document },
  { value: 'React 18 完整開發指南', type: '課程', icon: Document },
  { value: 'Java', type: '標籤', icon: PriceTag },
  { value: 'Python', type: '標籤', icon: PriceTag },
  { value: 'Vue3', type: '標籤', icon: PriceTag },
  { value: 'Spring Boot', type: '標籤', icon: PriceTag },
  { value: '前端開發', type: '標籤', icon: PriceTag },
  { value: '後端開發', type: '標籤', icon: PriceTag },
  { value: '數據分析', type: '標籤', icon: PriceTag },
  { value: '機器學習', type: '標籤', icon: PriceTag }
]

// 搜尋建議查詢函數
const querySearch = (queryString, cb) => {
  if (!queryString) {
    cb([])
    return
  }

  const results = searchSuggestions.filter(item => {
    return item.value.toLowerCase().includes(queryString.toLowerCase())
  })

  cb(results)
}

// 處理選擇建議項目
const handleSelect = (item) => {
  if (item.type === '課程') {
    ElMessage.success(`正在搜尋課程：${item.value}`)
    router.push({ path: '/explore', query: { search: item.value } })
  } else if (item.type === '標籤') {
    ElMessage.success(`正在搜尋標籤：${item.value}`)
    router.push({ path: '/explore', query: { tag: item.value } })
  }
}

// ==================== 初始化模擬資料 ====================

/**
 * 初始化購物車模擬資料（僅用於測試）
 */
const initMockCartData = () => {
  // 如果購物車已有資料，不重複初始化
  if (cartStore.itemCount > 0) {
    return
  }

  // 模擬課程資料
  const mockCourses = [
    {
      id: 1,
      title: 'Vue 3 完整開發指南：從入門到精通',
      instructor: '張小明',
      price: 1200,
      cover_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
    },
    {
      id: 2,
      title: 'TypeScript 實戰開發：打造型別安全的應用程式',
      instructor: '李美華',
      price: 1500,
      cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
    },
    {
      id: 3,
      title: 'Pinia 狀態管理完全攻略',
      instructor: '王大偉',
      price: 800,
      cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
    }
  ]

  // 將模擬課程加入購物車
  mockCourses.forEach(course => {
    cartStore.addItem(course)
  })

  console.log('✅ 已載入模擬購物車資料')
}

// 元件掛載時初始化
onMounted(() => {
  // 先從 localStorage 載入
  cartStore.loadFromStorage()

  // 如果沒有資料，則載入模擬資料
  if (cartStore.isEmpty) {
    initMockCartData()
  }

  // 載入願望清單資料
  wishlistStore.loadFromStorage()

  // 如果願望清單為空，載入模擬資料
  if (wishlistStore.isEmpty) {
    initMockWishlistData()
  }

  // 載入通知資料
  notificationStore.fetchNotifications()
})

/**
 * 初始化願望清單模擬資料（僅用於測試）
 */
const initMockWishlistData = () => {
  const mockWishlistCourses = [
    {
      id: 4,
      title: 'React 18 完整開發指南',
      instructor: '陳小華',
      price: 1800,
      cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 5,
      title: 'Node.js 後端開發實戰',
      instructor: '林大明',
      price: 2000,
      cover_image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'
    },
    {
      id: 6,
      title: 'MongoDB 資料庫設計與優化',
      instructor: '黃小美',
      price: 1500,
      cover_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400'
    }
  ]

  mockWishlistCourses.forEach(course => {
    wishlistStore.addItem(course)
  })

  console.log('✅ 已載入模擬願望清單資料')
}

/**
 * 檢查是否在申請表單頁面
 * 在此頁面時，只顯示 Logo 和使用者選單
 */
const isApplicationPage = computed(() => {
  return route.name === 'becomeInstructor'
})

/**
 * 檢查使用者是否為講師
 * 用於控制 "Become a Teacher" 按鈕的顯示
 */
const isInstructor = computed(() => {
  const roles = userStore.userInfo.roles || []
  return roles.includes('instructor') || roles.includes('INSTRUCTOR')
})

/**
 * 處理購物車點擊
 */
const handleCart = () => {
  showCartDrawer.value = true
}

/**
 * 處理通知點擊
 */
const handleNotifications = () => {
  router.push({ name: 'Notifications' })
}
</script>

<style scoped>
.header {
  background: var(--capy-primary);
  padding: 0;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.logo-text {
  white-space: nowrap;
}

.header-center {
  flex: 1;
  max-width: 500px;
}

.header-spacer {
  flex: 1;
}

/* 申請頁面的簡化樣式 */
.header-minimal .header-content {
  justify-content: space-between;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.95);
  transition: all var(--capy-transition-base);
}

.search-input :deep(.el-input__wrapper:hover) {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 自動完成下拉樣式 */
.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.item-icon {
  color: var(--capy-primary);
  font-size: 16px;
}

.item-label {
  flex: 1;
  font-size: 14px;
  color: var(--capy-text-primary);
}

.item-type {
  font-size: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

/* --- 1. 玻璃擬態按鈕 (Explore - 未登入狀態) --- */
.btn-glass {
  /* 預設狀態：半透明白底 + 白字 */
  --el-button-bg-color: rgba(255, 255, 255, 0.15);
  --el-button-border-color: rgba(255, 255, 255, 0.4);
  --el-button-text-color: #ffffff;

  /* Hover 狀態：變實心白底 + 藍字 */
  --el-button-hover-bg-color: #ffffff;
  --el-button-hover-border-color: #ffffff;
  --el-button-hover-text-color: var(--capy-primary); /* 天藍色 #54CDF2 */

  /* Active (點擊) 狀態 */
  --el-button-active-bg-color: rgba(255, 255, 255, 0.9);
  --el-button-active-border-color: #ffffff;

  /* 額外特效 */
  backdrop-filter: blur(4px); /* 磨砂玻璃效果 */
  font-weight: 500;
  transition: all 0.3s ease;
}

/* --- 2. 半透明玻璃按鈕 (Become a Teacher - 已登入學生) --- */
.btn-ghost-teacher {
  /* 預設狀態：半透明白底 + 白色邊框 + 白字 */
  --el-button-bg-color: rgba(255, 255, 255, 0.25); /* 半透明白色背景 */
  --el-button-border-color: rgba(255, 255, 255, 0.6); /* 較明顯的白色邊框 */
  --el-button-text-color: #ffffff;

  /* Hover 狀態：實心白底 + Teal 文字 */
  --el-button-hover-bg-color: #ffffff; /* 實心白色 */
  --el-button-hover-border-color: #ffffff;
  --el-button-hover-text-color: #00BFA5; /* Primary Teal */

  /* Active 狀態 */
  --el-button-active-bg-color: #f5f5f5;
  --el-button-active-border-color: #ffffff;
  --el-button-active-text-color: #00BFA5;

  font-weight: 600; /* 半粗體，提升可讀性 */
  transition: all 0.3s ease;
}

/* --- 3. 純白跳色按鈕 (Log In) --- */
.btn-white-pop {
  /* 預設狀態：純白底 + 深藍字 (對比最強) */
  --el-button-bg-color: #ffffff;
  --el-button-border-color: #ffffff;
  --el-button-text-color: #0277BD; /* 深藍色，比淺藍更有質感 */

  /* Hover 狀態：微微變灰或維持白，但加強陰影 */
  --el-button-hover-bg-color: #F8FAFC;
  --el-button-hover-border-color: #ffffff;
  --el-button-hover-text-color: var(--capy-primary);

  /* 額外特效 */
  font-weight: 700; /* 加粗 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 懸浮陰影 */
  transition: all 0.3s ease;
}

/* Log In 按鈕 Hover 時的上浮效果 */
.btn-white-pop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

/* --- 4. 圖標組樣式 --- */
.icon-group {
  display: flex;
  align-items: center;
  gap: 20px; /* 增加圖標間距到 20px */
}

/* 圖標按鈕樣式 */
.icon-button {
  --el-button-bg-color: rgba(255, 255, 255, 0.18);
  --el-button-border-color: transparent;
  --el-button-text-color: white;

  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}
.icon-button:hover {
  border-radius: 50%; /* 圓形 hover 效果 */
}

/* Badge 樣式優化 */
.icon-badge :deep(.el-badge__content) {
  background-color: #E6A23C; /* Warning Orange 取代 Red */
  border: 2px solid var(--capy-primary); /* 與 Teal 背景形成對比 */
}

/* 分隔線 */
.icon-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3); /* 半透明白色 */
  margin: 0 4px;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-center {
    order: 3;
    width: 100%;
    max-width: 100%;
  }
}
</style>
