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
    <div class="wrapper" style="margin-bottom: 24px">
      <div class="admin-filter-row">
        <el-form inline label-position="left" class="admin-filter-form">
          <el-form-item label="操作類型 :">
            <el-select
              v-model="filters.action"
              placeholder="選擇操作類型"
              clearable
              style="width: 170px"
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
              style="width: 280px"
              @change="handleFilterChange"
            />
          </el-form-item>
          <el-form-item label="排序 :">
            <el-select
              v-model="filters.sort"
              style="width: 150px"
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
            <el-button type="primary" @click="resetFilters">
              清除篩選
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="wrapper admin-table-container">
      <el-table
        v-loading="loading"
        stripe
        :row-class-name="() => 'table-row'"
        :cell-class-name="() => 'tbody-cell'"
        :header-cell-class-name="() => 'table-head'"
        :data="displayRecords()"
                empty-text="暫無符合的操作紀錄"
        @row-click="openRecord"
      >
        <el-table-column label="序號" width="70" align="center">
          <template #default="{ row }">
            <span class="admin-index">#{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作類型" width="150" align="center">
          <template #default="{ row }">
            <el-tag round effect="plain" :type="actionMeta[row.action]?.tagType || 'info'">
              {{ actionLabel(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作摘要" min-width="200">
          <template #default="{ row }">
            <div>
              <p class="summary-title">{{ row.displayReason || row.reason }}</p>
              <p class="summary-reason">目標: {{ row.targetType }} #{{ row.targetId }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="管理員" width="140" align="center">
          <template #default="{ row }">
            {{ row.adminNickname }}
          </template>
        </el-table-column>
        <el-table-column label="時間" width="180" align="center">
          <template #default="{ row }">
            <span class="admin-time-text">{{ formatTime(row.createdAt) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-btn" style="justify-content: center">
        <el-pagination
                    background
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :total="totalElements"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <div class="admin-dialog-gradient">
      <el-dialog v-model="dialogVisible" title="操作詳情" width="520px" align-center>
        <div class="admin-detail-list" v-if="selectedRecord">
          <div class="admin-detail-row">
            <span class="admin-detail-label">操作類型</span>
            <el-tag round effect="plain" :type="actionMeta[selectedRecord.action]?.tagType || 'info'">
              {{ actionLabel(selectedRecord.action) }}
            </el-tag>
          </div>
          <div class="admin-detail-row">
            <span class="admin-detail-label">目標類型</span>
            <span class="admin-detail-value">{{ selectedRecord.targetType }}</span>
          </div>
          <div class="admin-detail-row">
            <span class="admin-detail-label">目標 ID</span>
            <span class="admin-detail-value">#{{ selectedRecord.targetId }}</span>
          </div>
          <div class="admin-detail-row">
            <span class="admin-detail-label">原因 / 備註</span>
            <span class="admin-detail-value">{{ selectedRecord.reason || '—' }}</span>
          </div>
          <div class="admin-detail-row">
            <span class="admin-detail-label">管理員</span>
            <span class="admin-detail-value">{{ selectedRecord.adminNickname }}</span>
          </div>
          <div class="admin-detail-row">
            <span class="admin-detail-label">時間</span>
            <span class="admin-detail-value">{{ formatTime(selectedRecord.createdAt) }}</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
/* Page-specific styles */
.summary-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.summary-reason {
  color: #6B7280;
  font-size: 13px;
  line-height: 1.4;
}
</style>

