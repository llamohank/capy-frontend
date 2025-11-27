<script setup>
import { ref } from 'vue';

const Ben = ref([
  { id: 1, name: "Java Basic", hot: 95 },
  { id: 2, name: "Python Basic", hot: 88 },
  { id: 3, name: "JavaScript Basic", hot: 76 },
  { id: 4, name: "SQL Basic", hot: 64 },
].sort((a, b) => b.hot - a.hot))


</script>
<template>
    <div class="button-row">
      <el-button v-for="course in Ben" :key="course.id" type="primary">{{ course.name }}</el-button>
    </div>
</template>
<style>
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content:  center;
}

.button-row > * {
  margin: 0;
}
</style>