<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getInstructorApplications } from "@/api/admin/instructor";
import dayjs from "dayjs";

const router = useRouter();

// 資料狀態
const loading = ref(false);
const tableData = ref([]);
const totalElements = ref(0);

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// 排序
const sortField = ref("createdAt");
const sortOrder = ref("desc");
const currentSort = ref("createdAt,desc");

// 排序選項
const sortOptions = [
  { label: "申請時間（新到舊）", value: "createdAt,desc" },
  { label: "申請時間（舊到新）", value: "createdAt,asc" },
];

// 處理排序變更
const handleSortChange = (value) => {
  const [field, order] = value.split(",");
  sortField.value = field;
  sortOrder.value = order;
  currentPage.value = 1;
  fetchApplications();
};

// 取得教師申請列表
const fetchApplications = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      sort: `${sortField.value},${sortOrder.value}`,
    };
    const result = await getInstructorApplications(params);
    if (result) {
      tableData.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch instructor applications:", error);
    ElMessage.error("取得教師申請列表失敗");
  } finally {
    loading.value = false;
  }
};

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchApplications();
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("YYYY-MM-DD HH:mm");
};

// 帶索引的資料
const dataWithIndex = computed(() => {
  return tableData.value.map((item, index) => ({
    ...item,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
  }));
});

// 查看詳情
const viewDetail = (applicationId) => {
  router.push({
    name: "instructor_detail",
    params: { instructorId: applicationId },
  });
};

onMounted(() => {
  fetchApplications();
});
</script>
<template>
  <h2 class="section-heading">教師申請列表</h2>
  <div class="wrapper" style="margin-bottom: 24px">
    <div class="filter-bar">
      <el-select
        v-model="currentSort"
        size="large"
        placeholder="排序方式"
        style="width: 200px"
        @change="handleSortChange"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>

  <div class="wrapper">
    <el-table
      v-loading="loading"
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
      size="large"
      :data="dataWithIndex"
      style="width: 100%"
      empty-text="暫無申請"
    >
      <el-table-column label="序號" width="100" align="center">
        <template #default="{ row }">
          <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申請者" min-width="280">
        <template #default="{ row }">
          <div style="width: 80%">
            <div class="user-info-cell">
              <el-avatar :size="50" :src="row.avatarUrl" />
              <div class="user-details">
                <p class="user-name">{{ row.nickname }}</p>
                <p class="user-sub">{{ row.fullName }}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申請時間" min-width="180" align="center">
        <template #default="{ row }">
          <span class="date-text">{{ formatDate(row.appliedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否為第一次申請" min-width="160" align="center">
        <template #default="{ row }">
          <span
            class="first-application-badge"
            :class="{ 'highlight-record': !row.firstApplication }"
          >
            {{ row.firstApplication ? "是" : "否" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewDetail(row.applicationId)">
            查看詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-btn" style="justify-content: center">
      <el-pagination
        size="large"
        background
        layout="total, prev, pager, next"
        :total="totalElements"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
<style scoped>
:deep(.el-table) {
  --el-table-header-bg-color: #f9fafb;
  --el-table-row-hover-bg-color: #f5f3ff;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.tbody-cell .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
}

:deep(.table-head .cell) {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #374151;
  padding: 16px 12px;
}

/* 用戶資訊欄位 */
.user-info-cell {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 8px 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
}

.user-sub {
  font-size: 12px;
  color: #909399;
}

/* 索引樣式 */
.index {
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
  color: #9ca3af;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.table-row:hover .index {
  opacity: 1;
  color: #4f46e5;
}

/* 日期樣式 */
.date-text {
  font-style: italic;
  font-weight: 500;
}

/* 首次申請標記 */
.first-application-badge {
  font-size: 16px;
  font-weight: 500;
}

.highlight-record {
  color: #4f46e5;
  font-weight: 600;
}

.pagination-btn {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
