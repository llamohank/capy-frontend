<script setup>
import CourseAttachment from "@/components/teacher/CourseAttachment.vue";
import CourseDetailForm from "@/components/teacher/CourseDetailForm.vue";
import CoursePlaylist from "@/components/teacher/CoursePlaylist.vue";
</script>
<template>
  <div style="display: flex; flex-direction: column; gap: 50px">
    <CourseDetailForm />
    <CoursePlaylist />
    <CourseAttachment />
  </div>
</template>
<style></style>
