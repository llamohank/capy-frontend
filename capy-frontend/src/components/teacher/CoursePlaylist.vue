<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
const jsondata = [
  {
    chapter_name: "code",
    index: "1",
    chapter_id: "1",
    lesson_info: [
      {
        lessonid: "1",
        lesson_index: "1",
        lesson_name: "python basic",
        isFree: true,
        lesson_description: "python introduction",
        video_url: "www.example.com",
        duration_time: "23.06",
        attachment_url: "www.example.com",
      },
      {
        lessonid: "2",
        lesson_index: "2",
        lesson_name: "java",
        isFree: false,
        lesson_description: "java introduction",
        video_url: "www.example.com",
        duration_time: "24.31",
        attachment_url: "www.example.com",
      },
    ],
  },
];
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程大綱與內容</h2>
    <div class="create-chapter-btn">
      <el-button type="primary"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon
        >建立新章節</el-button
      >
    </div>
    <el-collapse>
      <Draggable></Draggable>
      <collapse-playlist-item
        v-for="chapter in jsondata"
        :chapterinfo="chapter"
        :key="chapter.chapter_id"
      ></collapse-playlist-item>
    </el-collapse>
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
