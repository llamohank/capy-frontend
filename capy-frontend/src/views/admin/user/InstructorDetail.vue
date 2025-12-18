<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getInstructorApplicationDetail,
  getApplicationHistory,
  downloadCertificate,
  approveInstructorApplication,
  rejectInstructorApplication,
} from "@/api/admin/instructor";
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
  Link,
  CreditCard,
} from "@element-plus/icons-vue";
import dayjs from "dayjs";

const router = useRouter();

// Props from route
const props = defineProps({
  instructorId: {
    type: [String, Number],
    required: true,
  },
});

// Data states
const loading = ref(false);
const applicationDetail = ref(null);
const applicationHistory = ref([]);
const showHistoryDialog = ref(false);
const submitting = ref(false);

// Computed values
const instructor = computed(() => {
  if (!applicationDetail.value) return null;
  const detail = applicationDetail.value;
  return {
    applicationId: detail.applicationId,
    applicantId: detail.applicantId,
    name: detail.fullName,
    email: detail.applicantEmail,
    nickname: detail.applicantNickname,
    avatarUrl: detail.applicantAvatarUrl,
    status: detail.status,
    appliedAt: detail.submittedAt,
    applicationCount: detail.applicationCount,
    resume: detail.resume,
    bankCode: detail.bankCode,
    accountNumber: detail.accountNumber,
  };
});

const workExperiences = computed(() => {
  if (!applicationDetail.value?.workExperiences) return [];
  return applicationDetail.value.workExperiences.map((exp) => ({
    id: exp.id,
    company: exp.companyName,
    title: exp.jobTitle,
    period: `${formatDate(exp.startDate, "YYYY/MM")} - ${exp.endDate ? formatDate(exp.endDate, "YYYY/MM") : "至今"}`,
  }));
});

const certificates = computed(() => {
  if (!applicationDetail.value?.certificates) return [];
  return applicationDetail.value.certificates.map((cert) => ({
    id: cert.id,
    name: cert.fileName,
    size: formatFileSize(cert.fileSize),
    type: "pdf",
    uploadedAt: cert.uploadedAt,
  }));
});

// Status mapping
const statusMap = {
  pending: { label: "審核中", type: "warning" },
  approved: { label: "已通過", type: "success" },
  rejected: { label: "未通過", type: "danger" },
};

const getStatusConfig = (status) => {
  return statusMap[status] || { label: status, type: "info" };
};

// Format functions
const formatDate = (dateStr, format = "YYYY-MM-DD HH:mm") => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format(format);
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Fetch application detail
const fetchApplicationDetail = async () => {
  try {
    loading.value = true;
    const result = await getInstructorApplicationDetail(props.instructorId);
    applicationDetail.value = result;
  } catch (error) {
    console.error("Failed to fetch application detail:", error);
    ElMessage.error("取得申請詳情失敗");
  } finally {
    loading.value = false;
  }
};

// Fetch application history
const fetchApplicationHistory = async () => {
  try {
    const result = await getApplicationHistory(props.instructorId);
    applicationHistory.value = result || [];
    showHistoryDialog.value = true;
  } catch (error) {
    console.error("Failed to fetch application history:", error);
    ElMessage.error("取得申請歷史失敗");
  }
};

// Download certificate
const handleDownload = async (item) => {
  try {
    const response = await downloadCertificate(item.id);
    const blob = new Blob([response], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download certificate:", error);
    ElMessage.error("下載憑證失敗");
  }
};

// 審核通過
const handleApprove = async () => {
  try {
    await ElMessageBox.confirm("確定要審核通過此講師申請嗎？", "審核通過", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "success",
      customClass: "audit-message-box",
    });

    submitting.value = true;
    await approveInstructorApplication(props.instructorId);
    ElMessage.success("審核通過成功");
    router.push({ name: "instructor_application_list" });
  } catch (error) {
    if (error !== "cancel" && error?.message !== "cancel") {
      console.error("Failed to approve application:", error);
      ElMessage.error("審核操作失敗");
    }
  } finally {
    submitting.value = false;
  }
};

