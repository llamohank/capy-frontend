<template>
  <div class="student-center-layout">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">學生個人中心</h1>
        <p class="welcome-text">歡迎回來~ {{ userStore.userInfo.nickname || '訪客' }}!</p>
      </div>

      <!-- User Profile Card -->
      <div class="profile-section">
        <!-- Loading State -->
        <div v-if="studentCenterStore.profileLoading" class="profile-card">
          <el-skeleton :rows="2" animated />
        </div>

        <!-- Profile Card -->
        <div v-else class="profile-card">
          <div class="profile-avatar">
            <img
              :src="studentCenterStore.profile?.avatarUrl || userStore.userInfo.avatar || '/capybaraProfile.png'"
              alt="User Avatar"
            />
          </div>
          <div class="profile-info">
            <h2 class="profile-name">
              {{ studentCenterStore.profile?.nickname || userStore.userInfo.nickname || '訪客' }}
            </h2>
            <p class="profile-email">
              {{ studentCenterStore.profile?.email || userStore.userInfo.email || '' }}
            </p>
          </div>
          <el-button class="edit-profile-btn" plain @click="openProfileDialog">
            更新個人檔案
          </el-button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-label">進行中的課程</div>
          <div class="stat-value">{{ stats.ownedCoursesCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">我的願望清單</div>
          <div class="stat-value">{{ stats.wishlistCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已完成的課程</div>
          <div class="stat-value">{{ stats.completedCoursesCount }}</div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name }"
          class="tab-item"
          exact-active-class="active"
        >
          {{ tab.label }}
        </router-link>
      </div>

      <!-- Router View for Tab Content -->
      <div class="tab-content">
        <router-view />
      </div>
    </div>

    <!-- Profile Edit Dialog -->
    <StudentProfileEditDialog
      v-model:visible="profileDialogVisible"
      :user="{
        email: studentCenterStore.profile?.email || userStore.userInfo.email || '',
        nickname: studentCenterStore.profile?.nickname || userStore.userInfo.nickname || '',
        avatarUrl: studentCenterStore.profile?.avatarUrl || userStore.userInfo.avatar || '',
        googleLinked: studentCenterStore.profile?.googleLinked ?? (userStore.userInfo.google_id ? true : false),
        google_email: studentCenterStore.profile?.email || userStore.userInfo.google_email || null
      }"
      @save="handleProfileSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useStudentCenterStore } from '@/stores/studentCenter'
import StudentProfileEditDialog from '@/components/student/StudentCenter/StudentProfileEditDialog.vue'
import { fetchStudentProfile } from '@/api/student/studentCenter'

const userStore = useUserStore()
const studentCenterStore = useStudentCenterStore()

// ===== 除錯程式碼 =====
console.log('=== StudentCenterLayout ===')
console.log('userStore.userInfo:', userStore.userInfo)
console.log('googleLinked:', userStore.userInfo.googleLinked)
// ===== 除錯程式碼結束 =====

const tabs = [
  { label: '我的課程', name: 'MyLearning' },
  { label: '願望清單', name: 'Wishlist' },
  { label: '訂單記錄', name: 'Orders' },
  { label: '通知', name: 'Notifications' }
]

// 統計資料 - 直接使用 store 的 computed getter，避免重複呼叫 API
const stats = computed(() => studentCenterStore.statistics)

// Profile Edit Dialog
const profileDialogVisible = ref(false)

const openProfileDialog = async () => {
  console.log('🔍 Opening dialog with profile:', studentCenterStore.profile)
  console.log('🔍 googleLinked value:', studentCenterStore.profile?.googleLinked)

  // 如果 profile 還沒載入，先載入
  if (!studentCenterStore.profile) {
    console.log('🔍 Profile not loaded, loading now...')
    try {
      await studentCenterStore.loadProfile(true) // 強制重新載入
      console.log('🔍 Profile loaded:', studentCenterStore.profile)
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  profileDialogVisible.value = true
}

const handleProfileSave = async (updatedData) => {
  try {
    // 使用新的 API 更新 profile
    await studentCenterStore.updateProfile({
      nickname: updatedData.nickname,
      avatarUrl: updatedData.avatarUrl
    })

    // 同步更新 userStore
    userStore.updateUserInfo({
      nickname: updatedData.nickname,
      avatar: updatedData.avatarUrl
    })

    // 統計資料會自動從 store 更新，不需要手動重新載入

    // Show success message
    ElMessage.success('個人資料更新成功！')

  } catch (error) {
    console.error('Save profile error:', error)
    ElMessage.error('個人資料更新失敗，請稍後再試')
  }
}

// 載入 Profile 資料
onMounted(async () => {
  try {
    // 使用 store 載入 profile（帶快取）
    // 統計資料會自動從 store 的 statistics getter 取得，不需要重複呼叫 API
    await studentCenterStore.loadProfile()
  } catch (error) {
    console.error('載入 Profile 失敗:', error)
    ElMessage.error('載入個人資料失敗，請稍後再試')
  }
})
</script>

<style lang="scss" scoped>
.student-center-layout {
  min-height: 100vh;
  background: #FCF9F4;
  padding: 40px 20px;

  @include mobile {
    padding: 24px 16px;
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 24px;

  @include small-mobile {
    margin-bottom: 20px;
  }
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;

  @include mobile {
    font-size: 24px;
  }

  @include small-mobile {
    font-size: 20px;
  }
}

.welcome-text {
  font-size: 16px;
  color: #666;
  margin: 0;

  @include small-mobile {
    font-size: 14px;
  }
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 2px solid #e0e0e0;

  @include mobile {
    margin-bottom: 24px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.tab-item {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  bottom: -2px;
  text-decoration: none;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1a1a1a;
    border-bottom-color: #1a1a1a;
    font-weight: 600;
  }

  @include mobile {
    padding: 10px 20px;
    font-size: 14px;
    white-space: nowrap;
  }

  @include small-mobile {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* Profile Section */
.profile-section {
  margin-bottom: 32px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @include mobile {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
}

.profile-avatar {
  flex-shrink: 0;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #f0f0f0;

    @include small-mobile {
      width: 60px;
      height: 60px;
    }
  }
}

.profile-info {
  flex: 1;

  @include mobile {
    text-align: center;
  }
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;

  @include small-mobile {
    font-size: 18px;
  }
}

.profile-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.edit-profile-btn {
  flex-shrink: 0;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  color: #333;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }

  @include mobile {
    width: 100%;
  }
}

/* Statistics Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;

  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0B7FC1;

  @include small-mobile {
    font-size: 28px;
  }
}

/* Tab Content */
.tab-content {
  min-height: 400px;
}
</style>
