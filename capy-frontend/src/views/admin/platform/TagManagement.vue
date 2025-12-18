<script setup>
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listAllTags, createTag, deleteTag } from "@/api/admin/tag";

// Dialog 狀態
const createDialogVisible = ref(false);
const deleteDialogVisible = ref(false);

// 資料狀態
const loading = ref(false);
const createLoading = ref(false);
const deleteLoading = ref(false);
const currentTag = ref(null);
const newTagValue = ref("");
const tagList = ref([]);

// 取得標籤列表
const fetchTags = async () => {
  try {
    loading.value = true;
    const result = await listAllTags();
    if (result) {
      tagList.value = result || [];
    }
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    ElMessage.error("取得標籤列表失敗");
  } finally {
    loading.value = false;
  }
};

// 點擊刪除標籤
const handleDelete = (tag) => {
  currentTag.value = tag;
  deleteDialogVisible.value = true;
};

// 新增標籤
const handleCreateTag = async () => {
  if (!newTagValue.value.trim()) {
    ElMessage.warning("請輸入標籤名稱");
    return;
  }

  try {
    createLoading.value = true;
    await createTag(newTagValue.value.trim());
    ElMessage.success("標籤新增成功");
    createDialogVisible.value = false;
    // 重新獲取標籤列表
    fetchTags();
  } catch (error) {
    console.error("Failed to create tag:", error);
    ElMessage.error(error?.response?.data?.message || "新增標籤失敗");
  } finally {
    createLoading.value = false;
  }
};

// 刪除標籤
const handleDeleteTag = async () => {
  if (!currentTag.value) return;

  try {
    deleteLoading.value = true;
    await deleteTag(currentTag.value.id);
    ElMessage.success("標籤刪除成功");
    deleteDialogVisible.value = false;
    // 重新獲取標籤列表
    fetchTags();
  } catch (error) {
    console.error("Failed to delete tag:", error);
    ElMessage.error(error?.response?.data?.message || "刪除標籤失敗");
  } finally {
    deleteLoading.value = false;
  }
};

// 重置表單
watch(createDialogVisible, (val) => {
  if (!val) newTagValue.value = "";
});

onMounted(() => {
  fetchTags();
});
</script>
<template>
  <div class="wrapper">
    <el-dialog v-model="createDialogVisible" width="500">
      <template #header>
        <h4 class="admin-dialog-heading">新增課程標籤</h4>
      </template>
      <div class="admin-dialog-body">
        <div style="text-align: center">
          <el-input
                        v-model="newTagValue"
            placeholder="輸入標籤名稱"
            style="width: 90%"
          />
        </div>
      </div>
      <template #footer>
        <div class="admin-dialog-footer">
          <el-button type="info" @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="createLoading" @click="handleCreateTag"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="deleteDialogVisible" width="500">
      <template #header>
        <h4 class="admin-dialog-heading">刪除課程標籤</h4>
      </template>
      <div class="admin-dialog-body">
        <p>
          確認刪除標籤<span style="font-weight: 500; color: #409eff">{{ currentTag?.name }}</span>?
        </p>
      </div>
      <template #footer>
        <div class="admin-dialog-footer">
          <el-button type="info" @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="handleDeleteTag"> 確認 </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="title">
      <h3 class="section-title" style="margin-bottom: 0">標籤管理</h3>
      <el-button @click="createDialogVisible = true" round type="primary" class="add-btn"
        ><el-icon style="margin-right: 4px"><CirclePlus /></el-icon>新增標籤</el-button
      >
    </div>
    <p style="padding-bottom: 12px">現有標籤 :</p>
    <div v-loading="loading" class="pool">
      <span 
        v-for="tag in tagList" 
        :key="tag.id" 
        class="pool-item"
        @click="handleDelete(tag)"
      >
        {{ tag.name }}
        <el-icon><CircleClose /></el-icon>
      </span>
      <span v-if="!loading && tagList.length === 0" class="empty-text">暫無標籤</span>
    </div>
  </div>
</template>
<style scoped>
/* Page-specific styles */
.title {
  padding: 6px 0;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-btn {
  padding: 14px 20px;
}

.pool {
  border-radius: 12px;
  padding: 20px 14px;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 70px;
}

.pool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #D1D5DB;
  background-color: #FFFFFF;
  color: #374151;
  border-radius: 80px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pool-item:hover {
  background-color: #FEF2F2;
  border-color: #FECACA;
  color: #B91C1C;
  cursor: pointer;
}

.empty-text {
  color: rgb(153, 173, 183);
  padding: 12px;
  font-size: 14px;
}
</style>

