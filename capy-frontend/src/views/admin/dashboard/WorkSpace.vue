<script setup>
import { ref, computed, onMounted } from "vue";
import GradientLineChart from "@/components/admin/GradientLineChart.vue";
import UserGrowthChart from "@/components/admin/UserGrowthChart.vue";
import { getDashboard, getWeeklyUserTrend } from "@/api/admin/dashboard";

const progressBarColor = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"];

// Dashboard data
const dashboardData = ref({
  todayNewUsers: 0,
  pendingCourseReview: 0,
  pendingInstructorApplications: 0,
  currentMonthRevenue: 0,
  currentMonthNewUsers: 0,
  popularCourses: [],
});

// Weekly user trend data
const weeklyUserTrend = ref([]);

// Loading states
const loading = ref(false);

const datalist = computed(() => {
  const courses = dashboardData.value.popularCourses || [];
  const total = courses.reduce((sum, item) => sum + item.enrollmentCount, 0) || 1;
  return courses.map((item, index) => ({
    id: item.courseId,
    name: item.courseTitle,
    num: item.enrollmentCount,
    value: Math.ceil((item.enrollmentCount / total) * 100),
    color: progressBarColor[index] || "#ccc",
  }));
});

const formatCurrency = (value) => {
  return `NT$${Number(value || 0).toLocaleString()}`;
};

const getTimestamps = () => {
  const now = new Date();

  // Today start (00:00:00)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStartEpochMillis = todayStart.getTime();

  // Month start (first day of current month 00:00:00)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartEpochMillis = monthStart.getTime();

  return { todayStartEpochMillis, monthStartEpochMillis };
};

const fetchDashboard = async () => {
  try {
    loading.value = true;
    const { todayStartEpochMillis, monthStartEpochMillis } = getTimestamps();
    const data = await getDashboard(todayStartEpochMillis, monthStartEpochMillis);
    if (data) {
      dashboardData.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
  } finally {
    loading.value = false;
  }
};

const fetchWeeklyUserTrend = async () => {
  try {
    const { monthStartEpochMillis } = getTimestamps();
    const data = await getWeeklyUserTrend(monthStartEpochMillis);
    if (data) {
      weeklyUserTrend.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch weekly user trend:", error);
  }
};

onMounted(() => {
  fetchDashboard();
  fetchWeeklyUserTrend();
});
</script>

<template>
  <h2 class="section-heading">管理員工作台</h2>
  <div v-loading="loading" class="dashboard-container">
    <!-- Stats Row -->
    <div class="stats-section">
      <h3 class="section-title">今日概況</h3>
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="stat-card">
            <span class="stat-card__label">今日新註冊用戶</span>
            <span class="stat-card__value">{{ dashboardData.todayNewUsers }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <span class="stat-card__label">待審核上架申請</span>
            <span class="stat-card__value" :class="{ 'stat-card__value--warning': dashboardData.pendingCourseReview > 0 }">
              {{ dashboardData.pendingCourseReview }}
              <span v-if="dashboardData.pendingCourseReview > 0" class="pending-dot"></span>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <span class="stat-card__label">待審核教師申請</span>
            <span class="stat-card__value" :class="{ 'stat-card__value--warning': dashboardData.pendingInstructorApplications > 0 }">
              {{ dashboardData.pendingInstructorApplications }}
              <span v-if="dashboardData.pendingInstructorApplications > 0" class="pending-dot"></span>
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <span class="stat-card__label">本月收益</span>
            <span class="stat-card__value stat-card__value--primary">
              <el-text class="revenue-text" truncated>{{ formatCurrency(dashboardData.currentMonthRevenue) }}</el-text>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <h3 class="section-title">平台數據一覽</h3>
      <el-row :gutter="24">
        <el-col :span="14">
          <div class="wrapper chart-wrapper">
            <div class="chart-header">
              <span class="chart-title">本月學生人數成長</span>
              <span class="chart-value">{{ dashboardData.currentMonthNewUsers }} 人</span>
            </div>
            <div class="chart-container">
              <UserGrowthChart :data="weeklyUserTrend" />
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="wrapper">
            <p class="chart-title" style="margin-bottom: 8px">熱門課程 Top 5</p>
            <ul class="top-course-list">
              <template v-if="datalist.length">
                <li v-for="item in datalist" :key="item.id" class="top-course-item">
                  <div class="top-course-header">
                    <span class="course-name">{{ item.name }}</span>
                    <el-button link type="primary">查看</el-button>
                  </div>
                  <p class="course-count">{{ item.num }} 人</p>
                  <el-progress :color="item.color" :show-text="false" :percentage="item.value" />
                </li>
              </template>
              <el-empty v-else description="暫無數據" />
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Revenue Chart -->
    <div class="revenue-section">
      <div class="wrapper">
        <GradientLineChart />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ==================== Stat Cards ==================== */
.stat-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #F3F4F6;
  transition: all 0.25s ease;
  height: 100%;
}

.stat-card:hover {
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.1);
  border-color: #E0E7FF;
  transform: translateY(-2px);
}

.stat-card__label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 16px;
}

.stat-card__value {
  position: relative;
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.stat-card__value--primary {
  color: #4F46E5;
}

.stat-card__value--warning {
  color: #D97706;
}

.pending-dot {
  position: absolute;
  top: 4px;
  margin-left: 6px;
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

.revenue-text {
  font-size: 28px;
  font-weight: 700;
  color: #4F46E5;
}

/* ==================== Chart Section ==================== */
.chart-wrapper {
  height: 100%;
}

.chart-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.chart-value {
  font-size: 24px;
  font-weight: 700;
  color: #4F46E5;
}

.chart-container {
  height: 450px;
  width: 100%;
}

/* ==================== Top Course List ==================== */
.top-course-list {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-course-item {
  /* Add any specific styling */
}

.top-course-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.course-name {
  font-weight: 500;
  color: #374151;
  font-size: 15px;
}

.course-count {
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
}
</style>

