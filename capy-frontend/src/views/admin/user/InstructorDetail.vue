<script setup>
import {
  User,
  Message,
  Clock,
  Briefcase,
  Document,
  Download,
  ArrowLeft,
  Close,
  Check,
} from "@element-plus/icons-vue";

const instructor = {
  id: "INS-2033",
  name: "王小敏",
  email: "instructor@example.com",
  nickname: "UX_Minx",
  status: "審核中",
  appliedAt: "2025-12-03",
  applicationTimes: 2,
};

const workExperiences = [
  { company: "星辰互動", title: "資深 UX 設計師", period: "2023/02 - 2025/11" },
  { company: "山海數位", title: "產品設計師", period: "2020/08 - 2023/01" },
];

const certificates = [
  { id: 1, name: "Google UX Certificate.pdf", size: "1.2 MB", type: "pdf" },
  { id: 2, name: "Figma Advanced Workshop.pdf", size: "860 KB", type: "pdf" },
  { id: 3, name: "作品集連結", size: "link", type: "link" },
];

const handleDownload = (item) => {
  // TODO: 串接後端下載
  console.log("download", item.name);
};
</script>

<template>
  <div class="instructor-detail">
    <div class="section-heading">講師申請詳情</div>

    <!-- 基本資料卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar">
            <span class="avatar-text">{{ instructor.name.charAt(0) }}</span>
          </div>
          <div class="profile-basic">
            <h2 class="profile-name">{{ instructor.name }}</h2>
            <span class="profile-id">{{ instructor.id }}</span>
          </div>
        </div>
        <el-tag
          :type="instructor.status === '審核中' ? 'warning' : 'success'"
          effect="light"
          size="large"
          round
        >
          {{ instructor.status }}
        </el-tag>
      </div>

      <div class="profile-info-grid">
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Message /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">Email</span>
            <span class="info-value">{{ instructor.email }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">暱稱</span>
            <span class="info-value">{{ instructor.nickname }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">提交時間</span>
            <span class="info-value">{{ instructor.appliedAt }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon warning">
            <el-icon><Document /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">申請次數</span>
            <span class="info-value">
              {{ instructor.applicationTimes }} 次
              <el-button v-if="instructor.applicationTimes > 1" link type="primary" size="small">
                查看歷次紀錄
              </el-button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 工作經歷 -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Briefcase /></el-icon>
        </div>
        <h3 class="section-title">工作經歷</h3>
      </div>
      <div class="timeline">
        <div v-for="(item, index) in workExperiences" :key="item.company" class="timeline-item">
          <div class="timeline-dot" :class="{ active: index === 0 }"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h4 class="company-name">{{ item.company }}</h4>
              <span class="period-badge">{{ item.period }}</span>
            </div>
            <p class="job-title">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 憑證文件 -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="section-title">憑證 / 證明文件</h3>
      </div>
      <div class="file-grid">
        <div
          v-for="item in certificates"
          :key="item.id"
          class="file-card"
          :class="{ 'file-link': item.type === 'link' }"
        >
          <div class="file-icon">
            <el-icon v-if="item.type === 'pdf'" size="24"><Document /></el-icon>
            <el-icon v-else size="24"><Link /></el-icon>
          </div>
          <div class="file-info">
            <p class="file-name">{{ item.name }}</p>
            <p class="file-size">{{ item.size }}</p>
          </div>
          <el-button
            type="primary"
            :icon="Download"
            circle
            size="small"
            @click="handleDownload(item)"
          />
        </div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="action-bar">
      <el-button size="large" :icon="ArrowLeft"> 返回列表 </el-button>
      <div class="action-main">
        <el-button type="danger" size="large" :icon="Close"> 審核不通過 </el-button>
        <el-button type="primary" size="large" :icon="Check"> 審核通過 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructor-detail {
  max-width: 900px;
}

/* 基本資料卡片 */
.profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-text {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.profile-basic {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.profile-id {
  font-size: 14px;
  opacity: 0.85;
  font-weight: 500;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 14px 16px;
  border-radius: 12px;
  transition: background 0.2s;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon.warning {
  background: rgba(230, 162, 60, 0.3);
}

.info-icon .el-icon {
  font-size: 18px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-content .info-label {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 500;
}

.info-content .info-value {
  font-size: 15px;
  font-weight: 600;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 區塊卡片 */
.section-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f2f5;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-icon .el-icon {
  font-size: 20px;
}

.section-card .section-title {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

/* 時間線 */
.timeline {
  padding-left: 8px;
}

.timeline-item {
  display: flex;
  gap: 20px;
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: #e5ecf6;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e5ecf6;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #e5ecf6;
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
}

.timeline-dot.active {
  background: #667eea;
  box-shadow: 0 0 0 2px #667eea;
}

.timeline-content {
  flex: 1;
  background: #f9fafb;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #f0f2f5;
  transition: all 0.2s;
}

.timeline-content:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.company-name {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.period-badge {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.job-title {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 文件網格 */
.file-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f0f2f5;
  transition: all 0.2s;
}

.file-card:hover {
  border-color: #667eea;
  background: #fafbff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08);
}

.file-card.file-link {
  border-style: dashed;
}

.file-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-info .file-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
  word-break: break-all;
}

.file-info .file-size {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

/* 操作按鈕 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  margin-top: 8px;
  border-top: 1px solid #f0f2f5;
  flex-wrap: wrap;
  gap: 16px;
}

.action-main {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 響應式 */
@media (max-width: 640px) {
  .profile-info-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    gap: 16px;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-main {
    justify-content: center;
  }
}
</style>
