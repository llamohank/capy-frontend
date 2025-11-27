<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模擬老師資料
const teachers = ref([
  { id: 1, name: "老師一", avatar: "https://picsum.photos/200?1" },
  { id: 2, name: "老師二", avatar: "https://picsum.photos/200?2" },
  { id: 3, name: "老師三", avatar: "https://picsum.photos/200?3" },
  { id: 4, name: "老師四", avatar: "https://picsum.photos/200?4" }
])

function goToTeacher(id) {
  router.push(`/teacher/${id}`)
}
</script>

<template>
    <ul>
        <li v-for="t in teachers" :key="t.id " @click="goToTeacher(t.id)" style="cursor: pointer;">
            <div>
                <el-avatar :size="200" :src=t.avatar />
            </div>
            <p>{{ t.name }}</p>
        </li>
    </ul>
</template>
<style>
ul{
    display: flex;
    justify-content: center;
    gap: 100px;
  list-style: none;
}

</style>
