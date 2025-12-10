<script setup>
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getAuditLogs } from "@/api/admin/auditLog";
import dayjs from "dayjs";

// 操作類型選項 (對應後端 action enum)
const actionOptions = [
  { label: "所有類型", value: "" },
  { label: "用戶停權", value: "user_suspended" },
  { label: "用戶恢復", value: "user_unsuspended" },
  { label: "講師申請通過", value: "instructor_application_approved" },
  { label: "講師申請拒絕", value: "instructor_application_rejected" },
  { label: "課程審核通過", value: "course_submitted_approved" },
  { label: "課程審核拒絕", value: "course_submitted_rejected" },
  { label: "課程強制下架", value: "course_force_unpublished" },
  { label: "課程恢復上架", value: "course_restored" },
  { label: "標籤新增", value: "tag_created" },
  { label: "標籤刪除", value: "tag_deleted" },
  { label: "公告發布", value: "announcement_created" },
  { label: "撥款執行", value: "payout_executed" },
];

// 操作類型 meta (顯示和樣式)
const actionMeta = {
  user_suspended: { label: "用戶停權", tagType: "danger" },
  user_unsuspended: { label: "用戶恢復", tagType: "success" },
  instructor_application_approved: { label: "講師審核通過", tagType: "success" },
  instructor_application_rejected: { label: "講師審核拒絕", tagType: "warning" },
  course_submitted_approved: { label: "課程審核通過", tagType: "success" },
  course_submitted_rejected: { label: "課程審核拒絕", tagType: "warning" },
  course_force_unpublished: { label: "強制下架", tagType: "danger" },
  course_restored: { label: "恢復上架", tagType: "info" },
  tag_created: { label: "標籤新增", tagType: "primary" },
  tag_deleted: { label: "標籤刪除", tagType: "info" },
  announcement_created: { label: "公告發布", tagType: "primary" },
  payout_executed: { label: "撥款執行", tagType: "warning" },
};

// 排序選項
const sortOptions = [
  { label: "時間由新到舊", value: "createdAt,desc" },
  { label: "時間由舊到新", value: "createdAt,asc" },
];

// 資料狀態
const loading = ref(false);
const records = ref([]);
const totalElements = ref(0);

// 篩選條件
const filters = ref({
  action: "",
  dateRange: [],
  sort: "createdAt,desc",
});

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// Dialog
const dialogVisible = ref(false);
const selectedRecord = ref(null);

// 取得操作紀錄
const fetchLogs = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      sort: filters.value.sort,
    };

    // 操作類型篩選
    if (filters.value.action) {
      params.action = filters.value.action;
    }

    // 時間範圍篩選
    const [start, end] = filters.value.dateRange || [];
    if (start && end) {
      params.startEpochMillis = new Date(start).getTime();
      // 結束時間設為當天結束 (23:59:59.999)
      params.endEpochMillis = new Date(end).getTime() + 24 * 60 * 60 * 1000 - 1;
    }

    const result = await getAuditLogs(params);
    if (result) {
      records.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    ElMessage.error("取得操作紀錄失敗");
  } finally {
    loading.value = false;
  }
};

// 處理篩選變更
const handleFilterChange = () => {
  currentPage.value = 1;
  fetchLogs();
};

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchLogs();
};

// 清除篩選
const resetFilters = () => {
  filters.value = { 
    action: "", 
    dateRange: [],
    sort: "createdAt,desc",
  };
  currentPage.value = 1;
  fetchLogs();
};

// 格式化時間
const formatTime = (isoString) => {
  if (!isoString) return "—";
  return dayjs(isoString).format("YYYY-MM-DD HH:mm");
};

// 取得操作類型標籤
const actionLabel = (value) => actionMeta[value]?.label || value;

// 開啟詳情
const openRecord = (row) => {
  selectedRecord.value = row;
  dialogVisible.value = true;
};

