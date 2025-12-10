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
  <div class="wrapper">
    <div class="filter-bar">
      <el-select
        v-model="currentSort"
        size="large"
        placeholder="排序方式"
        style="width: 200px; margin-left: auto"
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
      <el-table-column label="序號" width="80">
        <template #default="{ row }">
          <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申請者" width="300">
        <template #default="{ row }">
          <div style="display: flex; gap: 28px; align-items: center; padding: 8px 0">
            <div style="display: flex; align-items: center">
              <el-avatar :size="50" :src="row.avatarUrl" />
            </div>
            <div>
              <p style="font-weight: 500">{{ row.nickname }}</p>
              <p style="font-size: 12px; color: #909399">{{ row.fullName }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申請時間">
        <template #default="{ row }">
          <span style="font-style: italic; font-weight: 500">{{ formatDate(row.appliedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否為第一次申請">
        <template #default="{ row }">
          <span style="font-size: 20px" :class="{ 'highlight-record': !row.firstApplication }">
            {{ row.firstApplication ? "是" : "否" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewDetail(row.applicationId)">
            查看詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
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
.highlight-record {
  color: #409eff;
  font-weight: 500;
}
.pagination-btn {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
</style>
