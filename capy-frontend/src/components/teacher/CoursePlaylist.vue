<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";
import { useCourse } from "@/composable/useCourse";
import { useSection } from "@/composable/useSection";
import timetransform from "@/utils/timetransform";
const { courseSections } = useCourse();
const { addCourseSection, reorderCourseSection } = useSection();
import { useCourseStore } from "@/stores/course";
import TextInputDialog from "../common/TextInputDialog.vue";
const courseStore = useCourseStore();
const dialogRef = ref(null);
const showDialog = ref(false);
const collapse = ref(false);
const ActiveCollapse = ref([]);
const totalLessonNum = computed(() => {
  return courseSections.value.reduce((sum, item) => {
    return sum + item.lessons.length;
  }, 0);
});
const sectionTitle = ref("");
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

const handleAddSection = async (value) => {
  await addCourseSection(value);
};

const next = () => {
  if (courseStore.courseSections.length < 1 || totalLessonNum.value === 0) {
    throw new Error("至少須包含一單元和單元影片");
  }
  return true;
};
const sectionIds = computed(() => {
  // const sectionList = [...courseStore.courseSections];
  // console.log(sectionList);
  return courseStore.courseSections.map((section) => section.sectionId);
});
// const courseSectionList = ref(...)
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
    for (let i = 0; i < newVal.length; i++) {
      if (newVal[i] !== oldVal[i]) {
        return false;
      }
      return true;
    }
  };
  if (newVal.length < 1) {
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
    courseStore.courseSections = oldVal.map((id) => map.get(id)).filter((item) => item); // 防呆
  }
});

const handleStartDrag = () => {
  ElMessage.primary("托拽以調整章節順序");
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
    <h2 class="section-title">課程大綱與內容</h2>
    <div v-if="courseSections?.length > 0" class="create-chapter-btn">
      <div class="playlist-info">
        <span>包含{{ courseSections?.length }} 章 {{ totalLessonNum }} 單元</span>
        <span>總時長 {{ timetransform(courseStore.totalCourseDuration, true) }}</span>
        <span
          ><el-button @click="collapse = !collapse" type="primary" link style="padding: 0"
            >全部{{ isAllCollapse ? "收合" : "展開" }}</el-button
          ></span
        >
      </div>
      <el-button type="primary" @click="dialogRef.open()"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon
        >建立新章節</el-button
      >
    </div>

    <el-collapse v-model="ActiveCollapse" style="border: none" v-if="courseSections?.length > 0">
      <Draggable @start="handleStartDrag" class="section-playlist" v-model="courseSections">
        <collapse-playlist-item
          v-for="section in courseSections"
          :sectionInfo="section"
          :key="section.sectionId ?? section.id"
        ></collapse-playlist-item>
      </Draggable>
    </el-collapse>
    <el-empty v-else description="目前還沒有章節喔..."
      ><el-button
        style="margin-top: 24px; padding: 20px 24px"
        type="primary"
        @click="dialogRef.open()"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon
        >立即建立新章節</el-button
      ></el-empty
    >
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
.section-playlist {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
