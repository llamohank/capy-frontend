<script setup>
import { ref, inject, computed, watch } from "vue";
import { downloadAttachment } from "@/api/admin/course";

const attachmentsData = inject("attachmentsData");
const sectionsData = inject("sectionsData");

const currentSection = ref("");

// 取得所有章節選項
const sectionOptions = computed(() => {
  if (!sectionsData?.value) return [];
  return sectionsData.value
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((section) => ({
      value: section.sectionId,
      label: section.title,
    }));
});

// 篩選後的附件列表
const filteredAttachments = computed(() => {
  if (!attachmentsData?.value) return [];
  let list = attachmentsData.value;

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
  try {
    const blob = await downloadAttachment(attachment.attachmentId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download attachment:", error);
    ElMessage.error("下載失敗");
  }
};
</script>

<template>
  <div class="wrapper">
    <h2 class="section-title">課程附件一覽</h2>
    <el-select
      v-model="currentSection"
      size="large"
      placeholder="全部章節"
      clearable
      style="width: 240px; margin-bottom: 12px"
    >
      <el-option
        v-for="item in sectionOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-table
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
      size="large"
      :data="filteredAttachments"
      style="width: 100%; margin-top: 24px"
      empty-text="暫無附件"
    >
      <el-table-column prop="sectionTitle" label="所屬章節" width="180" />
      <el-table-column prop="lessonTitle" label="所屬單元" width="180" />
      <el-table-column prop="fileName" label="文件名稱" />
      <el-table-column label="檔案大小" width="120">
        <template #default="{ row }">
          {{ formatFileSize(row.fileSize) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" @click="handleDownload(row)">下載</el-button>
        </template>
      </el-table-column>
    </el-table>
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
</style>
