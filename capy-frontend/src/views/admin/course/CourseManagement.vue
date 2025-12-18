<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getApprovedCourses, getParentCategories } from "@/api/admin/course";
import dayjs from "dayjs";

const router = useRouter();

// 資料狀態
const loading = ref(false);
const tableData = ref([]);
const totalElements = ref(0);

// 分類選項
const categoryOptions = ref([]);

// 篩選與搜尋
const currentCategory = ref("");
const currentStatus = ref("");
const searchKeyword = ref("");

// 狀態篩選選項
const statusOptions = [
  { label: "已上架", value: "published" },
  { label: "強制下架", value: "force_unpublish" },
];

// 排序
const sortField = ref("publishedAt");
const sortOrder = ref("desc");

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// 取得分類選項
const fetchCategories = async () => {
  try {
    const result = await getParentCategories();
    if (result) {
      categoryOptions.value = result.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// 取得課程列表
const fetchCourses = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      sort: `${sortField.value},${sortOrder.value}`,
    };

    if (currentCategory.value) {
      params.parentCategoryId = currentCategory.value;
    }

    if (currentStatus.value) {
      params.status = currentStatus.value;
    }

    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }

    const result = await getApprovedCourses(params);
    if (result) {
      tableData.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    ElMessage.error("取得課程列表失敗");
  } finally {
    loading.value = false;
  }
};

// 排序選項
const sortOptions = [
  { label: "上架時間（新到舊）", value: "publishedAt,desc" },
  { label: "上架時間（舊到新）", value: "publishedAt,asc" },
  { label: "課程名稱（A-Z）", value: "title,asc" },
  { label: "課程名稱（Z-A）", value: "title,desc" },
  { label: "價格（高到低）", value: "price,desc" },
  { label: "價格（低到高）", value: "price,asc" },
];

const currentSort = ref("publishedAt,desc");

// 處理排序變更
const handleSortChange = (value) => {
  const [field, order] = value.split(",");
  sortField.value = field;
  sortOrder.value = order;
  currentPage.value = 1;
  fetchCourses();
};

// 處理分類變更
const handleCategoryChange = () => {
  currentPage.value = 1;
  fetchCourses();
};

// 處理狀態變更
const handleStatusChange = () => {
  currentPage.value = 1;
  fetchCourses();
};

// 處理搜尋
const handleSearch = () => {
  currentPage.value = 1;
  fetchCourses();
};

// 清除搜尋
const clearSearch = () => {
  searchKeyword.value = "";
  currentPage.value = 1;
  fetchCourses();
};

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchCourses();
};

// 狀態標籤
const statusLabel = (status) => {
  const statusMap = {
    draft: "草稿",
    pending_review: "待審核",
    submitted_approved: "審核通過",
    submitted_rejected: "審核拒絕",
    transcoding: "轉碼中",
    transcoding_failed: "轉碼失敗",
    published: "已上架",
    force_unpublish: "強制下架",
  };
  return statusMap[status] || status;
};

const statusTagType = (status) => {
  const typeMap = {
    draft: "info",
    pending_review: "warning",
    submitted_approved: "success",
    submitted_rejected: "danger",
    transcoding: "warning",
    transcoding_failed: "danger",
    published: "success",
    force_unpublish: "danger",
  };
  return typeMap[status] || "info";
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("YYYY-MM-DD HH:mm");
};

// 格式化分類
const formatCategory = (row) => {
  if (row.parentCategoryName && row.subCategoryName) {
    return `${row.parentCategoryName} / ${row.subCategoryName}`;
  }
  return row.parentCategoryName || row.subCategoryName || "—";
};

// 帶索引的資料
const dataWithIndex = computed(() => {
  return tableData.value.map((item, index) => ({
    ...item,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
  }));
});

// 查看課程詳情
const viewCourseDetail = (courseId) => {
  router.push({
    name: "viewCourseDetail",
    params: { courseId },
  });
};

onMounted(() => {
  fetchCategories();
  fetchCourses();
});
</script>

<template>
  <h2 class="section-heading">課程狀態管理</h2>

  <div class="wrapper" style="margin-bottom: 24px">
    <!-- 篩選與搜尋區 -->
    <div class="admin-filter-row">
      <el-select
        v-model="currentCategory"
                placeholder="全部分類"
        clearable
        style="width: 200px"
        @change="handleCategoryChange"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-model="currentStatus"
                placeholder="全部狀態"
        clearable
        style="width: 150px"
        @change="handleStatusChange"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-input
        v-model="searchKeyword"
                placeholder="搜尋課程名稱、講師..."
        style="width: 300px"
        clearable
        @keyup.enter="handleSearch"
        @clear="clearSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" @click="handleSearch">
        <el-icon style="margin-right: 4px"><Search /></el-icon>
        搜尋
      </el-button>

      <el-select
        v-model="currentSort"
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

  <div class="wrapper admin-table-container">
    <!-- 課程列表 -->
    <el-table
      v-loading="loading"
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
            :data="dataWithIndex"
      style="width: 100%"
      empty-text="暫無課程"
    >
      <el-table-column label="序號" width="70" align="center">
        <template #default="{ row }">
          <span class="admin-index">#{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="課程名稱" min-width="200">
        <template #default="{ row }">
          {{ row.courseTitle }}
        </template>
      </el-table-column>
      <el-table-column label="分類" width="180">
        <template #default="{ row }">
          {{ formatCategory(row) }}
        </template>
      </el-table-column>
      <el-table-column label="講師" width="160">
        <template #default="{ row }">
          {{ row.instructorName }} / {{ row.userNickname }}
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" effect="plain">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上架日期" width="150" align="center">
        <template #default="{ row }">
          <span class="admin-date-text">{{ formatDate(row.publishedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewCourseDetail(row.courseId)">
            查看詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="pagination-btn" style="justify-content: center">
      <el-pagination
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
/* Page-specific styles only */
</style>

