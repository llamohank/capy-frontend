<template>
  <div class="teacher-detail-page">
    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading" :size="40">
        <Loading />
      </el-icon>
      <p>載入中...</p>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="error-container">
      <el-icon :size="60" color="var(--el-color-danger)">
        <CircleClose />
      </el-icon>
      <h2>{{ error }}</h2>
      <el-button type="primary" @click="loadTeacherDetail">重新載入</el-button>
    </div>

    <!-- 講師詳情內容 -->
    <div v-else-if="teacher" class="teacher-content">
      <!-- 講師資訊卡片 -->
      <el-card class="teacher-info-card" shadow="never">
        <div class="teacher-header">
          <el-avatar :size="120" :src="teacher.avatarUrl">
            <el-icon :size="60"><User /></el-icon>
          </el-avatar>
          <div class="teacher-info">
            <h1 class="teacher-name">{{ teacher.instructorName }}</h1>
            <p class="teacher-bio">{{ teacher.bio || '這位講師還沒有填寫簡介' }}</p>
            <div class="teacher-stats">
              <div class="stat-item">
                <el-icon><User /></el-icon>
                <span>{{ teacher.totalStudents.toLocaleString() }} 位學生</span>
              </div>
              <div class="stat-item">
                <el-icon><Reading /></el-icon>
                <span>{{ teacher.totalCourses }} 門課程</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 講師課程列表 -->
      <div class="courses-section">
        <div class="section-header">
          <h2 class="section-title">講師課程</h2>
          <el-select
            v-model="sortType"
            placeholder="排序方式"
            @change="handleSortChange"
            class="sort-select"
          >
            <el-option label="熱門優先" value="popular" />
            <el-option label="最新優先" value="latest" />
          </el-select>
        </div>

        <!-- 空狀態 -->
        <div v-if="courses.length === 0" class="empty-courses">
          <el-icon :size="60" color="var(--el-color-info)">
            <Document />
          </el-icon>
          <p>這位講師還沒有發布課程</p>
        </div>

        <!-- 課程列表 -->
        <div v-else class="courses-grid">
          <el-card
            v-for="course in courses"
            :key="course.id"
            class="course-card"
            shadow="hover"
            @click="goToCourse(course.id)"
          >
            <div class="course-cover">
              <el-image
                :src="course.coverImageUrl"
                fit="cover"
                class="cover-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="course-info">
              <h3 class="course-title">{{ course.title }}</h3>
              <div class="course-meta">
                <div class="rating">
                  <el-icon color="#fadb14"><Star /></el-icon>
                  <span>{{ course.averageRating.toFixed(1) }}</span>
                  <span class="review-count">({{ course.reviewCount }})</span>
                </div>
                <div class="enrollment">
                  <el-icon><User /></el-icon>
                  <span>{{ course.enrollmentCount }} 人</span>
                </div>
              </div>
              <div class="course-tags">
                <el-tag
                  v-for="(tag, index) in course.tags.slice(0, 3)"
                  :key="index"
                  size="small"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="course-footer">
                <span class="price">NT${{ course.price.toLocaleString() }}</span>
                <span class="publish-date">{{ formatDate(course.publishDate) }}</span>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 分頁 -->
        <div v-if="pagination.totalPages > 1" class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.totalElements"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import {
  User,
  Reading,
  Document,
  Picture,
  Star,
  Loading,
  CircleClose
} from '@element-plus/icons-vue'
import { fetchTeacherDetail, formatPublishDate } from '@/api/student/teacherDetail'

const route = useRoute()
const router = useRouter()

// 狀態
const loading = ref(false)
const error = ref(null)
const teacher = ref(null)
const courses = ref([])
const sortType = ref('popular')
const pagination = ref({
  currentPage: 1,
  pageSize: 12,
  totalElements: 0,
  totalPages: 0
})

/**
 * 載入講師詳情
 */
const loadTeacherDetail = async (page = 0) => {
  const instructorId = route.params.id

  if (!instructorId) {
    error.value = '講師 ID 不存在'
    return
  }

  loading.value = true
  error.value = null

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '載入講師資料中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    console.log('🔄 開始載入講師詳情，ID:', instructorId, '排序:', sortType.value)
    const data = await fetchTeacherDetail(instructorId, {
      sort: sortType.value,
      page,
      size: pagination.value.pageSize
    })
    console.log('✅ 講師詳情載入成功:', data)

    // 更新講師資訊
    teacher.value = {
      instructorId: data.instructorId,
      instructorName: data.instructorName,
      bio: data.bio,
      avatarUrl: data.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      totalStudents: data.totalStudents || 0,
      totalCourses: data.totalCourses || 0
    }

    // 更新課程列表
    if (data.courses && data.courses.content) {
      courses.value = data.courses.content
      pagination.value = {
        currentPage: data.courses.number + 1, // 後端是 0-based，前端顯示從 1 開始
        pageSize: data.courses.size,
        totalElements: data.courses.totalElements,
        totalPages: data.courses.totalPages
      }
    } else {
      courses.value = []
    }

  } catch (err) {
    console.error('❌ 載入講師詳情失敗:', err)
    error.value = err.message || '載入講師資料失敗'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

/**
 * 處理排序變更
 */
const handleSortChange = () => {
  loadTeacherDetail(0) // 重新載入第一頁
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 處理分頁變更
 */
const handlePageChange = (page) => {
  loadTeacherDetail(page - 1) // 轉換為 0-based
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 前往課程詳情頁
 */
const goToCourse = (courseId) => {
  router.push({
    name: 'courseDetail',
    params: { id: courseId }
  })
}

/**
 * 格式化日期
 */
const formatDate = (dateString) => {
  return formatPublishDate(dateString)
}

onMounted(() => {
  loadTeacherDetail()
})
</script>

<style scoped>
.teacher-detail-page {
  min-height: 100vh;
  background: #FCF9F4;
  padding: 32px 24px;
}

/* 載入和錯誤狀態 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.error-container h2 {
  color: var(--el-color-danger);
  margin: 0;
}

/* 講師內容 */
.teacher-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 講師資訊卡片 */
.teacher-info-card {
  margin-bottom: 32px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.teacher-info-card :deep(.el-card__body) {
  padding: 32px;
}

.teacher-header {
  display: flex;
  gap: 32px;
  align-items: center;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.teacher-bio {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.teacher-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
}

.stat-item .el-icon {
  color: #7ec8a3;
  font-size: 20px;
}

/* 課程區域 */
.courses-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.sort-select {
  width: 150px;
}

.empty-courses {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-courses p {
  margin: 16px 0 0 0;
  font-size: 16px;
}

/* 課程網格 */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.course-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-card :deep(.el-card__body) {
  padding: 0;
}

.course-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #ccc;
  font-size: 40px;
}

.course-info {
  padding: 16px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 44px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-count {
  color: #999;
}

.enrollment {
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 24px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #7ec8a3;
}

.publish-date {
  font-size: 12px;
  color: #999;
}

/* 分頁 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .teacher-detail-page {
    padding: 16px;
  }

  .teacher-header {
    flex-direction: column;
    text-align: center;
  }

  .teacher-name {
    font-size: 24px;
  }

  .teacher-stats {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .sort-select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>
