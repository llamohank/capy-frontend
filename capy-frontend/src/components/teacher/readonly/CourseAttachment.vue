<script setup>
import { ref, computed, watch } from "vue";
import { useCourseStore } from "@/stores/course";
import { useAttachment } from "@/composable/useAttachment";

const courseStore = useCourseStore();

const currentSection = ref(null);

// 取得所有有附件的章節選項
const sectionOptions = computed(() => {
  return courseStore.courseSections
    .filter((section) => {
      return section.lessons.reduce((sum, item) => sum + item.attachments.length, 0) > 0;
    })
    .map((section) => ({
      value: section.sectionId,
      label: section.title,
    }));
});

// 篩選後的附件列表
const filteredAttachments = computed(() => {
  let list = courseStore.courseAttachments || [];

  if (currentSection.value) {
    list = list.filter((item) => item.sectionId === currentSection.value);
  }

  return list.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
});

// 格式化檔案大小
const formatFileSize = (bytes) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// 下載附件
const handleDownload = async (attachment) => {
  const { download } = useAttachment(attachment.attachmentId);
  await download();
};
</script>

<template>
  <div class="wrapper">
    <div class="section-header">
      <h2 class="section-title">課程附件一覽</h2>
      <div class="filter-area">
        <el-select
          v-model="currentSection"
          placeholder="篩選章節"
          clearable
          class="section-filter"
        >
          <el-option
            v-for="item in sectionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div v-if="filteredAttachments.length" class="attachments-table">
      <el-table
        :data="filteredAttachments"
        table-layout="fixed"
        :header-cell-style="{
          backgroundColor: '#F9FAFB',
          color: '#374151',
          fontWeight: '600',
          fontSize: '13px',
        }"
        :cell-style="{
          fontSize: '14px',
        }"
      >
        <el-table-column label="檔案名稱" min-width="180">
          <template #default="{ row }">
            <div class="file-name-cell">
              <el-icon class="file-icon"><Document /></el-icon>
              <span class="file-name-text">{{ row.fileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sectionTitle" label="所屬章節" min-width="120" show-overflow-tooltip />
        <el-table-column prop="lessonTitle" label="所屬單元" min-width="120" show-overflow-tooltip />
        <el-table-column label="檔案大小" width="90" align="center">
          <template #default="{ row }">
            <span class="file-size">{{ formatFileSize(row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              size="small"
              @click="handleDownload(row)"
            >
              下載
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-empty v-else description="暫無附件" :image-size="100" />
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-filter {
  width: 200px;
}

.attachments-table {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.file-icon {
  color: #4F46E5;
  font-size: 16px;
  flex-shrink: 0;
}

.file-name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-table) {
  --el-table-border-color: #E5E7EB;
  width: 100% !important;
}

:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  width: 100% !important;
}

:deep(.el-table__row:hover > td) {
  background-color: #F9FAFB !important;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}

:deep(.el-table--fixed-right) {
  right: 0;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-filter {
    width: 100%;
  }
}
</style>
