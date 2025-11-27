<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './Navbar.vue';

const route = useRoute();
const id = Number(route.params.id);

const teachers = ref([
  { id: 1, name: "張老師", intro: "我喜歡教 Java 和 Vue。", avatar: "https://i.pravatar.cc/200?img=1" },
  { id: 2, name: "李老師", intro: "我專注於 Python 和資料分析。", avatar: "https://i.pravatar.cc/200?img=2" },
  { id: 3, name: "王老師", intro: "我喜歡前端開發，尤其是 Vue3。", avatar: "https://i.pravatar.cc/200?img=3" },
  { id: 4, name: "陳老師", intro: "我專注於後端與 Spring Boot。", avatar: "https://i.pravatar.cc/200?img=4" },
]);

// 只找「一位」老師
const teacher = computed(() =>
  teachers.value.find(t => t.id === id) || null
);
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Navbar />
      </el-header>

      <el-main class="teacher">
        <div v-if="teacher" class="">
          <el-avatar :size="200" :src="teacher.avatar" />
          <h1>老師：{{ teacher.name }}</h1>
          <p>ID：{{ teacher.id }}</p>
          <p>自我介紹：{{ teacher.intro }}</p>
        </div>

        <div v-else>
          <h2>找不到這位老師</h2>
        </div>
      </el-main>

    </el-container>
  </div>
</template>
<style>
.teacher{
  display: flex;
    justify-content: center;
    gap: 100px;
  list-style: none;
}

</style>
