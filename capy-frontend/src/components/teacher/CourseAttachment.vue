<script setup>
import { useCourseStore } from "@/stores/course";
import { useAttachment } from "@/composable/useAttachment";
import filesizeTransform from "@/utils/filesizeTransform";
const courseStore = useCourseStore();
const chapteroptions = computed(() => {
  return courseStore.courseSections.filter((section) => {
    return section.lessons.reduce((sum, item) => sum + item.attachments.length, 0) > 0;
  });
});
const currentchapter = ref(null);
// const attachmentList = courseStore.courseAttachments;
const attachmentList = ref([]);
onMounted(() => {
  attachmentList.value = [...courseStore.courseAttachments];
});
watch(currentchapter, (val) => {
  if (val) {
    attachmentList.value = courseStore.courseAttachments.filter((item) => item.sectionId === val);
  } else {
    attachmentList.value = [...courseStore.courseAttachments];
  }
});
const handleDeleteAttachment = async (item) => {
  try {
    await ElMessageBox.confirm("是否刪除此文件?", "提示", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });
  } catch (error) {
    ElMessage({
      type: "info",
      message: "已取消刪除",
    });
    return;
  }
  const { deleteFile } = useAttachment(item.attachmentId);
  await deleteFile();
  attachmentList.value = attachmentList.value.filter(
    (attachment) => attachment.attachmentId !== item.attachmentId
  );
};
const handleDownloadAttachment = async (id) => {
  const { download } = useAttachment(id);
  await download();
};
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程附件一覽</h2>
    <div v-if="attachmentList?.length > 0">
      <el-select
        size="large"
        v-model="currentchapter"
        clearable
        placeholder="選擇課程章節"
        style="width: 240px; margin-bottom: 24px"
      >
        <el-option
          v-for="item in chapteroptions"
          :key="item.sectionId"
          :label="item.title"
          :value="item.sectionId"
        />
      </el-select>
      <el-table
        stripe
        :row-class-name="() => 'table-row'"
        :cell-class-name="() => 'tbody-cell'"
        :header-cell-class-name="() => 'table-head'"
        size="large"
        :data="attachmentList"
        style="width: 100%"
      >
        <el-table-column prop="sectionTitle" label="所屬章節" />
        <el-table-column prop="lessonTitle" label="所屬單元" />
        <el-table-column prop="fileName" label="文件名稱">
          <template #default="{ row }">
            <div style="width: 80%">
              <p>{{ row.fileName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小">
          <template #default="{ row }">
            <span>{{ filesizeTransform(row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center">
              <el-button type="primary" @click="handleDownloadAttachment(row.attachmentId)"
                >下載</el-button
              >
              <el-button type="info" style="margin: 0" @click="handleDeleteAttachment(row)"
                >刪除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-empty v-else description="還沒有課程附件喔..." />
  </div>
</template>
<style scoped>
:deep(.tbody-cell .cell) {
  display: flex;
  padding: 12px 0;
  justify-content: center;
}

:deep(.table-head .cell) {
  font-size: 18px;
  text-align: center;
  padding: 4px 0 28px 0;
}

.el-select-dropdown__item {
  text-align: center;
}
</style>
