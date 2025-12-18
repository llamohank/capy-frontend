<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import ChangeUserStatusDialog from "./ChangeUserStatusDialog.vue";
import { searchUsers } from "@/api/admin/user";
import dayjs from "dayjs";

// 資料狀態
const loading = ref(false);
const tableData = ref([]);
const totalElements = ref(0);

// 篩選與搜尋
const searchKeyword = ref("");
const currentRole = ref("");
const currentStatus = ref("");

// 分頁
const currentPage = ref(1);
const pageSize = ref(10);

// 篩選選項
const roleOptions = [
  { label: "講師", value: "instructor" },
  { label: "學生", value: "student" },
];

const statusOptions = [
  { label: "活動中", value: "active" },
  { label: "已停權", value: "suspended" },
];

// 取得用戶列表
const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }

    if (currentRole.value) {
      params.role = currentRole.value;
    }

    if (currentStatus.value) {
      params.status = currentStatus.value;
    }

    const result = await searchUsers(params);
    if (result) {
      tableData.value = result.content || [];
      totalElements.value = result.totalElements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    ElMessage.error("取得用戶列表失敗");
  } finally {
    loading.value = false;
  }
};

// 處理搜尋
const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

// 清除搜尋
const clearSearch = () => {
  searchKeyword.value = "";
  currentPage.value = 1;
  fetchUsers();
};

// 處理角色篩選變更
const handleRoleChange = () => {
  currentPage.value = 1;
  fetchUsers();
};

// 處理狀態篩選變更
const handleStatusChange = () => {
  currentPage.value = 1;
  fetchUsers();
};

// 處理分頁變更
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchUsers();
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("YYYY-MM-DD HH:mm");
};

// 格式化角色顯示
const formatRole = (role) => {
  const roleMap = {
    instructor: "講師",
    student: "學生",
    admin: "管理員",
  };
  return roleMap[role] || role;
};

// 帶索引的資料
const dataWithIndex = computed(() => {
  return tableData.value.map((item, index) => ({
    ...item,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
    isActive: item.status === "active",
  }));
});

const dialogRef = ref(null);

const handleChangeStatus = (userdetail) => {
  return new Promise((resolve) => {
    dialogRef.value.open(userdetail, resolve);
  }).then(async (success) => {
    if (success) {
      fetchUsers();
    }
    return success;
  });
};

onMounted(() => {
  fetchUsers();
});
</script>
<template>
  <ChangeUserStatusDialog ref="dialogRef" />
  <h2 class="section-heading">用戶狀態管理</h2>
  <div class="wrapper" style="margin-bottom: 24px">
    <!-- 篩選與搜尋區 -->
    <div class="admin-filter-row">
      <el-select
        v-model="currentRole"
                placeholder="全部身分"
        clearable
        style="width: 150px"
        @change="handleRoleChange"
      >
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
                placeholder="搜尋用戶暱稱、Email..."
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
    </div>
  </div>

  <div class="wrapper admin-table-container">
    <el-table
      v-loading="loading"
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
            :data="dataWithIndex"
      style="width: 100%"
      empty-text="暫無用戶"
    >
      <el-table-column label="序號" width="80" align="center">
        <template #default="{ row }">
          <span class="admin-index">#{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="250" label="用戶資訊">
        <template #default="{ row }">
          <div class="admin-user-info-cell">
            <el-avatar :size="50" :src="row.avatarUrl" />
            <div class="admin-user-details">
              <p class="admin-user-name">{{ row.nickname }}</p>
              <p class="admin-user-sub">{{ row.email }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身分" min-width="140" align="center">
        <template #default="{ row }">
          <el-tag type="info" effect="plain" round>
            {{ formatRole(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="狀態" min-width="140" align="center">
        <template #default="{ row }">
          <div class="status-cell">
            <el-switch
              :before-change="() => handleChangeStatus(row)"
                            v-model="row.isActive"
            />
            <p class="status-text">{{ row.isActive ? "活動中" : "已停權" }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最後更新時間" min-width="200" align="center">
        <template #default="{ row }">
          <span class="admin-date-text">{{ formatDate(row.updatedAt) }}</span>
        </template>
      </el-table-column>
    </el-table>
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
/* User info cell (avatar + name/sub) */
.admin-user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.admin-user-info-cell :deep(.el-avatar) {
  flex-shrink: 0;
}

.admin-user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.admin-user-name,
.admin-user-sub {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-user-name {
  font-weight: 500;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.2;
}

.admin-user-sub {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
}

/* 狀態欄位 */
.status-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.status-text {
  font-size: 11px;
  color: #6B7280;
}

.el-tag {
  border: 1px solid #e5e7eb;
}
</style>
