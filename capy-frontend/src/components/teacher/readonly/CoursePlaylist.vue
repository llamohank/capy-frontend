<script setup>
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";
import { useCourse } from "@/composable/useCourse";
import { useSection } from "@/composable/useSection";
import timetransform from "@/utils/timetransform";
const { courseSections } = useCourse();
import { useCourseStore } from "@/stores/course";

const courseStore = useCourseStore();

const collapse = ref(false);
const ActiveCollapse = ref([]);
const totalLessonNum = computed(() => {
  return courseSections.value.reduce((sum, item) => {
    return sum + item.lessons.length;
  }, 0);
});

watch(collapse, () => {
  if (isAllCollapse.value) {
    ActiveCollapse.value = [];
  } else {
    ActiveCollapse.value = courseSections.value.map((item) => item.sectionId ?? section.id);
  }
});
const isAllCollapse = computed(() => {
  return courseSections.value.every((item) => ActiveCollapse.value.includes(item.sectionId));
});
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程大綱與內容</h2>
    <div class="create-chapter-btn">
      <div v-if="courseSections?.length > 0" class="playlist-info">
        <span>包含{{ courseSections?.length }} 章 {{ totalLessonNum }} 單元</span>
        <span>總時長 {{ timetransform(courseStore.totalCourseDuration, true) }}</span>
        <span
          ><el-button @click="collapse = !collapse" type="primary" link style="padding: 0"
            >全部{{ isAllCollapse ? "收合" : "展開" }}</el-button
          ></span
        >
      </div>
    </div>

    <el-collapse v-model="ActiveCollapse" style="border: none" v-if="courseSections?.length > 0">
      <collapse-playlist-item
        v-for="section in courseSections"
        :sectionInfo="section"
        :key="section.sectionId ?? section.id"
      ></collapse-playlist-item>
    </el-collapse>
    <el-empty v-else description="目前還沒有章節喔..." />
  </div>
</template>
<style scoped>
.create-chapter-btn {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 24px;
}
.create-chapter-btn button {
  padding: 20px 24px;
}
.el-collapse {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.playlist-info {
  display: flex;
}
.playlist-info span {
  display: flex;
  align-items: center;
}
.playlist-info span + span::before {
  content: "|";
  font-weight: 600;
  margin: 0 8px;
}
</style>