// 計算帶序號的資料
const displayRecords = () => {
  return records.value.map((item, index) => ({
    ...item,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
  }));
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
  <div>
    <h2 class="section-heading">操作紀錄查詢</h2>
    <div class="wrapper" style="margin-bottom: 32px">
      <div class="filter-bar">
        <el-form inline size="large" label-position="left" class="filter-form">
          <el-form-item label="操作類型 :">
            <el-select
              v-model="filters.action"
              placeholder="選擇操作類型"
              clearable
              style="width: 220px"
              @change="handleFilterChange"
            >
              <el-option
                v-for="option in actionOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作時間 :">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 320px"
              @change="handleFilterChange"
            />
          </el-form-item>
          <el-form-item label="排序 :">
            <el-select
              v-model="filters.sort"
              style="width: 160px"
              @change="handleFilterChange"
            >
              <el-option
                v-for="option in sortOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="resetFilters">
              清除篩選
            </el-button>
          </el-form-item>
        </el-form>
        <div class="meta">
          <span class="meta-label">共</span>
          <span class="meta-value">{{ totalElements }}</span>
          <span class="meta-label">筆結果</span>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <el-table
        v-loading="loading"
        stripe
        :row-class-name="() => 'table-row'"
        :cell-class-name="() => 'tbody-cell'"
        :header-cell-class-name="() => 'table-head'"
        :data="displayRecords()"
        size="large"
        empty-text="暫無符合的操作紀錄"
        @row-click="openRecord"
      >
        <el-table-column label="序號" width="80">
          <template #default="{ row }">
            <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作類型">
          <template #default="{ row }">
            <el-tag size="large" round effect="plain" :type="actionMeta[row.action]?.tagType || 'info'">
              {{ actionLabel(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作摘要">
          <template #default="{ row }">
            <div style="width: 80%; padding-left: 10%">
              <p class="summary-title">{{ row.displayReason || row.reason }}</p>
              <p class="summary-reason">目標: {{ row.targetType }} #{{ row.targetId }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="管理員">
          <template #default="{ row }">
            <span>{{ row.adminNickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="時間">
          <template #default="{ row }">
            <span class="time-text">{{ formatTime(row.createdAt) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-btn">
        <el-pagination
          size="large"
          background
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :total="totalElements"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="操作詳情" width="520px" align-center>
      <div class="detail-list" v-if="selectedRecord">
        <div class="detail-row">
          <span class="detail-label">操作類型</span>
          <el-tag round effect="plain" :type="actionMeta[selectedRecord.action]?.tagType || 'info'">
            {{ actionLabel(selectedRecord.action) }}
          </el-tag>
        </div>
        <div class="detail-row">
          <span class="detail-label">目標類型</span>
          <span class="detail-value">{{ selectedRecord.targetType }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">目標 ID</span>
          <span class="detail-value">#{{ selectedRecord.targetId }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">原因 / 備註</span>
          <span class="detail-value">{{ selectedRecord.reason || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">管理員</span>
          <span class="detail-value">{{ selectedRecord.adminNickname }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">時間</span>
          <span class="detail-value">{{ formatTime(selectedRecord.createdAt) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;

  gap: 20px;
  flex-wrap: wrap;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.el-form-item {
  margin: 0;
}
.meta {
  /* text-align: right; */
  color: #909399;
  min-width: 120px;
}

.meta-value {
  /* display: block; */
  margin: 0 4px;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.meta-label {
  font-size: 14px;
}

.summary-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-reason {
  color: #909399;
  font-size: 14px;
  line-height: 1.4;
}

.target-text {
  font-weight: 500;
}

.time-text {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
}
:deep(.el-dialog__header) {
  text-align: center;
  font-weight: 500;
  margin-right: 0;
  margin-bottom: 12px;
  padding-right: 0;
  padding-top: 12px;
  padding-bottom: 12px;
}
:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
:deep(.el-dialog__body) {
  padding: 12px;
}
:deep(.table-row:hover) {
  cursor: pointer;
}
:deep(.table-row .cell) {
  padding: 8px 0;
}
:deep(.tbody-cell .cell) {
  display: flex;
  justify-content: center;
}

:deep(.table-head .cell) {
  font-size: 18px;
  text-align: center;
  padding: 4px 0 28px 0;
}

.index {
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: #909399;
  opacity: 0.3;
  transition: opacity 0.2s;
}
.table-row:hover .index {
  opacity: 1;
}
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;

  line-height: 1.2;
}

.detail-label {
  color: #909399;
  font-weight: 500;
  min-width: 120px;
}

.detail-value {
  flex: 1;

  word-break: break-word;
}

.pagination-btn {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
}
</style>
