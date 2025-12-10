<script setup>
import { inject, computed } from "vue";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";

const sectionsData = inject("sectionsData");

// 依 displayOrder 排序
const sortedSections = computed(() => {
  if (!sectionsData?.value) return [];
  return [...sectionsData.value].sort((a, b) => a.displayOrder - b.displayOrder);
});

// 計算總時長 (秒轉分鐘)
const formatTotalDuration = (lessons) => {
  if (!lessons?.length) return "0";
  const totalSeconds = lessons.reduce((sum, lesson) => sum + (lesson.lessonDurationSeconds || 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  return minutes;
};
</script>

<template>
  <div class="wrapper">
    <h2 class="section-title">課程大綱與內容</h2>

    <el-collapse v-if="sortedSections.length">
      <CollapsePlaylistItem
        v-for="section in sortedSections"
        :key="section.sectionId"
        :sectionInfo="section"
      />
    </el-collapse>
    <el-empty v-else description="暫無課程大綱" />
  </div>
</template>

<style scoped>
.create-chapter-btn {
  display: flex;
  justify-content: end;
  margin-bottom: 12px;
}
.create-chapter-btn button {
  padding: 20px 24px;
}
.el-collapse {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
