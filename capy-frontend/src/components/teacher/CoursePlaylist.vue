<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { CirclePlus, Clock, Folder, VideoPlay } from "@element-plus/icons-vue";
import { VueDraggable as Draggable } from "vue-draggable-plus";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";
import TextInputDialog from "../common/TextInputDialog.vue";
import { useCourse } from "@/composable/useCourse";
import { useSection } from "@/composable/useSection";
import { useCourseStore } from "@/stores/course";

const { courseSections } = useCourse();
const { addCourseSection, reorderCourseSection } = useSection();
const courseStore = useCourseStore();

const dialogRef = ref(null);
const showDialog = ref(false);
const collapse = ref(false);
const ActiveCollapse = ref([]);
const sectionTitle = ref("");

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

const handleAddSection = async (value) => {
  await addCourseSection(value);
};

const next = () => {
  if (courseStore.courseSections.length < 1 || totalStats.value.lessons === 0) {
    throw new Error("至少須包含一單元和單元影片");
  }
  return true;
};

const sectionIds = computed(() => {
  return courseStore.courseSections.map((section) => section.sectionId);
});

onMounted(() => {
  console.log(courseStore.courseSections);
});

let reverseFlag = false;
watch(sectionIds, async (newVal, oldVal) => {
  if (reverseFlag) {
    reverseFlag = false;
    return;
  }
  const verify = () => {
    return newVal.every((val, index) => val === oldVal[index]);
  };
  if (newVal.length <= 1) {
    return;
  }
  if (newVal.length === oldVal.length + 1 && !isEditLesson.value) {
    return;
  }
  if (newVal.length === oldVal.length && verify()) {
    return;
  }
  const map = new Map(courseStore.courseSections.map((s) => [s.sectionId ?? s.id, s]));

  try {
    await reorderCourseSection(newVal);
    ElMessage.success("更新章節順序成功");
  } catch (e) {
    ElMessage.error("更新章節排序失敗");
    reverseFlag = true;
    courseStore.courseSections = oldVal.map((id) => map.get(id)).filter((item) => item);
  }
});

const handleStartDrag = () => {
  ElMessage.primary("拖拽以調整章節順序");
};
const isDraggable = ref(true);
const handleDragDisabled = (val) => {
  isDraggable.value = val;
};
defineExpose({ next });
</script>

<template>
  <div class="wrapper">
    <TextInputDialog
      ref="dialogRef"
      v-model:visible="showDialog"
      v-model:inputValue="sectionTitle"
      placeholder="請輸入章節名稱"
      title="建立新章節"
      @confirm="handleAddSection"
    />

    <div class="section-header">
      <h2 class="section-title">課程大綱與內容</h2>
      <div class="header-actions" v-if="courseSections?.length > 0">
        <div class="stats-badges">
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
        <el-button type="primary" @click="dialogRef.open()">
          <el-icon style="margin-right: 4px"><CirclePlus /></el-icon>
          建立新章節
        </el-button>
      </div>
    </div>

    <el-collapse
      v-if="courseSections?.length > 0"
      v-model="ActiveCollapse"
      class="playlist-collapse"
    >
      <Draggable
        :disabled="ActiveCollapse.length > 0 || !isDraggable"
        @start="handleStartDrag"
        class="section-playlist"
        v-model="courseSections"
      >
        <CollapsePlaylistItem
          @dragDisabled="handleDragDisabled"
          v-for="(section, index) in courseSections"
          :key="section.sectionId ?? section.id"
          :sectionInfo="section"
          :sectionIndex="index + 1"
        />
      </Draggable>
    </el-collapse>

    <el-empty v-else description="目前還沒有章節">
      <el-button type="primary" @click="dialogRef.open()">
        <el-icon style="margin-right: 4px"><CirclePlus /></el-icon>
        立即建立新章節
      </el-button>
    </el-empty>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
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
  background-color: #f3f4f6;
  border-radius: 6px;
}

.stat-badge .el-icon {
  font-size: 14px;
  color: #4f46e5;
}

.playlist-collapse {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: none;
}

.section-playlist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-collapse) {
  border: none;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .stats-badges {
    flex-wrap: wrap;
  }
}
</style>
