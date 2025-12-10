<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/utils/http';
import TrustBar from '@/components/student/Home/TrustBar.vue';
import { User, Reading } from '@element-plus/icons-vue';

// --- 路由參數 ---
const route = useRoute();
const router = useRouter();
const instructorId = ref(Number(route.params.id) || null);

// --- 教師資料 ---
const teacher = ref(null);

// --- 分頁 ---
const currentPage = ref(1);
const pageSize = 12;

// 格式化數字，例如 12000 -> 12k
const formatCount = count => {
  if (count === null || count === undefined) return '0';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

const formatReviews = count => {
  if (count === null || count === undefined) return '0';
  const num = Number(count);
  if (Number.isNaN(num)) return '0';
  return num.toLocaleString();
};

const displayRating = rating => {
  if (rating === null || rating === undefined) return '0.0';
  const num = Number(rating);
  if (Number.isNaN(num)) return '0.0';
  return num.toFixed(1);
};

// --- 取得老師資料 ---
const fetchTeacher = async (id, page = 0) => {
  if (!id) return;
  try {
    const res = await api.get(`/explore/instructor/${id}`, {
      params: { page, size: pageSize, sort: 'popular' }
    });
    teacher.value = res;
  } catch (err) {
    console.error('取得老師資料失敗', err);
  }
};


// --- 分頁切換 ---
const handlePageChange = page => {
  currentPage.value = page;
  fetchTeacher(instructorId.value, page - 1); // 後端分頁從 0 開始
  scrollToCourses();
};

const scrollToCourses = () => {
  const courseSection = document.querySelector('.courses-section');
  if (courseSection) {
    courseSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- 點擊課程 ---
const goToCourse = courseId => {
  if (!courseId) return;
  router.push({ name: 'courseDetail', params: { id: courseId } });
};

// --- 初始取得老師資料 ---
onMounted(() => {
  fetchTeacher(instructorId.value, currentPage.value - 1);
});

// --- 路由變更時重新抓取 ---
watch(
  () => route.params.id,
  newId => {
    const parsedId = Number(newId);
    instructorId.value = Number.isNaN(parsedId) ? null : parsedId;
    currentPage.value = 1;
    fetchTeacher(instructorId.value, 0);
  }
);

</script>

<template>
  <div class="common-layout capy-theme">
    <el-container>

      <el-header height="auto">
        <TrustBar/>
      </el-header>

      <el-main class="main-content">

        <!-- 老師個人資訊 -->
        <div v-if="teacher" class="teacher-profile-card">
          <div class="profile-left">
            <div class="avatar-wrapper">
              <div class="avatar-ring"></div>
              <el-avatar :size="160" :src="teacher.avatarUrl" class="teacher-avatar" />
            </div>
          </div>

          <div class="profile-right">
            <div class="profile-header">
              <h1 class="teacher-name">{{ teacher.instructorName }}</h1>
            </div>
            <p class="teacher-bio">{{ teacher.bio }}</p>

            <div class="teacher-stats">
              <div class="stat-item">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><User /></el-icon>
                </div>
                <div class="stat-text">
                  <span class="stat-value">{{ formatCount(teacher.totalStudents) }}</span>
                  <span class="stat-label">學員總數</span>
                </div>
              </div>

              <div class="stat-divider"></div>

              <div class="stat-item">
                <div class="stat-icon-wrapper">
                  <el-icon class="stat-icon"><Reading /></el-icon>
                </div>
                <div class="stat-text">
                  <span class="stat-value">{{ teacher.totalCourses }}</span>
                  <span class="stat-label">開設課程</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 課程列表 -->
        <div class="courses-section" v-if="teacher && teacher.courses">
          <h2 class="section-title">
            <span class="title-decoration"></span>
            Courses by this Teacher
          </h2>

          <div class="course-grid">
            <div
              class="course-card"
              v-for="course in teacher.courses.content || []"
              :key="course.id"
              @click="goToCourse(course.id)"
            >
              <div class="img-wrapper">
                <img :src="course.coverImageUrl" class="course-img" loading="lazy" />
                <div class="course-tag">熱門</div>
              </div>

              <div class="card-content">
                <h3 class="course-title">{{ course.title }}</h3>
                <p class="teacher-sub">{{ teacher.instructorName }}</p>

                <div class="card-footer">
                  <div class="rating-box">
                    <span class="rating-num">{{ displayRating(course.averageRating) }}</span>
                    <el-rate
                      :model-value="Number(course.averageRating) || 0"
                      disabled
                      show-score
                      text-color="#ff9900"
                      size="small"
                      class="custom-rate"
                    />
                  </div>
                  <span class="review-count">{{ formatReviews(course.reviewCount) }} 評價</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分頁 -->
          <div class="pagination-wrapper" v-if="teacher.courses.totalElements > pageSize">
            <el-pagination
              background
              layout="prev, pager, next"
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="teacher.courses.totalElements"
              @current-change="handlePageChange"
              class="custom-pagination"
            />
          </div>
        </div>

      </el-main>
    </el-container>
  </div>
</template>


<style scoped>
/* --- CSS 變數定義 (Capy Theme) --- */
.capy-theme {
  --capy-primary: #00bfa5;        /* 湖水綠 / Teal */
  --capy-primary-light: #e0f2f1;
  --capy-bg-surface: #ffffff;
  --capy-text-primary: #2c3e50;
  --capy-text-secondary: #606266;
  --capy-text-tertiary: #909399;
  --capy-border-light: #e4e7ed;
  --capy-border-lighter: #f2f6fc;
  --capy-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --capy-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --capy-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --capy-radius-lg: 16px;
  --capy-radius-md: 12px;
  --capy-transition-base: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  color: var(--capy-text-primary);
  background-color: #f9fbfd; /* 頁面背景微灰，凸顯卡片 */
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* =========================================
   1. Teacher Profile Card (詳情頁大卡片)
   ========================================= */
.teacher-profile-card {
  display: flex;
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: 40px;
  box-shadow: var(--capy-shadow-md);
  margin-bottom: 60px;
  gap: 60px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 裝飾背景圓 (選用) */
.teacher-profile-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: var(--capy-primary-light);
  border-radius: 50%;
  opacity: 0.5;
  z-index: 0;
}

.profile-left {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.profile-right {
  flex: 1;
  text-align: left;
  position: relative;
  z-index: 1;
}

/* Avatar Ring Effect */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid var(--capy-primary);
  opacity: 0.3;
  animation: pulse-ring 3s infinite;
}

@keyframes pulse-ring {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.2; }
  100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
}

.teacher-avatar {
  border: 4px solid var(--capy-bg-surface);
  box-shadow: var(--capy-shadow-sm);
  position: relative;
  z-index: 2;
}

/* Profile Texts */
.profile-header {
  margin-bottom: 16px;
  border-bottom: 2px solid var(--capy-border-lighter);
  padding-bottom: 16px;
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.teacher-name {
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  color: var(--capy-text-primary);
  letter-spacing: -0.5px;
}

.teacher-job {
  font-size: 18px;
  color: var(--capy-primary);
  font-weight: 600;
  background: var(--capy-primary-light);
  padding: 4px 12px;
  border-radius: 20px;
}

.teacher-bio {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-secondary);
  margin-bottom: 30px;
  max-width: 800px;
}

/* Stats Row */
.teacher-stats {
  display: flex;
  align-items: center;
  gap: 40px;
  background: #f8fafc;
  padding: 20px 30px;
  border-radius: var(--capy-radius-md);
  width: fit-content;
  border: 1px solid var(--capy-border-light);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  background: var(--capy-bg-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 20px;
  color: var(--capy-primary);
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--capy-text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--capy-text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--capy-border-light);
}

/* RWD for Profile */
@media (max-width: 768px) {
  .teacher-profile-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    gap: 30px;
  }
  .profile-right { text-align: center; }
  .profile-header { justify-content: center; }
  .teacher-stats { 
    width: 100%; 
    justify-content: space-around; 
    padding: 15px; 
    gap: 10px;
  }
  .stat-item { flex-direction: column; gap: 6px; }
  .stat-divider { display: none; }
  .stat-icon-wrapper { margin-bottom: 4px; }
}

/* =========================================
   2. Course Grid (課程列表)
   ========================================= */
.courses-section { margin-bottom: 60px; }

.section-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--capy-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-decoration {
  display: block;
  width: 6px;
  height: 24px;
  background: var(--capy-primary);
  border-radius: 4px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 24px;
}

/* RWD Grid */
@media (max-width: 1024px) { .course-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .course-grid { grid-template-columns: 1fr; } }

/* 卡片樣式 (Capy Card Style) */
.course-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: var(--capy-shadow-sm);
  transition: all var(--capy-transition-base);
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--capy-shadow-lg);
  border-color: var(--capy-primary);
}

.img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.course-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.course-card:hover .course-img {
  transform: scale(1.05);
}

.course-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--capy-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
  /* 兩行省略 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px; 
}

.teacher-sub {
  font-size: 13px;
  color: var(--capy-primary);
  margin: 0 0 12px 0;
  font-weight: 500;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--capy-text-tertiary);
  border-top: 1px solid var(--capy-border-lighter);
  padding-top: 12px;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-num {
  font-weight: 700;
  color: #ff9900;
  font-size: 14px;
}

/* Rate Component Override */
:deep(.el-rate__icon) { margin-right: 0; font-size: 12px; }
:deep(.el-rate) { height: auto; }

/* =========================================
   3. Pagination (Capy Style)
   ========================================= */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  text-align: center;
}

:deep(.el-pagination) {
  justify-content: center; 
  gap: 8px;
  --el-pagination-button-bg-color: var(--capy-bg-surface);
  --el-pagination-hover-color: var(--capy-primary);
}

:deep(.el-pagination .el-pager li) {
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: var(--capy-primary) !important;
  color: #fff !important;
  box-shadow: 0 4px 10px rgba(0, 191, 165, 0.3);
}

:deep(.el-pagination button) {
  border-radius: 8px;
}
</style>