// 審核拒絕
const handleReject = async () => {
  try {
    const { value: reason } = await ElMessageBox.prompt("請輸入拒絕原因", "審核拒絕", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      inputType: "textarea",
      inputPlaceholder: "請輸入拒絕原因...",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "請輸入拒絕原因";
        }
        return true;
      },
      customClass: "audit-message-box",
    });

    submitting.value = true;
    await rejectInstructorApplication(props.instructorId, reason);
    ElMessage.success("審核拒絕成功");
    router.push({ name: "instructor_application_list" });
  } catch (error) {
    if (error !== "cancel" && error?.message !== "cancel") {
      console.error("Failed to reject application:", error);
      ElMessage.error("審核操作失敗");
    }
  } finally {
    submitting.value = false;
  }
};

// Go back to list
const goBack = () => {
  router.push({ name: "instructor_application_list" });
};

onMounted(() => {
  fetchApplicationDetail();
});
</script>

<template>
  <div class="instructor-detail" v-loading="loading">
    <h2 class="section-heading">講師申請詳情</h2>

    <template v-if="instructor">
      <!-- 基本資料卡片 -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar :size="64" class="avatar" :src="instructor.avatarUrl">
              {{ instructor.name?.charAt(0) }}
            </el-avatar>
            <div class="profile-basic">
              <h2 class="profile-name">{{ instructor.name }}</h2>
              <span class="profile-id">ID: {{ instructor.applicantId }}</span>
            </div>
          </div>
          <el-tag
            :type="getStatusConfig(instructor.status).type"
                        round
          >
            {{ getStatusConfig(instructor.status).label }}
          </el-tag>
        </div>

        <el-divider />

        <el-descriptions :column="2" border>
          <el-descriptions-item>
            <template #label>
              <div class="desc-label">
                <el-icon><Message /></el-icon>
                <span>Email</span>
              </div>
            </template>
            {{ instructor.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="desc-label">
                <el-icon><User /></el-icon>
                <span>暱稱</span>
              </div>
            </template>
            {{ instructor.nickname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="desc-label">
                <el-icon><Clock /></el-icon>
                <span>提交時間</span>
              </div>
            </template>
            {{ formatDate(instructor.appliedAt) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="desc-label">
                <el-icon><Document /></el-icon>
                <span>申請次數</span>
              </div>
            </template>
            <div class="application-times">
              <span>{{ instructor.applicationCount }} 次</span>
              <el-button
                v-if="instructor.applicationCount > 1"
                link
                type="primary"
                size="small"
                @click="fetchApplicationHistory"
              >
                查看歷次紀錄
              </el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 銀行資訊 -->
      <div class="section-card">
        <div class="section-header">
          <el-icon class="section-icon"><CreditCard /></el-icon>
          <h3 class="section-title">銀行帳戶資訊</h3>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="銀行代碼">
            {{ instructor.bankCode || "—" }}
          </el-descriptions-item>
          <el-descriptions-item label="帳戶號碼">
            {{ instructor.accountNumber || "—" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 自我介紹 / 履歷 -->
      <div class="section-card" v-if="instructor.resume">
        <div class="section-header">
          <el-icon class="section-icon"><Document /></el-icon>
          <h3 class="section-title">自我介紹</h3>
        </div>
        <div class="resume-content">
          {{ instructor.resume }}
        </div>
      </div>

      <!-- 工作經歷 -->
      <div class="section-card" v-if="workExperiences.length > 0">
        <div class="section-header">
          <el-icon class="section-icon"><Briefcase /></el-icon>
          <h3 class="section-title">工作經歷</h3>
        </div>

        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in workExperiences"
            :key="item.id"
            :type="index === 0 ? 'primary' : 'info'"
            :hollow="index !== 0"
          >
            <div class="timeline-card">
              <div class="timeline-top">
                <h4 class="company-name">{{ item.company }}</h4>
                <el-tag size="small" type="info" effect="plain">{{
                  item.period
                }}</el-tag>
              </div>
              <p class="job-title">{{ item.title }}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 憑證文件 -->
      <div class="section-card" v-if="certificates.length > 0">
        <div class="section-header">
          <el-icon class="section-icon"><Document /></el-icon>
          <h3 class="section-title">憑證 / 證明文件</h3>
        </div>

        <div class="file-list">
          <div
            v-for="item in certificates"
            :key="item.id"
            class="file-item"
            :class="{ 'file-link': item.type === 'link' }"
          >
            <div class="file-icon">
              <el-icon v-if="item.type === 'pdf'" :size="20"
                ><Document
              /></el-icon>
              <el-icon v-else :size="20"><Link /></el-icon>
            </div>
            <div class="file-info">
              <span class="file-name">{{ item.name }}</span>
              <span class="file-size">{{ item.size }}</span>
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
        <el-button :icon="ArrowLeft" @click="goBack"
          >返回列表</el-button
        >
        <div class="action-main" v-if="instructor.status === 'pending'">
          <el-button
            type="danger"
                        :icon="Close"
            :loading="submitting"
            @click="handleReject"
            >審核拒絕</el-button
          >
          <el-button
            type="primary"
                        :icon="Check"
            :loading="submitting"
            @click="handleApprove"
            >審核通過</el-button
          >
        </div>
      </div>
    </template>

    <!-- 歷史紀錄對話框 -->
    <el-dialog v-model="showHistoryDialog" title="申請歷史紀錄" width="600px">
      <el-timeline>
        <el-timeline-item
          v-for="item in applicationHistory"
          :key="item.applicationId"
          :type="
            item.status === 'approved'
              ? 'success'
              : item.status === 'rejected'
                ? 'danger'
                : 'warning'
          "
          :timestamp="formatDate(item.submittedAt)"
          placement="top"
        >
          <div class="history-card">
            <div class="history-status">
              <el-tag :type="getStatusConfig(item.status).type" size="small">
                {{ getStatusConfig(item.status).label }}
              </el-tag>
              <span v-if="item.reviewedBy" class="history-reviewer">
                審核人: {{ item.reviewedBy }}
              </span>
            </div>
            <div v-if="item.reviewedAt" class="history-date">
              審核時間: {{ formatDate(item.reviewedAt) }}
            </div>
            <div v-if="item.rejectedReason" class="history-reason">
              拒絕原因: {{ item.rejectedReason }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<style scoped>
.instructor-detail {
  max-width: 900px;
}

/* 基本資料卡片 */
.profile-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  margin-bottom: var(--capy-spacing-lg);
  border: 1px solid var(--capy-border-lighter);
  box-shadow: var(--capy-shadow-sm);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
}

.avatar {
  background: var(--capy-primary);
  color: var(--capy-text-inverse);
  font-size: 24px;
  font-weight: var(--capy-font-weight-bold);
}

.profile-basic {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0;
}

.profile-id {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.desc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--capy-text-regular);
}

.desc-label .el-icon {
  color: var(--capy-primary);
}

.application-times {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 區塊卡片 */
.section-card {
  background: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-lg);
  margin-bottom: var(--capy-spacing-lg);
  border: 1px solid var(--capy-border-lighter);
  box-shadow: var(--capy-shadow-sm);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--capy-spacing-lg);
  padding-bottom: var(--capy-spacing-md);
  border-bottom: 1px solid var(--capy-border-lighter);
}

.section-icon {
  font-size: 20px;
  color: var(--capy-primary);
}

.section-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
}

/* 自我介紹 */
.resume-content {
  color: var(--capy-text-regular);
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 時間線 */
.timeline-card {
  padding: var(--capy-spacing-sm) 0;
}

.timeline-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.company-name {
  font-size: var(--capy-font-size-md);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0;
}

.job-title {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-md);
  padding: var(--capy-spacing-md);
  background: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-lighter);
  transition: all var(--capy-transition-base);
}

.file-item:hover {
  border-color: var(--capy-primary);
  box-shadow: var(--capy-shadow-sm);
}

.file-item.file-link {
  border-style: dashed;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--capy-radius-base);
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--capy-primary);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  word-break: break-all;
}

.file-size {
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-secondary);
}

/* 操作按鈕 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--capy-spacing-lg);
  border-top: 1px solid var(--capy-border-lighter);
  flex-wrap: wrap;
  gap: var(--capy-spacing-md);
}

.action-main {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 歷史紀錄 */
.history-card {
  padding: 8px 0;
}

.history-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.history-reviewer {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.history-date {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin-bottom: 4px;
}

.history-reason {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-regular);
  background: var(--capy-bg-base);
  padding: 8px 12px;
  border-radius: var(--capy-radius-base);
  margin-top: 8px;
}

/* 響應式 */
@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--capy-spacing-md);
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-main {
    justify-content: center;
  }

  :deep(.el-descriptions) {
    --el-descriptions-item-bordered-label-background: var(--capy-bg-base);
  }
}

/* Element Plus 覆寫 */
:deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: var(--capy-bg-base);
}

:deep(.el-divider) {
  margin: var(--capy-spacing-md) 0;
}

:deep(.el-timeline) {
  padding-left: 4px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}
</style>
