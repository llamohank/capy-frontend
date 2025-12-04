<script setup>
import { nextTick } from "vue";

const props = defineProps({
  chapterinfo: {
    type: Object,
    required: true,
  },
});
const dialogFormVisible = ref(false);
const videoPlayerRef = ref(null);
const editLessonVid = (lesson) => {
  dialogFormVisible.value = true;
  form.value = lesson;
};
watch(
  () => dialogFormVisible.value,
  async (value) => {
    // if (!value) {
    //   console.log(videoPlayerRef.value);
    //   videoPlayerRef.value.destroy();
    //   videoPlayerRef.value.init();
    // }
    // else {
    //   console.log(videoPlayerRef.value);
    //   videoPlayerRef.value.init();
    // }
    await nextTick();
    if (value) {
      await videoPlayerRef.value.init();
      await videoPlayerRef.value.play();

      return;
    }
    await videoPlayerRef.value.destroy();
  }
);
const form = ref({
  name: "",
  description: "",
  isFree: false,
  cate: "",
});
</script>
<template>
  <!-- //添加單元影片dialog form -->
  <el-dialog center v-model="dialogFormVisible" title="單元影片詳情" width="600">
    <el-form :model="form" label-position="top" size="large" class="dialogForm">
      <el-form-item label="影片標題 :">
        <p class="lesson-title">
          {{ form.lesson_name
          }}<el-tag style="margin-left: 8px" v-if="form.isFree">試看單元</el-tag>
        </p>
      </el-form-item>
      <el-form-item label="對應章節 :">
        <p>{{ chapterinfo?.chapter_name }}</p>
      </el-form-item>
      <el-form-item label="影片簡介 :">
        <p>{{ form.lesson_description }}</p>
      </el-form-item>

      <el-form-item label="預覽影片 :">
        <VideoPlayer ref="videoPlayerRef" />
      </el-form-item>
      <el-form-item label="單元附件 :">
        <ul>
          <li style="display: flex; align-items: center; line-height: 1.5; margin-bottom: 4px">
            <el-icon style="margin-right: 4px"><Document /></el-icon><span>555</span>
            <el-button style="margin-left: 16px; font-size: 14px" type="primary" link
              >下載</el-button
            >
          </li>
          <li style="display: flex; align-items: center; line-height: 1.5; margin-bottom: 4px">
            <el-icon style="margin-right: 4px"><Document /></el-icon><span>555</span>
            <el-button style="margin-left: 16px; font-size: 14px" type="primary" link
              >下載</el-button
            >
          </li>
          <li style="display: flex; align-items: center; line-height: 1.5; margin-bottom: 4px">
            <el-icon style="margin-right: 4px"><Document /></el-icon><span>555</span>
            <el-button style="margin-left: 16px; font-size: 14px" type="primary" link
              >下載</el-button
            >
          </li>
        </ul>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-collapse-item>
    <template #icon="{ isActive }">
      <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
      <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
    </template>
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
        <p style="font-size: 20px; padding: 5px 0; padding-left: 20px">
          {{ chapterinfo.chapter_name
          }}<span style="font-size: 14px">
            | 共{{ chapterinfo?.lesson_info.length }}單元 時長:992分鐘</span
          >
        </p>
      </div>
    </template>
    <div>
      <ul class="course-playlist">
        <li v-for="(lesson, index) in chapterinfo?.lesson_info" :key="lesson.lessonid">
          <span
            ><span class="index">{{ index < 10 ? "0" + (index + 1) : index }}</span
            >{{ lesson.lesson_name
            }}<el-tag v-if="lesson.isFree" style="margin-left: 8px" size="large"
              >試看單元</el-tag
            ></span
          >
          <div>
            {{ lesson.duration_time }}
            <el-button style="margin-left: 8px" @click="editLessonVid(lesson)">查看 </el-button>
          </div>
        </li>
      </ul>
    </div>
  </el-collapse-item>
</template>
<style scoped>
:deep(.el-collapse-item__header) {
  background-color: rgb(221, 233, 246);
  border-radius: 8px;
}
:deep(.el-collapse-item__content) {
  padding: 10px 0;
  background-color: rgb(245, 247, 249);
  border-radius: 0 0 8px 8px;
}

.course-playlist {
  margin-top: 10px;
}
.course-playlist li {
  margin-bottom: 4px;
  background-color: #fff;
  padding: 10px 10px;

  display: flex;
  justify-content: space-between;
}
.course-playlist li .index {
  font-size: 20px;
  font-weight: 700;
  margin-right: 8px;
}
.course-playlist li:hover {
  background-color: #eff4f9;
}
.dialogForm {
  padding: 16px;
}
:deep(.el-form-item__content) {
  padding-left: 12px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
:deep(.el-form-item) {
  margin-bottom: 12px;
}
:deep(.el-dialog__header) {
  padding-top: 16px;
  padding-bottom: 48px;
}
</style>
