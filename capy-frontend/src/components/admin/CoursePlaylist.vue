<script setup>
import { inject, computed } from "vue";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";

const sectionsData = inject("sectionsData");

// 依 displayOrder 排序
const sortedSections = computed(() => {
  if (!sectionsData?.value) return [];
  return [...sectionsData.value].sort((a, b) => a.displayOrder - b.displayOrder);
});

// 計算總章節與單元數
const totalStats = computed(() => {
  const sections = sortedSections.value;
  const totalLessons = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  const totalMinutes = sections.reduce((sum, s) => {
    const sectionSeconds = s.lessons?.reduce((ls, l) => ls + (l.lessonDurationSeconds || 0), 0) || 0;
    return sum + sectionSeconds;
  }, 0);
  return {
    sections: sections.length,
    lessons: totalLessons,
    minutes: Math.floor(totalMinutes / 60),
  };
});
</script>

<template>
  <div class="wrapper">
    <div class="section-header">
      <h2 class="section-title">課程大綱與內容</h2>
      <div class="stats-badges" v-if="sortedSections.length">
        <span class="stat-badge">
          <el-icon><Folder /></el-icon>
          {{ totalStats.sections }} 章節
        </span>
        <span class="stat-badge">
          <el-icon><VideoPlay /></el-icon>
          {{ totalStats.lessons }} 單元
        </span>
        <span class="stat-badge">
          <el-icon><Clock /></el-icon>
          {{ totalStats.minutes }} 分鐘
        </span>
      </div>
    </div>

    <el-collapse v-if="sortedSections.length" class="playlist-collapse">
      <CollapsePlaylistItem
        v-for="(section, index) in sortedSections"
        :key="section.sectionId"
        :sectionInfo="section"
        :sectionIndex="index + 1"
      />
    </el-collapse>

    <el-empty v-else description="暫無課程大綱" :image-size="100" />
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

.stats-badges {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  padding: 4px 10px;
  background-color: #F3F4F6;
  border-radius: 6px;
}

.stat-badge .el-icon {
  font-size: 14px;
  color: #4F46E5;
}

.playlist-collapse {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: none;
}

:deep(.el-collapse) {
  border: none;
}

@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stats-badges {
    flex-wrap: wrap;
  }
}
</style>
