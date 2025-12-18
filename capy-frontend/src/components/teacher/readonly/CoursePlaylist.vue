<script setup>
import { computed, ref, watch } from "vue";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";
import { useCourse } from "@/composable/useCourse";
import { useCourseStore } from "@/stores/course";

const { courseSections } = useCourse();
const courseStore = useCourseStore();

const collapse = ref(false);
const ActiveCollapse = ref([]);

// 計算總章節與單元數
const totalStats = computed(() => {
  const sections = courseSections.value || [];
  const totalLessons = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  const totalMinutes = Math.floor((courseStore.totalCourseDuration || 0) / 60);
  return {
    sections: sections.length,
    lessons: totalLessons,
    minutes: totalMinutes,
  };
});

watch(collapse, () => {
  if (isAllCollapse.value) {
    ActiveCollapse.value = [];
  } else {
    ActiveCollapse.value = courseSections.value.map((item) => item.sectionId ?? item.id);
  }
});

const isAllCollapse = computed(() => {
  return courseSections.value.every((item) => ActiveCollapse.value.includes(item.sectionId));
});
</script>

<template>
  <div class="wrapper">
    <div class="section-header">
      <h2 class="section-title">課程大綱與內容</h2>
      <div class="stats-badges" v-if="courseSections?.length > 0">
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
        <el-button @click="collapse = !collapse" type="primary" link size="small">
          全部{{ isAllCollapse ? "收合" : "展開" }}
        </el-button>
      </div>
    </div>

    <el-collapse v-if="courseSections?.length > 0" v-model="ActiveCollapse" class="playlist-collapse">
      <CollapsePlaylistItem
        v-for="(section, index) in courseSections"
        :key="section.sectionId ?? section.id"
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
  align-items: center;
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
