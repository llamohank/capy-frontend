<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { getCourseApplications, getParentCategories } from "@/api/admin/course";

const router = useRouter();

const applications = ref([]);
const categories = ref([]);
const loading = ref(false);
const totalElements = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 篩選條件
const filters = ref({
  parentCategoryId: "",
});

const displayData = computed(() => {
  return applications.value.map((item, index) => ({
    ...item,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
  }));
});

const fetchCategories = async () => {
  try {
    const result = await getParentCategories();
    if (result) {
      // 依 displayOrder 排序
      categories.value = result.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const fetchApplications = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    if (filters.value.parentCategoryId) {
      params.parentCategoryId = filters.value.parentCategoryId;
    }

    const result = await getCourseApplications(params);
    if (result) {
      applications.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch course applications:", error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchApplications();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchApplications();
};

const resetFilters = () => {
  filters.value.parentCategoryId = "";
  currentPage.value = 1;
  fetchApplications();
};

const viewCourseDetail = (courseId) => {
  router.push({
    name: "viewCourseDetail",
    params: { courseId },
    query: { viewtype: "apply" },
  });
};

const formatTime = (iso) => {
  if (!iso) return "-";
  return dayjs(iso).format("YYYY-MM-DD HH:mm");
};

watch(
  () => filters.value.parentCategoryId,
  () => {
    handleFilterChange();
  }
);

onMounted(() => {
  fetchCategories();
  fetchApplications();
});
</script>

<template>
  <h2 class="section-heading">上架申請列表</h2>

  <div class="wrapper" style="margin-bottom: 24px">
    <div class="admin-filter-row">
      <el-select
        v-model="filters.parentCategoryId"
                placeholder="全部分類"
        clearable
        style="width: 200px"
      >
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-button type="primary" @click="resetFilters">清除篩選</el-button>
    </div>
  </div>

  <div class="wrapper admin-table-container">
    <el-table
      v-loading="loading"
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
            :data="displayData"
      style="width: 100%"
      empty-text="暫無申請"
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
      <el-table-column prop="parentCategoryName" label="分類" width="160" />
      <el-table-column label="申請人" width="180">
        <template #default="{ row }">
          {{ row.instructorName }} / {{ row.userNickname }}
        </template>
      </el-table-column>
      <el-table-column label="申請時間" width="150" align="center">
        <template #default="{ row }">
          {{ formatTime(row.submittedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="檢視" width="80" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewCourseDetail(row.courseId)">查看</el-button>
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
</template>

<style scoped>
/* Page-specific styles only */
</style>

