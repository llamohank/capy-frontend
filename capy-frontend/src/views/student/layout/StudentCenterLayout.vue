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
        <div class="profile-card">
          <div class="profile-avatar">
            <img
              :src="userStore.userInfo.avatar || '/capybaraProfile.png'"
              alt="User Avatar"
            />
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ userStore.userInfo.nickname || '訪客' }}</h2>
            <p class="profile-email">{{ userStore.userInfo.email || '' }}</p>
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
          <div class="stat-value">{{ stats.activeCourses }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">我的願望清單</div>
          <div class="stat-value">{{ stats.hoursLearning }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已完成的課程</div>
          <div class="stat-value">{{ stats.coursesCompleted }}</div>
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
      :current-user="{
        email: userStore.userInfo.email || '',
        nickname: userStore.userInfo.nickname || '',
        avatarUrl: userStore.userInfo.avatar || ''
      }"
      @save="handleProfileSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import StudentProfileEditDialog from '@/components/student/StudentCenter/StudentProfileEditDialog.vue'

const userStore = useUserStore()

const tabs = [
  { label: '我的課程', name: 'MyLearning' },
  { label: '願望清單', name: 'Wishlist' },
  { label: '訂單記錄', name: 'Orders' },
  { label: '通知', name: 'Notifications' }
]


// 移除本地 userProfile，直接使用 userStore

const stats = ref({
  activeCourses: 12,
  hoursLearning: 45,
  coursesCompleted: 7
})

// Profile Edit Dialog
const profileDialogVisible = ref(false)

const openProfileDialog = () => {
  profileDialogVisible.value = true
}

const handleProfileSave = async (updatedData) => {
  try {
    // TODO: Replace with actual API call
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        nickname: updatedData.nickname,
        avatar_url: updatedData.avatarUrl
      })
    })

    if (!response.ok) {
      throw new Error('更新失敗')
    }

    // Update user store
    userStore.updateUserInfo({
      nickname: updatedData.nickname,
      avatar: updatedData.avatarUrl
    })

    // Close dialog
    profileDialogVisible.value = false

    // Show success message
    ElMessage.success('個人資料更新成功！')

  } catch (error) {
    console.error('Save profile error:', error)
    ElMessage.error('個人資料更新失敗，請稍後再試')
  }
}
</script>

<style scoped>
.student-center-layout {
  min-height: 100vh;
  background: #FCF9F4;
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.welcome-text {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 2px solid #e0e0e0;
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
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #1a1a1a;
  border-bottom-color: #1a1a1a;
  font-weight: 600;
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
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
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
}

.edit-profile-btn:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

/* Statistics Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
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
}

/* Tab Content */
.tab-content {
  min-height: 400px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .student-center-layout {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .tab-navigation {
    margin-bottom: 24px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-item {
    padding: 10px 20px;
    font-size: 14px;
    white-space: nowrap;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .profile-info {
    text-align: center;
  }

  .edit-profile-btn {
    width: 100%;
  }

  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 20px;
  }

  .welcome-text {
    font-size: 14px;
  }

  .tab-item {
    padding: 10px 16px;
    font-size: 13px;
  }

  .profile-avatar img {
    width: 60px;
    height: 60px;
  }

  .profile-name {
    font-size: 18px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
