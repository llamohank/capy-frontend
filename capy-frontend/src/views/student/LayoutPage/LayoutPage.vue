<template>
    <div class="layout-container">
        <StudentHeader/>
        <main class="main-content">
            <router-view />
        </main>
        <StudentFotter/>
    </div>
</template>

<script setup>
import StudentHeader from './StudentHeader.vue'
import StudentFotter from './StudentFotter.vue'
</script>

<style scoped>
.layout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    width: 100%;
}
</style>