<script setup>
const abc = ref(3);
</script>
<template>
  <el-scrollbar>
    <RouterView></RouterView>
  </el-scrollbar>
</template>
<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
<style scoped>

</style>
